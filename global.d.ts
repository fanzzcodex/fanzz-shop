import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { Ref } from 'vue'

interface GoogleCredentialResponse {
   credential: any
}

interface GoogleAccounts {
   accounts: any
   id: {
      initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void; }) => void
      renderButton: (parent: HTMLElement | null, options: { theme?: string; size?: string; width?: string; }) => void
      prompt: () => void
   }
}

declare global {
   interface Window {
      google: GoogleAccounts
   }
   
   // Nuxt composables - these are available globally in Nuxt 3, so we declare them here for TypeScript
   const useNuxtApp: () => any
   const useRuntimeConfig: () => any
   const useRoute: () => RouteLocationNormalizedLoaded
   const useRouter: () => Router
   const useCookie: <T = any>(name: string, options?: any) => Ref<T>
   const useHead: (meta: any) => void
   const navigateTo: (to: string | any, options?: any) => Promise<void>
   const defineNuxtPlugin: (plugin: any) => any
   const defineNuxtRouteMiddleware: (middleware: any) => any
   
   // Custom composables
   const useAuth: () => any
   const usePageEffects: () => any
}

export { }