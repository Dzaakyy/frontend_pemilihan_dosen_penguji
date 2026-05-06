<template>
  <div class="relative w-full space-y-6">
    <div v-if="alert.show" class="fixed top-20 right-5 z-[99999] w-full max-w-sm transition-all duration-300">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div class="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Informasi Tugas Akhir</h3>

      <div v-if="mahasiswaData?.judul_ta && !isEditingForm" class="flex flex-col gap-4">
        <div class="p-4 bg-brand-50 border border-brand-100 rounded-xl">
          <p class="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">Judul Tugas Akhir</p>
          <p class="text-lg font-bold text-gray-800">{{ mahasiswaData.judul_ta }}</p>
        </div>
        <div class="flex items-center gap-3 mt-2">
          <span class="text-sm font-medium text-gray-500">Topik TA:</span>
          <span class="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-lg border border-purple-200">
            {{ mahasiswaData.topik_ta?.nama_topik || 'Belum diset' }}
          </span>
        </div>
      </div>

      <form v-else @submit.prevent="simpanJudulTA" class="flex flex-col gap-4">
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-2">
          <p class="text-sm text-yellow-800 font-medium">⚠️ Anda belum melengkapi data Tugas Akhir. Silakan isi terlebih
            dahulu.</p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Judul Tugas Akhir</label>
          <textarea v-model="formInput.judul_ta" rows="3"
            class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            placeholder="Ketikkan judul TA Anda di sini..." required></textarea>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Topik Tugas Akhir</label>
          <select v-model="formInput.topik_id"
            class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 text-sm" required>
            <option value="" disabled>Pilih Topik...</option>
            <option v-for="t in topikList" :key="t.id_topik" :value="t.id_topik">{{ t.nama_topik }}</option>
          </select>
        </div>
        <button type="submit" :disabled="isSaving"
          class="mt-2 self-start px-6 py-2.5 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 disabled:opacity-50">
          {{ isSaving ? 'Menyimpan...' : 'Simpan Data TA' }}
        </button>
      </form>
    </div>

    <div>
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Tim Penguji Anda</h3>

      <div v-if="isLoading" class="text-gray-500 text-sm">Memuat data penguji...</div>
      <div v-else-if="!penugasan" class="p-6 bg-gray-50 border border-gray-200 rounded-2xl text-center text-gray-500">
        <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="font-medium text-lg">Belum Ada Penguji</p>
        <p class="text-sm mt-1">Sistem belum menetapkan dosen penguji untuk Anda. Silakan hubungi Kaprodi.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div
          class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
          <span
            class="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-3 border border-blue-100">Sekretaris</span>
          <h4 class="text-lg font-bold text-gray-800">{{ penugasan.dosen_sekretaris?.nama_dosen }}</h4>
          <p class="text-sm text-gray-500 mt-1">NIDN: {{ penugasan.dosen_sekretaris?.nidn }}</p>
        </div>

        <div
          class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
          <span
            class="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full mb-3 border border-emerald-100">Penguji
            1</span>
          <h4 class="text-lg font-bold text-gray-800">{{ penugasan.dosen_penguji_1?.nama_dosen }}</h4>
          <p class="text-sm text-gray-500 mt-1">NIDN: {{ penugasan.dosen_penguji_1?.nidn }}</p>
        </div>

        <div
          class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-violet-500"></div>
          <span
            class="inline-block px-3 py-1 bg-violet-50 text-violet-600 text-xs font-bold rounded-full mb-3 border border-violet-100">Penguji
            2</span>
          <h4 class="text-lg font-bold text-gray-800">{{ penugasan.dosen_penguji_2?.nama_dosen }}</h4>
          <p class="text-sm text-gray-500 mt-1">NIDN: {{ penugasan.dosen_penguji_2?.nidn }}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Alert from '@/components/ui/Alert.vue'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface TopikTA {
  id_topik: number;
  nama_topik: string;
}

interface Dosen {
  id_dosen: number;
  nama_dosen: string;
  nidn: string;
}

interface Mahasiswa {
  id_mahasiswa: number;
  nama_mahasiswa: string;
  nim: string;
  judul_ta: string;
  topik_id?: number | null;
  topik_ta?: TopikTA;
}

interface Penugasan {
  id_penugasan: number;
  mahasiswa_id: number;
  dosen_sekretaris?: Dosen;
  dosen_penguji_1?: Dosen;
  dosen_penguji_2?: Dosen;
}

const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })
const showAlert = (type: AlertVariant, title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  setTimeout(() => { alert.value.show = false }, 3000)
}

// State
const myUserId = ref<number | null>(null) // ID Akun Login
const myMahasiswaId = ref<number | null>(null) // ID Asli Tabel Mahasiswa
const penugasan = ref<Penugasan | null>(null)
const mahasiswaData = ref<Mahasiswa | null>(null)
const topikList = ref<TopikTA[]>([])

const isEditingForm = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)

const formInput = ref({ judul_ta: '', topik_id: '' as number | '' })

const simpanJudulTA = async () => {
  if (!myMahasiswaId.value) return;
  isSaving.value = true;
  try {
    // Memperbarui berdasarkan ID Mahasiswa (Bukan ID User)
    const response = await fetch(`http://localhost:3000/api/mahasiswa/${myMahasiswaId.value}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify(formInput.value)
    });

    if(response.ok) {
      showAlert('success', 'Berhasil!', 'Judul TA dan Topik berhasil disimpan.')
      await fetchInitData() // Muat ulang data terbaru
    } else {
      showAlert('error', 'Gagal', 'Terjadi kesalahan saat menyimpan data.')
    }
  } catch (error) {
    console.error("Terjadi error saat menyimpan data TA:", error);
    showAlert('error', 'Gagal', 'Terjadi kesalahan jaringan.')
  } finally {
    isSaving.value = false;
  }
}

// Fungsi Utama untuk memuat data secara berurutan
const fetchInitData = async () => {
  isLoading.value = true
  try {
    // 1. Tarik Data Mahasiswa via User ID
    const resMhs = await fetch(`http://localhost:3000/api/mahasiswa/user/${myUserId.value}`, { credentials: 'include' })
    const resMhsData = await resMhs.json()

    if (resMhsData.success && resMhsData.data) {
      mahasiswaData.value = resMhsData.data
      myMahasiswaId.value = resMhsData.data.id_mahasiswa // Ambil ID Mahasiswa asli

      formInput.value = {
        judul_ta: resMhsData.data.judul_ta || '',
        topik_id: resMhsData.data.topik_id || ''
      }

      // 2. Jika mahasiswa valid, tarik Data Penugasannya
      const resPenugasan = await fetch(`http://localhost:3000/api/penugasan/mahasiswa/${myMahasiswaId.value}`, { credentials: 'include' })
      const penugasanData = await resPenugasan.json()

      if (penugasanData.success && penugasanData.data) {
        penugasan.value = penugasanData.data
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const fetchTopikList = async () => {
  const response = await fetch('http://localhost:3000/api/topik-ta', { credentials: 'include' })
  const result = await response.json()
  if(result.success) topikList.value = result.data
}

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem('userData') || '{}')
  myUserId.value = storedUser.id_user || 1

  await fetchTopikList()
  await fetchInitData()
})
</script>
