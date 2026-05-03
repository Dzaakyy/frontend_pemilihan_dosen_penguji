<template>
  <div class="relative">
    <div v-if="alert.show" class="fixed top-20 right-5 z-[99999] w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div class="flex flex-col gap-4 mb-6 p-5 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50 shadow-sm relative z-20">

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
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
          Tambah Mahasiswa
        </button>
      </div>

      <hr class="border-gray-100 dark:border-gray-800" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        <div class="relative w-full">
          <input v-model="searchQuery" type="text" placeholder="Cari nama, NIM, judul..."
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

        <div class="relative w-full" ref="topikDropdownRef">
          <button type="button" @click="isTopikDropdownOpen = !isTopikDropdownOpen"
            class="flex items-center justify-between h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="truncate pr-4 font-medium">{{ selectedTopikLabel }}</span>
            <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0', { 'rotate-180': isTopikDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
            <div v-if="isTopikDropdownOpen" class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <ul class="max-h-60 overflow-y-auto custom-scrollbar py-1">
                <li @click="selectFilterTopik('')" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">Semua Topik TA</li>
                <li v-for="topik in listTopik" :key="topik.id_topik" @click="selectFilterTopik(topik.id_topik)" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">{{ topik.nama_topik }}</li>
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

    <div class="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02]">
              <th class="px-5 py-3 w-16 sm:px-6"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No</p></th>
              <th class="px-5 py-3 sm:px-6 w-40"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Mahasiswa</p></th>
              <th class="px-5 py-3 sm:px-6 w-28"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">NIM</p></th>
              <th class="px-5 py-3 sm:px-6 min-w-[200px] lg:w-[30%]"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Judul TA</p></th>
              <th class="px-5 py-3 sm:px-6 w-40"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Prodi</p></th>
              <th class="px-5 py-3 text-center sm:px-6 w-36"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Topik</p></th>
              <th v-if="isAdmin" class="px-5 py-3 text-center sm:px-6 w-40"><p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading">
              <td colspan="7" class="px-5 py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400">Memuat data mahasiswa...</td>
            </tr>
            <tr v-else-if="paginatedList.length === 0">
              <td colspan="7" class="px-5 py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400">Data tidak ditemukan sesuai filter.</td>
            </tr>

            <tr v-else v-for="(item, index) in paginatedList" :key="item.id_mahasiswa" class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block font-medium text-gray-800 text-theme-sm dark:text-gray-300 mt-1">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block text-gray-800 text-theme-sm dark:text-gray-200 whitespace-normal break-words mt-1 font-semibold">{{ item.nama_mahasiswa }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block text-gray-500 text-theme-sm dark:text-gray-400 mt-1">{{ item.nim }}</span>
              </td>

              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block text-gray-500 text-theme-sm dark:text-gray-400 whitespace-normal break-words leading-relaxed mt-1">
                  {{ item.judul_ta || '-' }}
                </span>
              </td>

              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block text-gray-500 text-theme-sm dark:text-gray-400 whitespace-normal break-words mt-1">{{ item.prodi?.nama_prodi || '-' }}</span>
              </td>
              <td class="px-5 py-4 text-center sm:px-6 align-top">
                <span class="inline-flex items-center justify-center rounded-xl bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-500 border border-brand-500/20 whitespace-normal break-words leading-snug mt-1 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800">
                  {{ item.topik_ta?.nama_topik || '-' }}
                </span>
              </td>
              <td v-if="isAdmin" class="px-5 py-4 text-center sm:px-6 align-top">
                <div class="flex items-center justify-center gap-2 mt-0.5">
                  <button @click="openEditModal(item)" class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-blue-600 shadow-theme-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400" title="Edit">
                    <svg class="fill-current w-3.5 h-3.5" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" /></svg>
                    <span>Edit</span>
                  </button>
                  <button @click="openDeleteModal(item)" class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-red-600 shadow-theme-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-400" title="Hapus">
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.99998H16V5.99998C16 4.89541 15.1046 3.99998 14 3.99998H10C8.89543 3.99998 8 4.89541 8 5.99998V6.99998H5V8.99998H6V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V8.99998H19V6.99998ZM10 5.99998H14V6.99998H10V5.99998ZM16 19H8V8.99998H16V19Z" /></svg>
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
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
    />

    <Modal v-if="isModalOpen" @close="closeModal">
      <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 border dark:border-gray-700 lg:p-11 mx-auto mt-10 shadow-2xl">
        <button @click="closeModal" class="transition-color absolute right-5 top-5 z-[100] flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" /></svg>
        </button>

        <div class="px-2 pr-14 mb-6 mt-4">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {{ isEditing ? 'Edit Data Mahasiswa' : 'Tambah Data Mahasiswa' }}
          </h4>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col px-2">
          <h5 class="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">Informasi Mahasiswa</h5>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nama Lengkap <span class="text-red-500">*</span></label>
              <input v-model="formData.nama_mahasiswa" type="text" placeholder="Misal: Anton Surya" class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" required />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">NIM <span class="text-red-500">*</span></label>
              <input v-model="formData.nim" type="text" placeholder="Masukkan NIM" class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" required />
            </div>
          </div>

          <div class="mb-4">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Judul Tugas Akhir</label>
            <input v-model="formData.judul_ta" type="text" placeholder="Judul TA Mahasiswa" class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            <div class="relative w-full" ref="formProdiDropdownRef">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Program Studi <span class="text-red-500">*</span></label>
              <button type="button" @click="isFormProdiDropdownOpen = !isFormProdiDropdownOpen"
                class="flex items-center justify-between h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 text-left transition-colors">
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

            <!-- 2. Custom Dropdown Topik TA di Form Modal -->
            <div class="relative w-full" ref="formTopikDropdownRef">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Topik TA</label>
              <button type="button" @click="isFormTopikDropdownOpen = !isFormTopikDropdownOpen"
                class="flex items-center justify-between h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 text-left transition-colors">
                <span class="truncate pr-4" :class="{'text-gray-500 dark:text-gray-400': !formData.topik_id}">{{ selectedFormTopikLabel }}</span>
                <svg :class="['w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0', { 'rotate-180': isFormTopikDropdownOpen }]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                <div v-if="isFormTopikDropdownOpen" class="absolute z-[100] w-full mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                  <ul class="max-h-48 overflow-y-auto custom-scrollbar py-1">
                    <li @click="selectFormTopik('')" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors border-b border-gray-100 dark:border-gray-700 font-medium">Kosongkan Topik</li>
                    <li v-for="topik in listTopik" :key="topik.id_topik" @click="selectFormTopik(topik.id_topik)" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50">
                      {{ topik.nama_topik }}
                    </li>
                  </ul>
                </div>
              </transition>
            </div>
          </div>

          <div>
            <h5 class="mb-3 text-lg font-medium text-gray-800 dark:text-white/90 border-t pt-4 dark:border-gray-700">Akun Pengguna (Login)</h5>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Username <span class="text-red-500">*</span></label>
                <input v-model="formData.username" type="text" placeholder="Username untuk mahasiswa" class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" required />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password <span v-if="!isEditing" class="text-red-500">*</span></label>
                <input v-model="formData.password" type="password" placeholder="Password untuk mahasiswa" class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" :required="!isEditing" />
                <p v-if="isEditing" class="mt-1 text-xs text-gray-500 dark:text-gray-400">Kosongkan jika tidak ingin mengubah password.</p>
              </div>
              <input type="hidden" v-model="formData.role_id" />
            </div>
          </div>

          <div class="flex items-center gap-3 lg:justify-end mt-2">
            <button @click="closeModal" type="button" class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
              Batal
            </button>
            <button type="submit" :disabled="isSaving || formData.prodi_id === ''" class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 sm:w-auto dark:bg-brand-600 dark:hover:bg-brand-500">
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <Modal v-if="isDeleteModalOpen" @close="closeDeleteModal">
        <div class="w-full max-w-[400px] rounded-3xl bg-white p-6 text-center mx-auto mt-20 z-50 shadow-xl dark:bg-gray-900 border dark:border-gray-700">
          <h4 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">Konfirmasi Hapus</h4>
          <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus data mahasiswa <br />
            <strong class="text-gray-800 text-lg dark:text-white/90">"{{ itemToDelete?.nama_mahasiswa }}"</strong>?
            <br /><br /> Akun login mahasiswa ini juga akan ikut terhapus secara permanen.
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
interface Topik { id_topik: number; nama_topik: string; }

interface Mahasiswa {
  id_mahasiswa: number;
  nama_mahasiswa: string;
  nim: string;
  judul_ta: string;
  prodi_id: number;
  topik_id: number;
  prodi?: Prodi;
  topik_ta?: Topik;
  user?: { id_user: number; username: string; };
}

interface MahasiswaPayload {
  nama_mahasiswa: string;
  nim: string;
  judul_ta: string;
  prodi_id: number;
  topik_id?: number;
  username?: string;
  password?: string;
  role_id?: number;
}

// --- STATE ALERT ---
const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })
const showAlert = (type: AlertVariant, title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  setTimeout(() => { alert.value.show = false }, 3000)
}

const userRoles = ref<string[]>([])
const isAdmin = computed(() => {
  return userRoles.value.some(role => role.toLowerCase() === 'admin')
})

const mahasiswaList = ref<Mahasiswa[]>([])
const listProdi = ref<Prodi[]>([])
const listTopik = ref<Topik[]>([])
const isLoading = ref(true)

// --- STATE SEARCH, FILTER, & PAGINATION ---
const searchQuery = ref('')
const filterProdi = ref<number | ''>('')
const filterTopik = ref<number | ''>('')
const sortOrder = ref<'asc' | 'desc' | ''>('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const itemsPerPageDropdownRef = ref<HTMLElement | null>(null)
const prodiDropdownRef = ref<HTMLElement | null>(null)
const topikDropdownRef = ref<HTMLElement | null>(null)
const sortDropdownRef = ref<HTMLElement | null>(null)
const formProdiDropdownRef = ref<HTMLElement | null>(null)
const formTopikDropdownRef = ref<HTMLElement | null>(null)

const isItemsPerPageDropdownOpen = ref(false)
const isProdiDropdownOpen = ref(false)
const isTopikDropdownOpen = ref(false)
const isSortDropdownOpen = ref(false)
const isFormProdiDropdownOpen = ref(false)
const isFormTopikDropdownOpen = ref(false)

const selectedProdiLabel = computed(() => {
  if (filterProdi.value === '') return 'Semua Prodi'
  const found = listProdi.value.find(p => p.id_prodi === filterProdi.value)
  return found ? found.nama_prodi : 'Semua Prodi'
})

const selectedTopikLabel = computed(() => {
  if (filterTopik.value === '') return 'Semua Topik TA'
  const found = listTopik.value.find(t => t.id_topik === filterTopik.value)
  return found ? found.nama_topik : 'Semua Topik TA'
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

const selectedFormTopikLabel = computed(() => {
  if (formData.value.topik_id === '') return 'Pilih Topik'
  const found = listTopik.value.find(t => t.id_topik === formData.value.topik_id)
  return found ? found.nama_topik : 'Pilih Topik'
})

const selectItemsPerPage = (val: number) => { itemsPerPage.value = val; isItemsPerPageDropdownOpen.value = false; }
const selectFilterProdi = (val: number | '') => { filterProdi.value = val; isProdiDropdownOpen.value = false; }
const selectFilterTopik = (val: number | '') => { filterTopik.value = val; isTopikDropdownOpen.value = false; }
const selectSortOrder = (val: 'asc' | 'desc' | '') => { sortOrder.value = val; isSortDropdownOpen.value = false; }

const selectFormProdi = (val: number) => { formData.value.prodi_id = val; isFormProdiDropdownOpen.value = false; }
const selectFormTopik = (val: number | '') => { formData.value.topik_id = val; isFormTopikDropdownOpen.value = false; }

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (itemsPerPageDropdownRef.value && !itemsPerPageDropdownRef.value.contains(target)) isItemsPerPageDropdownOpen.value = false
  if (prodiDropdownRef.value && !prodiDropdownRef.value.contains(target)) isProdiDropdownOpen.value = false
  if (topikDropdownRef.value && !topikDropdownRef.value.contains(target)) isTopikDropdownOpen.value = false
  if (sortDropdownRef.value && !sortDropdownRef.value.contains(target)) isSortDropdownOpen.value = false
  if (formProdiDropdownRef.value && !formProdiDropdownRef.value.contains(target)) isFormProdiDropdownOpen.value = false
  if (formTopikDropdownRef.value && !formTopikDropdownRef.value.contains(target)) isFormTopikDropdownOpen.value = false
}


// --- LOGIKA FILTER & SORTING ---
const filteredList = computed(() => {
  let result = mahasiswaList.value;

  if (filterProdi.value !== '') {
    result = result.filter(mhs => mhs.prodi_id === filterProdi.value);
  }

  if (filterTopik.value !== '') {
    result = result.filter(mhs => mhs.topik_id === filterTopik.value);
  }

  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase();
    result = result.filter(mhs =>
      mhs.nama_mahasiswa.toLowerCase().includes(lowerQuery) ||
      mhs.nim.includes(lowerQuery) ||
      (mhs.judul_ta && mhs.judul_ta.toLowerCase().includes(lowerQuery)) ||
      (mhs.prodi?.nama_prodi && mhs.prodi.nama_prodi.toLowerCase().includes(lowerQuery)) ||
      (mhs.topik_ta?.nama_topik && mhs.topik_ta.nama_topik.toLowerCase().includes(lowerQuery))
    );
  }

  if (sortOrder.value === 'asc') {
    result = [...result].sort((a, b) => a.nama_mahasiswa.localeCompare(b.nama_mahasiswa));
  } else if (sortOrder.value === 'desc') {
    result = [...result].sort((a, b) => b.nama_mahasiswa.localeCompare(a.nama_mahasiswa));
  }

  return result;
})

// --- LOGIKA PAGINATION ---
const totalItems = computed(() => filteredList.value.length)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredList.value.slice(start, end)
})

watch([searchQuery, filterProdi, filterTopik, sortOrder, itemsPerPage], () => {
  currentPage.value = 1
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const formData = ref({
  id: null as number | null,
  nama_mahasiswa: '',
  nim: '',
  judul_ta: '',
  prodi_id: '' as number | '',
  topik_id: '' as number | '',
  username: '',
  password: '',
  role_id: 4
})

const isDeleteModalOpen = ref(false)
const itemToDelete = ref<Mahasiswa | null>(null)
const isDeleting = ref(false)

// --- FETCH DATA ---
const fetchMahasiswa = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:3000/api/mahasiswa', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    const result = await response.json()
    if (result.success) {
      mahasiswaList.value = result.data.rows || result.data
    }
  } catch (error) {
    console.error("Gagal fetch data mahasiswa:", error)
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

const fetchTopikList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/topik-ta', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    const result = await response.json()
    if (result.success) listTopik.value = result.data
  } catch (error) {
    console.error("Gagal fetch topik:", error)
  }
}

const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    id: null, nama_mahasiswa: '', nim: '', judul_ta: '', prodi_id: '', topik_id: '',
    username: '', password: '', role_id: 4
  }
  isFormProdiDropdownOpen.value = false;
  isFormTopikDropdownOpen.value = false;
  isModalOpen.value = true
}

const openEditModal = (item: Mahasiswa) => {
  isEditing.value = true
  formData.value = {
    id: item.id_mahasiswa,
    nama_mahasiswa: item.nama_mahasiswa,
    nim: item.nim,
    judul_ta: item.judul_ta,
    prodi_id: item.prodi_id,
    topik_id: item.topik_id || '',
    username: item.user?.username || '',
    password: '',
    role_id: 4
  }
  isFormProdiDropdownOpen.value = false;
  isFormTopikDropdownOpen.value = false;
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const submitForm = async () => {
  isSaving.value = true
  try {
    const url = isEditing.value
      ? `http://localhost:3000/api/mahasiswa/${formData.value.id}`
      : 'http://localhost:3000/api/mahasiswa'
    const method = isEditing.value ? 'PUT' : 'POST'

    const bodyPayload: MahasiswaPayload = {
      nama_mahasiswa: formData.value.nama_mahasiswa,
      nim: formData.value.nim,
      judul_ta: formData.value.judul_ta,
      prodi_id: Number(formData.value.prodi_id),
      username: formData.value.username
    }

    if (formData.value.topik_id) {
      bodyPayload.topik_id = Number(formData.value.topik_id);
    }

    if (!isEditing.value) {
      bodyPayload.password = formData.value.password;
      bodyPayload.role_id = formData.value.role_id;
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
      fetchMahasiswa()
      showAlert('success', 'Berhasil!', `Data Mahasiswa berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}.`)
    } else {
      const errorData = await response.json()
      showAlert('error', 'Gagal!', errorData.message || 'Terdapat kesalahan saat menyimpan data.')
    }
  } catch (error) {
    console.error("Error simpan data:", error)
    showAlert('error', 'Gagal Server!', 'Pastikan server backend sedang menyala.')
  } finally {
    isSaving.value = false
  }
}

const openDeleteModal = (item: Mahasiswa) => { itemToDelete.value = item; isDeleteModalOpen.value = true }
const closeDeleteModal = () => { isDeleteModalOpen.value = false; itemToDelete.value = null }

const confirmDelete = async () => {
  if (itemToDelete.value === null) return;
  isDeleting.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/mahasiswa/${itemToDelete.value.id_mahasiswa}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    if (response.ok) {
      closeDeleteModal()
      fetchMahasiswa()
      showAlert('success', 'Dihapus!', 'Data Mahasiswa dan akunnya berhasil dihapus permanen.')
    } else {
      showAlert('error', 'Gagal!', 'Terdapat kesalahan saat menghapus data.')
    }
  } catch (error) {
    console.error("Error hapus data:", error)
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
  fetchMahasiswa()
  fetchProdiList()
  fetchTopikList()
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
