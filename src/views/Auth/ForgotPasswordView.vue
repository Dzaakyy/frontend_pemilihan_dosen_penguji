<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">

        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <router-link to="/login" class="inline-flex items-center text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 mb-6 transition-colors">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Kembali ke Login
                </router-link>
                <h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Lupa Password?
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Jangan khawatir! Masukkan email yang terdaftar, sistem akan mengirimkan instruksi pemulihan.
                </p>
              </div>

              <div>
                <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                  {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="p-4 mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                  {{ successMessage }}
                </div>

                <form @submit.prevent="handleSubmit" v-if="!successMessage">
                  <div class="space-y-5">
                    <div>
                      <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Alamat Email<span class="text-error-500">*</span>
                      </label>
                      <input v-model="email" type="email" id="email" placeholder="email.anda@domain.com"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        required />
                    </div>

                    <div>
                      <button type="submit" :disabled="isLoading"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed">
                        <svg v-if="isLoading" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isLoading ? 'Mengirim...' : 'Kirim Tautan Reset' }}
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>

        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-gray-900 lg:flex overflow-hidden">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-800/40 via-brand-950 to-brand-950 dark:from-brand-900/30 dark:via-gray-900 dark:to-gray-900 z-0"></div>

          <div class="relative z-10 flex flex-col items-center justify-center w-full p-8 text-center sm:p-12">
            <div class="w-full max-w-lg p-10 transition-all duration-500 border shadow-2xl backdrop-blur-md bg-white/5 border-white/10 rounded-3xl">
              <div class="flex justify-center mb-8">
                <div class="p-5 rounded-full bg-brand-500/20 ring-1 ring-brand-400/30 backdrop-blur-sm">
                  <svg class="w-14 h-14 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <h2 class="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Pemulihan Akses Cepat
              </h2>
              <p class="text-base leading-relaxed text-gray-300 sm:text-lg">
                Sistem Pemilihan Penguji TA menggunakan jalur aman terenkripsi untuk mengembalikan akses ke akun Anda.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

defineOptions({ name: 'ForgotPasswordView' })

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const response = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      successMessage.value = result.data?.message || 'Tautan berhasil dikirim! Silakan periksa kotak masuk email anda atau spam.'
      email.value = ''
    } else {
      errorMessage.value = result.message || 'Email tidak ditemukan atau terjadi kesalahan.'
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error)
    errorMessage.value = 'Tidak dapat terhubung ke server backend.'
  } finally {
    isLoading.value = false
  }
}
</script>
