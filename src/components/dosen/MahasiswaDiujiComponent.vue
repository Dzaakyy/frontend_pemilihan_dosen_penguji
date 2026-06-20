<template>
  <div class="relative w-full space-y-6">

    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white/90 transition-colors">Daftar Mahasiswa Uji</h2>
      <div
        class="px-4 py-2 bg-brand-50 border border-brand-200 rounded-lg text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-400 transition-colors">
        Total Tugas: {{ mahasiswaList.length }} Mahasiswa
      </div>
    </div>

    <div v-if="isLoading" class="text-gray-500 dark:text-gray-400 py-10 text-center transition-colors">
      <svg class="animate-spin h-8 w-8 mx-auto text-brand-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Memuat daftar mahasiswa...
    </div>

    <div v-else-if="mahasiswaList.length === 0"
      class="p-10 bg-white border border-gray-200 rounded-2xl text-center shadow-sm dark:bg-white/[0.02] dark:border-gray-800 transition-colors">
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4 transition-colors" fill="none"
        stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
        </path>
      </svg>
      <p class="font-bold text-xl text-gray-800 dark:text-white/90 transition-colors">Tidak Ada Jadwal</p>
      <p class="text-gray-500 dark:text-gray-400 mt-2 transition-colors">Anda belum ditugaskan untuk menguji mahasiswa
        manapun saat ini.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in mahasiswaList" :key="item.id_penugasan" @click="openDetailModal(item)"
        class="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer hover:border-brand-300 transition-all flex flex-col justify-between dark:bg-white/[0.02] dark:border-gray-800 dark:hover:border-brand-500/50">

        <div class="mb-4 flex justify-between items-start">
          <span :class="[
            'inline-block px-3 py-1 text-xs font-bold rounded-full border transition-colors',
            getRole(item) === 'Sekretaris'
              ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400' :
              getRole(item) === 'Penguji 1'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' :
                'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400'
          ]">
            Peran Anda: {{ getRole(item) }}
          </span>

          <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors dark:bg-gray-800 dark:text-gray-500 dark:group-hover:bg-brand-500/20 dark:group-hover:text-brand-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </div>
        </div>

        <div>
          <h4 class="text-xl font-bold text-gray-800 leading-tight dark:text-white/90 transition-colors line-clamp-1">
            {{ item.mahasiswa?.nama_mahasiswa }}
          </h4>
          <p class="text-sm font-medium text-brand-500 dark:text-brand-400 mt-1 mb-4 transition-colors">
            NIM: {{ item.mahasiswa?.nim }}
          </p>

          <div
            class="bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900/50 dark:border-gray-800/80 transition-colors mb-4">
            <p
              class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 transition-colors">
              Judul TA:</p>
            <p class="text-sm font-medium text-gray-700 line-clamp-2 mb-3 dark:text-gray-300 transition-colors"
              :title="item.mahasiswa?.judul_ta">
              {{ item.mahasiswa?.judul_ta || 'Belum Mengajukan Judul' }}
            </p>

            <p
              class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 transition-colors">
              Topik:</p>
            <span
              class="inline-flex px-2 py-1 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition-colors">
              {{ item.mahasiswa?.topik_ta?.nama_topik || 'Belum diset' }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2 pt-1">
            <span class="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 w-full sm:w-auto">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {{ formatDateDisplay(item.tanggal_ujian) }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400 w-full sm:w-auto">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ formatSesiDisplay(item.sesi_waktu) }}
            </span>
          </div>

        </div>

      </div>
    </div>

    <Modal v-if="isDetailModalOpen" @close="closeDetailModal">
      <div class="relative w-full max-w-[550px] rounded-3xl bg-white p-6 dark:bg-gray-900 mx-auto mt-10 shadow-2xl transition-colors text-left border border-gray-100 dark:border-gray-800">

        <button @click="closeDetailModal" class="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="mb-5 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white/90">Detail Penugasan Ujian</h3>
          <p class="text-sm text-gray-500 mt-1 dark:text-gray-400">Rincian informasi Tugas Akhir mahasiswa yang akan diuji.</p>
        </div>

        <div v-if="selectedItem" class="space-y-5">
          <div class="flex items-start gap-4 p-4 rounded-xl bg-brand-50/50 border border-brand-100 dark:bg-brand-900/10 dark:border-brand-800/30">
            <div class="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl shrink-0">
              {{ selectedItem.mahasiswa?.nama_mahasiswa?.charAt(0) || 'M' }}
            </div>
            <div>
              <h4 class="text-lg font-bold text-gray-800 dark:text-white/90">{{ selectedItem.mahasiswa?.nama_mahasiswa }}</h4>
              <p class="text-sm font-semibold text-brand-600 dark:text-brand-400">NIM: {{ selectedItem.mahasiswa?.nim }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Judul Penelitian</p>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50">
                {{ selectedItem.mahasiswa?.judul_ta || 'Belum Mengajukan Judul' }}
              </p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Topik Utama</p>
              <span class="inline-flex px-3 py-1.5 bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                {{ selectedItem.mahasiswa?.topik_ta?.nama_topik || 'Belum diset' }}
              </span>
            </div>
          </div>

          <hr class="border-gray-100 dark:border-gray-800">

          <div>
            <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Waktu Pelaksanaan & Peran</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30">
                <div class="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/40 dark:text-blue-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p class="text-[10px] uppercase font-bold text-blue-500 dark:text-blue-400">Tanggal</p>
                  <p class="text-sm font-bold text-blue-900 dark:text-blue-200">{{ formatDateDisplay(selectedItem.tanggal_ujian) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 rounded-lg bg-purple-50/50 border border-purple-100 dark:bg-purple-900/10 dark:border-purple-800/30">
                <div class="p-2 bg-purple-100 text-purple-600 rounded-lg dark:bg-purple-900/40 dark:text-purple-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p class="text-[10px] uppercase font-bold text-purple-500 dark:text-purple-400">Sesi Ujian</p>
                  <p class="text-sm font-bold text-purple-900 dark:text-purple-200">{{ formatSesiDisplay(selectedItem.sesi_waktu) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30 sm:col-span-2">
                <div class="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/40 dark:text-emerald-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <div>
                  <p class="text-[10px] uppercase font-bold text-emerald-500 dark:text-emerald-400">Posisi Tim Penguji</p>
                  <p class="text-sm font-bold text-emerald-900 dark:text-emerald-200">Sebagai {{ getRole(selectedItem) }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Modal from '@/components/modal/Modal.vue'

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
  tanggal_ujian?: string;
  sesi_waktu?: string;
  mahasiswa?: Mahasiswa;
}

interface DosenAPI {
  id_dosen: number;
  user_id: number;
  nama_dosen?: string;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL

const myDosenId = ref<number | null>(null)
const mahasiswaList = ref<Penugasan[]>([])
const isLoading = ref(true)
const isError = ref(false)
const errorMessage = ref('')

// State untuk Modal Detail
const isDetailModalOpen = ref(false)
const selectedItem = ref<Penugasan | null>(null)

const openDetailModal = (item: Penugasan) => {
  selectedItem.value = item;
  isDetailModalOpen.value = true;
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false;
  setTimeout(() => {
    selectedItem.value = null;
  }, 200); // clear data setelah animasi close
}

const getRole = (penugasan: Penugasan) => {
  const dsId = Number(myDosenId.value);
  if (Number(penugasan.sekretaris) === dsId) return 'Sekretaris'
  if (Number(penugasan.penguji_1) === dsId) return 'Penguji 1'
  if (Number(penugasan.penguji_2) === dsId) return 'Penguji 2'
  return 'Penguji'
}

const formatDateDisplay = (dateString?: string) => {
  if (!dateString) return 'Belum Ditetapkan';
  try {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const [y, m, d] = dateString.split('-');
    return `${d} ${monthNames[parseInt(m) - 1]} ${y}`;
  } catch {
    return dateString;
  }
}

const formatSesiDisplay = (sesi?: string) => {
  if (!sesi) return 'Belum Ditentukan';
  const mapWaktu: Record<string, string> = {
    '1': 'Sesi 1 (08:00 - 10:00 WIB)',
    '2': 'Sesi 2 (10:00 - 12:00 WIB)',
    '3': 'Sesi 3 (13:00 - 15:00 WIB)',
    '4': 'Sesi 4 (15:00 - 17:00 WIB)',
    '08:00': 'Sesi 1 (08:00 - 10:00 WIB)',
    '10:00': 'Sesi 2 (10:00 - 12:00 WIB)',
    '13:00': 'Sesi 3 (13:00 - 15:00 WIB)',
    '15:00': 'Sesi 4 (15:00 - 17:00 WIB)'
  };
  return mapWaktu[String(sesi)] || `Sesi ${sesi}`;
}

onMounted(async () => {
  isLoading.value = true;
  isError.value = false;
  try {
    const opts = { credentials: 'include' as RequestCredentials };

    let userId: number | null = null;
    const storedUserStr = localStorage.getItem('userData');

    if (storedUserStr) {
      const parsed = JSON.parse(storedUserStr);
      userId = parsed.id || parsed.id_user || parsed.data?.id || parsed.data?.id_user;
    }

    if (!userId) {
      const profileRes = await fetch(`${baseUrl}/auth/profile`, opts);
      if (profileRes.ok) {
        const profileJson = await profileRes.json();
        userId = profileJson.data?.id || profileJson.data?.id_user;
      }
    }

    if (!userId) {
      throw new Error('Gagal mendapatkan data sesi. Silakan logout dan login ulang.');
    }

    const dosenRes = await fetch(`${baseUrl}/dosen`, opts);
    if (!dosenRes.ok) {
      throw new Error('Anda tidak memiliki akses untuk memuat profil Dosen.');
    }

    const dosenJson = await dosenRes.json();
    const semuaDosen: DosenAPI[] = dosenJson.data?.rows || dosenJson.data || [];

    const myDosenProfile = semuaDosen.find((d: DosenAPI) => Number(d.user_id) === Number(userId));

    if (!myDosenProfile) {
      throw new Error('Akun Anda tidak tertaut dengan profil Dosen manapun di Database.');
    }

    myDosenId.value = myDosenProfile.id_dosen;

    const penugasanRes = await fetch(`${baseUrl}/penugasan/dosen/${myDosenId.value}`, opts);
    const penugasanJson = await penugasanRes.json();

    if (penugasanJson.success) {
      mahasiswaList.value = penugasanJson.data || [];
    } else {
      throw new Error(penugasanJson.message || 'Gagal memuat jadwal penugasan.');
    }

  } catch (err: unknown) {
    console.error(err);
    isError.value = true;
    if (err instanceof Error) {
      errorMessage.value = err.message;
    } else {
      errorMessage.value = 'Terjadi kesalahan sistem yang tidak diketahui.';
    }
  } finally {
    isLoading.value = false;
  }
})
</script>
