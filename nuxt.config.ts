// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: '2026-02-09',
   ssr: false,
   nitro: {
      preset: 'vercel-static'
   },
   devtools: { enabled: false },
   vite: {
      server: {
         allowedHosts: true
      }
   },
   devServer: {
      host: 'localhost',
      port: 5173
   },
   css: [
      '~/assets/css/theme.css',
      '~/assets/css/global.css',
      '~/assets/css/modern.css',
      '~/assets/css/pages.css',
      '~/assets/css/style.min.css',
      'sweetalert2/dist/sweetalert2.min.css',
      '~/assets/css/overrides.css'
   ],
   app: {
      head: {
         title: process.env.NUXT_PUBLIC_TITLE || 'Your Shop Name',
         titleTemplate: `%s - ${process.env.NUXT_PUBLIC_TITLE || 'Your Shop Name'}`,
         meta: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
            { name: 'author', content: process.env.AUTHOR_NAME || 'Your Name' },
            { name: 'description', content: process.env.NUXT_PUBLIC_DESCRIPTION || 'Toko produk digital premium, script, tools, dan website berkualitas tinggi.' },
            { property: 'og:title', content: process.env.NUXT_PUBLIC_TITLE || 'Your Shop Name' },
            { property: 'og:description', content: process.env.NUXT_PUBLIC_DESCRIPTION || 'Toko produk digital premium, script, tools, dan website berkualitas tinggi.' },
            { property: 'og:url', content: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000' },
            { property: 'og:site_name', content: process.env.NUXT_PUBLIC_TITLE || 'Your Shop Name' },
            { property: 'og:keywords', content: 'Produk digital, script premium, website, tools otomasi, toko digital, download script' },
            { property: 'og:type', content: 'website' }
         ],
         link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css', crossorigin: 'anonymous' }
         ],
         script: [
            { src: 'https://accounts.google.com/gsi/client', async: true, defer: true },
            { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', crossorigin: 'anonymous' }
         ]
      }
   },
   runtimeConfig: {
      public: {
         baseURL: process.env.NUXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'),
         session_expires: 3 * 24 * 60 * 60,
         downloadLinkExpiresInHours: 1,
         title: process.env.NUXT_PUBLIC_TITLE || 'Your Shop Name',
         description: process.env.NUXT_PUBLIC_DESCRIPTION || 'Toko produk digital premium, script, tools, dan website berkualitas tinggi.',
         hero: {
            tagline: process.env.NUXT_PUBLIC_TITLE || 'Your Shop Name',
            title: 'Produk Digital Premium',
            highlight: 'Menyediakan berbagai produk digital, script, website, dan tools otomasi berkualitas tinggi untuk kebutuhan bisnis Anda.'
         },
         googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
         recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
         tax: 1.5,
         links: [{
            name: 'Personal Blog',
            url: '#'
         }, {
            name: 'Portfolio',
            url: '#'
         }, {
            name: 'API Documentation',
            url: '#'
         }],
         contacts: [{
            name: 'WhatsApp',
            url: `https://wa.me/${process.env.NUXT_PUBLIC_CONTACT_WHATSAPP || '628123456789'}`
         }, {
            name: 'Telegram',
            url: `https://t.me/${process.env.NUXT_PUBLIC_CONTACT_TELEGRAM || 'YourTelegram'}`
         }, {
            name: 'Email',
            url: `mailto:${process.env.ADMIN_EMAIL || 'admin@yourdomain.com'}`
         }]
      }
   }
})
