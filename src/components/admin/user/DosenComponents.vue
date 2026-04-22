<template>
  <div class="relative">
    <div v-if="alert.show" class="fixed top-20 right-5 z-99999 w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div class="flex flex-col gap-4 mb-4">

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-sm text-gray-500 dark:text-gray-400">Tampilkan</span>
          <select v-model="itemsPerPage" class="h-9 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
          <span class="text-sm text-gray-500 dark:text-gray-400">data</span>
        </div>

        <button v-if="isAdmin" @click="openAddModal" class="flex items-center justify-center px-4 h-10 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 w-full sm:w-auto">
          <svg class="w-4 h-4 mr-2 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.8333 9.16667V2.5H9.16667V9.16667H2.5V10.8333H9.16667V17.5H10.8333V10.8333H17.5V9.16667H10.8333Z" /></svg>
          Tambah Dosen
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input v-model="searchQuery" type="text" placeholder="Cari nama, NIDN..."
          class="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />

        <select v-model="filterProdi" class="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option value="">Semua Prodi</option>
          <option v-for="prodi in listProdi" :key="prodi.id_prodi" :value="prodi.id_prodi">{{ prodi.nama_prodi }}</option>
        </select>

        <select v-model="filterGrupRiset" class="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option value="">Semua Grup Riset</option>
          <option value="Center of Artificial Intelligence">Center of AI</option>
          <option value="Center of Design, Animation and Multimedia">Center of Design & Multimedia</option>
          <option value="Center of Programming">Center of Programming</option>
          <option value="Center of Software Technology and Management">Center of Software & Management</option>
          <option value="Center of Network, Security, and Infrastructure">Center of Network & Security</option>
        </select>

        <select v-model="sortOrder" class="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          <option value="">Urutkan Default</option>
          <option value="asc">Nama (A - Z)</option>
          <option value="desc">Nama (Z - A)</option>
        </select>
      </div>

    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02]">
              <th class="px-5 py-3 text-left w-16 sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No</p></th>
              <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Dosen</p></th>
              <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">NIDN</p></th>
              <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Prodi</p></th>
              <th class="px-5 py-3 text-center sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Grup Riset (Center)</p></th>
              <th class="px-5 py-3 text-center sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Peran/Role</p></th>
              <th class="px-5 py-3 text-center sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Kuota Menguji</p></th>
              <th v-if="isAdmin" class="px-5 py-3 text-center w-32 sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading">
              <td colspan="8" class="px-5 py-8 text-center text-gray-500 text-theme-sm">Memuat data dosen...</td>
            </tr>
            <tr v-else-if="paginatedList.length === 0">
              <td colspan="8" class="px-5 py-8 text-center text-gray-500 text-theme-sm">Data tidak ditemukan sesuai filter.</td>
            </tr>

            <tr v-else v-for="(item, index) in paginatedList" :key="item.id_dosen" class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
              <td class="px-5 py-4 sm:px-6">
                <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6"><span class="block text-gray-800 text-theme-sm dark:text-white/90">{{ item.nama_dosen }}</span></td>
              <td class="px-5 py-4 sm:px-6"><span class="block text-gray-500 text-theme-sm dark:text-gray-400">{{ item.nidn }}</span></td>
              <td class="px-5 py-4 sm:px-6"><span class="block text-gray-500 text-theme-sm dark:text-gray-400">{{ item.prodi?.nama_prodi || '-' }}</span></td>
              <td class="px-5 py-4 text-center sm:px-6">
                <span class="inline-flex items-center justify-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">{{ item.grup_riset || '-' }}</span>
              </td>
              <td class="px-5 py-4 text-center sm:px-6">
                <div class="flex flex-wrap items-center justify-center gap-1">
                  <span v-if="!item.user?.role || item.user.role.length === 0" class="inline-flex items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">-</span>
                  <span v-else v-for="role in item.user.role" :key="role.id_role" :class="['inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium', role.id_role === 2 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800']">
                    {{ role.nama || role.nama_role }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-4 text-center sm:px-6">
                <span class="inline-flex items-center justify-center rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-500">{{ item.kuota_menguji }}</span>
              </td>
              
              <td v-if="isAdmin" class="px-5 py-4 text-center sm:px-6">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(item)" class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-blue-600 shadow-theme-xs" title="Edit">
                    <svg class="fill-current w-4 h-4" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" /></svg> Edit
                  </button>
                  <button @click="openDeleteModal(item)" class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-red-600 shadow-theme-xs" title="Hapus">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.99998H16V5.99998C16 4.89541 15.1046 3.99998 14 3.99998H10C8.89543 3.99998 8 4.89541 8 5.99998V6.99998H5V8.99998H6V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V8.99998H19V6.99998ZM10 5.99998H14V6.99998H10V5.99998ZM16 19H8V8.99998H16V19Z" /></svg> Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination
      v-if="!isLoading && totalItems > 0"
      :current-page="currentPage"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      @update:currentPage="currentPage = $event"
    />

    <Modal v-if="isModalOpen" @close="closeModal">
      <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 mx-auto mt-10">
        <button @click="closeModal" class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-white/[0.05]">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" /></svg>
        </button>

        <div class="px-2 pr-14 mb-6 mt-4">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {{ isEditing ? 'Edit Data Dosen' : 'Tambah Data Dosen' }}
          </h4>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col px-2">
          <h5 class="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">Informasi Dosen</h5>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nama Lengkap <span class="text-red-500">*</span></label>
              <input v-model="formData.nama_dosen" type="text" placeholder="Misal: Budi Santoso, M.Kom" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3" required />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">NIDN <span class="text-red-500">*</span></label>
              <input v-model="formData.nidn" type="text" placeholder="Masukkan NIDN" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3" required />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Program Studi <span class="text-red-500">*</span></label>
              <select v-model="formData.prodi_id" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3" required>
                <option value="" disabled>Pilih Program Studi</option>
                <option v-for="prodi in listProdi" :key="prodi.id_prodi" :value="prodi.id_prodi">{{ prodi.nama_prodi }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Grup Riset (Center) <span class="text-red-500">*</span></label>
              <select v-model="formData.grup_riset" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3" required>
                <option value="" disabled>Pilih Center</option>
                <option value="Center of Artificial Intelligence">Center of Artificial Intelligence</option>
                <option value="Center of Design, Animation and Multimedia">Center of Design, Animation and Multimedia</option>
                <option value="Center of Programming">Center of Programming</option>
                <option value="Center of Software Technology and Management">Center of Software Technology and Management</option>
                <option value="Center of Network, Security, and Infrastructure">Center of Network, Security, and Infrastructure</option>
              </select>
            </div>
          </div>

          <div class="mb-6">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Kuota Menguji <span class="text-red-500">*</span></label>
            <input v-model="formData.kuota_menguji" type="number" placeholder="Misal: 10" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3" required />
          </div>

          <div>
            <h5 class="mb-3 text-lg font-medium text-gray-800 dark:text-white/90 border-t pt-4 dark:border-gray-700">Akun Pengguna (Login)</h5>

            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Peran (Role) Akun <span class="text-red-500">*</span></label>
              <div class="flex flex-col gap-3 sm:flex-row">
                <label class="relative flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-3 hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.role_ids" :value="2" class="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                  <span class="text-sm font-medium text-gray-700">Ketua Prodi</span>
                </label>
                <label class="relative flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-3 hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.role_ids" :value="3" class="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                  <span class="text-sm font-medium text-gray-700">Dosen Penguji</span>
                </label>
              </div>
              <p v-if="formData.role_ids.length === 0" class="mt-2 text-xs text-red-500">Pilih minimal 1 peran.</p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Username <span class="text-red-500">*</span></label>
                <input v-model="formData.username" type="text" placeholder="Username untuk dosen" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3" :required="!isEditing" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password <span v-if="!isEditing" class="text-red-500">*</span></label>
                <input v-model="formData.password" type="password" placeholder="Password untuk dosen" class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3" :required="!isEditing" />
                <p v-if="isEditing" class="mt-1 text-xs text-gray-500">Kosongkan jika tidak ingin mengubah password.</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 lg:justify-end mt-2">
            <button @click="closeModal" type="button" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto">
              Batal
            </button>
            <button type="submit" :disabled="isSaving || formData.role_ids.length === 0" class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 sm:w-auto">
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <Modal v-if="isDeleteModalOpen" @close="closeDeleteModal">
        <div class="w-full max-w-[400px] rounded-3xl bg-white p-6 text-center mx-auto mt-20 z-50">
          <h4 class="mb-4 text-xl font-semibold text-gray-800">Konfirmasi Hapus</h4>
          <p class="mb-8 text-sm text-gray-500">
            Apakah Anda yakin ingin menghapus data dosen <br />
            <strong class="text-gray-800 text-lg">"{{ itemToDelete?.nama_dosen }}"</strong>?
            <br /><br /> Akun login dosen ini juga akan ikut terhapus.
          </p>
          <div class="flex items-center justify-center gap-3">
            <button @click="closeDeleteModal" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto">
              Batal
            </button>
            <button @click="confirmDelete" :disabled="isDeleting" class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto">
              {{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
          </div>
        </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Pagination from '@/components/pagination/Pagination.vue'
import Modal from '@/components/modal/Modal.vue'
import Alert from '@/components/ui/Alert.vue'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface Prodi { id_prodi: number; nama_prodi: string; }
interface Role { id_role: number; nama?: string; nama_role?: string; }

interface Dosen {
  id_dosen: number;
  nama_dosen: string;
  nidn: string;
  prodi_id: number;
  grup_riset: string;
  kuota_menguji: number;
  prodi?: Prodi;
  user?: {
    id_user: number;
    username: string;
    role?: Role[];
  };
}

interface DosenPayload {
  nama_dosen: string;
  nidn: string;
  prodi_id: number;
  grup_riset: string;
  kuota_menguji: number;
  username?: string;
  password?: string;
  role_ids: number[];
}

// --- STATE ---
const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })
const showAlert = (type: AlertVariant, title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  setTimeout(() => { alert.value.show = false }, 3000)
}

const userRoles = ref<string[]>([])
const isAdmin = computed(() => {
  return userRoles.value.some(role => role.toLowerCase() === 'admin')
})

const dosenList = ref<Dosen[]>([])
const listProdi = ref<Prodi[]>([])
const isLoading = ref(true)

// --- STATE SEARCH, FILTER, & PAGINATION ---
const searchQuery = ref('')
const filterProdi = ref<number | ''>('')
const filterGrupRiset = ref('')
const sortOrder = ref<'asc' | 'desc' | ''>('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// --- LOGIKA FILTER & SORTING (KOMBINASI SEMUA) ---
const filteredList = computed(() => {
  let result = dosenList.value;

  // 1. Filter by Prodi
  if (filterProdi.value !== '') {
    result = result.filter(dosen => dosen.prodi_id === filterProdi.value);
  }

  // 2. Filter by Grup Riset
  if (filterGrupRiset.value !== '') {
    result = result.filter(dosen => dosen.grup_riset === filterGrupRiset.value);
  }

  // 3. Search Query
  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase();
    result = result.filter(dosen =>
      dosen.nama_dosen.toLowerCase().includes(lowerQuery) ||
      dosen.nidn.includes(lowerQuery) ||
      (dosen.prodi?.nama_prodi && dosen.prodi.nama_prodi.toLowerCase().includes(lowerQuery)) ||
      (dosen.grup_riset && dosen.grup_riset.toLowerCase().includes(lowerQuery))
    );
  }

  // 4. Sort by Nama (Abjad)
  if (sortOrder.value === 'asc') {
    result = [...result].sort((a, b) => a.nama_dosen.localeCompare(b.nama_dosen));
  } else if (sortOrder.value === 'desc') {
    result = [...result].sort((a, b) => b.nama_dosen.localeCompare(a.nama_dosen));
  }

  return result;
})

const totalItems = computed(() => filteredList.value.length)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredList.value.slice(start, end)
})

watch([searchQuery, filterProdi, filterGrupRiset, sortOrder, itemsPerPage], () => {
  currentPage.value = 1
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const formData = ref({
  id: null as number | null,
  nama_dosen: '',
  nidn: '',
  prodi_id: '' as number | '',
  grup_riset: '',
  kuota_menguji: '' as number | '',
  username: '',
  password: '',
  role_ids: [] as number[]
})

const isDeleteModalOpen = ref(false)
const itemToDelete = ref<Dosen | null>(null)
const isDeleting = ref(false)

// --- FETCH DATA ---
const fetchDosen = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:3000/api/dosen', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    const result = await response.json()
    if (result.success) {
      dosenList.value = result.data.rows || result.data
    }
  } catch (error) {
    console.error("Fetch Dosen Error:", error)
    showAlert('error', 'Gagal!', 'Terjadi kesalahan jaringan saat memuat data.')
  } finally {
    isLoading.value = false
  }
}

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

// --- MODAL & FORM ---
const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    id: null, nama_dosen: '', nidn: '', prodi_id: '', grup_riset: '', kuota_menguji: '',
    username: '', password: '', role_ids: []
  }
  isModalOpen.value = true
}

const openEditModal = (item: Dosen) => {
  isEditing.value = true
  const existingRoleIds = item.user?.role?.map((r: Role) => r.id_role) || []

  formData.value = {
    id: item.id_dosen,
    nama_dosen: item.nama_dosen,
    nidn: item.nidn,
    prodi_id: item.prodi_id,
    grup_riset: item.grup_riset || '',
    kuota_menguji: item.kuota_menguji,
    username: item.user?.username || '',
    password: '',
    role_ids: existingRoleIds
  }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const submitForm = async () => {
  if (formData.value.role_ids.length === 0) {
    showAlert('warning', 'Peringatan', 'Minimal pilih satu peran/role dosen.')
    return;
  }

  isSaving.value = true
  try {
    const url = isEditing.value
      ? `http://localhost:3000/api/dosen/${formData.value.id}`
      : 'http://localhost:3000/api/dosen'
    const method = isEditing.value ? 'PUT' : 'POST'

    const bodyPayload: DosenPayload = {
      nama_dosen: formData.value.nama_dosen,
      nidn: formData.value.nidn,
      prodi_id: Number(formData.value.prodi_id),
      grup_riset: formData.value.grup_riset,
      kuota_menguji: Number(formData.value.kuota_menguji),
      username: formData.value.username,
      role_ids: formData.value.role_ids
    }

    if (!isEditing.value) {
      bodyPayload.password = formData.value.password;
    } else if (formData.value.password && formData.value.password.trim() !== '') {
      bodyPayload.password = formData.value.password;
    }

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bodyPayload)
    })

    if (response.ok) {
      closeModal()
      fetchDosen()
      showAlert('success', 'Berhasil!', `Data Dosen berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}.`)
    } else {
      const errorData = await response.json()
      showAlert('error', 'Gagal!', errorData.message || 'Terdapat kesalahan saat menyimpan data.')
    }
  } catch (error) {
    console.error("Submit Error:", error)
    showAlert('error', 'Gagal Server!', 'Pastikan server backend sedang menyala.')
  } finally {
    isSaving.value = false
  }
}

// --- DELETE ---
const openDeleteModal = (item: Dosen) => { itemToDelete.value = item; isDeleteModalOpen.value = true }
const closeDeleteModal = () => { isDeleteModalOpen.value = false; itemToDelete.value = null }

const confirmDelete = async () => {
  if (itemToDelete.value === null) return;
  isDeleting.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/dosen/${itemToDelete.value.id_dosen}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    if (response.ok) {
      closeDeleteModal()
      fetchDosen()
      showAlert('success', 'Dihapus!', 'Data Dosen berhasil dihapus permanen.')
    }
  } catch (error) {
    console.error("Delete Error:", error)
    showAlert('error', 'Gagal Server!', 'Pastikan server backend sedang menyala.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  try {
    userRoles.value = JSON.parse(localStorage.getItem('userRoles') || '[]')
  } catch {
    userRoles.value = (localStorage.getItem('userRoles') || '').split(',').map(r => r.trim())
  }
  fetchDosen()
  fetchProdiList()
})
</script>
