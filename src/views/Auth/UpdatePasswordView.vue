<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">

        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Buat Password Baru
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Tentukan kata sandi baru untuk akun Anda. Gunakan kombinasi yang kuat dan unik.
                </p>
              </div>

              <div>
                <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                  {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="p-5 mb-4 text-center border rounded-xl bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800">
                  <div class="flex justify-center mb-3">
                    <svg class="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 class="mb-1 text-lg font-bold text-emerald-800 dark:text-emerald-400">Pembaruan Berhasil!</h3>
                  <p class="mb-4 text-sm text-emerald-600 dark:text-emerald-500">{{ successMessage }}</p>
                  <router-link to="/login" class="inline-block px-6 py-2 text-sm font-bold text-white transition-colors rounded-lg bg-brand-500 hover:bg-brand-600 shadow-theme-xs">
                    Masuk Sekarang
                  </router-link>
                </div>

                <form @submit.prevent="handleSubmit" v-if="!successMessage" novalidate>
                  <div class="space-y-5">
                    <div>
                      <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Password Baru<span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input v-model="newPassword" :type="showPassword ? 'text' : 'password'" id="password"
                          placeholder="Minimal 6 karakter"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                          @input="errorMessage = ''"
                        />
                        <span @click="showPassword = !showPassword" class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400 hover:text-gray-700 transition-colors">
                          <svg v-if="!showPassword" class="fill-current w-5 h-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 4C6.5 4 3.5 6.3 2.4 9.5C3.5 12.7 6.5 15 10 15C13.5 15 16.5 12.7 17.6 9.5C16.5 6.3 13.5 4 10 4ZM10 13.5C7.8 13.5 6 11.7 6 9.5C6 7.3 7.8 5.5 10 5.5C12.2 5.5 14 7.3 14 9.5C14 11.7 12.2 13.5 10 13.5ZM10 7C8.6 7 7.5 8.1 7.5 9.5C7.5 10.9 8.6 12 10 12C11.4 12 12.5 10.9 12.5 9.5C12.5 8.1 11.4 7 10 7Z"/>
                          </svg>
                          <svg v-else class="fill-current w-5 h-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.6 3.6C4.3 3.3 3.9 3.3 3.6 3.6C3.3 3.9 3.3 4.3 3.6 4.6L4.8 5.9C3.7 6.8 2.9 8.1 2.4 9.5C3.5 12.7 6.5 15 10 15C11.3 15 12.4 14.7 13.5 14.2L15.4 16.1C15.7 16.4 16.1 16.4 16.4 16.1C16.7 15.8 16.7 15.4 16.4 15.1L4.6 3.6ZM12.4 13.4L10.4 11.4C10.3 11.5 10.2 11.5 10 11.5C8.9 11.5 8 10.6 8 9.5C8 9.3 8.1 9.2 8.2 9L5.9 6.7C5 7.4 4.3 8.3 3.9 9.5C4.9 11.9 7.2 13.6 10 13.6C10.8 13.6 11.6 13.5 12.4 13.4ZM16.1 9.5C15.8 10.2 15.4 10.9 14.8 11.5L15.9 12.6C16.6 11.8 17.2 10.8 17.6 9.5C16.5 6.3 13.5 4 10 4C9.1 4 8.3 4.1 7.5 4.4L8.7 5.6C9.1 5.5 9.5 5.5 10 5.5C12.8 5.5 15.1 7.3 16.1 9.5Z"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div>
                      <button type="submit" :disabled="isLoading || !token"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed">
                        <svg v-if="isLoading" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isLoading ? 'Menyimpan...' : 'Simpan Password Baru' }}
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
              <h2 class="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Aman & Terlindungi
              </h2>
              <p class="text-base leading-relaxed text-gray-300 sm:text-lg">
                Kata sandi baru Anda akan dienkripsi dengan algoritma standar industri sebelum disimpan ke dalam basis data sistem.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

defineOptions({ name: 'ResetPasswordView' })

const route = useRoute()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const token = ref('')
const newPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  token.value = (route.query.token as string) || ''
  if (!token.value) {
    errorMessage.value = 'Tautan tidak valid! Pastikan Anda mengklik tautan langsung dari email.'
  }
})

const validateInput = () => {
  if (!newPassword.value) {
    errorMessage.value = 'Password tidak boleh kosong.'
    return false
  }
  if (newPassword.value.length < 6) {
    errorMessage.value = 'Password harus memiliki minimal 6 karakter.'
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateInput()) return

  if (!token.value) return

  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await fetch(`${baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token.value,
        newPassword: newPassword.value
      })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      successMessage.value = result.data?.message || 'Password berhasil diperbarui.'
    } else {
      errorMessage.value = result.message || 'Gagal mengubah password. Token mungkin sudah kedaluwarsa.'
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error)
    errorMessage.value = 'Tidak dapat terhubung ke server backend.'
  } finally {
    isLoading.value = false
  }
}
</script>
