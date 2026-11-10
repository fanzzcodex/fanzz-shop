<template>
   <div class="contact-page position-relative overflow-hidden d-flex flex-column min-vh-100">
      <!-- Background Ambient Glow -->
      <div class="ambient-bg">
         <div class="glow-orb orb-1"></div>
         <div class="glow-orb orb-2"></div>
         <div class="glow-orb orb-3"></div>
      </div>

      <div class="container position-relative z-1 py-5 flex-grow-1">

         <!-- Header -->
         <div class="text-center mb-5 animate-slide-up">
            <h1 class="display-3 fw-black text-gradient mb-3">Mari Bekerja Sama</h1>
            <p class="lead text-secondary opacity-75 max-w-600 mx-auto">
               Ubah ide brilian Anda menjadi produk digital mutakhir.
               Konsultasikan kebutuhan Anda sekarang, secara gratis.
            </p>
         </div>

         <div class="row g-5 align-items-center">

            <!-- Left: Card Profil 3D Glass -->
            <div class="col-lg-5 animate-slide-right">
               <div class="profile-3d-wrapper">
                  <div class="glass-profile-card d-flex flex-column">
                     <div class="card-glow-element"></div>

                     <div class="profile-header text-center pt-5 pb-3">
                        <div class="avatar-ring mx-auto mb-4">
                           <img src="/images/profile-yilzi.jpg" alt="Andri Kusuma (Yilzi)" class="avatar-img"
                              @error="handleImgError">
                           <div class="verified-badge"><i class="bi bi-patch-check-fill"></i></div>
                        </div>
                        <h2 class="fw-black fs-2 contact-text-main mb-1">Andri Kusuma</h2>
                        <span
                           class="d-inline-flex px-3 py-1 rounded-pill bg-primary bg-opacity-25 text-primary fw-bold tracking-wider small text-uppercase">
                           Full Stack Developer
                        </span>
                     </div>

                     <div class="profile-body px-4 pb-4 text-center">
                        <p class="text-secondary mb-4 lh-lg">
                           Spesialis dalam integrasi <strong>AI</strong>, otomasi <strong>Bot WhatsApp</strong>,
                           dan solusi <strong>Web Enterprise</strong> kelas premium.
                        </p>

                        <div
                           class="stats-row d-flex justify-content-center gap-4 border-top border-secondary border-opacity-25 pt-4">
                           <div class="stat-col">
                              <span class="d-block fs-3 fw-black contact-text-main">4+</span>
                              <span
                                 class="d-block small text-secondary fw-semibold text-uppercase tracking-wider">Tahun</span>
                           </div>
                           <div class="stat-col px-4 border-start border-end border-secondary border-opacity-25">
                              <span class="d-block fs-3 fw-black contact-text-main">50+</span>
                              <span
                                 class="d-block small text-secondary fw-semibold text-uppercase tracking-wider">Proyek</span>
                           </div>
                           <div class="stat-col">
                              <span class="d-block fs-3 fw-black contact-text-main">100%</span>
                              <span
                                 class="d-block small text-secondary fw-semibold text-uppercase tracking-wider">Puas</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Right: Grid Kontak -->
            <div class="col-lg-7 animate-slide-left" style="animation-delay: 0.2s">

               <div class="contact-grid">
                  <!-- Contact Cards -->
                  <a href="https://wa.me/6281359123789" target="_blank" class="contact-glass-card hover-whatsapp">
                     <div class="icon-box whatsapp-box"><i class="bi bi-whatsapp"></i></div>
                     <div class="contact-info">
                        <h5 class="fw-bold contact-text-main mb-1">WhatsApp</h5>
                        <p class="mb-0 text-secondary small">Fast Response 24/7</p>
                     </div>
                     <i class="bi bi-arrow-up-right fs-5 text-secondary action-arrow"></i>
                  </a>

                  <a href="mailto:owner@yilzicode.com" class="contact-glass-card hover-primary">
                     <div class="icon-box email-box"><i class="bi bi-envelope-fill"></i></div>
                     <div class="contact-info">
                        <h5 class="fw-bold contact-text-main mb-1">Email Bisnis</h5>
                        <p class="mb-0 text-secondary small">owner@yilzicode.com</p>
                     </div>
                     <i class="bi bi-arrow-up-right fs-5 text-secondary action-arrow"></i>
                  </a>

                  <a href="https://instagram.com/yilzi_dominan" target="_blank"
                     class="contact-glass-card hover-instagram">
                     <div class="icon-box insta-box"><i class="bi bi-instagram"></i></div>
                     <div class="contact-info">
                        <h5 class="fw-bold contact-text-main mb-1">Instagram</h5>
                        <p class="mb-0 text-secondary small">@yilzi_dominan</p>
                     </div>
                     <i class="bi bi-arrow-up-right fs-5 text-secondary action-arrow"></i>
                  </a>

                  <a href="https://yilzicode.com" target="_blank" class="contact-glass-card hover-portfolio">
                     <div class="icon-box web-box"><i class="bi bi-globe"></i></div>
                     <div class="contact-info">
                        <h5 class="fw-bold contact-text-main mb-1">Portfolio</h5>
                        <p class="mb-0 text-secondary small">yilzicode.com</p>
                     </div>
                     <i class="bi bi-arrow-up-right fs-5 text-secondary action-arrow"></i>
                  </a>
               </div>

               <!-- Bottom Info Panel -->
               <div class="info-glass-panel mt-4 p-4 d-flex align-items-center gap-4">
                  <div
                     class="world-icon bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                     style="width: 60px; height: 60px;">
                     <i class="bi bi-geo-alt-fill fs-3"></i>
                  </div>
                  <div>
                     <h5 class="fw-bold contact-text-main mb-1">Berbasis di Indonesia 🇮🇩</h5>
                     <p class="text-secondary small mb-0 lh-base">
                        Menerima klien dari seluruh dunia. Konsultasi fleksibel menyesuaikan zona waktu Anda.
                     </p>
                  </div>
               </div>

            </div>
         </div>

      </div>
   </div>
   <Footer />
</template>

<script setup>
import { useHead } from '#app';

useHead({
   title: 'Hubungi Kami - Yilzi Shop',
   meta: [
      { name: 'description', content: 'Hubungi developer Yilzi Code untuk proyek integrasi AI, Bot WhatsApp, dan Website Enterprise.' }
   ]
})

const handleImgError = (e) => {
   e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yilzi&backgroundColor=b6e3f4'
}
</script>

<style scoped>
.contact-page {
   min-height: 100vh;
   color: var(--app-text-color);
}

/* Typography Overrides */
.text-secondary {
   color: var(--app-secondary-text-color) !important;
}

.text-white {
   color: var(--app-text-color) !important;
}

.contact-text-main {
   color: var(--app-text-color);
}

/* Helpers */
.fw-black {
   font-weight: 900;
}

.tracking-wider {
   letter-spacing: 0.1em;
}

.max-w-600 {
   max-width: 600px;
}

.text-gradient {
   background: linear-gradient(135deg, #a78bfa, #60a5fa, #818cf8);
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
   background-clip: text;
}

/* Ambient Backgrund */
.ambient-bg {
   position: absolute;
   inset: 0;
   pointer-events: none;
   z-index: 0;
   overflow: hidden;
}

.glow-orb {
   position: absolute;
   border-radius: 50%;
   filter: blur(120px);
   opacity: 0.2;
}

.orb-1 {
   width: 600px;
   height: 600px;
   background: #8b5cf6;
   top: -10%;
   left: -10%;
   animation: floatSlow 12s infinite alternate;
}

.orb-2 {
   width: 500px;
   height: 500px;
   background: #3b82f6;
   bottom: -20%;
   right: -10%;
   animation: floatSlow 15s infinite alternate-reverse;
}

.orb-3 {
   width: 400px;
   height: 400px;
   background: #e879f9;
   top: 40%;
   left: 30%;
   opacity: 0.1;
   animation: pulseGlow 10s infinite;
}

/* Profile 3D Card */
.profile-3d-wrapper {
   perspective: 1200px;
}

.glass-profile-card {
   background: var(--app-card-bg);
   border: 1px solid var(--app-border-color);
   border-radius: 32px;
   backdrop-filter: blur(20px);
   -webkit-backdrop-filter: blur(20px);
   box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
   transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s;
   transform-style: preserve-3d;
   position: relative;
   overflow: hidden;
}

.glass-profile-card:hover {
   transform: rotateY(5deg) rotateX(2deg) translateY(-10px);
   box-shadow: 0 40px 80px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
   border-color: rgba(139, 92, 246, 0.3);
}

.card-glow-element {
   position: absolute;
   top: 0;
   left: 50%;
   transform: translateX(-50%);
   width: 200px;
   height: 100px;
   background: #a78bfa;
   filter: blur(50px);
   opacity: 0.3;
   pointer-events: none;
}

.avatar-ring {
   width: 160px;
   height: 160px;
   border-radius: 50%;
   position: relative;
   background: linear-gradient(135deg, #8b5cf6, #3b82f6);
   padding: 4px;
   box-shadow: 0 15px 35px rgba(139, 92, 246, 0.4);
   transform: translateZ(30px);
   /* 3D effect */
}

.avatar-img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   border-radius: 50%;
   border: 4px solid var(--app-card-bg);
}

.verified-badge {
   position: absolute;
   bottom: 5px;
   right: 5px;
   width: 40px;
   height: 40px;
   background: var(--app-card-bg);
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   color: #38bdf8;
   font-size: 1.5rem;
   border: 3px solid #1e293b;
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.profile-header h2 {
   color: var(--app-text-color);
}

.profile-body {
   transform: translateZ(20px);
}

/* Contact Grid */
.contact-grid {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
   gap: 1.5rem;
}

.contact-glass-card {
   background: var(--app-card-bg);
   border: 1px solid var(--app-border-color);
   border-radius: 20px;
   padding: 1.5rem;
   display: flex;
   align-items: center;
   gap: 1.2rem;
   text-decoration: none;
   backdrop-filter: blur(10px);
   transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
   position: relative;
   overflow: hidden;
}

.contact-glass-card::before {
   content: "";
   position: absolute;
   inset: 0;
   background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
   transform: translateX(-100%);
   transition: transform 0.6s ease;
}

.icon-box {
   width: 54px;
   height: 54px;
   border-radius: 16px;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 1.5rem;
   color: white;
   flex-shrink: 0;
   transition: transform 0.4s;
}

/* Hover Configurations */
.contact-glass-card:hover {
   transform: translateY(-5px);
   background: var(--app-bg);
}

.contact-glass-card:hover::before {
   transform: translateX(100%);
}

.contact-glass-card:hover .action-arrow {
   color: white !important;
   transform: translate(3px, -3px) scale(1.1);
}

.contact-glass-card:hover .icon-box {
   transform: scale(1.1) rotate(5deg);
   box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.whatsapp-box {
   background: linear-gradient(135deg, #10b981, #059669);
}

.hover-whatsapp:hover {
   border-color: rgba(16, 185, 129, 0.5);
   box-shadow: 0 15px 30px rgba(16, 185, 129, 0.15);
}

.email-box {
   background: linear-gradient(135deg, #f43f5e, #e11d48);
}

.hover-primary:hover {
   border-color: rgba(244, 63, 94, 0.5);
   box-shadow: 0 15px 30px rgba(244, 63, 94, 0.15);
}

.insta-box {
   background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.hover-instagram:hover {
   border-color: rgba(220, 39, 67, 0.5);
   box-shadow: 0 15px 30px rgba(220, 39, 67, 0.15);
}

.web-box {
   background: linear-gradient(135deg, #8b5cf6, #6366f1);
}

.hover-portfolio:hover {
   border-color: rgba(139, 92, 246, 0.5);
   box-shadow: 0 15px 30px rgba(139, 92, 246, 0.15);
}

.action-arrow {
   transition: all 0.3s ease;
   margin-left: auto;
}

/* Info Panel */
.info-glass-panel {
   background: var(--app-card-bg);
   backdrop-filter: blur(10px);
   border: 1px solid var(--app-border-color);
   border-left: 4px solid #8b5cf6;
   border-radius: 20px;
}

/* Animations */
@keyframes floatSlow {
   0% {
      transform: translate(0, 0);
   }

   100% {
      transform: translate(30px, 30px);
   }
}

@keyframes pulseGlow {

   0%,
   100% {
      transform: scale(1);
      opacity: 0.1;
   }

   50% {
      transform: scale(1.2);
      opacity: 0.2;
   }
}

.animate-slide-up {
   animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.animate-slide-right {
   animation: slideRight 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.animate-slide-left {
   animation: slideLeft 1s cubic-bezier(0.16, 1, 0.3, 1) both;
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

@keyframes slideRight {
   0% {
      opacity: 0;
      transform: translateX(-40px);
   }

   100% {
      opacity: 1;
      transform: translateX(0);
   }
}

@keyframes slideLeft {
   0% {
      opacity: 0;
      transform: translateX(40px);
   }

   100% {
      opacity: 1;
      transform: translateX(0);
   }
}

@media (max-width: 991px) {
   .profile-3d-wrapper {
      margin-bottom: 2rem;
      perspective: none;
   }

   .glass-profile-card:hover {
      transform: translateY(-10px);
   }
}
</style>
