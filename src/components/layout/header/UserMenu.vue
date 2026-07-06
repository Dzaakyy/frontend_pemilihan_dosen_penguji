<template>
  <div class="relative" ref="dropdownRef">
    <button class="flex items-center text-gray-700 dark:text-gray-400" @click.prevent="toggleDropdown">
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11 bg-gray-200 flex items-center justify-center text-brand-500 font-bold text-lg">
        {{ currentUsername.charAt(0).toUpperCase() }}
      </span>

      <span class="block mr-1 font-medium text-theme-sm">{{ currentUsername }}</span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <div v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400 capitalize">
          {{ currentUsername }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ currentRoles }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
            <component :is="item.icon" class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <router-link to="/" @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
        <LogoutIcon class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
        Sign out
      </router-link>
    </div>
    </div>
</template>

<script setup lang="ts">
import {
  UserCircleIcon,
  ChevronDownIcon,
  LogoutIcon,
  } from '@/icons'
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const currentUsername = ref('Guest')
const currentRoles = ref('User')

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: 'Profile' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = async (event: Event) => {
  event.preventDefault()

  try {
    console.log('Signing out...')

    await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('userRoles')
    localStorage.removeItem('userData')

    closeDropdown()
    router.push('/')

  } catch (error) {
    console.error("Terjadi masalah saat logout:", error)

    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('userRoles')
    localStorage.removeItem('userData')

    closeDropdown()
    router.push('/')
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  currentUsername.value = localStorage.getItem('username') || 'Guest'

  const storedRoles = localStorage.getItem('userRoles');
  if (storedRoles) {
    try {
      const parsedRoles = JSON.parse(storedRoles);

      if (Array.isArray(parsedRoles) && parsedRoles.length > 0) {
        currentRoles.value = parsedRoles.join(', ');
      } else {
        currentRoles.value = 'User';
      }
    } catch {
      currentRoles.value = storedRoles;
    }
  } else {
    currentRoles.value = 'User';
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
