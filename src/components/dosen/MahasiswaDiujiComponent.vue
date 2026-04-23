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

        <div v-for="item in mahasiswaList" :key="item.id_penugasan"
          class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between dark:bg-white/[0.02] dark:border-gray-800">

          <div class="mb-4">
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
          </div>

          <div>
            <h4 class="text-xl font-bold text-gray-800 leading-tight dark:text-white/90 transition-colors">
              {{ item.mahasiswa?.nama_mahasiswa }}
            </h4>
            <p class="text-sm font-medium text-brand-500 dark:text-brand-400 mt-1 mb-4 transition-colors">
              {{ item.mahasiswa?.nim }}
            </p>

            <div
              class="bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900/50 dark:border-gray-800/80 transition-colors">
              <p
                class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 transition-colors">
                Judul TA:</p>
              <p class="text-sm font-medium text-gray-700 line-clamp-3 mb-3 dark:text-gray-300 transition-colors"
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
          </div>

        </div>
      </div>

    </div>
  </template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

interface DosenAPI {
  id_dosen: number;
  user_id: number;
  nama_dosen?: string;
}

const myDosenId = ref<number | null>(null)
const mahasiswaList = ref<Penugasan[]>([])
const isLoading = ref(true)
const isError = ref(false)
const errorMessage = ref('')

const getRole = (penugasan: Penugasan) => {
  const dsId = Number(myDosenId.value);
  if (Number(penugasan.sekretaris) === dsId) return 'Sekretaris'
  if (Number(penugasan.penguji_1) === dsId) return 'Penguji 1'
  if (Number(penugasan.penguji_2) === dsId) return 'Penguji 2'
  return 'Penguji'
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
      const profileRes = await fetch('http://localhost:3000/api/auth/profile', opts);
      if (profileRes.ok) {
        const profileJson = await profileRes.json();
        userId = profileJson.data?.id || profileJson.data?.id_user;
      }
    }

    if (!userId) {
      throw new Error('Gagal mendapatkan data sesi. Silakan logout dan login ulang.');
    }

    const dosenRes = await fetch('http://localhost:3000/api/dosen', opts);
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

    const penugasanRes = await fetch(`http://localhost:3000/api/penugasan/dosen/${myDosenId.value}`, opts);
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
