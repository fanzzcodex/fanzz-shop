import { ofetch } from 'ofetch'

// Declare Nuxt function for TypeScript
declare const defineNuxtPlugin: any
declare const useRuntimeConfig: any
declare const useCookie: any

export default defineNuxtPlugin(() => {
   const config = useRuntimeConfig()

   const baseURL = process.env.NODE_ENV === 'production' && !config.public.baseURL ? '' : config.public.baseURL as string;
   const api = ofetch.create({
      baseURL: baseURL,
      headers: {
         Accept: 'application/json'
      },
      onRequest({ options }) {
         const config = useRuntimeConfig()
         const cookie: any = useCookie('session_token', {
            default: () => null,
            maxAge: config.public.session_expires,
            path: '/',
            sameSite: 'lax'
         })
         const token = cookie.value?.token ?? ''

         if (token) {
            const headers = new Headers(options.headers as HeadersInit)
            headers.set('Authorization', `Bearer ${token}`)
            options.headers = headers
         }
      },
      onResponseError({ response }) {
         const data = response._data
         const isHtml = typeof data === 'string' && data.includes('<!DOCTYPE')

         if (data?.isBlocked) {
            const rtConfig = useRuntimeConfig()
            const cookie = useCookie('session_token', {
               default: () => null,
               maxAge: rtConfig.public.session_expires,
               path: '/',
               sameSite: 'lax'
            })
            cookie.value = null
            if (process.client) {
               window.location.href = '/blocked'
            }
            return
         }

         if (isHtml) {
            console.error('[v0] API Error: Received HTML instead of JSON. Backend server may not be running.')
            console.error('[v0] Expected baseURL:', config.public.baseURL)
         } else {
            console.error('[v0] API Error:', response.status, data)
         }
      }
   })

   return {
      provide: { api }
   }
})
