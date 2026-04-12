<template>
  <div class="relative w-full">
    <div v-if="alert.show" class="fixed top-20 right-5 z-[99999] w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
      <div class="flex items-center gap-2">
        <input v-model="searchKeahlianQuery" type="text" placeholder="Cari nama dosen..."
          class="h-10 w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
      </div>

      <button @click="openAddModal"
        class="flex items-center justify-center px-4 h-10 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 w-full sm:w-auto">
        <svg class="w-4 h-4 mr-2 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.8333 9.16667V2.5H9.16667V9.16667H2.5V10.8333H9.16667V17.5H10.8333V10.8333H17.5V9.16667H10.8333Z" />
        </svg>
        Tambah Keahlian Dosen
      </button>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02]">
              <th class="px-5 py-3 w-16 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No</p>
              </th>
              <th class="px-5 py-3 sm:px-6 w-1/3">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Dosen</p>
              </th>
              <th class="px-5 py-3 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Topik Keahlian</p>
              </th>
              <th class="px-5 py-3 text-center w-40 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading">
              <td colspan="4" class="px-5 py-8 text-center text-gray-500 text-theme-sm">
                Memuat data keahlian dosen...
              </td>
            </tr>
            <tr v-else-if="filteredGroupedKeahlian.length === 0">
              <td colspan="4" class="px-5 py-8 text-center text-gray-500 text-theme-sm">
                Belum ada data keahlian dosen.
              </td>
            </tr>

            <tr v-else v-for="(group, index) in filteredGroupedKeahlian" :key="group.dosen_id"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]">

              <td class="px-5 py-4 sm:px-6 align-top pt-5">
                <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {{ index + 1 }}
                </span>
              </td>

              <td class="px-5 py-4 sm:px-6 align-top pt-5">
                <span class="block text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                  {{ group.nama_dosen }}
                </span>
              </td>

              <td class="px-5 py-4 sm:px-6 align-top pt-5">
                <div class="flex flex-wrap gap-2">
                  <span v-for="keahlian in group.keahlian" :key="keahlian.id"
                    class="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {{ keahlian.topik_ta?.nama_topik || '-' }}
                  </span>
                </div>
              </td>

              <td class="px-5 py-4 text-center sm:px-6 align-top pt-4">
                <div class="flex justify-center gap-2">
                  <button @click="openEditModal(group)" class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-blue-600 shadow-theme-xs" title="Edit">
                    <svg class="fill-current w-4 h-4" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" /></svg>
                    Edit
                  </button>
                  <button @click="openDeleteModal(group)" class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-red-600 shadow-theme-xs" title="Hapus">
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
      <div class="relative w-full max-w-[600px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 mx-auto mt-10 shadow-2xl">
        <button @click="closeModal" class="transition-color absolute right-5 top-5 z-[100] flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-white/[0.05]">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" /></svg>
        </button>

        <div class="px-2 pr-14 mb-6 mt-4">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {{ isEditing ? 'Edit Keahlian Dosen' : 'Tambah Keahlian Dosen' }}
          </h4>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col px-2 pb-10">

          <div class="mb-5 relative z-[60]" ref="dosenDropdownContainer">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Pilih Dosen (Ketik untuk mencari) <span class="text-red-500">*</span>
            </label>

            <div v-if="!isEditing" class="relative">
              <input type="text" v-model="dosenSearchTerm" @focus="showDosenDropdown = true"
                placeholder="Ketik nama dosen..."
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10"
                required />

              <ul v-if="showDosenDropdown && filteredDosenOptions.length > 0"
                  class="absolute w-full mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-xl">
                <li v-for="dosen in filteredDosenOptions" :key="dosen.id" @click="selectDosen(dosen)"
                    class="px-4 py-2 cursor-pointer hover:bg-brand-50 text-sm text-gray-800 border-b border-gray-100 last:border-0">
                  {{ dosen.nama_dosen }}
                </li>
              </ul>
              <div v-if="showDosenDropdown && filteredDosenOptions.length === 0" class="absolute w-full mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-xl text-sm text-gray-500 text-center">
                Dosen tidak ditemukan
              </div>
            </div>

            <input v-else type="text" :value="dosenSearchTerm" disabled class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 shadow-theme-xs cursor-not-allowed" />
          </div>

          <div class="mb-6 relative z-[50]" ref="topikDropdownContainer">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Pilih Topik Keahlian (Bisa Lebih Dari Satu) <span class="text-red-500">*</span>
            </label>

            <div @click="showTopikDropdown = !showTopikDropdown"
              class="min-h-[44px] w-full rounded-lg border border-gray-300 bg-transparent px-2 py-1.5 text-sm text-gray-800 shadow-theme-xs focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/10 cursor-pointer flex flex-wrap gap-1 items-center relative">

              <span v-if="formData.topik_ids.length === 0" class="text-gray-400 px-2 py-1">Pilih satu atau beberapa topik...</span>

              <span v-for="id in formData.topik_ids" :key="id"
                class="inline-flex items-center gap-1.5 rounded-md bg-brand-50 pl-2 text-xs font-medium text-brand-600 border border-brand-200">
                {{ getTopikName(id) }}
                <button @click.stop="toggleTopik(id)" type="button" class="p-1 hover:bg-brand-200 rounded-r-md transition-colors text-brand-500">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </span>

              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div v-if="showTopikDropdown" class="absolute w-full mt-1 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl">
              <div v-for="topik in topikList" :key="topik.id" @click="toggleTopik(topik.id)"
                class="px-4 py-2.5 cursor-pointer hover:bg-brand-50 text-sm text-gray-800 border-b border-gray-100 last:border-0 flex items-center justify-between transition-colors">
                <span>{{ topik.nama_topik }}</span>
                <svg v-if="formData.topik_ids.includes(topik.id)" class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>

            <p v-if="formData.topik_ids.length === 0" class="mt-2 text-xs text-red-500">Pilih minimal 1 topik keahlian.</p>
          </div>

          <div class="flex items-center gap-3 lg:justify-end mt-4">
            <button @click="closeModal" type="button" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto">
              Batal
            </button>
            <button type="submit" :disabled="isSaving || !formData.dosen_id || formData.topik_ids.length === 0" class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 sm:w-auto">
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <Modal v-if="isDeleteModalOpen" @close="closeDeleteModal">
      <div class="w-full max-w-[400px] rounded-3xl bg-white p-6 dark:bg-gray-900 text-center mx-auto mt-20 z-50 shadow-xl">
        <h4 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">Konfirmasi Hapus</h4>
        <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
          Apakah Anda yakin ingin menghapus <strong>SELURUH keahlian</strong> dari dosen <br/>
          <strong class="text-gray-800 dark:text-white text-lg">"{{ itemToDeleteGroup?.nama_dosen }}"</strong>?
        </p>
        <div class="flex items-center justify-center gap-3">
          <button @click="closeDeleteModal" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto">Batal</button>
          <button @click="confirmDelete" :disabled="isDeleting" class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto">
            {{ isDeleting ? 'Menghapus...' : 'Ya, Hapus Semua' }}
          </button>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import Alert from '@/components/ui/Alert.vue'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface Dosen { id: number; nama_dosen: string; }
interface Topik { id: number; nama_topik: string; }
interface Keahlian { id: number; dosen_id: number; topik_id: number; dosen?: Dosen; topik_ta?: Topik; }

// Struktur Group
interface GroupedKeahlian {
  dosen_id: number;
  nama_dosen: string;
  keahlian: Keahlian[];
}

const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })
const showAlert = (type: AlertVariant, title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  setTimeout(() => { alert.value.show = false }, 3000)
}

const keahlianList = ref<Keahlian[]>([])
const dosenList = ref<Dosen[]>([])
const topikList = ref<Topik[]>([])
const isLoading = ref(true)

const searchKeahlianQuery = ref('')

const groupedKeahlian = computed(() => {
  const groups: Record<number, GroupedKeahlian> = {}
  keahlianList.value.forEach(item => {
    if (!item.dosen) return;
    if (!groups[item.dosen_id]) {
      groups[item.dosen_id] = { dosen_id: item.dosen_id, nama_dosen: item.dosen.nama_dosen, keahlian: [] }
    }
    groups[item.dosen_id].keahlian.push(item)
  })
  return Object.values(groups)
})

const filteredGroupedKeahlian = computed(() => {
  if (!searchKeahlianQuery.value) return groupedKeahlian.value;
  const q = searchKeahlianQuery.value.toLowerCase()
  return groupedKeahlian.value.filter(g => g.nama_dosen.toLowerCase().includes(q))
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const formData = ref({
  dosen_id: '' as number | '',
  topik_ids: [] as number[]
})

const dosenDropdownContainer = ref<HTMLElement | null>(null)
const topikDropdownContainer = ref<HTMLElement | null>(null)
const showDosenDropdown = ref(false)
const showTopikDropdown = ref(false)

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (dosenDropdownContainer.value && !dosenDropdownContainer.value.contains(target)) {
    showDosenDropdown.value = false
  }
  if (topikDropdownContainer.value && !topikDropdownContainer.value.contains(target)) {
    showTopikDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  fetchKeahlian()
  fetchDosenList()
  fetchTopikList()
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const dosenSearchTerm = ref('')

const filteredDosenOptions = computed(() => {
  const dosenIdsWithKeahlian = groupedKeahlian.value.map(group => group.dosen_id);

  let availableDosen = dosenList.value.filter(dosen =>
    !dosenIdsWithKeahlian.includes(dosen.id) ||
    (isEditing.value && dosen.id === formData.value.dosen_id)
  );

  if (dosenSearchTerm.value) {
    const term = dosenSearchTerm.value.toLowerCase();
    availableDosen = availableDosen.filter(d => d.nama_dosen.toLowerCase().includes(term));
  }

  return availableDosen;
})
const selectDosen = (dosen: Dosen) => {
  formData.value.dosen_id = dosen.id
  dosenSearchTerm.value = dosen.nama_dosen
  showDosenDropdown.value = false
}

const toggleTopik = (id: number) => {
  const index = formData.value.topik_ids.indexOf(id)
  if (index === -1) {
    formData.value.topik_ids.push(id)
  } else {
    formData.value.topik_ids.splice(index, 1)
  }
}

const getTopikName = (id: number) => {
  const topik = topikList.value.find(t => t.id === id)
  return topik ? topik.nama_topik : ''
}

const isDeleteModalOpen = ref(false)
const itemToDeleteGroup = ref<GroupedKeahlian | null>(null)
const isDeleting = ref(false)

const fetchKeahlian = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:3000/api/keahlian-dosen', { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (result.success) keahlianList.value = result.data.rows || result.data
  } catch (error) {
    console.error("Gagal fetch data keahlian:", error)
  } finally {
    isLoading.value = false
  }
}

const fetchDosenList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/dosen', { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (result.success) dosenList.value = result.data.rows || result.data
  } catch (error) {
    console.error("Gagal fetch dosen:", error)
  }
}

const fetchTopikList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/topik-ta', { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (result.success) topikList.value = result.data
  } catch (error) {
    console.error("Gagal fetch topik:", error)
  }
}

const openAddModal = () => {
  isEditing.value = false
  formData.value = { dosen_id: '', topik_ids: [] }
  dosenSearchTerm.value = ''
  showDosenDropdown.value = false
  showTopikDropdown.value = false
  isModalOpen.value = true
}

const openEditModal = (group: GroupedKeahlian) => {
  isEditing.value = true
  formData.value = {
    dosen_id: group.dosen_id,
    topik_ids: group.keahlian.map(k => k.topik_id) // Ekstrak ID Topik yang sudah ada
  }
  dosenSearchTerm.value = group.nama_dosen
  showDosenDropdown.value = false
  showTopikDropdown.value = false
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  showDosenDropdown.value = false
  showTopikDropdown.value = false
}

const submitForm = async () => {
  if (!formData.value.dosen_id || formData.value.topik_ids.length === 0) {
    showAlert('warning', 'Peringatan', 'Silakan pilih dosen dan minimal 1 topik.');
    return;
  }

  isSaving.value = true
  try {
    const url = isEditing.value
      ? `http://localhost:3000/api/keahlian-dosen/${formData.value.dosen_id}` // Kalau edit, base on dosen_id
      : 'http://localhost:3000/api/keahlian-dosen'

    const method = isEditing.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        dosen_id: Number(formData.value.dosen_id),
        topik_ids: formData.value.topik_ids
      })
    })

    const result = await response.json()

    if (response.ok) {
      closeModal()
      fetchKeahlian()
      showAlert('success', 'Berhasil!', `Keahlian Dosen berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}.`)
    } else {
      showAlert('error', 'Gagal!', result.message || 'Terdapat kesalahan saat menyimpan data.')
    }
  } catch (error) {
    console.error("Error simpan data:", error)
    showAlert('error', 'Gagal Server!', 'Pastikan server backend sedang menyala.')
  } finally {
    isSaving.value = false
  }
}

const openDeleteModal = (group: GroupedKeahlian) => {
  itemToDeleteGroup.value = group
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  itemToDeleteGroup.value = null
}

const confirmDelete = async () => {
  if (itemToDeleteGroup.value === null) return;
  isDeleting.value = true
  try {
    // Menghapus berdasarkan dosen_id (semua keahlian dosen akan terhapus)
    const response = await fetch(`http://localhost:3000/api/keahlian-dosen/${itemToDeleteGroup.value.dosen_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (response.ok) {
      closeDeleteModal()
      fetchKeahlian()
      showAlert('success', 'Dihapus!', 'Seluruh Keahlian Dosen berhasil dihapus.')
    } else {
      showAlert('error', 'Gagal!', 'Terdapat kesalahan saat menghapus data.')
    }
  } catch (error) {
    console.error("Error hapus data:", error)
  } finally {
    isDeleting.value = false
  }
}
</script>
