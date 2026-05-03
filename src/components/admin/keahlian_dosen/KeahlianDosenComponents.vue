<template>
  <div class="relative w-full">
    <div v-if="alert.show"
      class="fixed top-20 right-5 z-[99999] w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div class="flex flex-col gap-5 mb-6 p-5 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50 shadow-sm relative z-20">

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-sm text-gray-500 dark:text-gray-400">Tampilkan</span>
          <select v-model="itemsPerPage"
            class="h-9 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:bg-gray-800">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
          <span class="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">data</span>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button v-if="isAdmin" @click="syncAllScholar" :disabled="isSyncingAll"
            class="flex-1 sm:flex-none flex items-center justify-center px-4 h-10 text-sm font-medium text-brand-600 transition rounded-lg bg-brand-50 border border-brand-200 hover:bg-brand-100 shadow-theme-xs disabled:opacity-50 dark:bg-brand-900/20 dark:border-brand-800/50 dark:text-brand-400 dark:hover:bg-brand-900/40">
            <svg v-if="!isSyncingAll" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
            <svg v-else class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span class="whitespace-nowrap">{{ isSyncingAll ? 'Proses Sync...' : 'Sync Semua Scholar' }}</span>
          </button>

          <button v-if="isAdmin" @click="openAddModal"
            class="flex-1 sm:flex-none flex items-center justify-center px-5 h-10 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 shadow-theme-xs dark:bg-brand-600 dark:hover:bg-brand-500">
            <svg class="w-4 h-4 mr-2 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.8333 9.16667V2.5H9.16667V9.16667H2.5V10.8333H9.16667V17.5H10.8333V10.8333H17.5V9.16667H10.8333Z" />
            </svg>
            <span class="whitespace-nowrap">Tambah Keahlian</span>
          </button>
        </div>
      </div>

      <hr class="border-gray-100 dark:border-gray-800" />

      <div class="flex flex-col lg:flex-row items-center gap-4">
        <div class="relative w-full lg:w-1/3" ref="grupRisetDropdownRef">
          <button type="button" @click="isGrupRisetDropdownOpen = !isGrupRisetDropdownOpen"
            class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="truncate pr-4 font-medium">{{ selectedGrupRisetLabel }}</span>
            <svg
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': isGrupRisetDropdownOpen }]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isGrupRisetDropdownOpen"
              class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                <li @click="selectFilterGrupRiset('')"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">
                  Semua Grup Riset
                </li>
                <li v-for="grup in grupRisetList" :key="grup" @click="selectFilterGrupRiset(grup)"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">
                  {{ grup }}
                </li>
              </ul>
            </div>
          </transition>
        </div>

        <!-- Filter Topik Keahlian -->
        <div class="relative w-full lg:w-1/3" ref="topikFilterDropdownRef">
          <button type="button" @click="isTopikFilterDropdownOpen = !isTopikFilterDropdownOpen"
            class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="truncate pr-4 font-medium">{{ selectedTopikFilterLabel }}</span>
            <svg
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': isTopikFilterDropdownOpen }]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isTopikFilterDropdownOpen"
              class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                <li @click="selectFilterTopik('')"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">
                  Semua Topik Keahlian
                </li>
                <li v-for="topik in topikList" :key="topik.id_topik" @click="selectFilterTopik(topik.id_topik)"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">
                  {{ topik.nama_topik }}
                </li>
              </ul>
            </div>
          </transition>
        </div>

        <!-- Kolom Pencarian -->
        <div class="relative w-full lg:w-1/3">
          <input v-model="searchKeahlianQuery" type="text" placeholder="Cari nama dosen..."
            class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Tabel Data -->
    <div
      class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50 shadow-sm relative z-10">
      <div class="w-full overflow-visible">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02]">
              <th class="px-5 py-3 w-16 sm:px-6 rounded-tl-xl">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No</p>
              </th>
              <th class="px-5 py-3 sm:px-6 w-1/4">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Dosen & Grup</p>
              </th>
              <th class="px-5 py-3 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Topik Keahlian & Bukti Scholar</p>
              </th>
              <th v-if="isAdmin" class="px-5 py-3 text-center w-52 sm:px-6 rounded-tr-xl">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading">
              <td :colspan="isAdmin ? 4 : 3" class="px-5 py-12 text-center text-gray-500 text-theme-sm">
                <div class="flex items-center justify-center gap-3">
                  <svg class="animate-spin h-5 w-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Memuat data keahlian dosen...
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedGroups.length === 0">
              <td :colspan="isAdmin ? 4 : 3" class="px-5 py-12 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                Belum ada data atau dosen tidak ditemukan sesuai filter.
              </td>
            </tr>

            <tr v-else v-for="(group, index) in paginatedGroups" :key="group.dosen_id"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
              <td class="px-5 py-4 sm:px-6 align-middle">
                <span class="block font-medium text-gray-800 text-theme-sm dark:text-gray-300">{{ (currentPage - 1) *
                  itemsPerPage + index + 1 }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6 align-middle">
                <span class="block font-semibold text-gray-800 text-theme-sm dark:text-gray-200">{{ group.nama_dosen
                }}</span>
                <span class="block text-[11px] text-gray-500 dark:text-gray-400 mt-1">{{ group.grup_riset || 'Tidak Ada Grup' }}</span>
              </td>

              <!-- BAGIAN TOPIK KEAHLIAN & TOOLTIP  -->
              <td class="px-5 py-4 sm:px-6 align-middle">
                <div class="flex flex-wrap gap-2">
                  <div v-for="keahlian in group.keahlian" :key="keahlian.id_keahlian"
                    class="group relative inline-flex items-center justify-center">

                    <span
                      class="inline-flex items-center gap-1.5 justify-center rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 cursor-help transition-all hover:bg-blue-100 hover:border-blue-300 shadow-sm relative z-10 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-800/50">
                      <svg class="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                        </path>
                      </svg>
                      {{ keahlian.topik_ta?.nama_topik || '-' }}
                    </span>

                    <!-- TOOLTIP WRAPPER (Penahan Posisi 100% Tengah) -->
                    <div v-if="keahlian.keyword_jurnal"
                      class="absolute left-1/2 -translate-x-1/2 hidden group-hover:block z-[9999] w-[340px] pointer-events-none"
                      :class="index < (itemsPerPage / 2) ? 'top-full pt-2' : 'bottom-full pb-2'">

                      <!-- TOOLTIP BOX -->
                      <div
                        class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl relative"
                        :class="index < (itemsPerPage / 2) ? 'animate-fade-in-down' : 'animate-fade-in-up'">

                        <div
                          class="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transform rotate-45"
                          :class="index < (itemsPerPage / 2) ? 'top-0 -mt-1.5 border-t border-l' : 'bottom-0 -mb-1.5 border-b border-r'">
                        </div>

                        <!-- Header Tooltip -->
                        <div
                          class="relative z-10 flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 rounded-t-xl border-b border-gray-100 dark:border-gray-700">
                          <svg class="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
                            </path>
                          </svg>
                          <span class="font-bold text-xs text-gray-700 dark:text-gray-300">Sumber Validasi Keahlian</span>
                        </div>

                        <!-- Body Tooltip -->
                        <div class="relative z-10 p-3 bg-white dark:bg-gray-800 rounded-b-xl">
                          <ul v-if="!keahlian.keyword_jurnal.includes('Manual')" class="flex flex-col gap-2.5">
                            <li v-for="(jurnal, i) in parseJurnal(keahlian.keyword_jurnal)" :key="i"
                              class="text-[11px] text-gray-600 dark:text-gray-400 leading-snug flex items-start gap-2">
                              <span v-if="!jurnal.startsWith('...')" class="text-blue-500 dark:text-blue-400 mt-[3px] text-[8px]">●</span>
                              <span
                                :class="['text-left font-medium', { 'italic text-blue-500 dark:text-blue-400 font-semibold text-center w-full mt-1': jurnal.startsWith('...') }]">{{
                                  jurnal }}</span>
                            </li>
                          </ul>
                          <p v-else class="text-[11px] text-gray-500 dark:text-gray-400 italic text-center py-2">
                            {{ keahlian.keyword_jurnal }}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </td>

              <td v-if="isAdmin" class="px-5 py-4 text-center sm:px-6 align-middle">
                <div class="flex justify-center gap-2">
                  <!-- Tombol Tabel Diperbarui untuk Dark Mode -->
                  <button @click="syncOneScholar(group.dosen_id)" :disabled="isSyncingId === group.dosen_id"
                    class="flex items-center justify-center w-8 h-8 text-brand-600 bg-brand-50 border border-brand-200 hover:bg-brand-100 rounded-full transition-colors disabled:opacity-50 dark:bg-gray-800 dark:text-brand-400 dark:border-gray-700 dark:hover:bg-gray-700"
                    title="Sync Scholar">
                    <svg v-if="isSyncingId !== group.dosen_id" class="w-4 h-4" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                      </path>
                    </svg>
                    <svg v-else class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                  </button>
                  <button @click="openEditModal(group)"
                    class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-blue-600 shadow-theme-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                    title="Edit">
                    <svg class="fill-current w-4 h-4" viewBox="0 0 18 18">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" />
                    </svg>
                    Edit
                  </button>
                  <button @click="openDeleteModal(group)"
                    class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-red-600 shadow-theme-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-400"
                    title="Hapus">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path
                        d="M19 6.99998H16V5.99998C16 4.89541 15.1046 3.99998 14 3.99998H10C8.89543 3.99998 8 4.89541 8 5.99998V6.99998H5V8.99998H6V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V8.99998H19V6.99998ZM10 5.99998H14V6.99998H10V5.99998ZM16 19H8V8.99998H16V19Z" />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination v-if="!isLoading && totalItems > 0" :current-page="currentPage" :total-items="totalItems"
      :items-per-page="itemsPerPage" @update:currentPage="currentPage = $event" class="mt-4" />

    <!-- MODAL TAMBAH/EDIT -->
    <Modal v-if="isModalOpen" @close="closeModal">
      <div
        class="relative w-full max-w-[600px] rounded-3xl bg-white p-4 dark:bg-gray-900 border dark:border-gray-700 lg:p-11 mx-auto mt-10 shadow-2xl">
        <button @click="closeModal"
          class="transition-color absolute right-5 top-5 z-[100] flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" />
          </svg>
        </button>

        <div class="px-2 pr-14 mb-6 mt-4">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {{ isEditing ? 'Edit Keahlian Dosen' : 'Tambah Keahlian Dosen' }}
          </h4>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col px-2 pb-10">
          <div class="mb-5 relative z-[60]" ref="dosenDropdownContainer">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Pilih Dosen (Ketik untuk
              mencari) <span class="text-red-500">*</span></label>
            <div v-if="!isEditing" class="relative">
              <input type="text" v-model="dosenSearchTerm" @focus="showDosenDropdown = true"
                placeholder="Ketik nama dosen..."
                class="dark:bg-gray-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-gray-200"
                required />
              <ul v-if="showDosenDropdown && filteredDosenOptions.length > 0"
                class="absolute w-full mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-xl dark:border-gray-700">
                <li v-for="dosen in filteredDosenOptions" :key="dosen.id_dosen" @click="selectDosen(dosen)"
                  class="px-4 py-2 cursor-pointer hover:bg-brand-50 text-sm text-gray-800 border-b border-gray-100 last:border-0 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700">
                  {{ dosen.nama_dosen }}</li>
              </ul>
            </div>
            <input v-else type="text" :value="dosenSearchTerm" disabled
              class="dark:bg-gray-800 h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 shadow-theme-xs cursor-not-allowed dark:border-gray-700 dark:text-gray-400" />
          </div>

          <div class="mb-6 relative z-[50]" ref="topikDropdownContainer">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Pilih Topik Keahlian (Bisa
              Lebih Dari Satu) <span class="text-red-500">*</span></label>

            <div @click="showTopikDropdown = !showTopikDropdown"
                 class="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-2 pr-10 py-1.5 text-sm text-gray-800 shadow-theme-xs cursor-pointer flex flex-wrap gap-2 items-center relative transition-colors focus-within:border-brand-300 dark:bg-gray-800 dark:border-gray-700">

              <span v-if="formData.topik_ids.length === 0" class="text-gray-400 px-2 py-1">Pilih satu atau beberapa topik...</span>

              <span v-for="id in formData.topik_ids" :key="id"
                    class="inline-flex items-center gap-1.5 rounded-md bg-brand-50 pl-2.5 py-0.5 text-xs font-medium text-brand-700 border border-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800">
                {{ getTopikName(id) }}
                <button @click.stop="toggleTopik(id)" type="button"
                        class="p-1 hover:bg-brand-200 hover:text-red-500 rounded-r-md transition-colors text-brand-500 dark:hover:bg-brand-800 dark:text-brand-400 focus:outline-none">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </span>

              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg class="w-5 h-5 transition-transform duration-200" :class="{'rotate-180': showTopikDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
              <div v-if="showTopikDropdown" class="absolute z-[100] w-full mt-1 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 custom-scrollbar">
                <div v-for="topik in topikList" :key="topik.id_topik" @click="toggleTopik(topik.id_topik)"
                     class="px-4 py-2.5 cursor-pointer hover:bg-brand-50 text-sm text-gray-800 border-b border-gray-100 last:border-0 flex items-center justify-between dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-700">
                  <span>{{ topik.nama_topik }}</span>
                  <svg v-if="formData.topik_ids.includes(topik.id_topik)" class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
            </transition>
          </div>

          <div class="flex items-center gap-3 lg:justify-end mt-4">
            <button @click="closeModal" type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
            <button type="submit" :disabled="isSaving || !formData.dosen_id || formData.topik_ids.length === 0"
              class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 sm:w-auto dark:bg-brand-600 dark:hover:bg-brand-500">{{
                isSaving ? 'Menyimpan...' : 'Simpan' }}</button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Modal Hapus -->
    <Modal v-if="isDeleteModalOpen" @close="closeDeleteModal">
      <div
        class="w-full max-w-[400px] rounded-3xl bg-white p-6 dark:bg-gray-900 border dark:border-gray-700 text-center mx-auto mt-20 z-50 shadow-xl">
        <h4 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">Konfirmasi Hapus</h4>
        <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">Apakah Anda yakin ingin menghapus <strong>SELURUH
            keahlian</strong> dari dosen <br /><strong class="text-gray-800 dark:text-white text-lg">"{{
              itemToDeleteGroup?.nama_dosen }}"</strong>?</p>
        <div class="flex items-center justify-center gap-3">
          <button @click="closeDeleteModal"
            class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">Batal</button>
          <button @click="confirmDelete" :disabled="isDeleting"
            class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto">{{
              isDeleting ? 'Menghapus...' : 'Ya, Hapus Semua' }}</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import Alert from '@/components/ui/Alert.vue'
import Pagination from '@/components/pagination/Pagination.vue'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface Dosen { id_dosen: number; nama_dosen: string; url_scholar?: string; grup_riset?: string; }
interface Topik { id_topik: number; nama_topik: string; }
interface Keahlian { id_keahlian: number; dosen_id: number; topik_id: number; keyword_jurnal?: string; dosen?: Dosen; topik_ta?: Topik; }

interface GroupedKeahlian {
  dosen_id: number;
  nama_dosen: string;
  url_scholar?: string;
  grup_riset?: string;
  keahlian: Keahlian[];
}

const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })
const showAlert = (type: AlertVariant, title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  setTimeout(() => { alert.value.show = false }, 3500)
}

const userRoles = ref<string[]>([])
const isAdmin = computed(() => userRoles.value.some(role => role.toLowerCase() === 'admin'))

const keahlianList = ref<Keahlian[]>([])
const dosenList = ref<Dosen[]>([])
const topikList = ref<Topik[]>([])
const isLoading = ref(true)

const isSyncingAll = ref(false)
const isSyncingId = ref<number | null>(null)

const searchKeahlianQuery = ref('')
const filterTopik = ref<number | ''>('')
const filterGrupRiset = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const isTopikFilterDropdownOpen = ref(false)
const topikFilterDropdownRef = ref<HTMLElement | null>(null)

const isGrupRisetDropdownOpen = ref(false)
const grupRisetDropdownRef = ref<HTMLElement | null>(null)

const dosenDropdownContainer = ref<HTMLElement | null>(null)
const topikDropdownContainer = ref<HTMLElement | null>(null)

const grupRisetList = computed(() => {
  const groups = dosenList.value.map(d => d.grup_riset).filter(Boolean) as string[];
  return [...new Set(groups)].sort();
})

const selectedGrupRisetLabel = computed(() => {
  return filterGrupRiset.value === '' ? 'Semua Grup Riset' : filterGrupRiset.value;
})

const selectFilterGrupRiset = (val: string) => {
  filterGrupRiset.value = val;
  isGrupRisetDropdownOpen.value = false;
}

const selectedTopikFilterLabel = computed(() => {
  if (filterTopik.value === '') return 'Semua Topik Keahlian';
  const found = topikList.value.find(t => t.id_topik === filterTopik.value);
  return found ? found.nama_topik : 'Semua Topik Keahlian';
})

const selectFilterTopik = (val: number | '') => {
  filterTopik.value = val;
  isTopikFilterDropdownOpen.value = false;
}

const groupedKeahlian = computed(() => {
  const groups: Record<number, GroupedKeahlian> = {}
  keahlianList.value.forEach(item => {
    if (!item.dosen) return;
    if (!groups[item.dosen_id]) {
      groups[item.dosen_id] = {
        dosen_id: item.dosen_id,
        nama_dosen: item.dosen.nama_dosen,
        url_scholar: item.dosen.url_scholar,
        grup_riset: item.dosen.grup_riset,
        keahlian: []
      }
    }
    groups[item.dosen_id].keahlian.push(item)
  })
  return Object.values(groups)
})

const filteredGroupedKeahlian = computed(() => {
  let result = groupedKeahlian.value;

  if (filterGrupRiset.value !== '') {
    result = result.filter(group => group.grup_riset === filterGrupRiset.value);
  }
  if (filterTopik.value !== '') {
    result = result.filter(group => group.keahlian.some(k => k.topik_id === filterTopik.value));
  }
  if (searchKeahlianQuery.value) {
    const q = searchKeahlianQuery.value.toLowerCase();
    result = result.filter(group => group.nama_dosen.toLowerCase().includes(q));
  }

  return result;
})

const totalItems = computed(() => filteredGroupedKeahlian.value.length)

const paginatedGroups = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredGroupedKeahlian.value.slice(start, end)
})

watch([searchKeahlianQuery, filterTopik, filterGrupRiset, itemsPerPage], () => {
  currentPage.value = 1
})

const formatJudulJurnal = (judul: string) => {
  if (!judul) return '';
  return judul.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

const parseJurnal = (keywordStr?: string) => {
  if (!keywordStr) return [];
  const list = keywordStr.split(/\s*[|;]\s*/).filter(Boolean).map(formatJudulJurnal);

  if (list.length > 3) {
    const displayList = list.slice(0, 3);
    displayList.push(`... dan ${list.length - 3} publikasi ilmiah lainnya`);
    return displayList;
  }
  return list;
}

const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const formData = ref({ dosen_id: '' as number | '', topik_ids: [] as number[] })
const dosenSearchTerm = ref('')
const showDosenDropdown = ref(false)
const showTopikDropdown = ref(false)

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (dosenDropdownContainer.value && !dosenDropdownContainer.value.contains(target)) showDosenDropdown.value = false
  if (topikDropdownContainer.value && !topikDropdownContainer.value.contains(target)) showTopikDropdown.value = false
  if (topikFilterDropdownRef.value && !topikFilterDropdownRef.value.contains(target)) isTopikFilterDropdownOpen.value = false
  if (grupRisetDropdownRef.value && !grupRisetDropdownRef.value.contains(target)) isGrupRisetDropdownOpen.value = false
}

onMounted(() => {
  try { userRoles.value = JSON.parse(localStorage.getItem('userRoles') || '[]') }
  catch { userRoles.value = (localStorage.getItem('userRoles') || '').split(',').map(r => r.trim()) }
  document.addEventListener('mousedown', handleClickOutside)
  fetchKeahlian()
  fetchDosenList()
  fetchTopikList()
})

onBeforeUnmount(() => { document.removeEventListener('mousedown', handleClickOutside) })

const filteredDosenOptions = computed(() => {
  const dosenIdsWithKeahlian = groupedKeahlian.value.map(group => group.dosen_id);
  let availableDosen = dosenList.value.filter(dosen =>
    !dosenIdsWithKeahlian.includes(dosen.id_dosen) || (isEditing.value && dosen.id_dosen === formData.value.dosen_id)
  );
  if (dosenSearchTerm.value) {
    const term = dosenSearchTerm.value.toLowerCase();
    availableDosen = availableDosen.filter(d => d.nama_dosen.toLowerCase().includes(term));
  }
  return availableDosen;
})

const selectDosen = (dosen: Dosen) => { formData.value.dosen_id = dosen.id_dosen; dosenSearchTerm.value = dosen.nama_dosen; showDosenDropdown.value = false }
const toggleTopik = (id: number) => { const index = formData.value.topik_ids.indexOf(id); if (index === -1) formData.value.topik_ids.push(id); else formData.value.topik_ids.splice(index, 1) }
const getTopikName = (id: number) => { const topik = topikList.value.find(t => t.id_topik === id); return topik ? topik.nama_topik : '' }

const isDeleteModalOpen = ref(false)
const itemToDeleteGroup = ref<GroupedKeahlian | null>(null)
const isDeleting = ref(false)

const fetchKeahlian = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:3000/api/keahlian-dosen', { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (result.success) keahlianList.value = result.data.rows || result.data
  } catch (error) { console.error("Gagal fetch data keahlian:", error) } finally { isLoading.value = false }
}

const fetchDosenList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/dosen', { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (result.success) dosenList.value = result.data.rows || result.data
  } catch (error) { console.error("Gagal fetch dosen:", error) }
}

const fetchTopikList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/topik-ta', { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (result.success) topikList.value = result.data
  } catch (error) { console.error("Gagal fetch topik:", error) }
}

const syncOneScholar = async (id: number) => {
  isSyncingId.value = id
  try {
    const response = await fetch(`http://localhost:3000/api/keahlian-dosen/sync-scholar/${id}`, { method: 'POST', credentials: 'include' })
    const result = await response.json()

    const customMessage = result.data?.message || result.message || 'Sinkronisasi dari Google Scholar selesai.';

    if (response.ok) {
      await fetchKeahlian();

      if (customMessage.toLowerCase().includes('sinkron') || customMessage.toLowerCase().includes('terbaru')) {
        showAlert('info', 'Info Sinkronisasi', customMessage);
      } else {
        showAlert('success', 'Berhasil Diperbarui!', customMessage);
      }
    } else {
      showAlert('error', 'Gagal!', customMessage);
    }
  } catch (error) {
    console.error("Sync error:", error);
    showAlert('error', 'Error!', 'Gagal menghubungi server.')
  } finally {
    isSyncingId.value = null
  }
}

const syncAllScholar = async () => {
  isSyncingAll.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/keahlian-dosen/sync-scholar-all`, { method: 'POST', credentials: 'include' })
    const result = await response.json()

    const customMessage = result.data?.message || result.message || 'Proses sinkronisasi massal selesai.';

    if (response.ok) {
      await fetchKeahlian();
      if (customMessage.includes('0 profil') || customMessage.toLowerCase().includes('sudah yang paling terbaru')) {
        showAlert('info', 'Info Sinkronisasi', 'Semua data keahlian dosen sudah sinkron. Tidak ada perubahan baru dari Google Scholar.');
      } else {
        showAlert('success', 'Berhasil Diperbarui!', customMessage);
      }
    } else {
      showAlert('error', 'Gagal!', customMessage);
    }
  } catch (error) {
    console.error("Sync All error:", error);
    showAlert('error', 'Error!', 'Gagal menghubungi server.')
  } finally {
    isSyncingAll.value = false
  }
}

const openAddModal = () => { isEditing.value = false; formData.value = { dosen_id: '', topik_ids: [] }; dosenSearchTerm.value = ''; showDosenDropdown.value = false; showTopikDropdown.value = false; isModalOpen.value = true }
const openEditModal = (group: GroupedKeahlian) => { isEditing.value = true; formData.value = { dosen_id: group.dosen_id, topik_ids: group.keahlian.map(k => k.topik_id) }; dosenSearchTerm.value = group.nama_dosen; showDosenDropdown.value = false; showTopikDropdown.value = false; isModalOpen.value = true }
const closeModal = () => { isModalOpen.value = false; showDosenDropdown.value = false; showTopikDropdown.value = false }

const submitForm = async () => {
  if (!formData.value.dosen_id || formData.value.topik_ids.length === 0) { showAlert('warning', 'Peringatan', 'Silakan pilih dosen dan minimal 1 topik.'); return; }
  isSaving.value = true
  try {
    const url = isEditing.value ? `http://localhost:3000/api/keahlian-dosen/${formData.value.dosen_id}` : 'http://localhost:3000/api/keahlian-dosen'
    const method = isEditing.value ? 'PUT' : 'POST'
    const response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ dosen_id: Number(formData.value.dosen_id), topik_ids: formData.value.topik_ids }) })
    const result = await response.json()
    if (response.ok) { closeModal(); fetchKeahlian(); showAlert('success', 'Berhasil!', `Keahlian Dosen berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}.`) }
    else { showAlert('error', 'Gagal!', result.message || 'Terdapat kesalahan saat menyimpan data.') }
  } catch (error) { console.error("Error simpan data:", error); showAlert('error', 'Gagal Server!', 'Pastikan server backend sedang menyala.') }
  finally { isSaving.value = false }
}

const openDeleteModal = (group: GroupedKeahlian) => { itemToDeleteGroup.value = group; isDeleteModalOpen.value = true }
const closeDeleteModal = () => { isDeleteModalOpen.value = false; itemToDeleteGroup.value = null }

const confirmDelete = async () => {
  if (itemToDeleteGroup.value === null) return;
  isDeleting.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/keahlian-dosen/${itemToDeleteGroup.value.dosen_id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
    if (response.ok) { closeDeleteModal(); fetchKeahlian(); showAlert('success', 'Dihapus!', 'Seluruh Keahlian Dosen berhasil dihapus.') }
    else { showAlert('error', 'Gagal!', 'Terdapat kesalahan saat menghapus data.') }
  } catch (error) { console.error("Error hapus data:", error) }
  finally { isDeleting.value = false }
}
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.2s ease-out forwards;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #94a3b8;
}
</style>
