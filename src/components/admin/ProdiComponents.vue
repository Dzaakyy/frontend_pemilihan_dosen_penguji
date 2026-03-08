<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">

        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left w-16 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No</p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Prodi</p>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">

          <tr v-if="isLoading">
            <td colspan="2" class="px-5 py-8 text-center text-gray-500 text-theme-sm">
              Memuat data prodi...
            </td>
          </tr>

          <tr
            v-else
            v-for="(item, index) in prodiList"
            :key="item.id"
            class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
          >
            <td class="px-5 py-4 sm:px-6">
              <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {{ index + 1 }}
              </span>
            </td>

            <td class="px-5 py-4 sm:px-6">
              <span class="block text-gray-500 text-theme-sm dark:text-gray-400">
                {{ item.nama_prodi }}
              </span>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const prodiList = ref([])
const isLoading = ref(true)

const fetchProdi = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/prodi', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    const result = await response.json()

    if (result.success) {
      prodiList.value = result.data
    } else {
      console.error("Gagal mengambil data:", result.message)
    }
  } catch (error) {
    console.error("Terjadi kesalahan jaringan:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProdi()
})
</script>
