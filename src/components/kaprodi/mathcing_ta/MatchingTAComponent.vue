<template>
  <div class="relative">
    <div v-if="alert.show" class="fixed top-20 right-5 z-[99999] w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div class="flex flex-col gap-4 mb-6 p-5 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 w-full sm:w-auto" ref="itemsPerPageDropdownRef">
          <span class="text-sm text-gray-500 dark:text-gray-400">Tampilkan</span>
          <div class="relative">
            <button type="button" @click="isItemsPerPageDropdownOpen = !isItemsPerPageDropdownOpen"
              class="flex items-center justify-between h-9 min-w-[130px] rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
              <span class="font-medium">{{ itemsPerPage }} Mahasiswa</span>
              <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200 ml-2', { 'rotate-180': isItemsPerPageDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
              <div v-if="isItemsPerPageDropdownOpen" class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden left-0">
                <ul class="py-1">
                  <li v-for="val in [5, 10, 20]" :key="val" @click="selectItemsPerPage(val)"
                    class="px-3 py-2 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                    :class="itemsPerPage === val ? 'text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'">
                    {{ val }} Mahasiswa
                  </li>
                </ul>
              </div>
            </transition>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">per halaman</span>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button v-if="canManageMatching && filteredGroups.length > 0" @click="isDeleteAllModalOpen = true" class="flex-1 sm:flex-none flex items-center justify-center px-4 h-10 text-sm font-medium text-red-600 transition rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 shadow-theme-xs dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/40">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Hapus Semua
          </button>

          <button v-if="canManageMatching && hasUnassignedMahasiswa" @click="openGenerateModal" class="flex-1 sm:flex-none flex items-center justify-center px-5 h-10 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 shadow-theme-xs">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            Jalankan Matching PSO Massal
          </button>

          <span v-else-if="canManageMatching && !hasUnassignedMahasiswa" class="text-sm font-medium text-emerald-600 flex items-center bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Semua Mahasiswa Telah Di-Matching
          </span>
        </div>
      </div>

      <div v-if="!isAdmin && activeProdiName" class="w-full mb-2">
        <span class="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold">
          Menampilkan Data Hasil Matching Prodi: {{ activeProdiName }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Cari Mahasiswa atau Dosen Penguji..."
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
                <li v-for="mhs in filteredMahasiswaDropdown" :key="mhs.id_mahasiswa" @click="selectFilterMahasiswa(mhs.id_mahasiswa)"
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
              <th class="px-5 py-3 text-center"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Iterasi Ditemukan</p></th>
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
                Belum ada hasil pencocokan yang sesuai. Silakan jalankan algoritma PSO Massal.
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
                        <span class="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 mt-3 uppercase tracking-wider">Topik Tugas Akhir:</span>
                      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {{ group.nama_topik || 'Belum ada judul / Topik belum diajukan' }}
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
                  <div class="mt-3">
                    <button @click="openDetailModal(item, group)" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 dark:hover:border-blue-800">
                      <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Detail Evaluasi
                    </button>
                  </div>
                </td>

                <td class="px-5 py-3 text-center align-middle">
                  <span class="inline-flex items-center justify-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
                    {{ item.iterasi_pso }}
                  </span>
                </td>

                <td class="px-5 py-3 text-center align-middle">
                  <span class="font-mono text-gray-800 dark:text-gray-300 font-bold text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                    {{ item.nilai_fitness }}%
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

    <Modal v-if="isDeleteAllModalOpen" @close="isDeleteAllModalOpen = false">
      <div class="w-full max-w-[400px] rounded-3xl bg-white p-6 dark:bg-gray-900 border dark:border-gray-700 text-center mx-auto mt-20 z-50 shadow-xl">
        <h4 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">Konfirmasi Hapus Semua</h4>
        <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">Apakah Anda yakin ingin menghapus <strong>seluruh data hasil rekomendasi (Matching TA)</strong> dari sistem? Tindakan ini tidak dapat dibatalkan.</p>
        <div class="flex items-center justify-center gap-3">
          <button @click="isDeleteAllModalOpen = false" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
          <button @click="confirmDeleteAll" :disabled="isDeleting" class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto">{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus Semua' }}</button>
        </div>
      </div>
    </Modal>

    <Modal v-if="isGenerateModalOpen" @close="closeGenerateModal">
      <div class="relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900 mx-auto mt-20 shadow-2xl">
        <div class="text-center mb-6">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 mb-4 shadow-inner">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h4 class="text-2xl font-bold text-gray-800 dark:text-white/90">Automasi PSO Massal</h4>
          <p class="text-sm text-gray-500 mt-3 leading-relaxed">
            Sistem akan mendeteksi seluruh mahasiswa yang belum di-matching. Tetapkan hyperparameter di bawah ini untuk mencari kombinasi partikel terbaik.
          </p>
        </div>

        <form @submit.prevent="submitGeneratePso" class="flex flex-col gap-4 text-left">
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Jumlah Iterasi</label>
               <input v-model.number="psoParams.maxIter" type="number" class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
             </div>
             <div>
               <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Jumlah Partikel</label>
               <input v-model.number="psoParams.numParticles" type="number" class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
             </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
             <div>
               <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Bobot Inertia (w)</label>
               <input v-model.number="psoParams.w" type="number" step="0.1" class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
             </div>
             <div>
               <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Bobot Kognitif (c1)</label>
               <input v-model.number="psoParams.c1" type="number" step="0.1" class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
             </div>
             <div>
               <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Bobot Sosial (c2)</label>
               <input v-model.number="psoParams.c2" type="number" step="0.1" class="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none" required />
             </div>
          </div>

          <div class="flex items-center gap-3 w-full mt-4 border-t border-gray-100 pt-5 dark:border-gray-800">
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

    <Modal v-if="isDetailModalOpen" @close="closeDetailModal">
      <div class="relative w-full max-w-[800px] flex flex-col max-h-[90vh] rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 mx-auto mt-10 shadow-2xl overflow-hidden transition-colors">

        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 z-10">
          <h4 class="text-xl font-bold text-gray-800 dark:text-white/90">
            Analisis Evaluasi PSO
          </h4>
          <button @click="closeDetailModal" class="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="px-6 py-6 overflow-y-auto custom-scrollbar flex-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-brand-50 border border-brand-100 rounded-xl dark:bg-brand-900/10 dark:border-brand-900/30">
              <span class="block text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-1">Mahasiswa</span>
              <p class="font-bold text-gray-800 dark:text-white/90">{{ selectedGroupDetail?.nama_mahasiswa }}</p>
              <p class="text-xs text-gray-500 line-clamp-2 mt-1" :title="selectedGroupDetail?.judul_ta">{{ selectedGroupDetail?.judul_ta }}</p>
            </div>
            <div class="p-4 bg-emerald-50 border border-emerald-100 rounded-xl dark:bg-emerald-900/10 dark:border-emerald-900/30">
              <span class="block text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Rekomendasi Dosen (Rank #{{ selectedRekomendasiDetail?.rank }})</span>
              <p class="font-bold text-gray-800 dark:text-white/90">{{ selectedRekomendasiDetail?.dosen?.nama_dosen }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Skor Total: {{ selectedRekomendasiDetail?.nilai_fitness }}%</span>
                <span class="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Ditemukan di Iterasi: {{ selectedRekomendasiDetail?.iterasi_pso }}</span>
              </div>
            </div>
          </div>

          <div v-if="parsedDetailKriteria" class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 mb-6">
            <h5 class="font-bold text-gray-800 dark:text-white/90 mb-3 text-sm flex items-center gap-2">
              <svg class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Bukti Rincian Penilaian (Fitness Breakdown)
            </h5>

            <div class="space-y-4">
              <div class="flex flex-col bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-bold text-gray-500 dark:text-gray-400">1. Kemiripan Teks Mahasiswa & Keahlian Dosen (Max 75 Poin)</span>
                  <span class="font-bold text-blue-600">+ {{ parsedDetailKriteria.poin_teks }} Poin</span>
                </div>

                <div class="bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs border border-gray-100 dark:border-gray-700">
                  <p class="text-gray-600 dark:text-gray-400 mb-1"><strong>Bidang Keahlian Dosen Tercatat:</strong></p>
                  <p class="text-gray-800 dark:text-gray-300 italic mb-2 break-words">
                    {{ parsedDetailKriteria.keahlian_dosen && parsedDetailKriteria.keahlian_dosen.length > 0 ? parsedDetailKriteria.keahlian_dosen.join(', ') : 'Belum ada data keahlian.' }}
                  </p>

                  <p class="text-gray-600 dark:text-gray-400 mb-1"><strong>Kata yang Cocok (Matched Keywords):</strong></p>
                  <div class="flex flex-wrap gap-1">
                    <span v-if="parsedDetailKriteria.matched_words.length === 0" class="text-red-500 font-medium">Tidak ada kata kunci yang cocok.</span>
                    <span v-else v-for="kata in parsedDetailKriteria.matched_words" :key="kata" class="font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      {{ kata }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                <span class="text-xs font-bold text-gray-500 dark:text-gray-400">2. Ketersediaan Kuota Dosen (Max 25 Poin)</span>
                <span class="font-bold text-orange-500 mt-1 sm:mt-0">+ {{ parsedDetailKriteria.poin_kuota }} Poin</span>
              </div>

              <div class="flex flex-col sm:flex-row justify-between sm:items-center bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded border border-indigo-100 dark:border-indigo-800">
                <span class="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Posisi Partikel Terbaik (Global Best / Gbest)
                </span>
                <span class="font-bold text-indigo-700 dark:text-indigo-400 mt-1 sm:mt-0">{{ selectedRekomendasiDetail?.nilai_fitness }} Poin</span>
              </div>

              <div class="mt-2 bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-100 dark:border-gray-700">
                <p class="text-[10px] text-gray-500 dark:text-gray-400 italic leading-relaxed">
                  *Berdasarkan rumusan algoritma PSO pada sistem, partikel mengevaluasi nilai <b>Fitness</b> tertinggi dengan terus memperbarui kecepatan pergerakannya menuju titik optimal melalui persamaan:<br/>
                  <span class="font-mono text-indigo-600 dark:text-indigo-400 font-semibold block mt-1">V_j(i) = w · V_j(i-1) + c1·r1 [Pbest_j - X_j(i-1)] + c2·r2 [Gbest - X_j(i-1)]</span>
                </p>
              </div>

            </div>
          </div>

          <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800">
            <div class="mb-4">
              <h5 class="font-bold text-gray-800 dark:text-white/90">Grafik Konvergensi Particle Swarm Optimization</h5>
              <p class="text-xs text-gray-500">Rekam jejak asli partikel menemukan nilai fitness tertinggi (Global Best) selama iterasi pencarian solusi.</p>
            </div>

            <div class="w-full h-[300px] relative chart-container">
               <VueApexCharts v-if="chartSeries.length > 0" type="line" height="300" :options="chartOptions" :series="chartSeries"></VueApexCharts>
            </div>
          </div>

        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Pagination from '@/components/pagination/Pagination.vue'
import Modal from '@/components/modal/Modal.vue'
import Alert from '@/components/ui/Alert.vue'
import VueApexCharts from 'vue3-apexcharts'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface GenericRecord { [key: string]: unknown; }

interface TopikTA { nama_topik: string; }
interface Mahasiswa { id_mahasiswa: number; nama_mahasiswa: string; judul_ta: string; nim: string; topik_id: unknown; topik_ta?: TopikTA; prodi_id: unknown; }
interface Dosen { id_dosen: number; nama_dosen: string; nidn: string; kuota_menguji: number; }
interface DetailKriteria { keahlian_dosen: string[]; matched_words: string[]; poin_teks: number; poin_kuota: number; }
interface Rekomendasi {
  id_rekomendasi: number;
  mahasiswa_id: number;
  dosen_id: number;
  iterasi_pso: number;
  nilai_fitness: number;
  rank: string;
  history_fitness?: string;
  detail_kriteria?: string;
  dosen?: Dosen;
  mahasiswa?: Mahasiswa;
}

interface GroupedMahasiswa {
  mahasiswa_id: number;
  nama_mahasiswa: string;
  judul_ta: string;
  nama_topik: string;
  nim: string;
  prodi_id: number;
  rekomendasi: Rekomendasi[];
}

const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })
const showAlert = (type: AlertVariant, title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  setTimeout(() => { alert.value.show = false }, 3000)
}

const isLoading = ref(false)
const isGenerating = ref(false)
const isDeleting = ref(false)
const isGenerateModalOpen = ref(false)
const isDeleteAllModalOpen = ref(false)

const psoParams = ref({ maxIter: 50, numParticles: 30, w: 0.7, c1: 1.5, c2: 1.5 })

const mahasiswaList = ref<Mahasiswa[]>([])
const semuaRekomendasi = ref<Rekomendasi[]>([])

const isMahasiswaDropdownOpen = ref(false)
const mahasiswaDropdownRef = ref<HTMLElement | null>(null)
const isItemsPerPageDropdownOpen = ref(false)
const itemsPerPageDropdownRef = ref<HTMLElement | null>(null)

const selectedMahasiswaFilter = ref<number | ''>('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)

const userRoles = ref<string[]>([])
const userProdiId = ref<number>(0)
const activeProdiName = ref('')

const isAdmin = computed(() => userRoles.value.some(role => role.toLowerCase() === 'admin'))
const canManageMatching = computed(() => userRoles.value.some(role => ['admin', 'kaprodi'].includes(role.toLowerCase())))

const getRawId = (dataData: unknown): number => {
  if (dataData === null || dataData === undefined) return 0;
  if (typeof dataData === 'object' && dataData !== null) {
      const obj = dataData as GenericRecord;
      const id = obj.id_prodi || obj.id_user || obj.id_topik || obj.id_mahasiswa || obj.id_dosen || obj.id;
      return Number(id) || 0;
  }
  return Number(dataData) || 0;
}

const selectItemsPerPage = (val: number) => { itemsPerPage.value = val; isItemsPerPageDropdownOpen.value = false; }
const handleDropdownClickOutside = (event: MouseEvent) => {
  if (mahasiswaDropdownRef.value && !mahasiswaDropdownRef.value.contains(event.target as Node)) isMahasiswaDropdownOpen.value = false;
  if (itemsPerPageDropdownRef.value && !itemsPerPageDropdownRef.value.contains(event.target as Node)) isItemsPerPageDropdownOpen.value = false;
}

const selectFilterMahasiswa = (val: number | '') => {
  selectedMahasiswaFilter.value = val;
  isMahasiswaDropdownOpen.value = false;
}

const filteredMahasiswaDropdown = computed(() => {
  if (isAdmin.value || userProdiId.value === 0) return mahasiswaList.value;
  return mahasiswaList.value.filter(m => getRawId(m.prodi_id) === userProdiId.value);
})

const selectedMahasiswaLabel = computed(() => {
  if (selectedMahasiswaFilter.value === '') return '-- Tampilkan Semua Mahasiswa --';
  const found = mahasiswaList.value.find(m => m.id_mahasiswa === selectedMahasiswaFilter.value);
  return found ? `${found.nama_mahasiswa} (${found.nim})` : '-- Tampilkan Semua Mahasiswa --';
});

const groupedRekomendasi = computed(() => {
  const groups: Record<number, GroupedMahasiswa> = {};
  semuaRekomendasi.value.forEach(rek => {
    if (!rek.mahasiswa) return;
    if (!groups[rek.mahasiswa_id]) {
      // PENAMBAHAN LOGIKA PENCARIAN PRODI ID YANG AMAN
      let prodiId = getRawId(rek.mahasiswa.prodi_id);
      // JIKA BACKEND GAGAL MENGIRIM PRODI ID, CARI DARI DAFTAR MAHASISWA (FRONTEND)
      if (prodiId === 0) {
          const foundMhs = mahasiswaList.value.find(m => getRawId(m.id_mahasiswa) === getRawId(rek.mahasiswa_id));
          if (foundMhs) prodiId = getRawId(foundMhs.prodi_id);
      }

      groups[rek.mahasiswa_id] = {
        mahasiswa_id: rek.mahasiswa_id,
        nama_mahasiswa: rek.mahasiswa.nama_mahasiswa,
        judul_ta: rek.mahasiswa.judul_ta,
        nama_topik: rek.mahasiswa.topik_ta?.nama_topik || '',
        nim: rek.mahasiswa.nim,
        prodi_id: prodiId,
        rekomendasi: []
      };
    }
    groups[rek.mahasiswa_id].rekomendasi.push(rek);
  });
  return Object.values(groups);
})

const filteredGroups = computed(() => {
  let result = groupedRekomendasi.value;

  if (!isAdmin.value && userProdiId.value > 0) {
      result = result.filter(group => group.prodi_id === userProdiId.value);
  }

  if (selectedMahasiswaFilter.value !== '') {
      result = result.filter(group => group.mahasiswa_id === selectedMahasiswaFilter.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(group => {
      const isMhsMatch = group.nama_mahasiswa.toLowerCase().includes(q) || group.nim.toLowerCase().includes(q) || (group.judul_ta && group.judul_ta.toLowerCase().includes(q));
      const isDosenMatch = group.rekomendasi.some(r => r.dosen && r.dosen.nama_dosen.toLowerCase().includes(q));
      return isMhsMatch || isDosenMatch;
    });
  }
  return result;
})

const totalItems = computed(() => filteredGroups.value.length)

const paginatedGroups = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredGroups.value.slice(start, end)
})

watch([searchQuery, selectedMahasiswaFilter, itemsPerPage], () => { currentPage.value = 1 })

const hasUnassignedMahasiswa = computed(() => {
    if (!mahasiswaList.value || mahasiswaList.value.length === 0) return false;

    const mahasiswaDiProdi = isAdmin.value
        ? mahasiswaList.value
        : mahasiswaList.value.filter(m => getRawId(m.prodi_id) === userProdiId.value);

    if (mahasiswaDiProdi.length === 0) return false;

    const mahasiswaSudahMatchingIds = new Set(semuaRekomendasi.value.map(r => getRawId(r.mahasiswa_id)));

    const unassigned = mahasiswaDiProdi.filter(m => !mahasiswaSudahMatchingIds.has(getRawId(m.id_mahasiswa)));

    return unassigned.length > 0;
});

const fetchMahasiswaList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/mahasiswa', { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
    const result = await response.json()
    if (result.success) mahasiswaList.value = result.data.rows || result.data
  } catch (error) { console.error("Gagal fetch mahasiswa:", error) }
}

const fetchAllRekomendasi = async () => {
  isLoading.value = true;
  semuaRekomendasi.value = [];
  try {
    const response = await fetch('http://localhost:3000/api/matching-ta', { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
    const result = await response.json()
    if (response.ok) {
      if (result.data && Array.isArray(result.data)) semuaRekomendasi.value = result.data;
      else if (result.data && result.data.rows) semuaRekomendasi.value = result.data.rows;
      else if (Array.isArray(result)) semuaRekomendasi.value = result;
    }
  } catch (error) {
    console.error("Gagal fetch rekomendasi:", error)
    showAlert('error', 'Gagal!', 'Tidak dapat memuat data rekomendasi.')
  } finally {
    isLoading.value = false;
  }
}

const fetchKaprodiIdentity = async () => {
    if (isAdmin.value) return;

    try {
        const response = await fetch('http://localhost:3000/api/auth/profile', { method: 'GET', credentials: 'include' });
        const result = await response.json();

        if (result.success && result.data) {
            activeProdiName.value = result.data.prodi;

            const resProdi = await fetch('http://localhost:3000/api/prodi', { method: 'GET', credentials: 'include' });
            const resultProdi = await resProdi.json();

            if (resultProdi.success && resultProdi.data) {
                const matchedProdi = resultProdi.data.find((p: GenericRecord) => String(p.nama_prodi) === activeProdiName.value);
                if (matchedProdi) {
                    userProdiId.value = getRawId(matchedProdi.id_prodi);
                    console.log("IDENTITAS KAPRODI DITEMUKAN:", activeProdiName.value, "| ID PRODI:", userProdiId.value);
                }
            }
        }
    } catch (error) {
        console.error("Gagal mendeteksi identitas Kaprodi:", error);
    }
}


const openGenerateModal = () => { isGenerateModalOpen.value = true; }
const closeGenerateModal = () => { isGenerateModalOpen.value = false; }

const submitGeneratePso = async () => {
  isGenerating.value = true;
  try {
    const payload = {
        ...psoParams.value,
        prodi_id: !isAdmin.value && userProdiId.value > 0 ? userProdiId.value : undefined
    };

    const response = await fetch('http://localhost:3000/api/matching-ta/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload)
    })
    const result = await response.json()
    if (response.ok) {
      showAlert('success', 'Algoritma Selesai!', result.data?.message || result.message || 'Berhasil mencarikan dosen untuk semua mahasiswa.')
      closeGenerateModal()
      fetchAllRekomendasi()
    } else {
      let errorMsg = 'Gagal menjalankan algoritma.';
      if (result.err && result.err.message) errorMsg = result.err.message;
      else if (result.meta && result.meta.message) errorMsg = result.meta.message;
      else if (result.message) errorMsg = result.message;
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

const confirmDeleteAll = async () => {
  isDeleting.value = true;
  try {
    const response = await fetch('http://localhost:3000/api/matching-ta/delete-all', { method: 'DELETE', credentials: 'include' })
    const result = await response.json()
    if (response.ok) {
      showAlert('success', 'Proses Selesai!', result.data?.message || result.message || 'Data rekomendasi berhasil dibersihkan.')
      isDeleteAllModalOpen.value = false
      await fetchAllRekomendasi()
    } else {
      showAlert('error', 'Gagal!', 'Terdapat kesalahan saat menghapus data.')
    }
  } catch (error) {
    console.error("Error hapus data:", error)
    showAlert('error', 'Gagal Server!', 'Gagal menghubungi server.')
  } finally {
    isDeleting.value = false;
  }
}

const isDetailModalOpen = ref(false)
const selectedGroupDetail = ref<GroupedMahasiswa | null>(null)
const selectedRekomendasiDetail = ref<Rekomendasi | null>(null)
const parsedDetailKriteria = ref<DetailKriteria | null>(null)

const chartSeries = ref<{ name: string, data: number[] }[]>([])

const chartOptions = ref({
  chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Inter, sans-serif', background: 'transparent', dropShadow: { enabled: true, color: '#3b82f6', top: 10, left: 0, blur: 5, opacity: 0.3 } },
  colors: ['#3b82f6'],
  dataLabels: { enabled: false },
  stroke: { curve: 'straight', width: 4 },
  xaxis: { categories: [] as string[], labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false } },
  yaxis: { min: 0, max: 100, labels: { formatter: (value: number) => { return value.toFixed(0) }, style: { colors: '#9ca3af', fontSize: '12px', fontWeight: 600 } } },
  grid: { borderColor: '#e5e7eb', strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
  tooltip: { theme: 'light', y: { formatter: function (val: number) { return val + " Poin Fitness" } }, marker: { show: false } }
})

const openDetailModal = (item: Rekomendasi, group: GroupedMahasiswa) => {
  selectedGroupDetail.value = group;
  selectedRekomendasiDetail.value = item;

  if (item.detail_kriteria) {
    try { parsedDetailKriteria.value = JSON.parse(item.detail_kriteria); } catch { parsedDetailKriteria.value = null; }
  } else { parsedDetailKriteria.value = null; }

  let dataPoints: number[] = [];
  if (item.history_fitness) {
      try { dataPoints = JSON.parse(item.history_fitness); } catch { dataPoints = [Number(item.nilai_fitness)]; }
  } else { dataPoints = [Number(item.nilai_fitness)]; }

  const actualIterCount = dataPoints.length;
  const isDark = document.documentElement.classList.contains('dark');
  const actualMin = Math.min(...dataPoints);
  const actualMax = Math.max(...dataPoints);

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: { ...chartOptions.value.xaxis, categories: Array.from({ length: actualIterCount }, (_, i) => `Iterasi ${i + 1}`) },
    tooltip: { ...chartOptions.value.tooltip, theme: isDark ? 'dark' : 'light' },
    grid: { ...chartOptions.value.grid, borderColor: isDark ? '#374151' : '#e5e7eb' },
    yaxis: { ...chartOptions.value.yaxis, min: Math.max(0, Math.floor(actualMin - 2)), max: Math.min(100, Math.ceil(actualMax + 2)) }
  };

  chartSeries.value = [{ name: 'Skor Fitness', data: dataPoints }];
  isDetailModalOpen.value = true;
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false;
  selectedGroupDetail.value = null;
  selectedRekomendasiDetail.value = null;
  parsedDetailKriteria.value = null;
  chartSeries.value = [];
}

onMounted(() => {
  try { userRoles.value = JSON.parse(localStorage.getItem('userRoles') || '[]') } catch { userRoles.value = (localStorage.getItem('userRoles') || '').split(',').map(r => r.trim()) }
  document.addEventListener('mousedown', handleDropdownClickOutside);

  fetchKaprodiIdentity().then(() => {
      fetchMahasiswaList();
      fetchAllRekomendasi();
  });
})

onBeforeUnmount(() => { document.removeEventListener('mousedown', handleDropdownClickOutside); })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
:deep(.apexcharts-tooltip) { background: #ffffff !important; border: 1px solid #e5e7eb !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important; color: #1f2937 !important; }
:deep(.dark .apexcharts-tooltip) { background: #1f2937 !important; border: 1px solid #374151 !important; color: #f9fafb !important; }
:deep(.apexcharts-tooltip-title) { background: transparent !important; border-bottom: 1px solid inherit !important; font-weight: bold !important; }
:deep(.apexcharts-tooltip-text-y-value) { color: inherit !important; }
</style>
