<template>
   <div class="blocked-page">
      <div class="blocked-gradient-orb orb-1"></div>
      <div class="blocked-gradient-orb orb-2"></div>

      <div class="blocked-container animate-slide-up">
         <!-- Blocked Card -->
         <div class="blocked-card text-center text-white p-5">
            <div class="icon-wrap mx-auto mb-4">
               <div class="icon-glow"></div>
               <i class="bi bi-shield-lock-fill display-1 position-relative z-index-2 text-danger"></i>
            </div>
            
            <h1 class="fw-bolder mb-3" style="font-size: 2.5rem; letter-spacing:-0.5px;">Akses Ditolak!</h1>
            <p class="text-secondary fs-5 pb-2 mb-4">Akun Anda telah ditangguhkan oleh Administrator karena dugaan pelanggaran Ketentuan Layanan. Anda tidak dapat lagi mengakses layanan ini.</p>
            
            <div class="alert alert-dark border border-danger border-opacity-25 bg-danger bg-opacity-10 d-inline-block text-start" role="alert" style="border-radius:15px; max-width: 400px; margin:0 auto;">
               <div class="d-flex align-items-center">
                  <i class="bi bi-info-circle-fill text-danger fs-3 me-3"></i>
                  <div>
                     <strong class="d-block text-danger">Status Akun: Diblokir</strong>
                     <small class="text-secondary">Silakan hubungi dukungan pelanggan jika Anda merasa ini adalah kesalahan sistem.</small>
                  </div>
               </div>
            </div>

            <div class="mt-5 d-flex gap-3 justify-content-center flex-column flex-sm-row">
               <a :href="contactUrl" target="_blank" class="btn btn-danger btn-lg px-4 fs-6 fw-bold shadow">
                  <i class="bi bi-headset me-2"></i>Hubungi Customer Support
               </a>
               <NuxtLink to="/login" class="btn btn-outline-secondary text-white btn-lg px-4 fs-6 fw-bold">
                   Kembali ke Beranda
               </NuxtLink>
            </div>
         </div>
         
         <div class="security-note text-center mt-4 text-secondary opacity-50 small">
            <i class="bi bi-shield-check me-1"></i> Keamanan Sistem oleh {{ config.public.webName || 'Yilzi Shop' }}
         </div>
      </div>
   </div>
</template>

<script setup>
const config = useRuntimeConfig()
useHead({ title: 'Akun Diblokir' })

const contactUrl = config.public.mainSite + '/contact'
</script>

<style scoped>
.blocked-page {
   min-height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 2rem 1rem;
   background: var(--app-bg-color);
   position: relative;
   overflow: hidden;
}

.blocked-gradient-orb {
   position: absolute;
   border-radius: 50%;
   filter: blur(150px);
   opacity: 0.2;
   pointer-events: none;
   animation: pulse 8s ease-in-out infinite alternate;
}

.orb-1 { width: 500px; height: 500px; background: #dc3545; top: -100px; left: -100px; }
.orb-2 { width: 400px; height: 400px; background: #7f1d1d; bottom: -50px; right: -50px; animation-delay: -4s; }

.blocked-container {
   max-width: 600px;
   width: 100%;
   z-index: 10;
   position: relative;
}

.blocked-card {
   background: rgba(20, 20, 20, 0.7);
   backdrop-filter: blur(20px);
   border: 1px solid rgba(220, 53, 69, 0.2);
   border-radius: 24px;
   box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

body.light-mode .blocked-card {
   background: rgba(255, 255, 255, 0.9);
   border: 1px solid rgba(220, 53, 69, 0.15);
   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
   color: #1a1a1a !important;
}
body.light-mode .blocked-card h1 { color: #1a1a1a; }
body.light-mode .blocked-card p.text-secondary { color: #6c757d !important; }

.icon-wrap {
   width: 120px;
   height: 120px;
   border-radius: 50%;
   background: rgba(220, 53, 69, 0.1);
   display: flex;
   align-items: center;
   justify-content: center;
   position: relative;
}

.icon-glow {
   position: absolute;
   width: 100%;
   height: 100%;
   border-radius: 50%;
   background: #dc3545;
   filter: blur(35px);
   opacity: 0.3;
   animation: pulse-glow 2s infinite alternate;
}

.animate-slide-up {
   animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-up {
   0% { opacity: 0; transform: translateY(30px) scale(0.95); }
   100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
@keyframes pulse-glow { 0% { opacity: 0.2; transform: scale(0.9); } 100% { opacity: 0.5; transform: scale(1.1); } }
</style>
