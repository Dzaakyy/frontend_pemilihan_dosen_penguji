<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-transform hover:-translate-y-1">
      <div class="flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-500 rounded-xl dark:bg-blue-500/10 mb-4">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
      </div>
      <div>
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Dosen</span>
        <h4 class="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90">{{ totalDosen }}</h4>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-transform hover:-translate-y-1">
      <div class="flex items-center justify-center w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl dark:bg-emerald-500/10 mb-4">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>
      </div>
      <div>
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Mahasiswa</span>
        <h4 class="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90">{{ totalMahasiswa }}</h4>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-transform hover:-translate-y-1">
      <div class="flex items-center justify-center w-12 h-12 bg-orange-50 text-orange-500 rounded-xl dark:bg-orange-500/10 mb-4">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
      </div>
      <div>
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ isAdmin ? 'Total Program Studi' : 'Dosen Ditugaskan' }}
        </span>
        <h4 class="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90">
          {{ isAdmin ? totalProdi : dosenDitugaskan }}
        </h4>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-transform hover:-translate-y-1">
      <div class="flex items-center justify-center w-12 h-12 bg-purple-50 text-purple-500 rounded-xl dark:bg-purple-500/10 mb-4">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <div>
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ isAdmin ? 'Total Seluruh User' : 'Rata-Rata Matching Score' }}
        </span>
        <div class="flex items-end gap-2 mt-1">
          <h4 class="font-bold text-gray-800 text-3xl dark:text-white/90">
            {{ isAdmin ? totalUser : (averageScore || 0) + '%' }}
          </h4>
          <span v-if="!isAdmin && averageScore && averageScore > 0" class="flex items-center text-[10px] font-bold text-success-600 bg-success-50 px-2 py-1 rounded-full mb-1">
            ↑ Baik
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps({
  isAdmin: Boolean,
  totalDosen: Number,
  totalMahasiswa: Number,
  totalProdi: Number,
  totalUser: Number,
  dosenDitugaskan: Number,
  averageScore: Number
})
</script>
