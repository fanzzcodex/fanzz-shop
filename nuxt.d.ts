/// <reference types="nuxt" />

declare global {
  const defineNuxtConfig: typeof import('nuxt/config')['defineNuxtConfig']
  const definePageMeta: typeof import('nuxt/dist/pages/runtime/composables')['definePageMeta']
  const defineNuxtPlugin: typeof import('nuxt/dist/app/nuxt')['defineNuxtPlugin']
  const defineNuxtRouteMiddleware: typeof import('nuxt/dist/app/composables/router')['defineNuxtRouteMiddleware']
}

export {}
