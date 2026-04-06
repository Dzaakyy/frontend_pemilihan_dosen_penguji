<template>
  <div>
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div class="flex items-center justify-center w-20 h-20 overflow-hidden text-3xl font-bold bg-gray-200 border border-gray-200 rounded-full text-brand-500 dark:border-gray-800">
            {{ profileName.charAt(0).toUpperCase() }}
          </div>
          <div class="order-3 xl:order-2">
            <h4 class="mb-2 text-lg font-semibold text-center text-gray-800 capitalize dark:text-white/90 xl:text-left">
              {{ profileName }}
            </h4>
            <div class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ profileRole }}</p>
              <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ profileIdentity }}</p>
              <div v-if="profileProdi !== '-'" class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p v-if="profileProdi !== '-'" class="text-sm text-gray-500 dark:text-gray-400">{{ profileProdi }}</p>
            </div>
          </div>
          <div class="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const profileName = ref('Loading...')
const profileRole = ref('Loading...')
const profileIdentity = ref('Loading...')
const profileProdi = ref('Loading...')

const fetchProfile = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const result = await response.json();
    if (result.success) {
      profileName.value = result.data.nama_asli;
      profileRole.value = result.data.role;
      profileIdentity.value = result.data.identitas;
      profileProdi.value = result.data.prodi;
    }
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
    profileName.value = 'Gagal memuat profil';
  }
}

onMounted(() => {
  fetchProfile();
})
</script>
