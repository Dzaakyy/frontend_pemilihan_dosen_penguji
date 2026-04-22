<template>
  <div class="relative">
    <div v-if="alert.show" class="fixed top-20 right-5 z-[99999] w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div class="flex flex-col gap-4 mb-6 p-5 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-sm text-gray-500 dark:text-gray-400">Tampilkan</span>
          <select v-model="itemsPerPage" class="h-9 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90">
            <option :value="5">5 Mahasiswa</option>
            <option :value="10">10 Mahasiswa</option>
            <option :value="20">20 Mahasiswa</option>
          </select>
          <span class="text-sm text-gray-500 dark:text-gray-400">per halaman</span>
        </div>

        <button v-if="canManageMatching" @click="openGenerateModal" class="flex items-center justify-center px-5 h-10 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 w-full sm:w-auto shadow-theme-xs">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
          Jalankan Matching PSO Massal
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Cari Nama Mahasiswa, NIM, atau Judul TA..."
            class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div class="relative w-full" ref="mahasiswaDropdownRef">
          <button type="button" @click="isMahasiswaDropdownOpen = !isMahasiswaDropdownOpen"
            class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="truncate pr-4 font-medium">{{ selectedMahasiswaLabel }}</span>
            <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': isMahasiswaDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
            <div v-if="isMahasiswaDropdownOpen"
              class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                <li @click="selectFilterMahasiswa('')"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">
                  -- Tampilkan Semua Mahasiswa --
                </li>
                <li v-for="mhs in mahasiswaList" :key="mhs.id_mahasiswa" @click="selectFilterMahasiswa(mhs.id_mahasiswa)"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">
                  {{ mhs.nama_mahasiswa }} <span class="text-gray-400 dark:text-gray-500 ml-1 text-xs">({{ mhs.nim }})</span>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-transparent">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hasil Algoritma PSO (Top 5 Dosen)
        </h3>
      </div>

      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02]">
              <th class="px-5 py-3 text-left w-1/3 border-r border-gray-200 dark:border-gray-700"><p class="font-bold text-gray-700 text-theme-xs uppercase tracking-wider">Data Mahasiswa</p></th>
              <th class="px-5 py-3 text-center w-24"><p class="font-bold text-brand-500 text-theme-xs uppercase tracking-wider">Ranking</p></th>
              <th class="px-5 py-3 text-left"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Dosen Penguji Rekomendasi</p></th>
              <th class="px-5 py-3 text-center"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Iterasi PSO</p></th>
              <th class="px-5 py-3 text-center"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Nilai Kecocokan</p></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">

            <tr v-if="isLoading">
              <td colspan="5" class="px-5 py-12 text-center text-gray-500 text-theme-sm">
                <div class="flex items-center justify-center gap-3">
                  <svg class="animate-spin h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Memuat semua hasil rekomendasi...
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedGroups.length === 0">
              <td colspan="5" class="px-5 py-12 text-center text-gray-500 text-theme-sm">
                Belum ada hasil matching yang sesuai. Silakan jalankan algoritma PSO Massal.
              </td>
            </tr>

            <template v-else v-for="group in paginatedGroups" :key="group.mahasiswa_id">
              <tr v-for="(item, index) in group.rekomendasi" :key="item.id_rekomendasi" class="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">

                <td v-if="index === 0" :rowspan="group.rekomendasi.length" class="px-5 py-5 border-r border-gray-200 dark:border-gray-700 align-top bg-white dark:bg-gray-900">
                  <div class="sticky top-0">
                    <div class="flex flex-col">
                      <span class="block font-bold text-gray-800 text-base dark:text-white/90">
                        {{ group.nama_mahasiswa }}
                      </span>
                      <span class="block text-sm font-medium text-brand-500 mt-0.5">NIM: {{ group.nim }}</span>
                    </div>

                    <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                      <span class="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">Judul Tugas Akhir:</span>
                      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {{ group.judul_ta || 'Belum ada judul / Topik belum diajukan' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-3 text-center border-l border-gray-100 dark:border-gray-800 align-middle">
                  <span :class="[
                    'inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm',
                    item.rank === '1' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700 ring-2 ring-yellow-400' :
                    item.rank === '2' ? 'bg-gray-100 text-gray-700' :
                    item.rank === '3' ? 'bg-orange-100 text-orange-800' : 'bg-brand-50 text-brand-600'
                  ]">
                    #{{ item.rank }}
                  </span>
                </td>

                <td class="px-5 py-3 align-middle">
                  <span class="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                    {{ item.dosen?.nama_dosen }}
                  </span>
                  <span class="block text-xs text-gray-500 mt-0.5">NIDN: {{ item.dosen?.nidn }}</span>
                </td>

                <td class="px-5 py-3 text-center align-middle">
                  <span class="inline-flex items-center justify-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
                    {{ item.iterasi_pso }} Iterasi
                  </span>
                </td>

                <td class="px-5 py-3 text-center align-middle">
                  <span class="font-mono text-gray-800 dark:text-gray-300 font-bold text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                    {{ item.nilai_fitness }}
                  </span>
                </td>
              </tr>
              <tr class="bg-gray-100 dark:bg-gray-800"><td colspan="5" class="h-1.5 p-0 m-0 border-none"></td></tr>
            </template>
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
      class="mt-4"
    />

    <Modal v-if="isGenerateModalOpen" @close="closeGenerateModal">
      <div class="relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900 mx-auto mt-20 shadow-2xl">
        <div class="text-center mb-6">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 mb-4 shadow-inner">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h4 class="text-2xl font-bold text-gray-800 dark:text-white/90">Matching Massal (PSO)</h4>
          <p class="text-sm text-gray-500 mt-3 leading-relaxed">
            Sistem akan mendeteksi seluruh mahasiswa yang <strong>belum memiliki dosen penguji</strong>, lalu mencarikan rekomendasi 5 dosen terbaik untuk masing-masing mahasiswa secara otomatis.
          </p>
        </div>

        <form @submit.prevent="submitGeneratePso" class="flex flex-col">
          <div class="flex items-center gap-3 w-full mt-2 border-t border-gray-100 pt-5 dark:border-gray-800">
            <button @click="closeGenerateModal" type="button" class="flex-1 justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isGenerating" class="flex-1 flex justify-center items-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg">
              <svg v-if="isGenerating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isGenerating ? 'Sedang Memproses...' : 'Ya, Mulai Matching' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Pagination from '@/components/pagination/Pagination.vue'
import Modal from '@/components/modal/Modal.vue'
import Alert from '@/components/ui/Alert.vue'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface Mahasiswa { id_mahasiswa: number; nama_mahasiswa: string; judul_ta: string; nim: string; }
interface Dosen { id_dosen: number; nama_dosen: string; nidn: string; kuota_menguji: number; }
interface Rekomendasi {
  id_rekomendasi: number;
  mahasiswa_id: number;
  dosen_id: number;
  iterasi_pso: number;
  nilai_fitness: number;
  rank: string;
  dosen?: Dosen;
  mahasiswa?: Mahasiswa;
}

// Interface Baru untuk Grouping (1 Mahasiswa memiliki banyak Rekomendasi Dosen)
interface GroupedMahasiswa {
  mahasiswa_id: number;
  nama_mahasiswa: string;
  judul_ta: string;
  nim: string;
  rekomendasi: Rekomendasi[];
}

const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })
const showAlert = (type: AlertVariant, title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  setTimeout(() => { alert.value.show = false }, 3000)
}

const isLoading = ref(false)
const isGenerating = ref(false)
const isGenerateModalOpen = ref(false)

const mahasiswaList = ref<Mahasiswa[]>([])
const semuaRekomendasi = ref<Rekomendasi[]>([])

// --- STATE DROPDOWN & FILTER ---
const isMahasiswaDropdownOpen = ref(false)
const mahasiswaDropdownRef = ref<HTMLElement | null>(null)
const selectedMahasiswaFilter = ref<number | ''>('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)

const userRoles = ref<string[]>([])
const canManageMatching = computed(() => {
  return userRoles.value.some(role => ['admin', 'kaprodi'].includes(role.toLowerCase()))
})

// --- LOGIKA CLICK OUTSIDE DROPDOWN ---
const handleDropdownClickOutside = (event: MouseEvent) => {
  if (mahasiswaDropdownRef.value && !mahasiswaDropdownRef.value.contains(event.target as Node)) {
    isMahasiswaDropdownOpen.value = false;
  }
}

const selectFilterMahasiswa = (val: number | '') => {
  selectedMahasiswaFilter.value = val;
  isMahasiswaDropdownOpen.value = false;
}

const selectedMahasiswaLabel = computed(() => {
  if (selectedMahasiswaFilter.value === '') return '-- Tampilkan Semua Mahasiswa --';
  const found = mahasiswaList.value.find(m => m.id_mahasiswa === selectedMahasiswaFilter.value);
  return found ? `${found.nama_mahasiswa} (${found.nim})` : '-- Tampilkan Semua Mahasiswa --';
});

// --- LOGIKA GROUPING ---
const groupedRekomendasi = computed(() => {
  const groups: Record<number, GroupedMahasiswa> = {};

  semuaRekomendasi.value.forEach(rek => {
    if (!rek.mahasiswa) return;

    if (!groups[rek.mahasiswa_id]) {
      groups[rek.mahasiswa_id] = {
        mahasiswa_id: rek.mahasiswa_id,
        nama_mahasiswa: rek.mahasiswa.nama_mahasiswa,
        judul_ta: rek.mahasiswa.judul_ta,
        nim: rek.mahasiswa.nim,
        rekomendasi: []
      };
    }
    groups[rek.mahasiswa_id].rekomendasi.push(rek);
  });

  return Object.values(groups);
})

// --- LOGIKA FILTER & SEARCH ---
const filteredGroups = computed(() => {
  let result = groupedRekomendasi.value;

  // 1. Filter dari Dropdown
  if (selectedMahasiswaFilter.value !== '') {
    result = result.filter(group => group.mahasiswa_id === selectedMahasiswaFilter.value);
  }

  // 2. Filter dari Kolom Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(group =>
      group.nama_mahasiswa.toLowerCase().includes(q) ||
      group.nim.toLowerCase().includes(q) ||
      (group.judul_ta && group.judul_ta.toLowerCase().includes(q))
    );
  }

  return result;
})

const totalItems = computed(() => filteredGroups.value.length)

// --- LOGIKA PAGINATION ---
const paginatedGroups = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredGroups.value.slice(start, end)
})

watch([searchQuery, selectedMahasiswaFilter, itemsPerPage], () => {
  currentPage.value = 1
})

// --- API CALLS ---
const fetchMahasiswaList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/mahasiswa', {
      method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include'
    })
    const result = await response.json()
    if (result.success) mahasiswaList.value = result.data.rows || result.data
  } catch (error) {
    console.error("Gagal fetch mahasiswa:", error)
  }
}

const fetchAllRekomendasi = async () => {
  isLoading.value = true;
  semuaRekomendasi.value = [];
  try {
    const response = await fetch('http://localhost:3000/api/matching-ta', {
      method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include'
    })
    const result = await response.json()
    if (response.ok) {
      if (result.data && Array.isArray(result.data)) {
         semuaRekomendasi.value = result.data;
      } else if (result.data && result.data.rows) {
         semuaRekomendasi.value = result.data.rows;
      } else if (Array.isArray(result)) {
         semuaRekomendasi.value = result;
      }
    }
  } catch (error) {
    console.error("Gagal fetch rekomendasi:", error)
    showAlert('error', 'Gagal!', 'Tidak dapat memuat data rekomendasi.')
  } finally {
    isLoading.value = false;
  }
}

const openGenerateModal = () => { isGenerateModalOpen.value = true; }
const closeGenerateModal = () => { isGenerateModalOpen.value = false; }

const submitGeneratePso = async () => {
  isGenerating.value = true;
  try {
    const response = await fetch('http://localhost:3000/api/matching-ta/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({})
    })

    const result = await response.json()

    if (response.ok) {
      showAlert('success', 'Algoritma Selesai!', result.data?.message || result.message || 'Berhasil mencarikan dosen untuk semua mahasiswa.')
      closeGenerateModal()
      fetchAllRekomendasi()
    } else {
      let errorMsg = 'Gagal menjalankan algoritma. Syarat jumlah dosen tidak terpenuhi.';

      if (result.err && result.err.message) {
        errorMsg = result.err.message;
      } else if (result.meta && result.meta.err && result.meta.err.message) {
        errorMsg = result.meta.err.message;
      } else if (result.meta && result.meta.message) {
        errorMsg = result.meta.message;
      } else if (result.metadata && result.metadata.err && result.metadata.err.message) {
        errorMsg = result.metadata.err.message;
      } else if (result.metadata && result.metadata.message) {
        errorMsg = result.metadata.message;
      }
      else if (result.message && result.message.toLowerCase() !== 'success' && result.message.toLowerCase() !== 'ok') {
        errorMsg = result.message;
      }

      showAlert('error', 'Proses Gagal!', errorMsg)
      closeGenerateModal()
    }
  } catch (error) {
    console.error("Error Generate PSO:", error)
    showAlert('error', 'Gagal Server!', 'Pastikan backend menyala dan database terhubung.')
  } finally {
    isGenerating.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleDropdownClickOutside);

  try {
    userRoles.value = JSON.parse(localStorage.getItem('userRoles') || '[]')
  } catch {
    userRoles.value = (localStorage.getItem('userRoles') || '').split(',').map(r => r.trim())
  }

  fetchMahasiswaList()
  fetchAllRekomendasi()
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDropdownClickOutside);
})
</script>
