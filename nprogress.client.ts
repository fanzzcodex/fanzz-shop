import NProgress from 'nprogress'

export default defineNuxtPlugin((nuxtApp: any) => {
   const router = useRouter()

   NProgress.configure({ showSpinner: false })

   router.beforeEach(() => {
      NProgress.start()
   })

   router.afterEach(() => {
      NProgress.done()
   })
})