<template>
  <div class="relative">
    <div v-if="alert.show"
      class="fixed top-20 right-5 z-[99999] w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <!-- HEADER KONTROL UTAMA -->
    <div
      class="flex flex-col gap-4 mb-6 p-5 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50 shadow-sm relative">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 w-full sm:w-auto" ref="itemsPerPageDropdownRef">
          <span class="text-sm text-gray-500 dark:text-gray-400">Tampilkan</span>
          <div class="relative">
            <button type="button" @click="isItemsPerPageDropdownOpen = !isItemsPerPageDropdownOpen"
              class="flex items-center justify-between h-9 min-w-[130px] rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
              <span class="font-medium">{{ itemsPerPage }} Mahasiswa</span>
              <svg
                :class="['w-4 h-4 text-gray-400 transition-transform duration-200 ml-2', { 'rotate-180': isItemsPerPageDropdownOpen }]"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <transition enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0">
              <div v-if="isItemsPerPageDropdownOpen"
                class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden left-0">
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
          <button v-if="canManageMatching && filteredGroups.length > 0" @click="isDeleteAllModalOpen = true"
            class="flex-1 sm:flex-none flex items-center justify-center px-4 h-10 text-sm font-medium text-red-600 transition rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 shadow-theme-xs dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/40">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
              </path>
            </svg>
            Hapus Semua
          </button>

          <button v-if="filteredGroups.length > 0" @click="exportToExcel"
            class="flex-1 sm:flex-none flex items-center justify-center px-4 h-10 text-sm font-medium text-emerald-700 transition rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 shadow-theme-xs dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400 dark:hover:bg-emerald-900/40">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            Export Excel
          </button>

          <button v-if="canManageMatching && hasUnassignedMahasiswa" @click="openGenerateModal"
            class="flex-1 sm:flex-none flex items-center justify-center px-5 h-10 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 shadow-theme-xs dark:bg-brand-600 dark:hover:bg-brand-500">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z">
              </path>
            </svg>
            Jalankan Matching PSO Massal
          </button>

          <span v-else-if="canManageMatching && !hasUnassignedMahasiswa"
            class="text-sm font-medium text-emerald-600 flex items-center bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Semua Mahasiswa Telah Di-Matching
          </span>
        </div>
      </div>

      <div v-if="!isAdmin && activeProdiName" class="w-full mb-2">
        <span
          class="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400">
          Menampilkan Data Hasil Matching Prodi: {{ activeProdiName }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        <!-- 1. Pencarian Teks -->
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Cari Mahasiswa atau Dosen Penguji..."
            class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <!-- 2. FILTER TANGGAL BARU -->
        <div class="relative w-full" ref="tanggalDropdownRef">
          <button type="button" @click="isTanggalDropdownOpen = !isTanggalDropdownOpen"
            class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="truncate pr-4 font-medium">{{ selectedTanggalLabel }}</span>
            <svg
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': isTanggalDropdownOpen }]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isTanggalDropdownOpen"
              class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                <li @click="selectFilterTanggal('')"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">
                  -- Tampilkan Semua Tanggal --
                </li>
                <li v-for="tgl in availableDatesFilter" :key="tgl"
                  @click="selectFilterTanggal(tgl)"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">
                  {{ formatDateDisplay(tgl) }}
                </li>
              </ul>
            </div>
          </transition>
        </div>

        <!-- 3. FILTER MAHASISWA -->
        <div class="relative w-full" ref="mahasiswaDropdownRef">
          <button type="button" @click="isMahasiswaDropdownOpen = !isMahasiswaDropdownOpen"
            class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="truncate pr-4 font-medium">{{ selectedMahasiswaLabel }}</span>
            <svg
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': isMahasiswaDropdownOpen }]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isMahasiswaDropdownOpen"
              class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                <li @click="selectFilterMahasiswa('')"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">
                  -- Tampilkan Semua Mahasiswa --
                </li>
                <li v-for="mhs in filteredMahasiswaDropdown" :key="mhs.id_mahasiswa"
                  @click="selectFilterMahasiswa(mhs.id_mahasiswa)"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">
                  {{ mhs.nama_mahasiswa }} <span class="text-gray-400 dark:text-gray-500 ml-1 text-xs">({{ mhs.nim
                    }})</span>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- TABEL UTAMA HASIL MATCHING -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50 shadow-sm">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-transparent">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hasil Algoritma PSO (Top 5 Dosen)
        </h3>
      </div>

      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02]">
              <th class="px-5 py-3 text-left w-1/3 border-r border-gray-200 dark:border-gray-700">
                <p class="font-bold text-gray-700 text-theme-xs uppercase tracking-wider">Data Mahasiswa</p>
              </th>
              <th class="px-5 py-3 text-center w-24">
                <p class="font-bold text-brand-500 text-theme-xs uppercase tracking-wider">Ranking</p>
              </th>
              <th class="px-5 py-3 text-left">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Dosen
                  Penguji Rekomendasi</p>
              </th>
              <th class="px-5 py-3 text-center">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Iterasi
                  Ditemukan</p>
              </th>
              <th class="px-5 py-3 text-center">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Nilai
                  Kecocokan</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">

            <tr v-if="isLoading">
              <td colspan="5" class="px-5 py-12 text-center text-gray-500 text-theme-sm">
                <div class="flex items-center justify-center gap-3">
                  <svg class="animate-spin h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
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
              <tr v-for="(item, index) in group.rekomendasi" :key="item.id_rekomendasi"
                class="hover:bg-gray-50 dark:hover:bg-white/[0.02]">

                <td v-if="index === 0" :rowspan="group.rekomendasi.length"
                  class="px-5 py-5 border-r border-gray-200 dark:border-gray-700 align-top bg-white dark:bg-gray-800/30">
                  <div class="sticky top-0">
                    <div class="flex flex-col">
                      <span class="block font-bold text-gray-800 text-base dark:text-white/90">
                        {{ group.nama_mahasiswa }}
                      </span>
                      <span class="block text-sm font-medium text-brand-500 mt-0.5">NIM: {{ group.nim }}</span>
                    </div>

                    <div class="mt-3 flex flex-wrap gap-2" v-if="group.tanggal_ujian || group.sesi_waktu">
                      <span v-if="group.tanggal_ujian"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                          </path>
                        </svg>
                        {{ formatDateDisplay(group.tanggal_ujian) }}
                      </span>
                      <span v-if="group.sesi_waktu"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-bold dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {{ formatSesiDisplay(group.sesi_waktu) }}
                      </span>
                    </div>

                    <div
                      class="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                      <span
                        class="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">Judul
                        Tugas Akhir:</span>
                      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {{ group.judul_ta || 'Belum ada judul / Topik belum diajukan' }}
                      </p>
                      <span
                        class="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 mt-3 uppercase tracking-wider">Topik
                        Tugas Akhir:</span>
                      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {{ group.nama_topik || 'Belum ada judul / Topik belum diajukan' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-3 text-center border-l border-gray-100 dark:border-gray-800 align-middle">
                  <span :class="[
                    'inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm transition-colors',
                    item.rank === '1' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700 ring-2 ring-yellow-400 dark:from-yellow-900/50 dark:to-yellow-800/50 dark:text-yellow-400 dark:ring-yellow-700/50' :
                      item.rank === '2' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border dark:border-gray-700' :
                        item.rank === '3' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400' : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
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
                    <button @click="openDetailModal(item, group)"
                      class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 dark:hover:border-blue-800">
                      <svg class="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Detail Evaluasi
                    </button>
                  </div>
                </td>

                <td class="px-5 py-3 text-center align-middle">
                  <span
                    class="inline-flex items-center justify-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                    {{ item.iterasi_pso }}
                  </span>
                </td>

                <td class="px-5 py-3 text-center align-middle">
                  <span
                    class="font-mono text-gray-800 dark:text-gray-200 font-bold text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                    {{ item.nilai_fitness }}%
                  </span>
                </td>
              </tr>
              <tr class="bg-gray-100 dark:bg-gray-800">
                <td colspan="5" class="h-1.5 p-0 m-0 border-none"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination v-if="!isLoading && totalItems > 0" :current-page="currentPage" :total-items="totalItems"
      :items-per-page="itemsPerPage" @update:currentPage="currentPage = $event" class="mt-4" />

    <Modal v-if="isDeleteAllModalOpen" @close="isDeleteAllModalOpen = false">
      <div
        class="w-full max-w-[400px] rounded-3xl bg-white p-6 dark:bg-gray-900 border dark:border-gray-700 text-center mx-auto mt-20 z-50 shadow-xl">
        <h4 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">Konfirmasi Hapus Semua</h4>
        <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">Apakah Anda yakin ingin menghapus <strong>seluruh data
            hasil rekomendasi (Matching TA)</strong> dari sistem? Tindakan ini tidak dapat dibatalkan.</p>
        <div class="flex items-center justify-center gap-3">
          <button @click="isDeleteAllModalOpen = false"
            class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
          <button @click="confirmDeleteAll" :disabled="isDeleting"
            class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto">{{
              isDeleting ? 'Menghapus...' : 'Ya, Hapus Semua' }}</button>
        </div>
      </div>
    </Modal>

    <!-- MODAL GENERATE PSO MASSAL -->
    <Modal v-if="isGenerateModalOpen" @close="closeGenerateModal">
      <div
        class="relative w-full max-w-[850px] rounded-3xl bg-white dark:bg-gray-900 mx-auto mt-4 sm:mt-10 shadow-2xl border dark:border-gray-800 flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">

        <!-- HEADER MODAL -->
        <div
          class="text-center p-5 sm:p-6 pb-4 shrink-0 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 mb-3 shadow-inner dark:bg-brand-900/30 dark:text-brand-400">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
              </path>
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-800 dark:text-white/90">Automasi PSO Massal</h4>
          <p class="text-xs text-gray-500 mt-1 leading-relaxed">
            Sistem mendeteksi mahasiswa yang belum di-matching. Atur kumpulan tanggal pelaksanaan serentak dan pilih parameter algoritma.
          </p>
        </div>

        <form @submit.prevent="submitGeneratePso" class="flex flex-col flex-1 min-h-0">

          <!-- BODY MODAL -->
          <div
            class="flex flex-col flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 pb-24 gap-6 bg-gray-50/30 dark:bg-gray-900/50">

            <!-- 1. KOTAK GLOBAL DATE SETTINGS -->
            <div
              class="shrink-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800/80 dark:to-gray-800/40 p-5 rounded-2xl border border-blue-200/60 dark:border-gray-700 shadow-sm relative z-20">
              <h5 class="text-xs font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                <span
                  class="flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px]">1</span>
                Tentukan Tanggal Pool (Pilih Lebih Dari Satu)
              </h5>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full items-start">

                <div class="w-full relative datepicker-container">
                  <label class="block text-[11px] font-semibold text-blue-700 dark:text-blue-400 mb-1 ml-1">Pilih Kumpulan Tanggal <span class="text-red-500">*</span></label>
                  <div class="relative w-full">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                      <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>

                    <button type="button" @click="openCalendar('global', '')"
                      class="pl-10 flex items-center justify-between w-full h-[38px] text-xs rounded-xl border border-blue-200 bg-white px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all outline-none cursor-pointer dark:bg-gray-900 dark:border-gray-600 dark:text-white hover:bg-blue-50/50 dark:hover:bg-gray-800">
                      <span :class="globalTanggal.length > 0 ? 'text-gray-800 dark:text-white truncate' : 'text-gray-400 dark:text-gray-500'">
                        {{ globalTanggal.length > 0 ? [...globalTanggal].sort().map(d => formatDateDisplay(d)).join(' & ') : 'Klik untuk memilih...' }}
                      </span>
                      <svg class="w-4 h-4 text-gray-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    <!-- Popover Calendar Global -->
                    <transition enter-active-class="transition duration-100 ease-out"
                      enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                      <div v-if="activeDatePicker === 'global'"
                        class="absolute z-[100] mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-72 left-0">
                        <div class="flex justify-between items-center mb-4">
                          <button type="button" @click.prevent="changeMonth(-1)"
                            class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><svg
                              class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
                              </path>
                            </svg></button>
                          <span class="text-sm font-bold text-gray-800 dark:text-white">{{ monthNames[currentMonth] }}
                            {{ currentYear }}</span>
                          <button type="button" @click.prevent="changeMonth(1)"
                            class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><svg
                              class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
                              </path>
                            </svg></button>
                        </div>
                        <div class="grid grid-cols-7 mb-2 gap-1 text-center">
                          <span v-for="d in dayNames" :key="d"
                            class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">{{ d }}</span>
                        </div>
                        <div class="grid grid-cols-7 gap-1 text-center">
                          <div v-for="blank in blankDays" :key="'blank-' + blank" class="h-8"></div>
                          <button type="button" v-for="day in daysInMonth" :key="'day-' + day"
                            @click.prevent="selectDate('global', day)" :class="['h-8 w-full rounded-lg text-xs transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                              isSelected('global', day) ? 'bg-brand-500 text-white font-bold shadow-md' :
                                isToday(day) ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold border border-brand-200 dark:border-brand-800/50' :
                                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700']">
                            {{ day }}
                          </button>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>

                <div class="w-full relative">
                  <label class="block text-[11px] font-semibold text-blue-700 dark:text-blue-400 mb-1 ml-1">Maks Mahasiswa / Hari <span class="text-red-500">*</span></label>
                  <div class="relative w-full">
                     <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                      <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                    <input v-model.number="inputDailyLimit" type="number" min="1"
                      class="pl-10 w-full h-[38px] text-xs rounded-xl border border-blue-200 bg-white px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

                <!-- INPUT BARU: MAKS SESI DOSEN -->
                <div class="w-full relative">
                  <label class="block text-[11px] font-semibold text-blue-700 dark:text-blue-400 mb-1 ml-1">Maks Sesi Dosen / Hari <span class="text-red-500">*</span></label>
                  <div class="relative w-full">
                     <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                      <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <input v-model.number="inputDosenDailyLimit" type="number" min="1"
                      class="pl-10 w-full h-[38px] text-xs rounded-xl border border-blue-200 bg-white px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

              </div>
            </div>

            <div v-if="capacityInfo.totalDosen > 0" class="shrink-0 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex flex-col gap-3 shadow-sm">
              <h6 class="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Informasi Kapasitas Sistem
              </h6>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="block text-[10px] text-gray-500 dark:text-gray-400">Total Dosen Tersedia</span>
                  <span class="font-bold text-sm text-gray-800 dark:text-white">{{ capacityInfo.totalDosen }} Orang</span>
                </div>
                <div>
                  <span class="block text-[10px] text-gray-500 dark:text-gray-400">Total Kapasitas ({{ globalTanggal.length || 0 }} Hari)</span>
                  <span class="font-bold text-sm text-indigo-600 dark:text-indigo-400">{{ inputDailyLimit * Math.max(1, globalTanggal.length) }} Mahasiswa</span>
                </div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mt-1">
                <div :class="['h-full rounded-full transition-all duration-300', capacityErrors.length > 0 ? 'bg-red-500' : 'bg-indigo-500']" :style="{ width: `${Math.min((selectedMahasiswaIds.length / (capacityInfo.globalCapacity || 1)) * 100, 100)}%` }"></div>
              </div>
              <div class="flex justify-between text-[10px] font-medium">
                <span :class="capacityErrors.length > 0 ? 'text-red-600 font-bold' : 'text-gray-500'">Total Terpilih: {{ selectedMahasiswaIds.length }} Mhs</span>
                <span class="text-gray-500">Sisa Kuota Global: {{ capacityInfo.globalCapacity }} Mhs</span>
              </div>
            </div>

            <!-- PLACEHOLDER JIKA TANGGAL BELUM DIPILIH -->
            <div v-if="globalTanggal.length === 0"
              class="shrink-0 my-4 p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20">
              <div
                class="mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Silakan tentukan <b>Tanggal Pelaksanaan</b> terlebih
                dahulu untuk menampilkan daftar mahasiswa.</p>
            </div>

            <!-- 2. DAFTAR MAHASISWA & SEARCH BAR -->
            <div v-else class="flex flex-col flex-1 animate-[fadeIn_0.3s_ease-in-out] gap-4">
              <div class="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <h5 class="text-sm font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
                  <span
                    class="flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 dark:bg-gray-700 text-white text-[9px]">2</span>
                  Pilih Mahasiswa
                </h5>

                <div class="relative w-full sm:w-1/2">
                  <input v-model="modalSearchQuery" type="text" placeholder="Cari Nama atau NIM..."
                    class="h-9 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 pr-3 text-xs text-gray-800 dark:text-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all shadow-sm" />
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>

              <!-- TABLE CONTAINER -->
              <div
                class="flex flex-col flex-1 min-h-[350px] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-900 relative">
                <table class="w-full text-sm text-left border-separate border-spacing-0">
                  <thead class="bg-gray-50 dark:bg-gray-800/95">
                    <tr>
                      <th class="p-3 w-12 text-center rounded-tl-xl border-b border-gray-200 dark:border-gray-700">
                        <input type="checkbox" @change="toggleAllModal" :checked="isAllModalSelected"
                          class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-brand-500 focus:ring-brand-500 cursor-pointer" />
                      </th>
                      <th
                        class="p-3 font-bold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        Nama Mahasiswa</th>
                      <th
                        class="p-3 font-bold text-gray-700 dark:text-gray-300 w-[220px] rounded-tr-xl border-b border-gray-200 dark:border-gray-700">
                        Status Penugasan</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
                    <tr v-for="(mhs, index) in filteredUnassignedMahasiswaList" :key="mhs.id_mahasiswa"
                      class="transition-colors group"
                      :class="selectedMahasiswaIds.includes(mhs.id_mahasiswa) ? 'bg-blue-50/40 hover:bg-blue-50/80 dark:bg-blue-900/20 dark:hover:bg-blue-900/40' : 'bg-white hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800/40'">

                      <td class="py-3 px-3 text-center align-middle"
                        :class="{ 'rounded-bl-xl': index === filteredUnassignedMahasiswaList.length - 1 }">
                        <input type="checkbox" v-model="selectedMahasiswaIds" :value="mhs.id_mahasiswa"
                          class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-brand-500 focus:ring-brand-500 cursor-pointer" />
                      </td>

                      <td class="py-3 px-3 align-middle">
                        <div class="font-semibold text-sm text-gray-800 dark:text-gray-200"
                          :class="!selectedMahasiswaIds.includes(mhs.id_mahasiswa) ? 'text-gray-500 dark:text-gray-400' : ''">
                          {{ mhs.nama_mahasiswa }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ mhs.nim }}</div>
                      </td>

                      <td class="py-3 px-3 align-middle"
                        :class="{ 'rounded-br-xl': index === filteredUnassignedMahasiswaList.length - 1 }">
                          <span v-if="selectedMahasiswaIds.includes(mhs.id_mahasiswa)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                              Akan Diplot Otomatis
                          </span>
                          <span v-else class="text-xs text-gray-400 dark:text-gray-600 italic">Tidak Dipilih</span>
                      </td>
                    </tr>

                    <tr v-if="filteredUnassignedMahasiswaList.length === 0">
                      <td colspan="3" class="p-8 text-center rounded-b-xl">
                        <div class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                          <svg class="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <p class="text-sm font-medium">Tidak ada mahasiswa yang sesuai dengan pencarian.</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- FOOTER MODAL -->
          <div
            class="shrink-0 bg-white dark:bg-gray-900 p-5 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4 z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.2)]">

            <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
              <div v-if="capacityErrors.length > 0" class="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3 text-xs text-red-600 dark:text-red-400">
                <span class="font-bold mb-1 flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  Gagal: Kapasitas Melebihi Batas!
                </span>
                <ul class="list-disc pl-6 mt-1 space-y-0.5">
                  <li v-for="(err, i) in capacityErrors" :key="i">{{ err }}</li>
                </ul>
              </div>
            </transition>
            <!-- PARAMETER PSO -->
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
              <div>
                <label
                  class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Iterasi</label>
                <input v-model.number="psoParams.maxIter" type="number"
                  class="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                  required />
              </div>
              <div>
                <label
                  class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Partikel</label>
                <input v-model.number="psoParams.numParticles" type="number"
                  class="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                  required />
              </div>
              <div>
                <label
                  class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Inertia
                  (w)</label>
                <input v-model.number="psoParams.w" type="number" step="0.1"
                  class="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                  required />
              </div>
              <div>
                <label
                  class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Kognitif
                  (c1)</label>
                <input v-model.number="psoParams.c1" type="number" step="0.1"
                  class="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                  required />
              </div>
              <div>
                <label
                  class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Sosial
                  (c2)</label>
                <input v-model.number="psoParams.c2" type="number" step="0.1"
                  class="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                  required />
              </div>
            </div>

            <div class="flex items-center gap-3 w-full">
              <button @click="closeGenerateModal" type="button"
                class="flex-1 justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                Batal
              </button>
              <button type="submit" :disabled="isSubmitDisabled"
                class="flex-[2] flex justify-center items-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg dark:bg-brand-600 dark:hover:bg-brand-500">
                <svg v-if="isGenerating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ isGenerating ? 'Sedang Memproses...' : 'Ya, Mulai Matching' }}
              </button>
            </div>
          </div>

        </form>
      </div>
    </Modal>

    <!-- MODAL DETAIL EVALUASI -->
    <Modal v-if="isDetailModalOpen" @close="closeDetailModal">
      <div
        class="relative w-full max-w-[800px] flex flex-col max-h-[90vh] rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 mx-auto mt-10 shadow-2xl overflow-hidden transition-colors">

        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 z-10">
          <h4 class="text-xl font-bold text-gray-800 dark:text-white/90">
            Analisis Evaluasi PSO
          </h4>
          <button @click="closeDetailModal"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="px-6 py-6 overflow-y-auto custom-scrollbar flex-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              class="p-4 bg-brand-50 border border-brand-100 rounded-xl dark:bg-brand-900/20 dark:border-brand-800/50">
              <span
                class="block text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">Mahasiswa</span>
              <p class="font-bold text-gray-800 dark:text-white/90">{{ selectedGroupDetail?.nama_mahasiswa }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1"
                :title="selectedGroupDetail?.judul_ta">
                {{ selectedGroupDetail?.judul_ta }}</p>
            </div>

            <div
              class="p-4 bg-emerald-50 border border-emerald-100 rounded-xl dark:bg-emerald-900/20 dark:border-emerald-800/50">
              <span
                class="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Rekomendasi
                Dosen (Rank #{{ selectedRekomendasiDetail?.rank }})</span>
              <p class="font-bold text-gray-800 dark:text-white/90">{{ selectedRekomendasiDetail?.dosen?.nama_dosen }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <span
                  class="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-1 rounded">Skor
                  Total: {{ selectedRekomendasiDetail?.nilai_fitness }}%</span>
                <span
                  class="text-xs font-bold text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-1 rounded">Ditemukan
                  di Iterasi: {{ selectedRekomendasiDetail?.iterasi_pso }}</span>
              </div>
            </div>
          </div>

          <div v-if="parsedDetailKriteria"
            class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 mb-6">
            <h5 class="font-bold text-gray-800 dark:text-white/90 mb-3 text-sm flex items-center gap-2">
              <svg class="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Bukti Rincian Penilaian (Fitness Breakdown)
            </h5>

            <div class="space-y-4">
              <div
                class="flex flex-col bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-bold text-gray-500 dark:text-gray-400">1. Kemiripan Teks Mahasiswa &
                    Keahlian
                    Dosen (Max 75 Poin)</span>
                  <span class="font-bold text-blue-600 dark:text-blue-400">+ {{ parsedDetailKriteria.poin_teks }}
                    Poin</span>
                </div>

                <div
                  class="bg-gray-50 dark:bg-gray-900/50 p-2 rounded text-xs border border-gray-100 dark:border-gray-700">
                  <p class="text-gray-600 dark:text-gray-400 mb-1"><strong>Bidang Keahlian Dosen Tercatat:</strong></p>
                  <p class="text-gray-800 dark:text-gray-300 italic mb-2 break-words">
                    {{ parsedDetailKriteria.keahlian_dosen && parsedDetailKriteria.keahlian_dosen.length > 0 ?
                      parsedDetailKriteria.keahlian_dosen.join(', ') : 'Belum ada data keahlian.' }}
                  </p>

                  <p class="text-gray-600 dark:text-gray-400 mb-1"><strong>Kata yang Cocok (Matched Keywords):</strong>
                  </p>
                  <div class="flex flex-wrap gap-1">
                    <span v-if="parsedDetailKriteria.matched_words.length === 0" class="text-red-500 font-medium">Tidak
                      ada
                      kata kunci yang cocok.</span>
                    <span v-else v-for="kata in parsedDetailKriteria.matched_words" :key="kata"
                      class="font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-1.5 py-0.5 rounded">
                      {{ kata }}
                    </span>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                <span class="text-xs font-bold text-gray-500 dark:text-gray-400">2. Ketersediaan Kuota Dosen (Max 25
                  Poin)</span>
                <span class="font-bold text-orange-500 dark:text-orange-400 mt-1 sm:mt-0">+ {{
                  parsedDetailKriteria.poin_distribusi }} Poin</span>
              </div>

              <div
                class="flex flex-col sm:flex-row justify-between sm:items-center bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded border border-indigo-100 dark:border-indigo-800/50">
                <span class="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z">
                    </path>
                  </svg>
                  Posisi Partikel Terbaik (Global Best / Gbest)
                </span>
                <span class="font-bold text-indigo-700 dark:text-indigo-400 mt-1 sm:mt-0">{{
                  selectedRekomendasiDetail?.nilai_fitness }} Poin</span>
              </div>

              <div class="mt-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-100 dark:border-gray-700">
                <p class="text-[10px] text-gray-500 dark:text-gray-400 italic leading-relaxed">
                  *Berdasarkan rumusan algoritma PSO pada sistem, partikel mengevaluasi nilai <b>Fitness</b> tertinggi
                  dengan terus memperbarui kecepatan pergerakannya menuju titik optimal melalui persamaan:<br />
                  <span class="font-mono text-indigo-600 dark:text-indigo-400 font-semibold block mt-1">V_j(i) = w ·
                    V_j(i-1) + c1·r1 [Pbest_j - X_j(i-1)] + c2·r2 [Gbest - X_j(i-1)]</span>
                </p>
              </div>

            </div>
          </div>

          <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800">
            <div class="mb-4">
              <h5 class="font-bold text-gray-800 dark:text-white/90">Grafik Konvergensi Particle Swarm Optimization</h5>
              <p class="text-xs text-gray-500 dark:text-gray-400">Rekam jejak asli partikel menemukan nilai fitness
                tertinggi (Global Best) selama iterasi pencarian solusi.</p>
            </div>

            <div class="w-full h-[300px] relative chart-container">
              <VueApexCharts v-if="chartSeries.length > 0" type="line" height="300" :options="chartOptions"
                :series="chartSeries"></VueApexCharts>
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
import * as XLSX from 'xlsx'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface GenericRecord { [key: string]: unknown; }

interface TopikTA { nama_topik: string; }
interface Mahasiswa { id_mahasiswa: number; nama_mahasiswa: string; judul_ta: string; nim: string; topik_id: unknown; topik_ta?: TopikTA; prodi_id: unknown; }
interface Dosen { id_dosen: number; nama_dosen: string; nidn: string; kuota_menguji: number; }
interface DetailKriteria { keahlian_dosen: string[]; matched_words: string[]; poin_teks: number; poin_distribusi: number; }
interface Rekomendasi {
  id_rekomendasi: number;
  mahasiswa_id: number;
  dosen_id: number;
  iterasi_pso: number;
  nilai_fitness: number;
  rank: string;
  tanggal_ujian?: string;
  sesi_waktu?: string;
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
  tanggal_ujian?: string;
  sesi_waktu?: string;
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

const capacityInfo = ref({ totalDosen: 0, dailyCapacity: 0, globalCapacity: 0 });

const fetchCapacityInfo = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/matching-ta/capacity', { method: 'GET', credentials: 'include' });
    const result = await response.json();
    if (response.ok && result.data) {
      capacityInfo.value = result.data;
    }
  } catch (e) {
    console.error("Gagal menarik data kapasitas", e);
    capacityInfo.value = { totalDosen: 999, dailyCapacity: 999, globalCapacity: 9999 };
  }
};

const selectedMahasiswaIds = ref<number[]>([])
const mhsTimeConfig = ref<Record<number, { tanggal: string }>>({})
const modalSearchQuery = ref('')

const globalTanggal = ref<string[]>([])
const inputDailyLimit = ref(10)
const inputDosenDailyLimit = ref(2)

const distributeDates = () => {
  if (globalTanggal.value.length === 0) return;
  const dates = [...globalTanggal.value].sort();
  let currentStudentIdx = 0;

  selectedMahasiswaIds.value.forEach(id => {
    if (!mhsTimeConfig.value[id]) mhsTimeConfig.value[id] = { tanggal: '' };
    mhsTimeConfig.value[id].tanggal = '';
  });

  for (const date of dates) {
    let assignedToThisDate = 0;
    while (assignedToThisDate < inputDailyLimit.value && currentStudentIdx < selectedMahasiswaIds.value.length) {
      const mhsId = selectedMahasiswaIds.value[currentStudentIdx];
      mhsTimeConfig.value[mhsId].tanggal = date;
      assignedToThisDate++;
      currentStudentIdx++;
    }
  }

  if (currentStudentIdx < selectedMahasiswaIds.value.length && dates.length > 0) {
    const lastDate = dates[dates.length - 1];
    while (currentStudentIdx < selectedMahasiswaIds.value.length) {
      const mhsId = selectedMahasiswaIds.value[currentStudentIdx];
      mhsTimeConfig.value[mhsId].tanggal = lastDate;
      currentStudentIdx++;
    }
  }
};

watch([globalTanggal, () => [...selectedMahasiswaIds.value], inputDailyLimit], () => {
  distributeDates();
}, { deep: true });

const activeDatePicker = ref<'global' | number | null>(null)

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const openCalendar = (id: 'global' | number, currentDateValue: string) => {
  if (activeDatePicker.value === id) {
    activeDatePicker.value = null;
    return;
  }
  activeDatePicker.value = id;

  if (currentDateValue) {
    const d = new Date(currentDateValue);
    currentMonth.value = d.getMonth();
    currentYear.value = d.getFullYear();
  } else {
    const d = new Date();
    currentMonth.value = d.getMonth();
    currentYear.value = d.getFullYear();
  }
}

const blankDays = computed(() => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay();
  return Array.from({ length: firstDayOfMonth }, (_, i) => i);
})

const daysInMonth = computed(() => {
  const days = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
})

const changeMonth = (delta: number) => {
  let newMonth = currentMonth.value + delta;
  let newYear = currentYear.value;
  if (newMonth < 0) { newMonth = 11; newYear--; }
  else if (newMonth > 11) { newMonth = 0; newYear++; }
  currentMonth.value = newMonth;
  currentYear.value = newYear;
}

const selectDate = (id: 'global' | number, day: number) => {
  const m = String(currentMonth.value + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  const formattedDate = `${currentYear.value}-${m}-${d}`;

  if (id === 'global') {
    const index = globalTanggal.value.indexOf(formattedDate);
    if (index === -1) {
      globalTanggal.value.push(formattedDate);
    } else {
      globalTanggal.value.splice(index, 1);
    }
  } else {
    if (!mhsTimeConfig.value[id]) {
      mhsTimeConfig.value[id] = { tanggal: '' };
    }
    mhsTimeConfig.value[id].tanggal = formattedDate;
    activeDatePicker.value = null;
  }
}

const formatDateDisplay = (dateString: string) => {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('-');
  return `${d} ${monthNames[parseInt(m) - 1]} ${y}`;
}

const formatSesiDisplay = (sesi: string) => {
  if (!sesi) return '';
  const mapWaktu: Record<string, string> = {
    '1': 'Sesi 1 (08:00 - 10:00)',
    '2': 'Sesi 2 (10:00 - 12:00)',
    '3': 'Sesi 3 (13:00 - 15:00)',
    '4': 'Sesi 4 (15:00 - 17:00)'
  };
  return mapWaktu[sesi] || `Sesi ${sesi}`;
}

const isToday = (day: number) => {
  const today = new Date();
  return today.getDate() === day && today.getMonth() === currentMonth.value && today.getFullYear() === currentYear.value;
}

const isSelected = (id: 'global' | number, day: number) => {
  const m = String(currentMonth.value + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  const checkDate = `${currentYear.value}-${m}-${d}`;

  if (id === 'global') {
    return globalTanggal.value.includes(checkDate);
  } else {
    return mhsTimeConfig.value[id as number]?.tanggal === checkDate;
  }
}

const mahasiswaList = ref<Mahasiswa[]>([])
const semuaRekomendasi = ref<Rekomendasi[]>([])

// TANGGAL FILTER REFS (BARU)
const selectedTanggalFilter = ref<string>('')
const isTanggalDropdownOpen = ref(false)
const tanggalDropdownRef = ref<HTMLElement | null>(null)

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

const selectFilterTanggal = (val: string) => {
  selectedTanggalFilter.value = val;
  isTanggalDropdownOpen.value = false;
}

const selectFilterMahasiswa = (val: number | '') => {
  selectedMahasiswaFilter.value = val;
  isMahasiswaDropdownOpen.value = false;
}

const handleDropdownClickOutside = (event: MouseEvent) => {
  if (mahasiswaDropdownRef.value && !mahasiswaDropdownRef.value.contains(event.target as Node)) isMahasiswaDropdownOpen.value = false;
  if (itemsPerPageDropdownRef.value && !itemsPerPageDropdownRef.value.contains(event.target as Node)) isItemsPerPageDropdownOpen.value = false;
  if (tanggalDropdownRef.value && !tanggalDropdownRef.value.contains(event.target as Node)) isTanggalDropdownOpen.value = false;

  const target = event.target as HTMLElement;
  if (!target.closest('.datepicker-container')) {
    activeDatePicker.value = null;
  }
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

const selectedTanggalLabel = computed(() => {
  if (selectedTanggalFilter.value === '') return '-- Tampilkan Semua Tanggal --';
  return formatDateDisplay(selectedTanggalFilter.value);
});

const groupedRekomendasi = computed(() => {
  const groups: Record<number, GroupedMahasiswa> = {};
  semuaRekomendasi.value.forEach(rek => {
    if (!rek.mahasiswa) return;
    if (!groups[rek.mahasiswa_id]) {
      let prodiId = getRawId(rek.mahasiswa.prodi_id);
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
        tanggal_ujian: rek.tanggal_ujian,
        sesi_waktu: rek.sesi_waktu,
        rekomendasi: []
      };
    }
    groups[rek.mahasiswa_id].rekomendasi.push(rek);
  });
  return Object.values(groups);
})

const availableDatesFilter = computed(() => {
  const dates = new Set<string>();
  groupedRekomendasi.value.forEach(group => {
    if (group.tanggal_ujian) dates.add(group.tanggal_ujian);
  });
  return Array.from(dates).sort();
});

const filteredGroups = computed(() => {
  let result = groupedRekomendasi.value;

  if (!isAdmin.value && userProdiId.value > 0) {
    result = result.filter(group => group.prodi_id === userProdiId.value);
  }

  // Filter Tanggal Baru
  if (selectedTanggalFilter.value !== '') {
    result = result.filter(group => group.tanggal_ujian === selectedTanggalFilter.value);
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

watch([searchQuery, selectedMahasiswaFilter, selectedTanggalFilter, itemsPerPage], () => { currentPage.value = 1 })

const unassignedMahasiswaList = computed(() => {
  if (!mahasiswaList.value || mahasiswaList.value.length === 0) return [];

  const mahasiswaDiProdi = isAdmin.value
    ? mahasiswaList.value
    : mahasiswaList.value.filter(m => getRawId(m.prodi_id) === userProdiId.value);

  if (mahasiswaDiProdi.length === 0) return [];

  const mahasiswaSudahMatchingIds = new Set(semuaRekomendasi.value.map(r => getRawId(r.mahasiswa_id)));

  return mahasiswaDiProdi.filter(m => !mahasiswaSudahMatchingIds.has(getRawId(m.id_mahasiswa)));
});

const filteredUnassignedMahasiswaList = computed(() => {
  if (!modalSearchQuery.value) return unassignedMahasiswaList.value;
  const q = modalSearchQuery.value.toLowerCase();
  return unassignedMahasiswaList.value.filter(m =>
    m.nama_mahasiswa.toLowerCase().includes(q) ||
    m.nim.toLowerCase().includes(q)
  );
});

const hasUnassignedMahasiswa = computed(() => unassignedMahasiswaList.value.length > 0);

const isAllModalSelected = computed(() => {
  if (filteredUnassignedMahasiswaList.value.length === 0) return false;
  return filteredUnassignedMahasiswaList.value.every(m => selectedMahasiswaIds.value.includes(m.id_mahasiswa));
});

const toggleAllModal = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.checked) {
    const idsToAdd = filteredUnassignedMahasiswaList.value.map(m => m.id_mahasiswa);
    idsToAdd.forEach(id => {
      if (!selectedMahasiswaIds.value.includes(id)) {
        selectedMahasiswaIds.value.push(id);
      }
    });
  } else {
    const idsToRemove = filteredUnassignedMahasiswaList.value.map(m => m.id_mahasiswa);
    selectedMahasiswaIds.value = selectedMahasiswaIds.value.filter(id => !idsToRemove.includes(id));
  }
}

watch(unassignedMahasiswaList, (newList) => {
  const newConfig = { ...mhsTimeConfig.value };
  newList.forEach(mhs => {
    if (!newConfig[mhs.id_mahasiswa]) {
      newConfig[mhs.id_mahasiswa] = { tanggal: '' };
    }
  });
  mhsTimeConfig.value = newConfig;
}, { immediate: true, deep: true });

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
        }
      }
    }
  } catch (error) {
    console.error("Gagal mendeteksi identitas Kaprodi:", error);
  }
}

const openGenerateModal = () => {
  selectedMahasiswaIds.value = [];
  globalTanggal.value = [];
  modalSearchQuery.value = '';
  activeDatePicker.value = null;
  isGenerateModalOpen.value = true;
  fetchCapacityInfo();
}

const capacityErrors = computed(() => {
  const errors: string[] = [];
  if (capacityInfo.value.totalDosen === 0) return errors;

  const numDays = Math.max(1, globalTanggal.value.length);
  const totalCapacity = numDays * inputDailyLimit.value;

  if (globalTanggal.value.length === 0 && selectedMahasiswaIds.value.length > 0) {
    errors.push("Silakan pilih minimal 1 tanggal pelaksanaan.");
    return errors;
  }

  if (selectedMahasiswaIds.value.length > totalCapacity) {
    errors.push(`Kapasitas tidak cukup! ${selectedMahasiswaIds.value.length} Mahasiswa butuh minimal ${Math.ceil(selectedMahasiswaIds.value.length / inputDailyLimit.value)} hari ujian (Maks ${inputDailyLimit.value} Mhs/hari). Silakan tambah tanggal seleksi.`);
  }

  if (selectedMahasiswaIds.value.length > capacityInfo.value.globalCapacity) {
    errors.push(`Total mahasiswa melampaui sisa kuota penguji se-Prodi (${capacityInfo.value.globalCapacity} Mhs).`);
  }

  return errors;
});

const isSubmitDisabled = computed(() => {
  const hasMissingDates = selectedMahasiswaIds.value.some(id => !mhsTimeConfig.value[id]?.tanggal);
  return isGenerating.value || selectedMahasiswaIds.value.length === 0 || capacityErrors.value.length > 0 || hasMissingDates;
});

const closeGenerateModal = () => { isGenerateModalOpen.value = false; }

const submitGeneratePso = async () => {
  isGenerating.value = true;
  try {
    const payload = {
      ...psoParams.value,
      prodi_id: !isAdmin.value && userProdiId.value > 0 ? userProdiId.value : undefined,
      data_generate: selectedMahasiswaIds.value.map(id => ({ id_mahasiswa: id })),
      tanggal_pool: globalTanggal.value,
      max_mhs_per_day: inputDailyLimit.value,
      max_dosen_per_day: inputDosenDailyLimit.value
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

const exportToExcel = () => {
  if (filteredGroups.value.length === 0) {
    showAlert('warning', 'Data Kosong', 'Tidak ada data untuk diekspor.');
    return;
  }

  const excelData: Record<string, string | number>[] = [];
  let no = 1;

  filteredGroups.value.forEach(group => {
    group.rekomendasi.forEach((rek, index) => {
      const isFirstRow = index === 0;

      const tanggalText = group.tanggal_ujian ? formatDateDisplay(group.tanggal_ujian) : 'Belum Ditentukan';
      const sesiText = group.sesi_waktu ? formatSesiDisplay(group.sesi_waktu) : '-';

      excelData.push({
        'No': isFirstRow ? no : '',
        'Nama Mahasiswa': isFirstRow ? group.nama_mahasiswa : '',
        'NIM': isFirstRow ? group.nim : '',
        'Judul TA': isFirstRow ? (group.judul_ta || 'Belum ada judul') : '',
        'Topik TA': isFirstRow ? (group.nama_topik || 'Belum ada topik') : '',
        'Tanggal Pelaksanaan': isFirstRow ? tanggalText : '',
        'Sesi Waktu': isFirstRow ? sesiText : '',
        'Rank': rek.rank,
        'Dosen Rekomendasi': rek.dosen?.nama_dosen || '',
        'NIDN Dosen': rek.dosen?.nidn || '',
        'Nilai Fitness (%)': rek.nilai_fitness
      });
    });
    no++;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Rekomendasi");

  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Data_Rekomendasi_TA_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, fileName);

  showAlert('success', 'Berhasil', 'Data berhasil diekspor ke format .xlsx asli!');
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

:global(.apexcharts-tooltip) { border-radius: 0.75rem !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; padding: 0 !important; overflow: hidden !important; transition: all 0.2s ease !important; }
:global(.apexcharts-tooltip), :global(.apexcharts-tooltip.apexcharts-theme-light) { background: #ffffff !important; border: 1px solid #e5e7eb !important; color: #1f2937 !important; }
:global(.dark .apexcharts-tooltip), :global(.apexcharts-tooltip.apexcharts-theme-dark) { background: #1f2937 !important; border: 1px solid #374151 !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important; color: #f9fafb !important; }
:global(.apexcharts-tooltip-title) { font-family: inherit !important; font-size: 0.75rem !important; font-weight: 700 !important; padding: 0.625rem 0.75rem !important; margin-bottom: 0 !important; background: transparent !important; border-bottom: 1px solid #e5e7eb !important; color: inherit !important; }
:global(.dark .apexcharts-tooltip-title), :global(.apexcharts-tooltip.apexcharts-theme-dark .apexcharts-tooltip-title) { border-bottom: 1px solid #374151 !important; }
:global(.apexcharts-tooltip-series-group) { padding: 0.625rem 0.75rem !important; background: transparent !important; display: flex !important; align-items: center !important; justify-content: space-between !important; }
:global(.apexcharts-tooltip-text) { font-family: inherit !important; font-size: 0.75rem !important; color: inherit !important; }
:global(.apexcharts-tooltip-text-y-label) { color: #6b7280 !important; }
:global(.dark .apexcharts-tooltip-text-y-label), :global(.apexcharts-tooltip.apexcharts-theme-dark .apexcharts-tooltip-text-y-label) { color: #9ca3af !important; }
:global(.apexcharts-tooltip-text-y-value) { color: #3b82f6 !important; font-weight: 700 !important; margin-left: 0.5rem !important; }
:global(.dark .apexcharts-tooltip-text-y-value), :global(.apexcharts-tooltip.apexcharts-theme-dark .apexcharts-tooltip-text-y-value) { color: #60a5fa !important; }
.custom-date-wrapper input[type="date"]::-webkit-calendar-picker-indicator { display: none !important; -webkit-appearance: none; }
</style>
