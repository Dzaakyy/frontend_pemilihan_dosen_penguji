<template>
  <div class="flex flex-col items-center justify-between gap-4 sm:flex-row mt-4 px-2">
    <div class="text-sm text-gray-500 dark:text-gray-400">
      Menampilkan <span class="font-medium text-gray-800 dark:text-white/90">{{ startItem }}</span>
      hingga <span class="font-medium text-gray-800 dark:text-white/90">{{ endItem }}</span>
      dari <span class="font-medium text-gray-800 dark:text-white/90">{{ totalItems }}</span> data
    </div>

    <nav class="flex items-center gap-1">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z" />
        </svg>
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors',
          page === currentPage
            ? 'bg-brand-500 text-white shadow-theme-xs'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 5.29289C6.90237 5.68342 6.90237 6.31658 7.29289 6.70711L10.5858 10L7.29289 13.2929C6.90237 13.6834 6.90237 14.3166 7.29289 14.7071C7.68342 15.0976 8.31658 15.0976 8.70711 14.7071L12.7071 10.7071C13.0976 10.3166 13.0976 9.68342 12.7071 9.29289L8.70711 5.29289C8.31658 4.90237 7.68342 4.90237 7.29289 5.29289Z" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Menyelesaikan Error ESLint "multi-word"
defineOptions({
  name: 'DataPagination'
})

// Props yang diterima dari halaman utama (misal: DosenComponents)
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true }
})

const emit = defineEmits(['update:currentPage'])

// Hitung total halaman
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage) || 1)

// Hitung info "Menampilkan 1 hingga 10"
const startItem = computed(() => props.totalItems === 0 ? 0 : ((props.currentPage - 1) * props.itemsPerPage) + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

// Tampilkan maksimal 5 nomor halaman agar tidak kepanjangan
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}
</script>
