<template>
  <div>
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
          <!-- Logo Inisial -->
          <div class="flex items-center justify-center w-20 h-20 overflow-hidden text-3xl font-bold bg-gray-200 border border-gray-200 rounded-full text-brand-500 dark:border-gray-800">
            {{ profileName.charAt(0).toUpperCase() }}
          </div>

          <div class="order-3 xl:order-2">
            <!-- Nama Asli -->
            <h4 class="mb-2 text-lg font-semibold text-center text-gray-800 capitalize dark:text-white/90 xl:text-left">
              {{ profileName }}
            </h4>

            <!-- Deretan Informasi -->
            <div class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p class="text-sm font-medium text-brand-500 dark:text-brand-400">{{ profileRole }}</p>

              <!-- HANYA TAMPIL JIKA BUKAN ADMIN -->
              <template v-if="profileRole.toLowerCase() !== 'admin'">
                <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ profileIdentity }}</p>

                <div v-if="profileProdi !== '-'" class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p v-if="profileProdi !== '-'" class="text-sm text-gray-500 dark:text-gray-400">{{ profileProdi }}</p>
              </template>

              <!-- TAMBAHAN: Email di Header -->
              <template v-if="profileEmail">
                <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <div class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  {{ profileEmail }}
                </div>
              </template>
            </div>
          </div>
          <div class="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const profileName = ref('Loading...')
const profileEmail = ref('')
const profileRole = ref('Loading...')
const profileIdentity = ref('Loading...')
const profileProdi = ref('Loading...')

const fetchProfile = async () => {
  try {
    const response = await fetch(`${baseUrl}/auth/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const result = await response.json();
    if (result.success) {
      profileName.value = result.data.nama_asli;
      profileEmail.value = result.data.email;
      profileRole.value = result.data.role;
      profileIdentity.value = result.data.identitas;
      profileProdi.value = result.data.prodi;
    }
  } catch (error) {
    console.error("Gagal mengambil profil:", error);
    profileName.value = 'Gagal memuat profil';
  }
}

const handleProfileUpdate = () => {
  fetchProfile();
}

onMounted(() => {
  fetchProfile();
  window.addEventListener('profile-updated', handleProfileUpdate);
})

onUnmounted(() => {
  window.removeEventListener('profile-updated', handleProfileUpdate);
})
</script>
