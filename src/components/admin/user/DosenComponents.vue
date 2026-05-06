<template>
  <div class="relative">
    <div v-if="alert.show" class="fixed top-20 right-5 z-[99999] w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <!-- Header Filter & Tambah -->
    <div class="flex flex-col gap-4 mb-6 p-5 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50 shadow-sm relative z-20">

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">

        <!-- CUSTOM DROPDOWN TAMPILKAN DATA -->
        <div class="flex items-center gap-2 w-full sm:w-auto" ref="itemsPerPageDropdownRef">
          <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Tampilkan</span>
          <div class="relative">
            <button type="button" @click="isItemsPerPageDropdownOpen = !isItemsPerPageDropdownOpen"
              class="flex items-center justify-between h-9 w-[70px] rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
              <span class="font-medium">{{ itemsPerPage }}</span>
              <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': isItemsPerPageDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
              <div v-if="isItemsPerPageDropdownOpen" class="absolute z-[100] w-full min-w-[70px] mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden left-0">
                <ul class="py-1">
                  <li v-for="val in [5, 10, 20, 50]" :key="val" @click="selectItemsPerPage(val)"
                    class="px-3 py-2 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    :class="itemsPerPage === val ? 'text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'">
                    {{ val }}
                  </li>
                </ul>
              </div>
            </transition>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">data</span>
        </div>

        <button v-if="isAdmin" @click="openAddModal" class="flex items-center justify-center px-5 h-10 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 shadow-theme-xs dark:bg-brand-600 dark:hover:bg-brand-500 w-full sm:w-auto flex-shrink-0">
          <svg class="w-4 h-4 mr-2 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.8333 9.16667V2.5H9.16667V9.16667H2.5V10.8333H9.16667V17.5H10.8333V10.8333H17.5V9.16667H10.8333Z" /></svg>
          Tambah Dosen
        </button>
      </div>

      <hr class="border-gray-100 dark:border-gray-800" />

      <!-- Filter Pencarian & Kategori -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="relative w-full">
          <input v-model="searchQuery" type="text" placeholder="Cari nama, NIDN..."
            class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div class="relative w-full" ref="prodiDropdownRef">
          <button type="button" @click="isProdiDropdownOpen = !isProdiDropdownOpen"
            class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="truncate pr-4 font-medium">{{ selectedProdiLabel }}</span>
            <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0', { 'rotate-180': isProdiDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
            <div v-if="isProdiDropdownOpen" class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                <li @click="selectFilterProdi('')" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">Semua Prodi</li>
                <li v-for="prodi in listProdi" :key="prodi.id_prodi" @click="selectFilterProdi(prodi.id_prodi)" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">{{ prodi.nama_prodi }}</li>
              </ul>
            </div>
          </transition>
        </div>

        <div class="relative w-full" ref="grupRisetDropdownRef">
          <button type="button" @click="isGrupRisetDropdownOpen = !isGrupRisetDropdownOpen"
            class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="truncate pr-4 font-medium">{{ selectedGrupRisetLabel }}</span>
            <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0', { 'rotate-180': isGrupRisetDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
            <div v-if="isGrupRisetDropdownOpen" class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                <li @click="selectFilterGrupRiset('')" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">Semua Grup Riset</li>
                <li v-for="grup in dataGrupRiset" :key="grup" @click="selectFilterGrupRiset(grup)" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">{{ grup }}</li>
              </ul>
            </div>
          </transition>
        </div>

        <div class="relative w-full" ref="sortDropdownRef">
          <button type="button" @click="isSortDropdownOpen = !isSortDropdownOpen"
            class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="truncate pr-4 font-medium">{{ selectedSortLabel }}</span>
            <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0', { 'rotate-180': isSortDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
            <div v-if="isSortDropdownOpen" class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                <li @click="selectSortOrder('')" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">Urutkan Default</li>
                <li @click="selectSortOrder('asc')" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 dark:border-gray-700/50">Nama (A - Z)</li>
                <li @click="selectSortOrder('desc')" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">Nama (Z - A)</li>
              </ul>
            </div>
          </transition>
        </div>

      </div>
    </div>

    <!-- Tabel Data -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50 relative z-10">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02]">
              <th class="px-5 py-3 text-left w-16 sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No</p></th>
              <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Dosen</p></th>
              <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">NIDN</p></th>
              <th class="px-5 py-3 text-left sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Prodi</p></th>
              <th class="px-5 py-3 text-center sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Grup Riset</p></th>
              <th class="px-5 py-3 text-center sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Kuota</p></th>
              <th v-if="isAdmin" class="px-5 py-3 text-center w-32 sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading">
              <td colspan="7" class="px-5 py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400">Memuat data dosen...</td>
            </tr>
            <tr v-else-if="paginatedList.length === 0">
              <td colspan="7" class="px-5 py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400">Data tidak ditemukan sesuai filter.</td>
            </tr>

            <tr v-else v-for="(item, index) in paginatedList" :key="item.id_dosen" class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block font-medium text-gray-800 text-theme-sm dark:text-gray-300 mt-1">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block text-gray-800 text-theme-sm dark:text-gray-200 font-semibold">{{ item.nama_dosen }}</span>
                <a v-if="item.url_scholar" :href="item.url_scholar" target="_blank" class="inline-flex items-center text-[11px] text-blue-500 hover:text-blue-600 mt-1 dark:text-blue-400 dark:hover:text-blue-300">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  Google Scholar
                </a>
              </td>
              <td class="px-5 py-4 sm:px-6 align-top"><span class="block text-gray-500 text-theme-sm dark:text-gray-400 mt-1">{{ item.nidn }}</span></td>
              <td class="px-5 py-4 sm:px-6 align-top"><span class="block text-gray-500 text-theme-sm dark:text-gray-400 mt-1">{{ item.prodi?.nama_prodi || '-' }}</span></td>
              <td class="px-5 py-4 text-center sm:px-6 align-top">
                <span class="inline-flex items-center justify-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mt-1">{{ item.grup_riset || '-' }}</span>
              </td>
              <td class="px-5 py-4 text-center sm:px-6 align-top">
                <span class="inline-flex items-center justify-center rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-500 border border-brand-500/20 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800 mt-1">{{ item.kuota_menguji }}</span>
              </td>

              <td v-if="isAdmin" class="px-5 py-4 text-center sm:px-6 align-top">
                <!-- SUSUNAN TOMBOL AKSI VERTIKAL (KE BAWAH), RATA KIRI -->
                <div class="flex flex-col gap-2 w-max mx-auto mt-0.5">
                  <button @click="openDetailModal(item)" class="flex items-center justify-start w-[100px] gap-2.5 px-3.5 py-1.5 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 shadow-theme-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 dark:hover:border-emerald-800" title="Detail Dosen">
                    <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 8.11 1 12c1.73 3.89 6 7.5 11 7.5s9.27-3.61 11-7.5c-1.73-3.89-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    <span>Detail</span>
                  </button>
                  <button @click="openEditModal(item)" class="flex items-center justify-start w-[100px] gap-2.5 px-3.5 py-1.5 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-theme-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 dark:hover:border-blue-800" title="Edit">
                    <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" /></svg>
                    <span>Edit</span>
                  </button>
                  <button @click="openDeleteModal(item)" class="flex items-center justify-start w-[100px] gap-2.5 px-3.5 py-1.5 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-theme-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:hover:border-red-800" title="Hapus">
                    <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.99998H16V5.99998C16 4.89541 15.1046 3.99998 14 3.99998H10C8.89543 3.99998 8 4.89541 8 5.99998V6.99998H5V8.99998H6V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V8.99998H19V6.99998ZM10 5.99998H14V6.99998H10V5.99998ZM16 19H8V8.99998H16V19Z" /></svg>
                    <span>Delete</span>
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

    <!-- MODAL DETAIL DOSEN -->
    <Modal v-if="isDetailModalOpen" @close="closeDetailModal">
      <div
        class="relative w-full max-w-[700px] rounded-3xl bg-white p-6 dark:bg-gray-900 border dark:border-gray-700 lg:p-11 mx-auto mt-10 shadow-2xl transition-colors">
        <button @click="closeDetailModal"
          class="absolute right-5 top-5 z-[100] flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.07] dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
          <svg class="fill-current w-6 h-6" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" />
          </svg>
        </button>

        <div class="mb-6 border-b border-gray-100 pb-5 dark:border-gray-800">
          <h4 class="text-2xl font-bold text-gray-800 dark:text-white/90">Detail Informasi Dosen</h4>
        </div>

        <div class="flex flex-col gap-6" v-if="selectedDosenDetail">

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div
              class="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800/50 dark:border-gray-800">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nama Lengkap</span>
              <span class="text-[15px] font-bold text-gray-800 dark:text-gray-200">{{ selectedDosenDetail.nama_dosen
              }}</span>
            </div>

            <div
              class="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800/50 dark:border-gray-800">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nomor Induk (NIDN)</span>
              <span class="text-[15px] font-bold text-gray-800 dark:text-gray-200">{{ selectedDosenDetail.nidn }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-gray-100 pt-6 dark:border-gray-800">
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Program Studi</span>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ selectedDosenDetail.prodi?.nama_prodi
                || '-' }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Grup Riset (Center)</span>
              <span
                class="inline-flex w-max items-center justify-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                {{ selectedDosenDetail.grup_riset || '-' }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-gray-100 pt-6 dark:border-gray-800">
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sisa Kuota Menguji</span>
              <span
                class="inline-flex w-max items-center justify-center rounded-md bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600 border border-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800">
                {{ selectedDosenDetail.kuota_menguji }} Kuota
              </span>
            </div>

            <div class="flex flex-col">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Peran (Role) Akun</span>
              <div class="flex flex-wrap gap-1.5 mt-0.5">
                <span v-if="!selectedDosenDetail.user?.role || selectedDosenDetail.user.role.length === 0"
                  class="text-sm text-gray-500">-</span>
                <span v-else v-for="role in selectedDosenDetail.user.role" :key="role.id_role"
                  class="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {{ role.nama || role.nama_role }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col border-t border-gray-100 pt-6 dark:border-gray-800">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">URL Profil Google
              Scholar</span>
            <div v-if="selectedDosenDetail.url_scholar"
              class="flex items-center gap-3 p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-900/30">
              <div
                class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-blue-100 dark:bg-gray-800 dark:border-gray-700">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <a :href="selectedDosenDetail.url_scholar" target="_blank"
                  class="block text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 truncate transition-colors">
                  {{ selectedDosenDetail.url_scholar }}
                </a>
                <span class="text-xs text-gray-500 dark:text-gray-400">Klik tautan untuk mengunjungi profil Google Scholar
                  dosen ini.</span>
              </div>
            </div>
            <span v-else
              class="text-sm font-medium text-gray-500 dark:text-gray-400 italic bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">Dosen
              ini belum menyertakan URL profil Google Scholar.</span>
          </div>

        </div>
      </div>
    </Modal>

    <!-- MODAL FORM TAMBAH/EDIT -->
    <Modal v-if="isModalOpen" @close="closeModal">
      <div class="relative w-full max-w-[700px] flex flex-col max-h-[90vh] rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 mx-auto mt-10 shadow-2xl overflow-hidden transition-colors">

        <!-- Header Sticky -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
          <h4 class="text-xl font-bold text-gray-800 dark:text-white/90">
            {{ isEditing ? 'Edit Data Dosen' : 'Tambah Data Dosen' }}
          </h4>
          <button @click="closeModal" class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Body Scrollable -->
        <div class="px-6 py-6 overflow-y-auto custom-scrollbar flex-1 pb-10">
          <form id="dosenForm" @submit.prevent="submitForm" class="flex flex-col gap-6">

            <!-- Section 1: Info Akademik -->
            <div>
              <h5 class="text-sm font-bold text-gray-800 dark:text-white/90 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Informasi Akademik</h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nama Lengkap <span class="text-red-500">*</span></label>
                  <input v-model="formData.nama_dosen" type="text" placeholder="Misal: Budi Santoso, M.Kom" class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors" required />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">NIDN <span class="text-red-500">*</span></label>
                  <input v-model="formData.nidn" type="text" placeholder="Masukkan NIDN" class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors" required />
                </div>

                <div class="relative w-full" ref="formProdiDropdownRef">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Program Studi <span class="text-red-500">*</span></label>
                  <button type="button" @click="isFormProdiDropdownOpen = !isFormProdiDropdownOpen"
                    class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 text-left transition-colors">
                    <span class="truncate pr-4" :class="{'text-gray-500 dark:text-gray-400': !formData.prodi_id}">{{ selectedFormProdiLabel }}</span>
                    <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0', { 'rotate-180': isFormProdiDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                    <div v-if="isFormProdiDropdownOpen" class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                      <ul class="max-h-48 overflow-y-auto custom-scrollbar py-1">
                        <li v-for="prodi in listProdi" :key="prodi.id_prodi" @click="selectFormProdi(prodi.id_prodi)" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">
                          {{ prodi.nama_prodi }}
                        </li>
                      </ul>
                    </div>
                  </transition>
                </div>

                <div class="relative w-full" ref="formGrupRisetDropdownRef">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Grup Riset (Center) <span class="text-red-500">*</span></label>
                  <button type="button" @click="isFormGrupRisetDropdownOpen = !isFormGrupRisetDropdownOpen"
                    class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 text-left transition-colors">
                    <span class="truncate pr-4" :class="{'text-gray-500 dark:text-gray-400': !formData.grup_riset}">{{ selectedFormGrupRisetLabel }}</span>
                    <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0', { 'rotate-180': isFormGrupRisetDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                    <div v-if="isFormGrupRisetDropdownOpen" class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                      <ul class="max-h-48 overflow-y-auto custom-scrollbar py-1">
                        <li v-for="grup in dataGrupRiset" :key="grup" @click="selectFormGrupRiset(grup)" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">
                          {{ grup }}
                        </li>
                      </ul>
                    </div>
                  </transition>
                </div>

                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">URL Google Scholar</label>
                  <input v-model="formData.url_scholar" type="url" placeholder="https://scholar.google.co.id/..." class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors" />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Kuota Menguji <span class="text-red-500">*</span></label>
                  <input v-model="formData.kuota_menguji" type="number" placeholder="Misal: 5" class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors" required />
                </div>
              </div>
            </div>

            <!-- Section 2: Info Akun -->
            <div>
              <h5 class="text-sm font-bold text-gray-800 dark:text-white/90 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Akun Pengguna</h5>

              <div class="mb-4">
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">Peran (Role) Akun <span class="text-red-500">*</span></label>
                <div class="flex flex-col gap-3 sm:flex-row">
                  <label class="relative flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <input type="checkbox" v-model="formData.role_ids" :value="2" class="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-600" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Ketua Prodi</span>
                  </label>
                  <label class="relative flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <input type="checkbox" v-model="formData.role_ids" :value="3" class="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-600" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Dosen Penguji</span>
                  </label>
                </div>
                <p v-if="formData.role_ids.length === 0" class="mt-2 text-xs text-red-500">Pilih minimal 1 peran.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Username <span class="text-red-500">*</span></label>
                  <input v-model="formData.username" type="text" placeholder="Username untuk dosen" class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors" :required="!isEditing" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password <span v-if="!isEditing" class="text-red-500">*</span></label>
                  <input v-model="formData.password" type="password" placeholder="Password untuk dosen" class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors" :required="!isEditing" />
                  <p v-if="isEditing" class="mt-1 text-xs text-gray-500 dark:text-gray-400">Kosongkan jika tidak ingin mengubah password.</p>
                </div>
              </div>
            </div>

          </form>
        </div>

        <!-- Footer Sticky -->
        <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 z-10 rounded-b-2xl">
          <button @click="closeModal" type="button" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-theme-xs transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
            Batal
          </button>
          <button type="submit" form="dosenForm" :disabled="isSaving || formData.role_ids.length === 0 || formData.prodi_id === '' || formData.grup_riset === ''" class="px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-theme-xs disabled:opacity-50 transition-colors dark:bg-brand-600 dark:hover:bg-brand-500">
            {{ isSaving ? 'Menyimpan...' : 'Simpan Data' }}
          </button>
        </div>

      </div>
    </Modal>

  <!-- Modal Hapus -->
  <Modal v-if="isDeleteModalOpen" @close="closeDeleteModal">
    <div class="w-full max-w-[400px] rounded-3xl bg-white p-6 text-center mx-auto mt-20 z-50 shadow-xl dark:bg-gray-900 border dark:border-gray-700 transition-colors">
     <h4 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">Konfirmasi Hapus</h4>
     <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
      Apakah Anda yakin ingin menghapus data dosen <br />
      <strong class="text-gray-800 text-lg dark:text-white/90">"{{ itemToDelete?.nama_dosen }}"</strong>?
      <br /><br /> Akun login dosen ini juga akan ikut terhapus.
     </p>
     <div class="flex items-center justify-center gap-3">
      <button @click="closeDeleteModal" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
       Batal
      </button>
      <button @click="confirmDelete" :disabled="isDeleting" class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto">
       {{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}
      </button>
     </div>
    </div>
  </Modal>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Pagination from '@/components/pagination/Pagination.vue'
import Modal from '@/components/modal/Modal.vue'
import Alert from '@/components/ui/Alert.vue'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface Prodi { id_prodi: number; nama_prodi: string; }
interface Role { id_role: number; nama?: string; nama_role?: string; }

interface Dosen {
 id_dosen: number;
 nama_dosen: string;
 nidn: string;
 url_scholar?: string;
 prodi_id: number;
 grup_riset: string;
 kuota_menguji: number;
 prodi?: Prodi;
 user?: {
  id_user: number;
  username: string;
  role?: Role[];
 };
}

interface DosenPayload {
 nama_dosen: string;
 nidn: string;
 url_scholar?: string;
 prodi_id: number;
 grup_riset: string;
 kuota_menguji: number;
 username?: string;
 password?: string;
 role_ids: number[];
}

// --- STATE ---
const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })
const showAlert = (type: AlertVariant, title: string, message: string) => {
 alert.value = { show: true, type, title, message }
 setTimeout(() => { alert.value.show = false }, 3000)
}

const userRoles = ref<string[]>([])
const isAdmin = computed(() => {
 return userRoles.value.some(role => role.toLowerCase() === 'admin')
})

const dosenList = ref<Dosen[]>([])
const listProdi = ref<Prodi[]>([])
const isLoading = ref(true)

const dataGrupRiset = [
 'Center of Artificial Intelligence',
 'Center of Design, Animation and Multimedia',
 'Center of Programming',
 'Center of Software Technology and Management',
 'Center of Network, Security, and Infrastructure'
];

// --- STATE SEARCH, FILTER, & PAGINATION ---
const searchQuery = ref('')
const filterProdi = ref<number | ''>('')
const filterGrupRiset = ref('')
const sortOrder = ref<'asc' | 'desc' | ''>('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const itemsPerPageDropdownRef = ref<HTMLElement | null>(null)
const prodiDropdownRef = ref<HTMLElement | null>(null)
const grupRisetDropdownRef = ref<HTMLElement | null>(null)
const sortDropdownRef = ref<HTMLElement | null>(null)
const formProdiDropdownRef = ref<HTMLElement | null>(null)
const formGrupRisetDropdownRef = ref<HTMLElement | null>(null)

const isItemsPerPageDropdownOpen = ref(false)
const isProdiDropdownOpen = ref(false)
const isGrupRisetDropdownOpen = ref(false)
const isSortDropdownOpen = ref(false)
const isFormProdiDropdownOpen = ref(false)
const isFormGrupRisetDropdownOpen = ref(false)

const isDetailModalOpen = ref(false)
const selectedDosenDetail = ref<Dosen | null>(null)

const selectedProdiLabel = computed(() => {
 if (filterProdi.value === '') return 'Semua Prodi'
 const found = listProdi.value.find(p => p.id_prodi === filterProdi.value)
 return found ? found.nama_prodi : 'Semua Prodi'
})

const selectedGrupRisetLabel = computed(() => {
 return filterGrupRiset.value === '' ? 'Semua Grup Riset' : filterGrupRiset.value
})

const selectedSortLabel = computed(() => {
 if (sortOrder.value === 'asc') return 'Nama (A - Z)'
 if (sortOrder.value === 'desc') return 'Nama (Z - A)'
 return 'Urutkan Default'
})

const selectedFormProdiLabel = computed(() => {
 if (formData.value.prodi_id === '') return 'Pilih Program Studi'
 const found = listProdi.value.find(p => p.id_prodi === formData.value.prodi_id)
 return found ? found.nama_prodi : 'Pilih Program Studi'
})

const selectedFormGrupRisetLabel = computed(() => {
 return formData.value.grup_riset === '' ? 'Pilih Center' : formData.value.grup_riset
})

const selectItemsPerPage = (val: number) => { itemsPerPage.value = val; isItemsPerPageDropdownOpen.value = false; }
const selectFilterProdi = (val: number | '') => { filterProdi.value = val; isProdiDropdownOpen.value = false; }
const selectFilterGrupRiset = (val: string) => { filterGrupRiset.value = val; isGrupRisetDropdownOpen.value = false; }
const selectSortOrder = (val: 'asc' | 'desc' | '') => { sortOrder.value = val; isSortDropdownOpen.value = false; }

const selectFormProdi = (val: number) => { formData.value.prodi_id = val; isFormProdiDropdownOpen.value = false; }
const selectFormGrupRiset = (val: string) => { formData.value.grup_riset = val; isFormGrupRisetDropdownOpen.value = false; }

const handleClickOutside = (event: MouseEvent) => {
 const target = event.target as Node
 if (itemsPerPageDropdownRef.value && !itemsPerPageDropdownRef.value.contains(target)) isItemsPerPageDropdownOpen.value = false
 if (prodiDropdownRef.value && !prodiDropdownRef.value.contains(target)) isProdiDropdownOpen.value = false
 if (grupRisetDropdownRef.value && !grupRisetDropdownRef.value.contains(target)) isGrupRisetDropdownOpen.value = false
 if (sortDropdownRef.value && !sortDropdownRef.value.contains(target)) isSortDropdownOpen.value = false
 if (formProdiDropdownRef.value && !formProdiDropdownRef.value.contains(target)) isFormProdiDropdownOpen.value = false
 if (formGrupRisetDropdownRef.value && !formGrupRisetDropdownRef.value.contains(target)) isFormGrupRisetDropdownOpen.value = false
}

const filteredList = computed(() => {
 let result = dosenList.value;

 if (filterProdi.value !== '') {
  result = result.filter(dosen => dosen.prodi_id === filterProdi.value);
 }

 if (filterGrupRiset.value !== '') {
  result = result.filter(dosen => dosen.grup_riset === filterGrupRiset.value);
 }

 if (searchQuery.value) {
  const lowerQuery = searchQuery.value.toLowerCase();
  result = result.filter(dosen =>
   dosen.nama_dosen.toLowerCase().includes(lowerQuery) ||
   dosen.nidn.includes(lowerQuery) ||
   (dosen.prodi?.nama_prodi && dosen.prodi.nama_prodi.toLowerCase().includes(lowerQuery)) ||
   (dosen.grup_riset && dosen.grup_riset.toLowerCase().includes(lowerQuery))
  );
 }

 if (sortOrder.value === 'asc') {
  result = [...result].sort((a, b) => a.nama_dosen.localeCompare(b.nama_dosen));
 } else if (sortOrder.value === 'desc') {
  result = [...result].sort((a, b) => b.nama_dosen.localeCompare(a.nama_dosen));
 }

 return result;
})

const totalItems = computed(() => filteredList.value.length)

const paginatedList = computed(() => {
 const start = (currentPage.value - 1) * itemsPerPage.value
 const end = start + itemsPerPage.value
 return filteredList.value.slice(start, end)
})

watch([searchQuery, filterProdi, filterGrupRiset, sortOrder, itemsPerPage], () => {
 currentPage.value = 1
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const formData = ref({
 id: null as number | null,
 nama_dosen: '',
 nidn: '',
 url_scholar: '',
 prodi_id: '' as number | '',
 grup_riset: '',
 kuota_menguji: '' as number | '',
 username: '',
 password: '',
 role_ids: [] as number[]
})

const isDeleteModalOpen = ref(false)
const itemToDelete = ref<Dosen | null>(null)
const isDeleting = ref(false)

// --- FETCH DATA ---
const fetchDosen = async () => {
 isLoading.value = true
 try {
  const response = await fetch('http://localhost:3000/api/dosen', {
   method: 'GET',
   headers: { 'Content-Type': 'application/json' },
   credentials: 'include'
  })
  const result = await response.json()
  if (result.success) {
   dosenList.value = result.data.rows || result.data
  }
 } catch (error) {
  console.error("Fetch Dosen Error:", error)
  showAlert('error', 'Gagal!', 'Terjadi kesalahan jaringan saat memuat data.')
 } finally {
  isLoading.value = false
 }
}

const fetchProdiList = async () => {
 try {
  const response = await fetch('http://localhost:3000/api/prodi', {
   method: 'GET',
   headers: { 'Content-Type': 'application/json' },
   credentials: 'include'
  })
  const result = await response.json()
  if (result.success) listProdi.value = result.data
 } catch (error) {
  console.error("Gagal fetch prodi:", error)
 }
}

// --- MODAL & FORM ---
const openDetailModal = (item: Dosen) => {
 selectedDosenDetail.value = item;
 isDetailModalOpen.value = true;
}

const closeDetailModal = () => {
 isDetailModalOpen.value = false;
 selectedDosenDetail.value = null;
}

const openAddModal = () => {
 isEditing.value = false
 formData.value = {
  id: null, nama_dosen: '', nidn: '', url_scholar: '', prodi_id: '', grup_riset: '', kuota_menguji: '',
  username: '', password: '', role_ids: []
 }
 isFormProdiDropdownOpen.value = false;
 isFormGrupRisetDropdownOpen.value = false;
 isModalOpen.value = true
}

const openEditModal = (item: Dosen) => {
 isEditing.value = true
 const existingRoleIds = item.user?.role?.map((r: Role) => r.id_role) || []

 formData.value = {
  id: item.id_dosen,
  nama_dosen: item.nama_dosen,
  nidn: item.nidn,
  url_scholar: item.url_scholar || '',
  prodi_id: item.prodi_id,
  grup_riset: item.grup_riset || '',
  kuota_menguji: item.kuota_menguji,
  username: item.user?.username || '',
  password: '',
  role_ids: existingRoleIds
 }
 isFormProdiDropdownOpen.value = false;
 isFormGrupRisetDropdownOpen.value = false;
 isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const submitForm = async () => {
 if (formData.value.role_ids.length === 0) {
  showAlert('warning', 'Peringatan', 'Minimal pilih satu peran/role dosen.')
  return;
 }

 isSaving.value = true
 try {
  const url = isEditing.value
   ? `http://localhost:3000/api/dosen/${formData.value.id}`
   : 'http://localhost:3000/api/dosen'
  const method = isEditing.value ? 'PUT' : 'POST'

  const bodyPayload: DosenPayload = {
   nama_dosen: formData.value.nama_dosen,
   nidn: formData.value.nidn,
   url_scholar: formData.value.url_scholar,
   prodi_id: Number(formData.value.prodi_id),
   grup_riset: formData.value.grup_riset,
   kuota_menguji: Number(formData.value.kuota_menguji),
   username: formData.value.username,
   role_ids: formData.value.role_ids
  }

  if (!isEditing.value) {
   bodyPayload.password = formData.value.password;
  } else if (formData.value.password && formData.value.password.trim() !== '') {
   bodyPayload.password = formData.value.password;
  }

  const response = await fetch(url, {
   method: method,
   headers: { 'Content-Type': 'application/json' },
   credentials: 'include',
   body: JSON.stringify(bodyPayload)
  })

  if (response.ok) {
   closeModal()
   fetchDosen()
   showAlert('success', 'Berhasil!', `Data Dosen berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}.`)
  } else {
   const errorData = await response.json()
   showAlert('error', 'Gagal!', errorData.message || 'Terdapat kesalahan saat menyimpan data.')
  }
 } catch (error) {
  console.error("Submit Error:", error)
  showAlert('error', 'Gagal Server!', 'Pastikan server backend sedang menyala.')
 } finally {
  isSaving.value = false
 }
}

// --- DELETE ---
const openDeleteModal = (item: Dosen) => { itemToDelete.value = item; isDeleteModalOpen.value = true }
const closeDeleteModal = () => { isDeleteModalOpen.value = false; itemToDelete.value = null }

const confirmDelete = async () => {
 if (itemToDelete.value === null) return;
 isDeleting.value = true
 try {
  const response = await fetch(`http://localhost:3000/api/dosen/${itemToDelete.value.id_dosen}`, {
   method: 'DELETE',
   headers: { 'Content-Type': 'application/json' },
   credentials: 'include'
  })
  if (response.ok) {
   closeDeleteModal()
   fetchDosen()
   showAlert('success', 'Dihapus!', 'Data Dosen berhasil dihapus permanen.')
  }
 } catch (error) {
  console.error("Delete Error:", error)
  showAlert('error', 'Gagal Server!', 'Pastikan server backend sedang menyala.')
 } finally {
  isDeleting.value = false
 }
}

onMounted(() => {
 try {
  userRoles.value = JSON.parse(localStorage.getItem('userRoles') || '[]')
 } catch {
  userRoles.value = (localStorage.getItem('userRoles') || '').split(',').map(r => r.trim())
 }
 document.addEventListener('mousedown', handleClickOutside)
 fetchDosen()
 fetchProdiList()
})

onBeforeUnmount(() => {
 document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
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
