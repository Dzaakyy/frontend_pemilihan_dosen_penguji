<template>
  <div class="relative">
    <div v-if="alert.show" class="fixed top-20 right-5 z-99999 w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div class="flex justify-end mb-4">
      <button @click="openAddModal"
        class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600">
        <svg class="w-4 h-4 mr-2 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.8333 9.16667V2.5H9.16667V9.16667H2.5V10.8333H9.16667V17.5H10.8333V10.8333H17.5V9.16667H10.8333Z" />
        </svg>
        Tambah Mahasiswa
      </button>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02]">
              <th class="px-5 py-3 text-left w-16 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Mahasiswa</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">NIM</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Judul TA</p>
              </th>
              <th class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Prodi</p>
              </th>
              <th class="px-5 py-3 text-center sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Topik</p>
              </th>
              <th class="px-5 py-3 text-center w-32 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading">
              <td colspan="7" class="px-5 py-8 text-center text-gray-500 text-theme-sm">
                Memuat data mahasiswa...
              </td>
            </tr>
            <tr v-else-if="mahasiswaList.length === 0">
              <td colspan="7" class="px-5 py-8 text-center text-gray-500 text-theme-sm">
                Belum ada data mahasiswa.
              </td>
            </tr>
            <tr v-else v-for="(item, index) in mahasiswaList" :key="item.id"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
              <td class="px-5 py-4 sm:px-6">
                <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{{ index + 1 }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="block text-gray-800 text-theme-sm dark:text-white/90">{{ item.nama_mahasiswa }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="block text-gray-500 text-theme-sm dark:text-gray-400">{{ item.nim }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="block text-gray-500 text-theme-sm dark:text-gray-400">{{ item.judul_ta || '-' }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="block text-gray-500 text-theme-sm dark:text-gray-400">{{ item.prodi?.nama_prodi || '-' }}</span>
              </td>
              <td class="px-5 py-4 text-center sm:px-6">
                <span class="inline-flex items-center justify-center rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-500">
                  {{ item.topik_ta?.nama_topik || '-' }}
                </span>
              </td>
              <td class="px-5 py-4 text-center sm:px-6">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(item)"
                    class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400 shadow-theme-xs"
                    title="Edit">
                    <svg class="fill-current w-4 h-4" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" /></svg>
                    Edit
                  </button>

                  <button @click="openDeleteModal(item)"
                    class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-red-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400 shadow-theme-xs"
                    title="Hapus">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.99998H16V5.99998C16 4.89541 15.1046 3.99998 14 3.99998H10C8.89543 3.99998 8 4.89541 8 5.99998V6.99998H5V8.99998H6V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V8.99998H19V6.99998ZM10 5.99998H14V6.99998H10V5.99998ZM16 19H8V8.99998H16V19Z" /></svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="isModalOpen" @close="closeModal">
      <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 mx-auto mt-10">

        <button @click="closeModal"
          class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" /></svg>
        </button>

        <div class="px-2 pr-14 mb-6 mt-4">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {{ isEditing ? 'Edit Data Mahasiswa' : 'Tambah Data Mahasiswa' }}
          </h4>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col px-2">

          <h5 class="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">Informasi Mahasiswa</h5>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nama Lengkap <span class="text-red-500">*</span></label>
              <input v-model="formData.nama_mahasiswa" type="text" placeholder="Misal: Anton Surya" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" required />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">NIM <span class="text-red-500">*</span></label>
              <input v-model="formData.nim" type="text" placeholder="Masukkan NIM" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" required />
            </div>
          </div>

          <div class="mb-4">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Judul Tugas Akhir</label>
            <input v-model="formData.judul_ta" type="text" placeholder="Judul TA Mahasiswa" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Program Studi <span class="text-red-500">*</span></label>
              <select v-model="formData.prodi_id" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" required>
                <option value="" disabled>Pilih Program Studi</option>
                <option v-for="prodi in listProdi" :key="prodi.id" :value="prodi.id">
                  {{ prodi.nama_prodi }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Topik TA</label>
              <select v-model="formData.topik_id" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
                <option value="" disabled>Pilih Topik</option>
                <option v-for="topik in listTopik" :key="topik.id" :value="topik.id">
                  {{ topik.nama_topik }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <h5 class="mb-3 text-lg font-medium text-gray-800 dark:text-white/90 border-t pt-4 dark:border-gray-700">Akun Pengguna (Login)</h5>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Username <span class="text-red-500">*</span></label>
                <input v-model="formData.username" type="text" placeholder="Username untuk mahasiswa" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" required />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password <span v-if="!isEditing" class="text-red-500">*</span></label>
                <input v-model="formData.password" type="password" placeholder="Password untuk mahasiswa" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800" :required="!isEditing" />
                <p v-if="isEditing" class="mt-1 text-xs text-gray-500">Kosongkan jika tidak ingin mengubah password.</p>
              </div>
              <input type="hidden" v-model="formData.role_id" />
            </div>
          </div>

          <div class="flex items-center gap-3 lg:justify-end mt-2">
            <button @click="closeModal" type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
              Batal
            </button>
            <button type="submit" :disabled="isSaving"
              class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 sm:w-auto">
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <Modal v-if="isDeleteModalOpen" @close="closeDeleteModal">
        <div class="w-full max-w-[400px] rounded-3xl bg-white p-6 dark:bg-gray-900 text-center mx-auto mt-20 z-50">
          <h4 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">Konfirmasi Hapus</h4>
          <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus data mahasiswa
            <br /> <strong class="text-gray-800 dark:text-white text-lg">"{{ itemToDelete?.nama_mahasiswa }}"</strong>?
            <br /><br /> Akun login mahasiswa ini juga akan ikut terhapus secara permanen.
          </p>
          <div class="flex items-center justify-center gap-3">
            <button @click="closeDeleteModal"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
              Batal
            </button>
            <button @click="confirmDelete" :disabled="isDeleting"
              class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto">
              {{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
          </div>
        </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import Alert from '@/components/ui/Alert.vue'

// --- INTERFACES ---
interface Prodi {
  id: number;
  nama_prodi: string;
}

interface Topik {
  id: number;
  nama_topik: string;
}

interface Mahasiswa {
  id: number;
  nama_mahasiswa: string;
  nim: string;
  judul_ta: string;
  prodi_id: number;
  topik_id: number;
  prodi?: Prodi;
  topik_ta?: Topik;
  user?: {
    id: number;
    username: string;
  };
}

interface MahasiswaPayload {
  nama_mahasiswa: string;
  nim: string;
  judul_ta: string;
  prodi_id: number;
  topik_id?: number;
  username?: string;
  password?: string;
  role_id?: number;
}

// --- STATE ALERT ---
const alert = ref({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  title: '',
  message: ''
})

const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  setTimeout(() => { alert.value.show = false }, 3000)
}

// --- STATE UTAMA ---
const mahasiswaList = ref<Mahasiswa[]>([])
const listProdi = ref<Prodi[]>([])
const listTopik = ref<Topik[]>([])
const isLoading = ref(true)

// --- STATE MODAL FORM ---
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const formData = ref({
  id: null as number | null,
  nama_mahasiswa: '',
  nim: '',
  judul_ta: '',
  prodi_id: '' as number | '',
  topik_id: '' as number | '',
  username: '',
  password: '',
  role_id: 4
})

const isDeleteModalOpen = ref(false)
const itemToDelete = ref<Mahasiswa | null>(null)
const isDeleting = ref(false)

// --- GET DATA MAHASISWA ---
const fetchMahasiswa = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:3000/api/mahasiswa', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    const result = await response.json()
    if (result.success) {
      mahasiswaList.value = result.data.rows || result.data
    }
  } catch (error) {
    console.error("Gagal fetch data mahasiswa:", error)
    showAlert('error', 'Gagal!', 'Terjadi kesalahan jaringan saat memuat data.')
  } finally {
    isLoading.value = false
  }
}

// --- GET DATA PRODI ---
const fetchProdiList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/prodi', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    const result = await response.json()
    if (result.success) listProdi.value = result.data
  } catch (error) {
    console.error("Gagal fetch prodi:", error)
  }
}

// --- GET DATA TOPIK ---
const fetchTopikList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/topik-ta', { // Asumsi endpoint topik
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    const result = await response.json()
    if (result.success) listTopik.value = result.data
  } catch (error) {
    console.error("Gagal fetch topik:", error)
  }
}

const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    id: null, nama_mahasiswa: '', nim: '', judul_ta: '', prodi_id: '', topik_id: '',
    username: '', password: '', role_id: 4
  }
  isModalOpen.value = true
}

const openEditModal = (item: Mahasiswa) => {
  isEditing.value = true
  formData.value = {
    id: item.id,
    nama_mahasiswa: item.nama_mahasiswa,
    nim: item.nim,
    judul_ta: item.judul_ta,
    prodi_id: item.prodi_id,
    topik_id: item.topik_ta?.id || '',
    username: item.user?.username || '',
    password: '',
    role_id: 4
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const submitForm = async () => {
  isSaving.value = true
  try {
    const url = isEditing.value
      ? `http://localhost:3000/api/mahasiswa/${formData.value.id}`
      : 'http://localhost:3000/api/mahasiswa'

    const method = isEditing.value ? 'PUT' : 'POST'

    const bodyPayload: MahasiswaPayload = {
      nama_mahasiswa: formData.value.nama_mahasiswa,
      nim: formData.value.nim,
      judul_ta: formData.value.judul_ta,
      prodi_id: Number(formData.value.prodi_id),
      username: formData.value.username
    }

    if (formData.value.topik_id) {
      bodyPayload.topik_id = Number(formData.value.topik_id);
    }

    if (!isEditing.value) {
      bodyPayload.password = formData.value.password;
      bodyPayload.role_id = formData.value.role_id;
    } else {
      if (formData.value.password && formData.value.password.trim() !== '') {
        bodyPayload.password = formData.value.password;
      }
    }

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bodyPayload)
    })

    if (response.ok) {
      closeModal()
      fetchMahasiswa()
      showAlert('success', 'Berhasil!', `Data Mahasiswa berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}.`)
    } else {
      const errorData = await response.json()
      showAlert('error', 'Gagal!', errorData.message || 'Terdapat kesalahan saat menyimpan data.')
    }
  } catch (error) {
    console.error("Error simpan data:", error)
    showAlert('error', 'Gagal Server!', 'Pastikan server backend sedang menyala.')
  } finally {
    isSaving.value = false
  }
}

// --- FUNGSI DELETE MODAL ---
const openDeleteModal = (item: Mahasiswa) => {
  itemToDelete.value = item
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  itemToDelete.value = null
}

const confirmDelete = async () => {
  if (itemToDelete.value === null) return;

  isDeleting.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/mahasiswa/${itemToDelete.value.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (response.ok) {
      closeDeleteModal()
      fetchMahasiswa()
      showAlert('success', 'Dihapus!', 'Data Mahasiswa dan akunnya berhasil dihapus permanen.')
    } else {
      showAlert('error', 'Gagal!', 'Terdapat kesalahan saat menghapus data.')
    }
  } catch (error) {
    console.error("Error hapus data:", error)
    showAlert('error', 'Gagal Server!', 'Pastikan server backend sedang menyala.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchMahasiswa()
  fetchProdiList()
  fetchTopikList()
})
</script>
