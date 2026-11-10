<template>
   <div class="error-page overflow-hidden position-relative">
      <div class="ambient-glow glow-1"></div>
      <div class="ambient-glow glow-2"></div>
      <div class="ambient-glow glow-3"></div>

      <div
         class="container min-vh-100 d-flex flex-column justify-content-center align-items-center text-center position-relative z-1">

         <!-- 3D Glitch Number -->
         <div class="error-number-wrapper animate-float">
            <h1 class="error-number text-gradient fw-black mb-0" :data-text="error?.statusCode || 404">
               {{ error?.statusCode || 404 }}
            </h1>
         </div>

         <div class="glass-error-card p-4 p-md-5 mt-4 mx-auto animate-slide-up" style="max-width: 600px;">
            <h2 class="display-6 fw-bold text-white mb-3">
               {{ error?.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan Server' }}
            </h2>
            <p class="lead text-secondary mb-4 opacity-75">
               {{ error?.message || `Maaf, tampaknya url yang Anda cari sudah tidak tersedia atau link tersebut mungkin
               rusak.` }}
            </p>

            <div class="d-flex justify-content-center gap-3 flex-wrap">
               <button @click="handleError"
                  class="btn-premium px-5 py-3 rounded-pill d-inline-flex align-items-center gap-2">
                  <i class="bi bi-house-door-fill"></i> Kembali ke Beranda
               </button>
               <button @click="$router.back()"
                  class="btn-glass px-4 py-3 rounded-pill d-inline-flex align-items-center gap-2">
                  <i class="bi bi-arrow-left"></i> Sebelumnya
               </button>
            </div>
         </div>

      </div>
   </div>
</template>

<script setup>
const props = defineProps({
   error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<style scoped>
.error-page {
   background: #0f172a;
   min-height: 100vh;
   color: #f8fafc;
}

/* Typography Overrides */
.text-secondary {
   color: #94a3b8 !important;
}

.text-white {
   color: #ffffff !important;
}

.fw-black {
   font-weight: 900;
}

.text-gradient {
   background: linear-gradient(to bottom, #a78bfa 0%, #3b82f6 100%);
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
   background-clip: text;
}

/* Ambient Backround */ 
.ambient-glow {
   position: absolute;
   border-radius: 50%;
   filter: blur(120px);
   opacity: 0.15;
   pointer-events: none;
}

.glow-1 {
   width: 500px;
   height: 500px;
   background: #8b5cf6;
   top: -10%;
   left: 10%;
   animation: pulse 10s infinite alternate;
}

.glow-2 {
   width: 400px;
   height: 400px;
   background: #3b82f6;
   bottom: -10%;
   right: 10%;
   animation: pulse 12s infinite alternate-reverse;
}

.glow-3 {
   width: 300px;
   height: 300px;
   background: #ec4899;
   top: 40%;
   left: 40%;
   opacity: 0.1;
}

.error-number-wrapper {
   position: relative;
}

.error-number {
   font-size: clamp(8rem, 25vw, 15rem);
   line-height: 1;
   letter-spacing: -1rem;
   text-shadow: 0 20px 50px rgba(139, 92, 246, 0.3);
}

.glass-error-card {
   background: rgba(30, 41, 59, 0.5);
   border: 1px solid rgba(255, 255, 255, 0.1);
   border-radius: 32px;
   backdrop-filter: blur(20px);
   -webkit-backdrop-filter: blur(20px);
   box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-premium {
   background: linear-gradient(135deg, #8b5cf6, #3b82f6);
   color: white;
   border: none;
   font-weight: 700;
   border: 1px solid rgba(255, 255, 255, 0.2);
   transition: all 0.3s ease;
   box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
}

.btn-premium:hover {
   transform: translateY(-3px);
   box-shadow: 0 15px 35px rgba(139, 92, 246, 0.6);
   color: white;
}

.btn-glass {
   background: rgba(255, 255, 255, 0.05);
   color: white;
   border: 1px solid rgba(255, 255, 255, 0.1);
   font-weight: 600;
   transition: all 0.3s ease;
}

.btn-glass:hover {
   background: rgba(255, 255, 255, 0.1);
   transform: translateY(-3px);
   color: white;
   border-color: rgba(255, 255, 255, 0.3);
}

/* Animations */
@keyframes pulse {
   0% {
      opacity: 0.1;
   }

   100% {
      opacity: 0.25;
      transform: scale(1.1);
   }
}

.animate-float {
   animation: floatSlow 6s ease-in-out infinite;
}

@keyframes floatSlow {

   0%,
   100% {
      transform: translateY(0);
   }

   50% {
      transform: translateY(-20px);
   }
}

.animate-slide-up {
   animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
   animation-delay: 0.2s;
}

@keyframes slideUp {
   0% {
      opacity: 0;
      transform: translateY(40px);
   }

   100% {
      opacity: 1;
      transform: translateY(0);
   }
}
</style>