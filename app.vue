<template>
   <div class="d-flex flex-column flex-grow-1 min-vh-100 w-100">
      <SecurityCheck />
      <Preloader />
      <NuxtLayout class="flex-grow-1 d-flex flex-column" />
   </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
   // Initialize theme on app load - this ensures the correct theme is applied before the user sees the page
   if (process.client) {
      const savedTheme = localStorage.getItem('theme') || 'dark'
      const htmlElement = document.documentElement
      const bodyElement = document.body

      bodyElement.classList.remove('light-mode', 'dark-mode')
      if (savedTheme === 'dark') {
         bodyElement.classList.add('dark-mode')
         htmlElement.setAttribute('data-theme', 'dark')
         htmlElement.setAttribute('data-bs-theme', 'dark')
      } else {
         bodyElement.classList.add('light-mode')
         htmlElement.setAttribute('data-theme', 'light')
         htmlElement.setAttribute('data-bs-theme', 'light')
      }
   }
})
</script>
