<template>
  <admin-layout>

    <div v-if="isAdmin" class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

      <div class="lg:col-span-6 xl:col-span-7">
        <DashboardMetrics
          :isAdmin="true"
          :totalDosen="dosenList.length"
          :totalMahasiswa="mahasiswaList.length"
          :totalProdi="prodiList.length"
          :totalUser="totalUserAsli"
        />
      </div>

      <div class="lg:col-span-6 xl:col-span-5">
        <div class="h-full min-h-[350px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">Keahlian Dosen</h3>
          <p class="text-xs text-gray-500 mb-6">Sebaran dosen berdasarkan topik keahliannya.</p>

          <div class="flex-1 flex flex-col justify-center gap-4">
            <div v-if="isLoading" class="text-center text-sm text-gray-400">Memuat diagram...</div>
            <div v-else-if="keahlianStats.length === 0" class="text-center text-sm text-gray-400">Belum ada data keahlian.</div>

            <div v-else v-for="(stat, index) in keahlianStats" :key="index" class="w-full">
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-gray-700 dark:text-gray-300">{{ stat.name }}</span>
                <span class="text-brand-600">{{ stat.count }} Dosen</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div class="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" :style="{ width: stat.percentage + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between text-sm font-semibold text-gray-500">
             <div class="text-center w-1/2 border-r border-gray-200">
               <p class="text-xs">Dosen</p>
               <p class="text-lg text-gray-800">{{ dosenList.length }}</p>
             </div>
             <div class="text-center w-1/2">
               <p class="text-xs">Keahlian</p>
               <p class="text-lg text-gray-800">{{ topikList.length }}</p>
             </div>
          </div>
        </div>
      </div>
    </div>


    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

      <div class="lg:col-span-6 xl:col-span-7">
        <DashboardMetrics
          :isAdmin="false"
          :totalDosen="dosenList.length"
          :totalMahasiswa="mahasiswaList.length"
          :totalProdi="0"
          :totalUser="0"
          :dosenDitugaskan="jumlahDosenDitugaskan"
        />
      </div>

      <div class="lg:col-span-6 xl:col-span-5">
        <div class="h-full min-h-[350px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">Sebaran Topik Tugas Akhir</h3>
          <p class="text-xs text-gray-500 mb-6">Persentase mahasiswa berdasarkan topik yang diambil.</p>

          <div class="flex-1 flex flex-col justify-center gap-4">
            <div v-if="isLoading" class="text-center text-sm text-gray-400">Memuat diagram...</div>
            <div v-else-if="topikStats.length === 0" class="text-center text-sm text-gray-400">Belum ada data topik.</div>

            <div v-else v-for="(stat, index) in topikStats" :key="index" class="w-full">
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
          <div class="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">Mahasiswa Belum Mendapatkan Penguji</h3>
            <p class="text-sm text-gray-500 mt-1">Daftar mahasiswa tingkat akhir yang harus segera diproses (Sisa: {{ unassignedMahasiswa.length }} mahasiswa).</p>
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
                  <td colspan="4" class="px-6 py-12 text-center text-brand-500 font-bold">✨ Hebat! Semua mahasiswa sudah mendapatkan penguji.</td>
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
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import DashboardMetrics from '../components/dashboard/DashboardMetrics.vue'

defineOptions({ name: 'DashboardView' })

interface Dosen { id_dosen: number; nama_dosen: string; }
interface Mahasiswa { id_mahasiswa: number; nama_mahasiswa: string; nim: string; topik_id: number; }
interface Penugasan { id_penugasan: number; mahasiswa_id: number; sekretaris: number; penguji_1: number; penguji_2: number; }
interface Prodi { id_prodi: number; nama_prodi: string; }
interface Topik { id_topik: number; nama_topik: string; }
interface Keahlian { id_keahlian: number; dosen_id: number; topik_id: number; }

const isLoading = ref(true)
const userRoles = ref<string[]>([])

const dosenList = ref<Dosen[]>([])
const mahasiswaList = ref<Mahasiswa[]>([])
const penugasanList = ref<Penugasan[]>([])
const prodiList = ref<Prodi[]>([])
const topikList = ref<Topik[]>([])
const keahlianList = ref<Keahlian[]>([])
const totalUserAsli = ref(0)

const isAdmin = computed(() => userRoles.value.some(role => role.toLowerCase() === 'admin'))

const jumlahDosenDitugaskan = computed(() => {
  const assignedIds = new Set<number>();
  penugasanList.value.forEach(p => {
    if(p.sekretaris) assignedIds.add(p.sekretaris);
    if(p.penguji_1) assignedIds.add(p.penguji_1);
    if(p.penguji_2) assignedIds.add(p.penguji_2);
  });
  return assignedIds.size;
})

const unassignedMahasiswa = computed(() => {
  const assignedMhsIds = penugasanList.value.map(p => p.mahasiswa_id);
  return mahasiswaList.value.filter(m => !assignedMhsIds.includes(m.id_mahasiswa));
})

const topikStats = computed(() => {
  if (topikList.value.length === 0 || mahasiswaList.value.length === 0) return [];
  const stats = topikList.value.map(t => {
    const count = mahasiswaList.value.filter(m => m.topik_id === t.id_topik).length;
    const percentage = mahasiswaList.value.length > 0 ? Math.round((count / mahasiswaList.value.length) * 100) : 0;
    return { name: t.nama_topik, count, percentage };
  });
  return stats.sort((a, b) => b.count - a.count).slice(0, 5);
})

const getTopikName = (id: number) => {
  const topik = topikList.value.find(t => t.id_topik === id);
  return topik ? topik.nama_topik : 'Belum memilih topik';
}

const keahlianStats = computed(() => {
  if (topikList.value.length === 0 || keahlianList.value.length === 0) return [];
  const stats = topikList.value.map(t => {
    const count = keahlianList.value.filter(k => k.topik_id === t.id_topik).length;
    const maxKeahlian = Math.max(...topikList.value.map(tx => keahlianList.value.filter(kx => kx.topik_id === tx.id_topik).length));
    const percentage = maxKeahlian > 0 ? Math.round((count / maxKeahlian) * 100) : 0;
    return { name: t.nama_topik, count, percentage };
  });
  return stats.sort((a, b) => b.count - a.count).slice(0, 5);
})

const fetchAllData = async () => {
  isLoading.value = true;
  try {
    const opts = { credentials: 'include' as RequestCredentials };

    const [resDosen, resMhs, resPenugasan, resProdi, resTopik, resKeahlian, resAuthList] = await Promise.all([
      fetch('http://localhost:3000/api/dosen', opts).then(r => r.json()).catch(() => ({})),
      fetch('http://localhost:3000/api/mahasiswa', opts).then(r => r.json()).catch(() => ({})),
      fetch('http://localhost:3000/api/penugasan', opts).then(r => r.json()).catch(() => ({})),
      fetch('http://localhost:3000/api/prodi', opts).then(r => r.json()).catch(() => ({})),
      fetch('http://localhost:3000/api/topik-ta', opts).then(r => r.json()).catch(() => ({})),
      fetch('http://localhost:3000/api/keahlian-dosen', opts).then(r => r.json()).catch(() => ({})),
      fetch('http://localhost:3000/api/auth/users', opts).then(r => r.json()).catch(() => ({}))
    ]);

    if (resDosen.success) dosenList.value = resDosen.data.rows || resDosen.data || [];
    if (resMhs.success) mahasiswaList.value = resMhs.data.rows || resMhs.data || [];
    if (resPenugasan.success) penugasanList.value = resPenugasan.data.rows || resPenugasan.data || [];
    if (resProdi.success) prodiList.value = resProdi.data || [];
    if (resTopik.success) topikList.value = resTopik.data || [];
    if (resKeahlian.success) keahlianList.value = resKeahlian.data.rows || resKeahlian.data || [];

    if (resAuthList.success && resAuthList.data) {
        totalUserAsli.value = resAuthList.data.length || resAuthList.data.rows?.length || 0;
    } else {
        totalUserAsli.value = 96;
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
