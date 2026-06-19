<template>
  <div class="relative">
    <div v-if="alert.show" class="fixed top-20 right-5 z-[9999999] w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 relative z-10">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div class="w-full">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nama Lengkap</p>
              <p class="text-sm font-medium text-gray-800 capitalize dark:text-white/90">{{ profileName }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Username Login</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ profileUsername }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Alamat Email</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ profileEmail || 'Belum diatur' }}</p>
            </div>

            <div v-if="profileRole.toLowerCase() !== 'admin'">
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Program Studi</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ profileProdi }}</p>
            </div>

            <div v-if="profileRole.toLowerCase() !== 'admin'">
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Identitas (NIM/NIDN)</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ profileIdentity }}</p>
            </div>
          </div>
        </div>

        <button class="flex-shrink-0 mt-4 edit-button lg:mt-0" @click="openEditModal">
          <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill=""/>
          </svg>
          Edit
        </button>
      </div>
    </div>

    <Modal v-if="isProfileInfoModal" @close="isProfileInfoModal = false">
      <div class="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 no-scrollbar">

        <button @click="isProfileInfoModal = false" class="absolute flex items-center justify-center w-11 h-11 text-gray-400 bg-gray-100 rounded-full right-5 top-5 z-[999] transition-colors hover:bg-gray-200 hover:text-gray-600 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" fill=""/>
          </svg>
        </button>

        <div class="px-2 pr-14 mb-6">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Perbarui data diri dan kata sandi Anda di sini.
          </p>
        </div>

        <form @submit.prevent="saveProfile" class="flex flex-col">
          <div class="p-2 overflow-y-auto custom-scrollbar">
            <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

              <div class="col-span-2 lg:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nama Lengkap</label>
                <input type="text" v-model="formEdit.nama_asli" required class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800" />
              </div>

              <div class="col-span-2 lg:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Username</label>
                <input type="text" v-model="formEdit.username" required class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800" />
              </div>

              <div class="col-span-2 lg:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Alamat Email</label>
                <input type="email" v-model="formEdit.email" required class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800" />
              </div>

              <div class="col-span-2 lg:col-span-1">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Ganti Password</label>
                <input type="password" v-model="formEdit.password" placeholder="Kosongkan jika tak ingin diubah" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800" />
              </div>

              <div class="col-span-2 lg:col-span-1" v-if="profileRole.toLowerCase() !== 'admin'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Program Studi <span class="text-xs text-gray-400">(Hubungi Admin untuk ubah)</span></label>
                <input type="text" :value="profileProdi" disabled class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400" />
              </div>

              <div class="col-span-2 lg:col-span-1" v-if="profileRole.toLowerCase() !== 'admin'">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Identitas (NIM/NIDN)</label>
                <input type="text" :value="profileIdentity" disabled class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400" />
              </div>

            </div>
          </div>

          <div class="flex items-center justify-end gap-3 px-2 mt-8">
            <button @click="isProfileInfoModal = false" type="button" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSaving" class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto transition-colors disabled:opacity-70">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>

      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Modal from '../modal/Modal.vue'
import Alert from '@/components/ui/Alert.vue'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

const isProfileInfoModal = ref(false)
const isSaving = ref(false)
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// State Alert Component
const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })

// Fungsi memanggil Alert
const showAlert = (type: AlertVariant, title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  setTimeout(() => { alert.value.show = false }, 3000)
}

// State Tampilan
const profileName = ref('Loading...')
const profileUsername = ref('Loading...')
const profileEmail = ref('')
const profileRole = ref('Loading...')
const profileIdentity = ref('Loading...')
const profileProdi = ref('Loading...')

// State Form Edit
const formEdit = ref({
  nama_asli: '',
  username: '',
  email: '',
  password: ''
})

const fetchProfile = async () => {
  try {
    const response = await fetch(`${baseUrl}/auth/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const result = await response.json();
    if (result.success) {
      profileName.value = result.data.nama_asli;
      profileUsername.value = result.data.username;
      profileEmail.value = result.data.email;
      profileRole.value = result.data.role;
      profileIdentity.value = result.data.identitas;
      profileProdi.value = result.data.prodi;
    }
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
  }
}

onMounted(() => {
  fetchProfile();
})

const openEditModal = () => {
  formEdit.value = {
    nama_asli: profileName.value,
    username: profileUsername.value,
    email: profileEmail.value,
    password: ''
  }
  isProfileInfoModal.value = true;
}

const saveProfile = async () => {
  isSaving.value = true;
  try {
    const response = await fetch(`${baseUrl}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        nama_asli: formEdit.value.nama_asli,
        username: formEdit.value.username,
        email: formEdit.value.email,
        password: formEdit.value.password ? formEdit.value.password : undefined
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      isProfileInfoModal.value = false;
      showAlert('success', 'Berhasil!', 'Profil berhasil diperbarui!');

      localStorage.setItem('namaAsli', formEdit.value.nama_asli);
      fetchProfile();
    } else {
      showAlert('error', 'Gagal!', result.message || 'Gagal memperbarui profil.');
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    showAlert('error', 'Gagal Server!', 'Terjadi kesalahan koneksi saat menyimpan profil.');
  } finally {
    isSaving.value = false;
  }
}
</script>
