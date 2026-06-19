<template>
  <admin-layout>
    <div v-if="isAdmin" class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <div class="lg:col-span-6 xl:col-span-7">
        <DashboardMetrics
          :isAdmin="true"
          :totalDosen="filteredDosenList.length"
          :totalMahasiswa="filteredMahasiswaList.length"
          :totalProdi="prodiList.length"
          :totalUser="totalUserAsli"
        />
      </div>

      <div class="lg:col-span-6 xl:col-span-5">
        <div class="h-[400px] lg:h-[430px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">Keahlian Dosen</h3>
          <p class="text-xs text-gray-500 mb-6 shrink-0">Sebaran dosen berdasarkan bidang keahliannya. Klik untuk detail dosen.</p>

          <div class="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            <div v-if="isLoading" class="text-center text-sm text-gray-400 mt-10">Memuat diagram...</div>
            <div v-else-if="keahlianStats.length === 0" class="text-center text-sm text-gray-400 mt-10">Belum ada data keahlian.</div>

            <div v-else v-for="(stat, index) in keahlianStats" :key="index" class="w-full shrink-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1.5 -ml-1.5 rounded-lg transition-colors" @click="openKeahlianDetail(stat.name)">
              <div class="flex justify-between text-xs font-semibold mb-1 px-1">
                <span class="text-gray-700 dark:text-gray-300">{{ stat.name }}</span>
                <span class="text-brand-600">{{ stat.count }} Dosen</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div class="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" :style="{ width: stat.percentage + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm font-semibold text-gray-500 shrink-0">
             <div class="text-center w-1/2 border-r border-gray-200">
               <p class="text-xs">Dosen</p>
               <p class="text-lg text-gray-800">{{ filteredDosenList.length }}</p>
             </div>
             <div class="text-center w-1/2">
               <p class="text-xs">Keahlian</p>
               <p class="text-lg text-gray-800">{{ uniqueKeahlianCount }}</p>
             </div>
          </div>
        </div>
      </div>
    </div>


    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

      <div class="lg:col-span-6 xl:col-span-7">
        <DashboardMetrics
          :isAdmin="false"
          :totalDosen="filteredDosenList.length"
          :totalMahasiswa="filteredMahasiswaList.length"
          :totalProdi="0"
          :totalUser="0"
          :dosenDitugaskan="jumlahDosenDitugaskan"
          :averageScore="rataRataSkorMatching"
        />
      </div>

      <div class="lg:col-span-6 xl:col-span-5">
        <div class="h-[400px] lg:h-[430px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">Sebaran Topik Tugas Akhir</h3>
          <p class="text-xs text-gray-500 mb-6 shrink-0">Persentase mahasiswa di prodi Anda berdasarkan topik yang diambil.</p>

          <div class="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            <div v-if="isLoading" class="text-center text-sm text-gray-400 mt-10">Memuat diagram...</div>
            <div v-else-if="topikStats.length === 0" class="text-center text-sm text-gray-400 mt-10">Belum ada data topik.</div>

            <div v-else v-for="(stat, index) in topikStats" :key="index" class="w-full shrink-0">
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-gray-700 dark:text-gray-300">{{ stat.name }}</span>
                <span class="text-brand-600">{{ stat.count }} Mhs ({{ stat.percentage }}%)</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div class="bg-brand-500 h-2.5 rounded-full transition-all duration-1000" :style="{ width: stat.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-12 mt-4">
        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white">Mahasiswa Belum Mendapatkan Penguji</h3>
              <p class="text-sm text-gray-500 mt-1">Daftar mahasiswa prodi Anda yang harus segera diproses (Sisa: {{ unassignedMahasiswa.length }} mahasiswa).</p>
            </div>
            <div v-if="!isAdmin && activeProdiName" class="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold rounded border border-brand-100">
              Filter: {{ activeProdiName }}
            </div>
          </div>

          <div class="overflow-x-auto max-h-[400px] custom-scrollbar">
            <table class="min-w-full text-left border-collapse relative">
              <thead class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Mahasiswa</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">NIM</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Topik TA</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-if="isLoading">
                  <td colspan="4" class="px-6 py-12 text-center text-gray-400 text-sm">Menyinkronkan data...</td>
                </tr>
                <tr v-else-if="unassignedMahasiswa.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-brand-500 font-bold">✨ Hebat! Semua mahasiswa prodi Anda sudah mendapatkan penguji.</td>
                </tr>

                <tr v-else v-for="mhs in unassignedMahasiswa" :key="mhs.id_mahasiswa" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200">{{ mhs.nama_mahasiswa }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-400">{{ mhs.nim }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-400">{{ getTopikName(mhs.topik_id) }}</td>
                  <td class="px-6 py-4 text-center">
                    <span class="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-full shadow-sm">Belum Ditugaskan</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-4 border-t border-gray-100 text-center bg-gray-50 dark:bg-transparent">
             <router-link to="/penugasan-penguji" class="text-sm font-semibold text-brand-500 hover:text-brand-700 hover:underline">
               Ke Halaman Penugasan &rarr;
             </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detail Keahlian Dosen  -->
    <div v-if="isModalOpen" @click.self="closeModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] transform transition-all scale-100">

        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-white dark:bg-gray-800">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Daftar Dosen</h3>
            <p class="text-xl font-extrabold text-brand-600 dark:text-brand-500">{{ selectedKeahlianName }}</p>
          </div>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-gray-900/20">
          <ul class="space-y-3">
            <li v-for="dosen in selectedDosenList" :key="dosen.id_dosen" class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all">
               <div class="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-800/20 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg shadow-inner">
                 {{ dosen.nama_dosen.charAt(0) }}
               </div>
               <div class="flex-1">
                 <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ dosen.nama_dosen }}</h4>
               </div>
            </li>
            <li v-if="selectedDosenList.length === 0" class="text-sm text-gray-500 text-center py-8">
              Data dosen tidak ditemukan.
            </li>
          </ul>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-right">
          <button @click="closeModal" class="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
            Tutup
          </button>
        </div>

      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import DashboardMetrics from '../components/dashboard/DashboardMetrics.vue'

defineOptions({ name: 'DashboardView' })

interface GenericRecord {
  [key: string]: unknown;
}

interface Dosen { id_dosen: number; nama_dosen: string; prodi_id: unknown; user_id: unknown; }
interface Mahasiswa { id_mahasiswa: number; nama_mahasiswa: string; nim: string; topik_id: unknown; prodi_id: unknown; }
interface Penugasan { id_penugasan: number; mahasiswa_id: unknown; sekretaris: unknown; penguji_1: unknown; penguji_2: unknown; }
interface Prodi { id_prodi: number; nama_prodi: string; }
interface Topik { id_topik: number; nama_topik: string; }

interface Keahlian { id_keahlian: number; dosen_id: unknown; bidang_keahlian?: string; topik_id?: unknown; }
interface Matching { id_rekomendasi: number; mahasiswa_id: unknown; nilai_fitness: unknown; rank: unknown; }

const isLoading = ref(true)
const userRoles = ref<string[]>([])
const userProdiId = ref<number>(0)

const dosenList = ref<Dosen[]>([])
const mahasiswaList = ref<Mahasiswa[]>([])
const penugasanList = ref<Penugasan[]>([])
const prodiList = ref<Prodi[]>([])
const topikList = ref<Topik[]>([])
const keahlianList = ref<Keahlian[]>([])
const matchingList = ref<Matching[]>([])

const totalUserAsli = ref(0)

const isModalOpen = ref(false);
const selectedKeahlianName = ref('');
const selectedDosenList = ref<Dosen[]>([]);

const isAdmin = computed(() => userRoles.value.some(role => role.toLowerCase() === 'admin'))

const getRawId = (dataData: unknown): number => {
  if (dataData === null || dataData === undefined) return 0;

  if (typeof dataData === 'object' && dataData !== null) {
      const obj = dataData as GenericRecord;
      const id = obj.id_prodi || obj.id_user || obj.id_topik || obj.id_mahasiswa || obj.id_dosen || obj.id;
      return Number(id) || 0;
  }

  return Number(dataData) || 0;
}

const activeProdiName = computed(() => {
  if (userProdiId.value === 0 || prodiList.value.length === 0) return '';
  const prodi = prodiList.value.find(p => getRawId(p.id_prodi) === userProdiId.value);
  return prodi ? prodi.nama_prodi : '';
})


const filteredDosenList = computed(() => {
  if (isAdmin.value) return dosenList.value;
  if (userProdiId.value === 0) return [];
  const reqId = userProdiId.value;
  return dosenList.value.filter(d => getRawId(d.prodi_id) === reqId);
});

const filteredMahasiswaList = computed(() => {
  if (isAdmin.value) return mahasiswaList.value;
  if (userProdiId.value === 0) return [];
  const reqId = userProdiId.value;
  return mahasiswaList.value.filter(m => getRawId(m.prodi_id) === reqId);
});

const filteredPenugasanList = computed(() => {
  if (isAdmin.value) return penugasanList.value;
  const mhsIds = new Set(filteredMahasiswaList.value.map(m => getRawId(m.id_mahasiswa)));
  return penugasanList.value.filter(p => mhsIds.has(getRawId(p.mahasiswa_id)));
});

const filteredMatchingList = computed(() => {
  if (isAdmin.value) return matchingList.value;
  const mhsIds = new Set(filteredMahasiswaList.value.map(m => getRawId(m.id_mahasiswa)));
  return matchingList.value.filter(m => mhsIds.has(getRawId(m.mahasiswa_id)));
});

const jumlahDosenDitugaskan = computed(() => {
  const assignedIds = new Set<number>();
  filteredPenugasanList.value.forEach(p => {
    const sId = getRawId(p.sekretaris);
    const p1Id = getRawId(p.penguji_1);
    const p2Id = getRawId(p.penguji_2);
    if(sId > 0) assignedIds.add(sId);
    if(p1Id > 0) assignedIds.add(p1Id);
    if(p2Id > 0) assignedIds.add(p2Id);
  });
  return assignedIds.size;
})

const rataRataSkorMatching = computed(() => {
  if (filteredMatchingList.value.length === 0) return 0;
  const rank1Matches = filteredMatchingList.value.filter(m => String(m.rank) === '1');
  if (rank1Matches.length === 0) return 0;

  const totalFitness = rank1Matches.reduce((sum, item) => sum + (Number(item.nilai_fitness) || 0), 0);
  const average = totalFitness / rank1Matches.length;

  return Number(average.toFixed(1));
})

const unassignedMahasiswa = computed(() => {
  const assignedMhsIds = filteredPenugasanList.value.map(p => getRawId(p.mahasiswa_id));
  return filteredMahasiswaList.value.filter(m => !assignedMhsIds.includes(getRawId(m.id_mahasiswa)));
})

const topikStats = computed(() => {
  if (topikList.value.length === 0 || filteredMahasiswaList.value.length === 0) return [];
  const stats = topikList.value.map(t => {
    const currentTopikId = getRawId(t.id_topik);
    const count = filteredMahasiswaList.value.filter(m => getRawId(m.topik_id) === currentTopikId).length;
    const percentage = filteredMahasiswaList.value.length > 0 ? Math.round((count / filteredMahasiswaList.value.length) * 100) : 0;
    return { name: t.nama_topik, count, percentage };
  });
  return stats.sort((a, b) => b.count - a.count);
})

const getTopikName = (idData: unknown) => {
  const targetId = getRawId(idData);
  const topik = topikList.value.find(t => getRawId(t.id_topik) === targetId);
  return topik ? topik.nama_topik : 'Belum memilih topik';
}

const uniqueKeahlianCount = computed(() => {
  if (keahlianList.value.length === 0) return 0;

  const validDosenIds = new Set(filteredDosenList.value.map(d => getRawId(d.id_dosen)));
  const validKeahlian = keahlianList.value.filter(k => validDosenIds.has(getRawId(k.dosen_id)));

  const uniqueNames = new Set(validKeahlian.map(k => k.bidang_keahlian || 'Belum Ditentukan'));
  return uniqueNames.size;
});

const keahlianStats = computed(() => {
  if (keahlianList.value.length === 0) return [];

  const validDosenIds = new Set(filteredDosenList.value.map(d => getRawId(d.id_dosen)));
  const filteredKeahlian = keahlianList.value.filter(k => validDosenIds.has(getRawId(k.dosen_id)));

  const statsMap: Record<string, number> = {};
  filteredKeahlian.forEach(k => {
    const name = k.bidang_keahlian || 'Belum Ditentukan';
    statsMap[name] = (statsMap[name] || 0) + 1;
  });

  const stats = Object.keys(statsMap).map(name => ({
    name,
    count: statsMap[name],
    percentage: 0
  }));

  const maxKeahlian = Math.max(...stats.map(s => s.count), 1);
  stats.forEach(s => {
    s.percentage = Math.round((s.count / maxKeahlian) * 100);
  });

  return stats.sort((a, b) => b.count - a.count);
})

const openKeahlianDetail = (keahlianName: string) => {
  selectedKeahlianName.value = keahlianName;

  const relatedDosenIds = new Set(
    keahlianList.value
      .filter(k => (k.bidang_keahlian || 'Belum Ditentukan') === keahlianName)
      .map(k => getRawId(k.dosen_id))
  );

  selectedDosenList.value = filteredDosenList.value.filter(d => relatedDosenIds.has(getRawId(d.id_dosen)));

  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};


const fetchAllData = async () => {
  isLoading.value = true;
  try {
    const opts = { credentials: 'include' as RequestCredentials };

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const [resDosen, resMhs, resPenugasan, resProdi, resTopik, resKeahlian, resAuthList, resMatching] = await Promise.all([
          fetch(`${baseUrl}/dosen`, opts).then(r => r.json()).catch(() => ({})),
          fetch(`${baseUrl}/mahasiswa`, opts).then(r => r.json()).catch(() => ({})),
          fetch(`${baseUrl}/penugasan`, opts).then(r => r.json()).catch(() => ({})),
          fetch(`${baseUrl}/prodi`, opts).then(r => r.json()).catch(() => ({})),
          fetch(`${baseUrl}/topik-ta`, opts).then(r => r.json()).catch(() => ({})),
          fetch(`${baseUrl}/keahlian-dosen`, opts).then(r => r.json()).catch(() => ({})),
          fetch(`${baseUrl}/auth/users`, opts).then(r => r.json()).catch(() => ({})),
          fetch(`${baseUrl}/matching-ta`, opts).then(r => r.json()).catch(() => ({}))
    ]);;

    if (resDosen.success) dosenList.value = resDosen.data.rows || resDosen.data || [];
    if (resMhs.success) mahasiswaList.value = resMhs.data.rows || resMhs.data || [];
    if (resPenugasan.success) penugasanList.value = resPenugasan.data.rows || resPenugasan.data || [];
    if (resProdi.success) prodiList.value = resProdi.data || [];
    if (resTopik.success) topikList.value = resTopik.data || [];
    if (resKeahlian.success) keahlianList.value = resKeahlian.data.rows || resKeahlian.data || [];
    if (resMatching.success) matchingList.value = resMatching.data.rows || resMatching.data || [];

    if (resAuthList.success && resAuthList.data) {
        totalUserAsli.value = resAuthList.data.length || resAuthList.data.rows?.length || 0;
    } else {
        totalUserAsli.value = 96;
    }

    if (!isAdmin.value) {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          const currentUserId = getRawId(userData.id_user);

          if (currentUserId > 0 && dosenList.value.length > 0) {
            const profilDiri = dosenList.value.find(d => getRawId(d.user_id) === currentUserId);
            if (profilDiri) {
              userProdiId.value = getRawId(profilDiri.prodi_id);
              console.log("SUKSES: Kaprodi Ditemukan! ID User:", currentUserId, "-> ID Prodi:", userProdiId.value);
            } else {
              console.warn("Profil dosen tidak ditemukan di database untuk User ID:", currentUserId);
            }
          }
        } catch (e) {
          console.error("Gagal memparsing userData dari LocalStorage:", e);
        }
      }
    }

  } catch (error) {
    console.error("Gagal memuat data dashboard:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  try {
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    userRoles.value = Array.isArray(roles) ? roles : [roles];
  } catch {
    userRoles.value = (localStorage.getItem('userRoles') || '').split(',').map(r => r.trim());
  }

  fetchAllData();
})
</script>
