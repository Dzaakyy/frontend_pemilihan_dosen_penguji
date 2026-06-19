<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">

        <!-- Sisi Kiri: Form Login -->
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Sign In
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Masukkan username dan password Anda untuk masuk!
                </p>
              </div>

              <div>
                <div v-if="errorMessage"
                  class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
                  {{ errorMessage }}
                </div>

                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5">
                    <div>
                      <label for="username" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Username<span class="text-error-500">*</span>
                      </label>
                      <input v-model="username" type="text" id="username" placeholder="Masukkan username Anda"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        required />
                    </div>

                    <div>
                      <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Password<span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password"
                          placeholder="Masukkan password Anda"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                          required />
                        <span @click="togglePasswordVisibility"
                          class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                          <svg v-if="!showPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                              fill="currentColor" />
                          </svg>
                          <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                              fill="currentColor" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <router-link to="/reset-password"
                        class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium transition-colors">
                        Forgot password?
                      </router-link>
                    </div>

                    <div>
                      <button type="submit" :disabled="isLoading"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed">
                        <svg v-if="isLoading" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isLoading ? 'Memproses...' : 'Sign In' }}
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>

        <!-- Sisi Kanan: Hero / Banner -->
        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-gray-900 lg:flex overflow-hidden">
          <!-- Efek Gradient Latar Belakang agar tidak flat -->
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-800/40 via-brand-950 to-brand-950 dark:from-brand-900/30 dark:via-gray-900 dark:to-gray-900 z-0"></div>

          <!-- Pola Grid Transparan -->
          <common-grid-shape class="absolute inset-0 z-0 opacity-40 mix-blend-overlay" />

          <!-- Konten Utama (Glassmorphism Card) -->
          <div class="relative z-10 flex flex-col items-center justify-center w-full p-8 text-center sm:p-12">
            <div class="w-full max-w-lg p-10 transition-all duration-500 border shadow-2xl backdrop-blur-md bg-white/5 border-white/10 rounded-3xl hover:bg-white/10">

              <!-- Ikon SVG Representatif -->
              <div class="flex justify-center mb-8">
                <div class="p-5 rounded-full bg-brand-500/20 ring-1 ring-brand-400/30 backdrop-blur-sm">
                  <svg class="w-14 h-14 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
              </div>

              <!-- Judul Utama -->
              <h2 class="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Sistem Pemilihan Penguji TA
              </h2>

              <!-- Deskripsi Algoritma & Manfaat -->
              <p class="text-base leading-relaxed text-gray-300 sm:text-lg">
                Platform otomatisasi cerdas berbasis web. Mengoptimalkan penentuan dosen penguji secara adil dan transparan menggunakan algoritma <span class="font-semibold text-brand-300">Particle Swarm Optimization (PSO)</span>.
              </p>

              <!-- Tags / Badges Estetik -->
              <div class="flex flex-wrap justify-center gap-3 mt-10">
                <span class="px-4 py-1.5 text-xs font-medium tracking-wide text-brand-200 rounded-full bg-brand-800/40 border border-brand-700/50 backdrop-blur-sm shadow-sm">Cerdas</span>
                <span class="px-4 py-1.5 text-xs font-medium tracking-wide text-brand-200 rounded-full bg-brand-800/40 border border-brand-700/50 backdrop-blur-sm shadow-sm">Otomatis</span>
                <span class="px-4 py-1.5 text-xs font-medium tracking-wide text-brand-200 rounded-full bg-brand-800/40 border border-brand-700/50 backdrop-blur-sm shadow-sm">Akurat</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

defineOptions({
  name: 'SignInView'
})
const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', result.data.username)
      localStorage.setItem('namaAsli', result.data.nama_asli || result.data.username)
      localStorage.setItem('identitas', result.data.identitas || '-')

      const userId = result.data.id || result.data.id_user;
      if (userId) {
          localStorage.setItem('userData', JSON.stringify({ id_user: userId }));
      }

      let rolesArray: string[] = [];
      const userRolesData = result.data.roles || result.data.role;

      if (userRolesData) {
        if (Array.isArray(userRolesData)) {
          rolesArray = userRolesData.map((r: { nama?: string } | string) => {
            if (typeof r === 'object' && r !== null && r.nama) return r.nama;
            return String(r);
          });
        } else if (typeof userRolesData === 'string') {
          rolesArray = userRolesData.split(',').map(r => r.trim());
        }
      }

      if (rolesArray.length === 0) rolesArray = ['User'];
      localStorage.setItem('userRoles', JSON.stringify(rolesArray));

      const rolesLower = rolesArray.map(r => r.toLowerCase());

      if (rolesLower.includes('admin') || rolesLower.includes('kaprodi')) {
        router.push('/dashboard');
      } else if (rolesLower.includes('dosen')) {
        router.push('/mahasiswa-diuji');
      } else if (rolesLower.includes('mahasiswa')) {
        router.push('/dosen-penguji');
      } else {
        router.push('/profile');
      }

    } else {
      errorMessage.value = result.message || 'Gagal login, periksa username dan password Anda.'
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat login:', error)
    errorMessage.value = 'Tidak dapat terhubung ke server (Pastikan server backend nyala).'
  } finally {
    isLoading.value = false
  }
}
</script>
