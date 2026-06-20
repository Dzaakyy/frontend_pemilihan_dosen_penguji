<template>
  <div class="relative w-full">
    <div v-if="alert.show"
      class="fixed top-20 right-5 z-[999999] w-full max-w-sm transition-all duration-300 ease-in-out">
      <Alert :variant="alert.type" :title="alert.title" :message="alert.message" />
    </div>

    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-5 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm transition-colors">

      <div class="flex items-center gap-2 w-full sm:w-auto" ref="itemsPerPageDropdownRef">
        <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Tampilkan</span>

        <div class="relative">
          <button type="button" @click="isItemsPerPageDropdownOpen = !isItemsPerPageDropdownOpen"
            class="flex items-center justify-between h-9 w-[70px] rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <span class="font-medium">{{ itemsPerPage }}</span>
            <svg
              :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': isItemsPerPageDropdownOpen }]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isItemsPerPageDropdownOpen"
              class="absolute z-[100] w-full min-w-[70px] mt-1.5 top-full bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden left-0">
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

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button v-if="filteredPenugasanList.length > 0" @click="exportToExcel"
          class="flex items-center justify-center px-4 h-10 text-sm font-medium text-emerald-700 transition rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 shadow-theme-xs dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400 dark:hover:bg-emerald-900/40 w-full sm:w-auto">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
          </svg>
          Export Excel
        </button>
        <button v-if="canManage" @click="openAddModal"
          class="flex items-center justify-center px-5 h-10 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 w-full sm:w-auto shadow-theme-xs dark:bg-brand-600 dark:hover:bg-brand-500">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Buat Penugasan Baru
        </button>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm transition-colors">
      <div
        class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-transparent transition-colors">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 transition-colors">Daftar Penugasan Dosen Penguji</h3>
      </div>
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02] transition-colors">
              <th class="px-5 py-4 text-left w-12">
                <p class="font-bold text-gray-700 text-theme-xs dark:text-gray-400 uppercase tracking-wider">No</p>
              </th>
              <th class="px-5 py-4 text-left w-1/4">
                <p class="font-bold text-gray-700 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Data Mahasiswa & Waktu Pelaksanaan</p>
              </th>
              <th class="px-5 py-4 text-left">
                <p class="font-bold text-gray-700 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Sekretaris</p>
              </th>
              <th class="px-5 py-4 text-left">
                <p class="font-bold text-gray-700 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Penguji 1</p>
              </th>
              <th class="px-5 py-4 text-left">
                <p class="font-bold text-gray-700 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Penguji 2</p>
              </th>
              <th v-if="canManage" class="px-5 py-4 text-center w-32">
                <p class="font-bold text-gray-700 text-theme-xs dark:text-gray-400 uppercase tracking-wider">Aksi</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
            <tr v-if="isLoading">
              <td :colspan="canManage ? 6 : 5" class="px-5 py-12 text-center text-gray-500 text-sm transition-colors">
                <svg class="animate-spin h-6 w-6 mx-auto text-brand-500 mb-3" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Memuat data penugasan...
              </td>
            </tr>
            <tr v-else-if="paginatedList.length === 0">
              <td :colspan="canManage ? 6 : 5" class="px-5 py-12 text-center text-gray-500 text-sm transition-colors">
                Belum ada data penugasan.</td>
            </tr>

            <tr v-else v-for="(item, index) in paginatedList" :key="item.id_penugasan"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </span>
              </td>

              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block font-bold text-gray-800 text-sm dark:text-white/90">{{ item.mahasiswa?.nama_mahasiswa }}</span>
                <span class="block text-xs font-medium text-brand-500 dark:text-brand-400 mt-0.5">NIM: {{ item.mahasiswa?.nim }}</span>

                <div class="mt-3 flex flex-wrap gap-2" v-if="item.tanggal_ujian || item.sesi_waktu">
                  <span v-if="item.tanggal_ujian"
                    class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                      </path>
                    </svg>
                    {{ formatDateDisplay(item.tanggal_ujian) }}
                  </span>
                  <span v-if="item.sesi_waktu"
                    class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ formatSesiDisplay(item.sesi_waktu) }}
                  </span>
                </div>

                <div class="mt-3 space-y-1">
                  <span class="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Judul:</span>
                  <span class="block text-xs text-gray-600 dark:text-gray-300 line-clamp-2"
                    :title="item.mahasiswa?.judul_ta">{{ item.mahasiswa?.judul_ta || 'Belum ada judul' }}</span>
                </div>

                <div class="mt-2 space-y-1">
                  <span class="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Topik:</span>
                  <span
                    class="inline-flex items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                    {{ item.mahasiswa?.topik_ta?.nama_topik || 'Belum ada topik' }}
                  </span>
                </div>
              </td>

              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">{{
                  item.dosen_sekretaris?.nama_dosen }}</span>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">NIDN: {{ item.dosen_sekretaris?.nidn
                  }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">{{
                  item.dosen_penguji_1?.nama_dosen }}</span>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">NIDN: {{ item.dosen_penguji_1?.nidn
                  }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6 align-top">
                <span class="block font-semibold text-gray-800 text-theme-sm dark:text-white/90">{{
                  item.dosen_penguji_2?.nama_dosen }}</span>
                <span class="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">NIDN: {{ item.dosen_penguji_2?.nidn
                  }}</span>
              </td>

              <td v-if="canManage" class="px-5 py-4 text-center sm:px-6 align-top">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(item)"
                    class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400 shadow-theme-xs"
                    title="Edit">
                    <svg class="fill-current w-4 h-4" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" />
                    </svg>
                    Edit
                  </button>

                  <button @click="openDeleteModal(item)"
                    class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-red-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400 shadow-theme-xs"
                    title="Hapus">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      :items-per-page="itemsPerPage" @update:currentPage="currentPage = $event" />

    <Modal v-if="isModalOpen" @close="closeModal">
      <div
        class="relative w-full max-w-[650px] max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl bg-white p-6 dark:bg-gray-900 mx-auto mt-10 shadow-2xl transition-colors">
        <button @click="closeModal"
          class="absolute right-5 top-5 z-[100] flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.07] dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" />
          </svg>
        </button>

        <div class="mb-6 border-b border-gray-100 pb-4 dark:border-gray-800 transition-colors">
          <h4 class="text-2xl font-bold text-gray-800 dark:text-white/90">
            {{ isEditing ? 'Edit Penugasan Penguji' : 'Buat Penugasan Penguji' }}
          </h4>
          <p class="text-sm text-gray-500 mt-1 dark:text-gray-400">Sistem otomatis memprioritaskan Top 3 Dosen Rekomendasi berserta waktu pelaksanaannya.</p>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col gap-5 pb-6">

          <div class="relative w-full z-[60] transition-all duration-300" :class="{ 'mb-64': openDropdown === 'mahasiswa' && !isEditing }" ref="mahasiswaFormRef">
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Pilih Mahasiswa <span class="text-red-500">*</span></label>

            <button type="button" @click="!isEditing && toggleDropdown('mahasiswa')" :class="[
              'flex items-center justify-between h-11 w-full rounded-lg border px-4 text-sm text-left transition-colors',
              isEditing ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800/50 dark:border-gray-700' : 'bg-white border-gray-300 text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90'
            ]">
              <span class="truncate pr-4 font-medium">
                {{ getMahasiswaLabel(formData.mahasiswa_id) || 'Pilih Mahasiswa...' }}
              </span>
              <svg v-if="!isEditing"
                :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': openDropdown === 'mahasiswa' }]"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <transition enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0">
              <div v-if="openDropdown === 'mahasiswa' && !isEditing"
                class="absolute w-full mt-1 top-full bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                <div class="p-2 border-b border-gray-100 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                  <input v-model="searchMhsQuery" type="text" placeholder="Cari nama atau NIM..."
                    class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                </div>
                <ul class="max-h-56 overflow-y-auto overscroll-contain custom-scrollbar py-1">
                  <li v-if="filteredMahasiswaOptions.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                    Data tidak ditemukan</li>
                  <li v-else v-for="mhs in filteredMahasiswaOptions" :key="mhs.id_mahasiswa"
                    @click="selectMahasiswa(mhs.id_mahasiswa)"
                    class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 text-gray-800 transition-colors border-b border-gray-50 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700/50">
                    {{ mhs.nama_mahasiswa }} <span class="text-gray-400 ml-1 text-xs font-normal dark:text-gray-500">({{
                      mhs.nim }})</span>
                  </li>
                </ul>
              </div>
            </transition>
          </div>

          <div v-if="isLoadingRekomendasi"
            class="text-sm text-brand-600 bg-brand-50 p-3 rounded-lg flex items-center gap-2 dark:bg-brand-500/10 dark:text-brand-400 transition-colors">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Mengambil data rekomendasi dosen...
          </div>

          <div v-if="formData.mahasiswa_id && !isLoadingRekomendasi"
            class="flex flex-col gap-5 border-t border-gray-100 pt-5 dark:border-gray-800 transition-colors">

            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex flex-col gap-2 shadow-sm">
              <h6 class="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">Waktu Ujian (Hasil Automasi PSO)</h6>
              <div class="flex items-center gap-4 text-sm text-indigo-900 dark:text-indigo-200">
                <div class="flex items-center gap-1.5 font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {{ selectedWaktuPso.tanggal ? formatDateDisplay(selectedWaktuPso.tanggal) : 'Belum Ditetapkan' }}
                </div>
                <div class="flex items-center gap-1.5 font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ selectedWaktuPso.sesi ? formatSesiDisplay(selectedWaktuPso.sesi) : 'Belum Ditentukan' }}
                </div>
              </div>
            </div>

            <div class="relative w-full z-[50] transition-all duration-300" :class="{ 'mb-64': openDropdown === 'sekretaris' }" ref="sekretarisRef">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Sekretaris<span
                  class="text-red-500">*</span></label>

              <button type="button" @click="toggleDropdown('sekretaris')"
                class="flex items-center justify-between h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/20 text-left transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                <span class="truncate pr-4 font-medium">
                  {{ getDosenLabel(formData.sekretaris) || 'Pilih Sekretaris...' }}
                </span>
                <svg
                  :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': openDropdown === 'sekretaris' }]"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <transition enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <div v-if="openDropdown === 'sekretaris'"
                  class="absolute w-full mt-1 top-full bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <div class="p-2 border-b border-gray-100 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                    <input v-model="searchDosenQuery" type="text" placeholder="Cari nama dosen..."
                      class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                  <ul class="max-h-56 overflow-y-auto overscroll-contain custom-scrollbar py-1">
                    <template v-if="filteredRecommendedDosen.length > 0">
                      <li
                        class="px-3 py-2 bg-brand-50 text-brand-600 font-bold text-xs uppercase tracking-wider sticky top-0 z-10 border-b border-brand-100 dark:bg-brand-900/40 dark:text-brand-400 dark:border-brand-800">
                        🌟 Top 3 Rekomendasi PSO</li>
                      <li v-for="d in filteredRecommendedDosen" :key="'sek_rek_' + d.dosen_id"
                        @click="selectDosenFor('sekretaris', d.dosen_id)"
                        class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 text-gray-800 transition-colors border-b border-gray-50 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700/50"
                        :class="{ 'opacity-50 cursor-not-allowed': (isDosenSelected(d.dosen_id) && formData.sekretaris !== d.dosen_id) || isDosenMaxed(d.dosen_id) }">
                        <span class="text-brand-600 dark:text-brand-400 font-bold mr-1">#{{ d.rank }}</span> - {{
                        d.nama_dosen }}
                        <span v-if="isDosenMaxed(d.dosen_id)" class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Maks 2 Sesi/Hari)</span>
                        <span v-else-if="isDosenSelected(d.dosen_id) && formData.sekretaris !== d.dosen_id"
                          class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Sudah Terpilih)</span>
                      </li>
                    </template>
                    <template v-if="filteredOtherDosen.length > 0">
                      <li
                        class="px-3 py-2 bg-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200 mt-1 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800">
                        Daftar Dosen Lainnya</li>
                      <li v-for="d in filteredOtherDosen" :key="'sek_oth_' + d.id_dosen"
                        @click="selectDosenFor('sekretaris', d.id_dosen)"
                        class="px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors border-b border-gray-50 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700/50"
                        :class="{ 'opacity-50 cursor-not-allowed': (isDosenSelected(d.id_dosen) && formData.sekretaris !== d.id_dosen) || isDosenMaxed(d.id_dosen) }">
                        {{ d.nama_dosen }}
                        <span v-if="isDosenMaxed(d.id_dosen)" class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Maks 2 Sesi/Hari)</span>
                        <span v-else-if="isDosenSelected(d.id_dosen) && formData.sekretaris !== d.id_dosen"
                          class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Sudah Terpilih)</span>
                      </li>
                    </template>
                    <li v-if="filteredRecommendedDosen.length === 0 && filteredOtherDosen.length === 0"
                      class="px-4 py-3 text-sm text-gray-500 text-center">Dosen tidak ditemukan</li>
                  </ul>
                </div>
              </transition>
            </div>

            <div class="relative w-full z-[40] transition-all duration-300" :class="{ 'mb-64': openDropdown === 'penguji1' }" ref="penguji1Ref">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Penguji 1 <span
                  class="text-red-500">*</span></label>

              <button type="button" @click="toggleDropdown('penguji1')"
                class="flex items-center justify-between h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/20 text-left transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                <span class="truncate pr-4 font-medium">
                  {{ getDosenLabel(formData.penguji_1) || 'Pilih Penguji 1...' }}
                </span>
                <svg
                  :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': openDropdown === 'penguji1' }]"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <transition enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <div v-if="openDropdown === 'penguji1'"
                  class="absolute w-full mt-1 top-full bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <div class="p-2 border-b border-gray-100 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                    <input v-model="searchDosenQuery" type="text" placeholder="Cari nama dosen..."
                      class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                  <ul class="max-h-56 overflow-y-auto overscroll-contain custom-scrollbar py-1">
                    <template v-if="filteredRecommendedDosen.length > 0">
                      <li
                        class="px-3 py-2 bg-brand-50 text-brand-600 font-bold text-xs uppercase tracking-wider sticky top-0 z-10 border-b border-brand-100 dark:bg-brand-900/40 dark:text-brand-400 dark:border-brand-800">
                        🌟 Top 3 Rekomendasi PSO</li>
                      <li v-for="d in filteredRecommendedDosen" :key="'p1_rek_' + d.dosen_id"
                        @click="selectDosenFor('penguji_1', d.dosen_id)"
                        class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 text-gray-800 transition-colors border-b border-gray-50 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700/50"
                        :class="{ 'opacity-50 cursor-not-allowed': (isDosenSelected(d.dosen_id) && formData.penguji_1 !== d.dosen_id) || isDosenMaxed(d.dosen_id) }">
                        <span class="text-brand-600 dark:text-brand-400 font-bold mr-1">#{{ d.rank }}</span> - {{
                        d.nama_dosen }}
                        <span v-if="isDosenMaxed(d.dosen_id)" class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Maks 2 Sesi/Hari)</span>
                        <span v-else-if="isDosenSelected(d.dosen_id) && formData.penguji_1 !== d.dosen_id"
                          class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Sudah Terpilih)</span>
                      </li>
                    </template>
                    <template v-if="filteredOtherDosen.length > 0">
                      <li
                        class="px-3 py-2 bg-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200 mt-1 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800">
                        Daftar Dosen Lainnya</li>
                      <li v-for="d in filteredOtherDosen" :key="'p1_oth_' + d.id_dosen"
                        @click="selectDosenFor('penguji_1', d.id_dosen)"
                        class="px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors border-b border-gray-50 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700/50"
                        :class="{ 'opacity-50 cursor-not-allowed': (isDosenSelected(d.id_dosen) && formData.penguji_1 !== d.id_dosen) || isDosenMaxed(d.id_dosen) }">
                        {{ d.nama_dosen }}
                        <span v-if="isDosenMaxed(d.id_dosen)" class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Maks 2 Sesi/Hari)</span>
                        <span v-else-if="isDosenSelected(d.id_dosen) && formData.penguji_1 !== d.id_dosen"
                          class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Sudah Terpilih)</span>
                      </li>
                    </template>
                    <li v-if="filteredRecommendedDosen.length === 0 && filteredOtherDosen.length === 0"
                      class="px-4 py-3 text-sm text-gray-500 text-center">Dosen tidak ditemukan</li>
                  </ul>
                </div>
              </transition>
            </div>

            <div class="relative w-full z-[30] transition-all duration-300" :class="{ 'mb-64': openDropdown === 'penguji2' }" ref="penguji2Ref">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Penguji 2 <span
                  class="text-red-500">*</span></label>

              <button type="button" @click="toggleDropdown('penguji2')"
                class="flex items-center justify-between h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/20 text-left transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                <span class="truncate pr-4 font-medium">
                  {{ getDosenLabel(formData.penguji_2) || 'Pilih Penguji 2...' }}
                </span>
                <svg
                  :class="['w-4 h-4 text-gray-400 transition-transform duration-200', { 'rotate-180': openDropdown === 'penguji2' }]"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <transition enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <div v-if="openDropdown === 'penguji2'"
                  class="absolute w-full mt-1 top-full bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <div class="p-2 border-b border-gray-100 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                    <input v-model="searchDosenQuery" type="text" placeholder="Cari nama dosen..."
                      class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                  <ul class="max-h-56 overflow-y-auto overscroll-contain custom-scrollbar py-1">
                    <template v-if="filteredRecommendedDosen.length > 0">
                      <li
                        class="px-3 py-2 bg-brand-50 text-brand-600 font-bold text-xs uppercase tracking-wider sticky top-0 z-10 border-b border-brand-100 dark:bg-brand-900/40 dark:text-brand-400 dark:border-brand-800">
                        🌟 Top 3 Rekomendasi PSO</li>
                      <li v-for="d in filteredRecommendedDosen" :key="'p2_rek_' + d.dosen_id"
                        @click="selectDosenFor('penguji_2', d.dosen_id)"
                        class="px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 text-gray-800 transition-colors border-b border-gray-50 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700/50"
                        :class="{ 'opacity-50 cursor-not-allowed': (isDosenSelected(d.dosen_id) && formData.penguji_2 !== d.dosen_id) || isDosenMaxed(d.dosen_id) }">
                        <span class="text-brand-600 dark:text-brand-400 font-bold mr-1">#{{ d.rank }}</span> - {{
                        d.nama_dosen }}
                        <span v-if="isDosenMaxed(d.dosen_id)" class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Maks 2 Sesi/Hari)</span>
                        <span v-else-if="isDosenSelected(d.dosen_id) && formData.penguji_2 !== d.dosen_id"
                          class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Sudah Terpilih)</span>
                      </li>
                    </template>
                    <template v-if="filteredOtherDosen.length > 0">
                      <li
                        class="px-3 py-2 bg-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200 mt-1 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800">
                        Daftar Dosen Lainnya</li>
                      <li v-for="d in filteredOtherDosen" :key="'p2_oth_' + d.id_dosen"
                        @click="selectDosenFor('penguji_2', d.id_dosen)"
                        class="px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors border-b border-gray-50 font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700/50"
                        :class="{ 'opacity-50 cursor-not-allowed': (isDosenSelected(d.id_dosen) && formData.penguji_2 !== d.id_dosen) || isDosenMaxed(d.id_dosen) }">
                        {{ d.nama_dosen }}
                        <span v-if="isDosenMaxed(d.id_dosen)" class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Maks 2 Sesi/Hari)</span>
                        <span v-else-if="isDosenSelected(d.id_dosen) && formData.penguji_2 !== d.id_dosen"
                          class="text-red-500 text-xs ml-2 italic dark:text-red-400">(Sudah Terpilih)</span>
                      </li>
                    </template>
                    <li v-if="filteredRecommendedDosen.length === 0 && filteredOtherDosen.length === 0"
                      class="px-4 py-3 text-sm text-gray-500 text-center">Dosen tidak ditemukan</li>
                  </ul>
                </div>
              </transition>
            </div>

          </div>

          <div
            class="flex items-center gap-3 mt-6 border-t border-gray-100 pt-5 dark:border-gray-800 transition-colors">
            <button @click="closeModal" type="button"
              class="flex-1 justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] transition-colors">Batal</button>
            <button type="submit"
              :disabled="isSaving || !formData.sekretaris || !formData.penguji_1 || !formData.penguji_2"
              class="flex-1 flex justify-center items-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-50 transition-colors">
              {{ isSaving ? 'Menyimpan...' : 'Simpan Penugasan' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <Modal v-if="isDeleteModalOpen" @close="closeDeleteModal">
      <div
        class="w-full max-w-[450px] rounded-3xl bg-white p-6 dark:bg-gray-900 text-center mx-auto mt-20 z-50 shadow-2xl border border-gray-100 dark:border-gray-800 transition-colors">
        <h4 class="mb-4 text-xl font-bold text-gray-800 dark:text-white/90 transition-colors">Konfirmasi Hapus</h4>
        <p class="mb-8 text-sm text-gray-500 dark:text-gray-400 transition-colors">
          Apakah Anda yakin ingin menghapus data penugasan mahasiswa
          <br /> <strong class="text-gray-800 dark:text-white text-lg">"{{ itemToDelete?.mahasiswa?.nama_mahasiswa
            }}"</strong>?
          <br /><br /> Menghapus data ini akan melonggarkan batas sesi harian dari ketiga dosen tersebut.
        </p>
        <div class="flex items-center justify-center gap-3">
          <button @click="closeDeleteModal"
            class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto transition-colors">
            Batal
          </button>
          <button @click="confirmDelete" :disabled="isDeleting"
            class="flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto transition-colors">
            {{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Pagination from '@/components/pagination/Pagination.vue'
import Modal from '@/components/modal/Modal.vue'
import Alert from '@/components/ui/Alert.vue'
import * as XLSX from 'xlsx'

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface GenericRecord { [key: string]: unknown; }
interface TopikTA { nama_topik: string; }
interface Dosen { id_dosen: number; nama_dosen: string; nidn: string; }
interface Mahasiswa { id_mahasiswa: number; nama_mahasiswa: string; nim: string; judul_ta: string; topik_ta?: TopikTA; prodi_id?: unknown; }
interface Rekomendasi { id_rekomendasi: number; dosen_id: number; rank: string; dosen?: Dosen; nama_dosen?: string; tanggal_ujian?: string; sesi_waktu?: string; }

interface Penugasan {
  id_penugasan: number;
  mahasiswa_id: number;
  sekretaris: number;
  penguji_1: number;
  penguji_2: number;
  tanggal_ujian?: string;
  sesi_waktu?: string;
  mahasiswa?: Mahasiswa;
  dosen_sekretaris?: Dosen;
  dosen_penguji_1?: Dosen;
  dosen_penguji_2?: Dosen;
}

const alert = ref({ show: false, type: 'success' as AlertVariant, title: '', message: '' })
const showAlert = (type: AlertVariant, title: string, message: string) => {
  alert.value = { show: true, type, title, message }
  // Menambah durasi tampil agar pesan yang detail sempat terbaca
  setTimeout(() => { alert.value.show = false }, 4500)
}

const baseUrl = import.meta.env.VITE_API_BASE_URL

const userRoles = ref<string[]>([])
const userProdiId = ref<number>(0)
const activeProdiName = ref('')

const isAdmin = computed(() => userRoles.value.some(role => role.toLowerCase() === 'admin'))
const canManage = computed(() => userRoles.value.some(role => ['admin', 'kaprodi'].includes(role.toLowerCase())))

const getRawId = (dataData: unknown): number => {
  if (dataData === null || dataData === undefined) return 0;
  if (typeof dataData === 'object' && dataData !== null) {
      const obj = dataData as GenericRecord;
      const id = obj.id_prodi || obj.id_user || obj.id_topik || obj.id_mahasiswa || obj.id_dosen || obj.id;
      return Number(id) || 0;
  }
  return Number(dataData) || 0;
}

const penugasanList = ref<Penugasan[]>([])
const mahasiswaList = ref<Mahasiswa[]>([])
const dosenList = ref<Dosen[]>([])
const rekomendasiList = ref<Rekomendasi[]>([])

const isLoading = ref(true)
const isSaving = ref(false)
const isLoadingRekomendasi = ref(false)

const isModalOpen = ref(false)
const isEditing = ref(false)
const isDeleteModalOpen = ref(false)
const itemToDelete = ref<Penugasan | null>(null)
const isDeleting = ref(false)

const itemsPerPageDropdownRef = ref<HTMLElement | null>(null)
const isItemsPerPageDropdownOpen = ref(false)
const selectItemsPerPage = (val: number) => { itemsPerPage.value = val; isItemsPerPageDropdownOpen.value = false; }

const openDropdown = ref<string | null>(null)
const mahasiswaFormRef = ref<HTMLElement | null>(null)
const sekretarisRef = ref<HTMLElement | null>(null)
const penguji1Ref = ref<HTMLElement | null>(null)
const penguji2Ref = ref<HTMLElement | null>(null)

const searchMhsQuery = ref('')
const searchDosenQuery = ref('')

const filteredPenugasanList = computed(() => {
  if (isAdmin.value || userProdiId.value === 0) return penugasanList.value;
  return penugasanList.value.filter(p => getRawId(p.mahasiswa?.prodi_id) === userProdiId.value);
})

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = computed(() => filteredPenugasanList.value.length)
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPenugasanList.value.slice(start, end)
})

const formData = ref({
  id: '' as number | '',
  mahasiswa_id: '' as number | '',
  sekretaris: '' as number | '',
  penguji_1: '' as number | '',
  penguji_2: '' as number | '',
})

const selectedWaktuPso = ref({ tanggal: '', sesi: '' });

// === LOGIKA PENCEGAHAN DOSEN (MAKSIMAL 2 SESI PER HARI) ===
const currentDailyCounts = computed(() => {
  const counts: Record<number, number> = {};
  if (!selectedWaktuPso.value.tanggal) return counts;

  penugasanList.value.forEach(p => {
    if (p.tanggal_ujian === selectedWaktuPso.value.tanggal) {
      if (isEditing.value && p.id_penugasan === formData.value.id) return;

      if (p.sekretaris) counts[p.sekretaris] = (counts[p.sekretaris] || 0) + 1;
      if (p.penguji_1) counts[p.penguji_1] = (counts[p.penguji_1] || 0) + 1;
      if (p.penguji_2) counts[p.penguji_2] = (counts[p.penguji_2] || 0) + 1;
    }
  });
  return counts;
});

const isDosenMaxed = (dosenId: number) => {
  return (currentDailyCounts.value[dosenId] || 0) >= 2;
};
// ============================================================

const filteredMahasiswaOptions = computed(() => {
  if (!searchMhsQuery.value) return mahasiswaList.value;
  const q = searchMhsQuery.value.toLowerCase();
  return mahasiswaList.value.filter(m =>
    m.nama_mahasiswa.toLowerCase().includes(q) ||
    m.nim.toLowerCase().includes(q)
  );
})

const getMahasiswaLabel = (id: number | '') => {
  if (!id) return '';
  const m = mahasiswaList.value.find(x => x.id_mahasiswa === id);
  return m ? `${m.nama_mahasiswa} - ${m.nim}` : '';
}

const selectMahasiswa = (id: number) => {
  formData.value.mahasiswa_id = id;
  openDropdown.value = null;
  handleMahasiswaChange();
}

const isDosenSelected = (id_dosen: number) => {
  return formData.value.sekretaris === id_dosen ||
    formData.value.penguji_1 === id_dosen ||
    formData.value.penguji_2 === id_dosen;
}

const recommendedDosen = computed(() => {
  return rekomendasiList.value.map(rek => ({
    id_rekomendasi: rek.id_rekomendasi,
    dosen_id: rek.dosen_id,
    nama_dosen: rek.dosen?.nama_dosen || '',
    rank: rek.rank
  }))
})

const filteredRecommendedDosen = computed(() => {
  if (!searchDosenQuery.value) return recommendedDosen.value;
  const q = searchDosenQuery.value.toLowerCase();
  return recommendedDosen.value.filter(d => d.nama_dosen.toLowerCase().includes(q));
})

const otherDosen = computed(() => {
  const recIds = recommendedDosen.value.map(d => d.dosen_id);
  return dosenList.value.filter(d => !recIds.includes(d.id_dosen));
})

const filteredOtherDosen = computed(() => {
  if (!searchDosenQuery.value) return otherDosen.value;
  const q = searchDosenQuery.value.toLowerCase();
  return otherDosen.value.filter(d => d.nama_dosen.toLowerCase().includes(q));
})

const toggleDropdown = (menu: string) => {
  if (openDropdown.value === menu) {
    openDropdown.value = null;
  } else {
    openDropdown.value = menu;
    searchMhsQuery.value = '';
    searchDosenQuery.value = '';
  }
}

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as Node;
  if (itemsPerPageDropdownRef.value && !itemsPerPageDropdownRef.value.contains(target)) isItemsPerPageDropdownOpen.value = false
  if (
    mahasiswaFormRef.value && !mahasiswaFormRef.value.contains(target) &&
    sekretarisRef.value && !sekretarisRef.value.contains(target) &&
    penguji1Ref.value && !penguji1Ref.value.contains(target) &&
    penguji2Ref.value && !penguji2Ref.value.contains(target)
  ) {
    openDropdown.value = null;
  }
}

const selectDosenFor = (role: 'sekretaris' | 'penguji_1' | 'penguji_2', id_dosen: number) => {
  // Cegah jika sudah max 2 kali hari ini
  if (isDosenMaxed(id_dosen)) return;

  if (isDosenSelected(id_dosen) && formData.value[role] !== id_dosen) {
    return;
  }
  formData.value[role] = id_dosen;
  openDropdown.value = null;
}

const getDosenLabel = (id_dosen: number | '') => {
  if (!id_dosen) return '';
  const rec = recommendedDosen.value.find(d => d.dosen_id === id_dosen);
  if (rec) return `#${rec.rank} - ${rec.nama_dosen}`;

  const oth = dosenList.value.find(d => d.id_dosen === id_dosen);
  if (oth) return `${oth.nama_dosen}`;

  return '';
}

const fetchKaprodiIdentity = async () => {
    if (isAdmin.value) return;

    try {
        const response = await fetch(`${baseUrl}/auth/profile`, { method: 'GET', credentials: 'include' });
        const result = await response.json();

        if (result.success && result.data) {
            activeProdiName.value = result.data.prodi;
            const resProdi = await fetch(`${baseUrl}/prodi`, { method: 'GET', credentials: 'include' });
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

const fetchPenugasan = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${baseUrl}/penugasan`, { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (response.ok) penugasanList.value = result.data.rows || result.data || []
  } catch (error) {
    console.error("Gagal fetch penugasan:", error)
  } finally {
    isLoading.value = false
  }
}

const fetchMahasiswaAvailable = async (currentEditId: number | null = null) => {
  try {
    const response = await fetch(`${baseUrl}/mahasiswa`, { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (result.success) {
      const assignedIds = penugasanList.value.map(p => p.mahasiswa_id);
      const allMhs = result.data.rows || result.data;

      mahasiswaList.value = allMhs.filter((m: Mahasiswa) => {
        const isAvailable = !assignedIds.includes(m.id_mahasiswa) || m.id_mahasiswa === currentEditId;
        const isSameProdi = isAdmin.value || getRawId(m.prodi_id) === userProdiId.value;
        return isAvailable && isSameProdi;
      });
    }
  } catch (error) {
    console.error("Gagal fetch mahasiswa:", error)
  }
}

const fetchSemuaDosen = async () => {
  try {
    const response = await fetch(`${baseUrl}/dosen`, { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (result.success) dosenList.value = result.data.rows || result.data || []
  } catch (error) {
    console.error("Gagal fetch dosen:", error)
  }
}

const handleMahasiswaChange = async (isFromEdit = false) => {
  if (!isFromEdit) {
    formData.value.sekretaris = ''
    formData.value.penguji_1 = ''
    formData.value.penguji_2 = ''
    selectedWaktuPso.value = { tanggal: '', sesi: '' }
  }
  rekomendasiList.value = []

  if (!formData.value.mahasiswa_id) return;

  isLoadingRekomendasi.value = true
  try {
    const response = await fetch(`${baseUrl}/matching-ta/mahasiswa/${formData.value.mahasiswa_id}`, { method: 'GET', credentials: 'include' })
    const result = await response.json()
    if (response.ok) {
      let recs = [];
      if (result.data && Array.isArray(result.data)) recs = result.data;
      else if (result.data && result.data.rows) recs = result.data.rows;
      else if (Array.isArray(result)) recs = result;

      if (recs.length > 0 && !isFromEdit) {
        selectedWaktuPso.value = {
          tanggal: recs[0].tanggal_ujian || '',
          sesi: recs[0].sesi_waktu || ''
        }
      }

      rekomendasiList.value = recs.slice(0, 3);
    }
  } catch (error) {
    console.error("Gagal fetch rekomendasi:", error)
  } finally {
    isLoadingRekomendasi.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false;
  formData.value = { id: '', mahasiswa_id: '', sekretaris: '', penguji_1: '', penguji_2: '' }
  rekomendasiList.value = []
  selectedWaktuPso.value = { tanggal: '', sesi: '' }
  openDropdown.value = null
  fetchMahasiswaAvailable()
  isModalOpen.value = true
}

const openEditModal = async (item: Penugasan) => {
  isEditing.value = true;
  formData.value = {
    id: item.id_penugasan,
    mahasiswa_id: item.mahasiswa_id,
    sekretaris: item.sekretaris,
    penguji_1: item.penguji_1,
    penguji_2: item.penguji_2
  };

  selectedWaktuPso.value = {
    tanggal: item.tanggal_ujian || '',
    sesi: item.sesi_waktu || ''
  };

  openDropdown.value = null;

  await fetchMahasiswaAvailable(item.mahasiswa_id);
  await handleMahasiswaChange(true);

  isModalOpen.value = true;
}

const closeModal = () => {
  isModalOpen.value = false;
  openDropdown.value = null;
}

const submitForm = async () => {
  const { sekretaris, penguji_1, penguji_2 } = formData.value;

  // Validasi peran ganda
  if (sekretaris === penguji_1 || sekretaris === penguji_2 || penguji_1 === penguji_2) {
    showAlert('warning', 'Komposisi Penguji Tidak Valid', 'Mohon pastikan posisi Sekretaris, Penguji 1, dan Penguji 2 diisi oleh dosen yang berbeda. Satu dosen tidak dapat merangkap peran ganda untuk mahasiswa yang sama.');
    return;
  }

  isSaving.value = true;

  const findRekomendasiId = (dosenId: number | '') => {
    const rec = rekomendasiList.value.find(r => r.dosen_id === dosenId);
    return rec ? rec.id_rekomendasi : null;
  }

  try {
    const url = isEditing.value ? `${baseUrl}/penugasan/${formData.value.id}` : `${baseUrl}/penugasan`;
    const method = isEditing.value ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        mahasiswa_id: Number(formData.value.mahasiswa_id),
        sekretaris: Number(sekretaris),
        penguji_1: Number(penguji_1),
        penguji_2: Number(penguji_2),
        rekomendasi_sekretaris: findRekomendasiId(sekretaris),
        rekomendasi_penguji_1: findRekomendasiId(penguji_1),
        rekomendasi_penguji_2: findRekomendasiId(penguji_2),
        tanggal_ujian: selectedWaktuPso.value.tanggal || null,
        sesi_waktu: selectedWaktuPso.value.sesi || null
      })
    })

    const result = await response.json()

    if (response.ok) {
      const mhsLabel = getMahasiswaLabel(formData.value.mahasiswa_id);
      const mhsNameOnly = mhsLabel ? mhsLabel.split(' - ')[0] : 'mahasiswa tersebut';

      const detailedSuccessMsg = `Data tim penguji untuk ${mhsNameOnly} telah berhasil ${isEditing.value ? 'diperbarui dan disinkronkan ke dalam sistem' : 'disimpan dan dialokasikan'}.`;

      // KITA PAKSA MENGGUNAKAN PESAN DETAIL (MENGABAIKAN PESAN DARI BACKEND)
      showAlert('success', 'Penyimpanan Berhasil', detailedSuccessMsg);
      closeModal()
      fetchPenugasan()
      fetchSemuaDosen()
    } else {
      const errorMsg = result.err?.message ||
        (result.err && typeof result.err === 'string' ? result.err : null) ||
        result.message ||
        'Terjadi kesalahan saat memproses data.';

      showAlert('error', 'Gagal Menyimpan Data', `Sistem tidak dapat memproses penugasan: ${errorMsg}. Silakan periksa kembali kelengkapan form Anda.`);
    }
  } catch (error) {
    console.error("Submit error:", error)
    showAlert('error', 'Gangguan Koneksi Server', 'Terjadi masalah saat menghubungi server. Mohon periksa koneksi internet Anda atau coba beberapa saat lagi.');
  } finally {
    isSaving.value = false;
  }
}

const openDeleteModal = (item: Penugasan) => { itemToDelete.value = item; isDeleteModalOpen.value = true; }
const closeDeleteModal = () => { isDeleteModalOpen.value = false; itemToDelete.value = null; }

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    const response = await fetch(`${baseUrl}/penugasan/${itemToDelete.value.id_penugasan}`, {
      method: 'DELETE', credentials: 'include'
    })
    const result = await response.json();

    if (response.ok) {
      const mhsName = itemToDelete.value.mahasiswa?.nama_mahasiswa || 'mahasiswa tersebut';

      // KITA PAKSA MENGGUNAKAN PESAN DETAIL (MENGABAIKAN PESAN DARI BACKEND)
      showAlert('success', 'Penghapusan Berhasil', `Data penugasan atas nama ${mhsName} telah dihapus permanen. Alokasi sesi untuk ketiga dosen terkait kini telah kembali tersedia.`);
      closeDeleteModal()
      fetchPenugasan()
      fetchSemuaDosen()
    } else {
      showAlert('error', 'Penghapusan Dibatalkan', result.message || 'Sistem gagal menghapus data penugasan ini. Kemungkinan data sedang terikat dengan proses sistem lainnya.');
    }
  } catch (error) {
    console.error("Delete error:", error)
    showAlert('error', 'Gangguan Koneksi Server', 'Terjadi masalah saat mengirim instruksi hapus ke server. Pastikan jaringan stabil dan coba kembali.');
  } finally {
    isDeleting.value = false;
  }
}

const formatDateDisplay = (dateString: string) => {
  if (!dateString) return '';
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const [y, m, d] = dateString.split('-');
  return `${d} ${monthNames[parseInt(m) - 1]} ${y}`;
}

const formatSesiDisplay = (sesi: string) => {
  if (!sesi) return '';
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

const exportToExcel = () => {
  if (filteredPenugasanList.value.length === 0) {
    return showAlert('warning', 'Pengeksporan Dibatalkan', 'Tidak ada rekam data penugasan yang tersedia untuk diekspor ke dalam Excel saat ini.');
  }

  const excelData: Record<string, string | number>[] = []; let no = 1;
  filteredPenugasanList.value.forEach(item => {
      excelData.push({
          'No': no,
          'Nama Mahasiswa': item.mahasiswa?.nama_mahasiswa || '',
          'NIM': item.mahasiswa?.nim || '',
          'Judul TA': item.mahasiswa?.judul_ta || '',
          'Tanggal Pelaksanaan': item.tanggal_ujian || '-',
          'Sesi Waktu': formatSesiDisplay(item.sesi_waktu || ''),
          'Dosen Sekretaris': item.dosen_sekretaris?.nama_dosen || '',
          'Dosen Penguji 1': item.dosen_penguji_1?.nama_dosen || '',
          'Dosen Penguji 2': item.dosen_penguji_2?.nama_dosen || ''
      });
      no++;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData); const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Data Penugasan");
  XLSX.writeFile(workbook, `Data_Penugasan_TA_${new Date().toISOString().slice(0, 10)}.xlsx`);

  // MENGABAIKAN JIKA ADA GANGGUAN PESAN BAWAAN
  showAlert('success', 'Dokumen Berhasil Diunduh', 'Data rekapitulasi penugasan penguji telah diekspor. Silakan periksa folder unduhan (Downloads) di perangkat Anda.');
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick);
  try { userRoles.value = JSON.parse(localStorage.getItem('userRoles') || '[]') }
  catch { userRoles.value = (localStorage.getItem('userRoles') || '').split(',').map(r => r.trim()) }

  fetchKaprodiIdentity().then(() => {
      fetchPenugasan();
      fetchSemuaDosen();
  });
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick);
})
</script>
