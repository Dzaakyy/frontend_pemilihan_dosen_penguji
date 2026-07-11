<template>
  <router-link to="/" class="lg:hidden flex items-center">
    <img class="dark:hidden w-[120px] h-auto object-contain" src="/images/logo/logo.svg" alt="Logo" />
    <img class="hidden dark:block w-[120px] h-auto object-contain" src="/images/logo/logo.svg" alt="Logo" />
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
