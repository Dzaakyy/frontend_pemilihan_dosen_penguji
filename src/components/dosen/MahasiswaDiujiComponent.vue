<template>
  <div class="relative w-full space-y-6">

    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Daftar Mahasiswa Uji</h2>
      <div class="px-4 py-2 bg-brand-50 border border-brand-200 rounded-lg text-sm font-semibold text-brand-700">
        Total Tugas: {{ mahasiswaList.length }} Mahasiswa
      </div>
    </div>

    <div v-if="isLoading" class="text-gray-500 py-10 text-center">Memuat daftar mahasiswa...</div>

    <div v-else-if="mahasiswaList.length === 0" class="p-10 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      <p class="font-bold text-xl text-gray-800">Tidak Ada Jadwal</p>
      <p class="text-gray-500 mt-2">Anda belum ditugaskan untuk menguji mahasiswa manapun saat ini.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div v-for="item in mahasiswaList" :key="item.id_penugasan" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">

        <div class="mb-4">
          <span :class="[
            'inline-block px-3 py-1 text-xs font-bold rounded-full border',
            getRole(item) === 'Sekretaris (Penguji 3)' ? 'bg-blue-50 text-blue-600 border-blue-200' :
            getRole(item) === 'Penguji 1' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
            'bg-violet-50 text-violet-600 border-violet-200'
          ]">
            Peran Anda: {{ getRole(item) }}
          </span>
        </div>

        <div>
          <h4 class="text-xl font-bold text-gray-800 leading-tight">{{ item.mahasiswa?.nama_mahasiswa }}</h4>
          <p class="text-sm font-medium text-brand-500 mt-1 mb-4">{{ item.mahasiswa?.nim }}</p>

          <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Judul TA:</p>
            <p class="text-sm font-medium text-gray-700 line-clamp-3 mb-3" :title="item.mahasiswa?.judul_ta">
              {{ item.mahasiswa?.judul_ta || 'Belum Mengajukan Judul' }}
            </p>

            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Topik:</p>
            <span class="inline-flex px-2 py-1 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded">
              {{ item.mahasiswa?.topik_ta?.nama_topik || 'Belum diset' }}
            </span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Interface Data
interface TopikTA {
  nama_topik: string;
}

interface Mahasiswa {
  id_mahasiswa: number;
  nama_mahasiswa: string;
  nim: string;
  judul_ta: string;
  topik_ta?: TopikTA;
}

interface Penugasan {
  id_penugasan: number;
  sekretaris: number;
  penguji_1: number;
  penguji_2: number;
  mahasiswa?: Mahasiswa;
}

const myDosenId = ref<number | null>(null)
const mahasiswaList = ref<Penugasan[]>([])
const isLoading = ref(true)

const getRole = (penugasan: Penugasan) => {
  if (penugasan.sekretaris === myDosenId.value) return 'Sekretaris (Penguji 3)'
  if (penugasan.penguji_1 === myDosenId.value) return 'Penguji 1'
  if (penugasan.penguji_2 === myDosenId.value) return 'Penguji 2'
  return 'Penguji'
}

const fetchMahasiswaSaya = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/penugasan/dosen/${myDosenId.value}`, { credentials: 'include' })
    const result = await response.json()
    if (result.success) {
      mahasiswaList.value = result.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem('userData') || '{}')

  myDosenId.value = storedUser.id_user || 1

  await fetchMahasiswaSaya()
})
</script>
