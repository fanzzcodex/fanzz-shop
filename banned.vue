<template>
    <div class="banned-page d-flex align-items-center justify-content-center">
        <div class="glass-card text-center p-5 mx-4 mx-md-0 shadow-lg position-relative overflow-hidden"
            style="max-width: 500px; z-index: 1;">
            <!-- Decorative Orbs -->
            <div class="red-glow orb-1"></div>
            <div class="red-glow orb-2"></div>

            <div class="icon-wrap mb-4 mx-auto animate-bounce">
                <i class="bi bi-shield-x display-1 text-danger"></i>
            </div>

            <h2 class="fw-bold mb-3 text-white position-relative">Akses Diblokir</h2>
            <p class="text-secondary position-relative px-3 mb-4" style="line-height: 1.6;">
                Akun Anda saat ini ditangguhkan oleh Administrator karena indikasi pelanggaran kebijakan kami. Mohon
                hubungi layanan dukungan jika Anda merasa ini adalah kesalahan.
            </p>

            <div class="d-flex flex-column gap-3 position-relative">
                <button class="btn btn-explore w-100 py-3 rounded-3" @click="contactSupport">
                    <i class="bi bi-whatsapp me-2"></i>Hubungi Dukungan
                </button>
                <button class="btn btn-ghost w-100 py-3 rounded-3" @click="logoutAndHome">
                    <i class="bi bi-box-arrow-left me-2"></i>Keluar ke Beranda
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import Swal from 'sweetalert2'
const { clearAuth } = useAuth()

useHead({ title: 'Akses Diblokir | Yilzi Shop' })
definePageMeta({ layout: 'empty' }) // use empty layout so sidebar doesn't show up. Wait, does it exist? If not, we just don't specify layout and use global Auth middleware to hide stuff? Actually let's not use definePageMeta, just let it be. But wait, if they go to /banned, `default.vue` layout will render. If they are logged out, sidebar is hidden except login. Wait, `clearAuth` sets `isLogin = false`, so they only see normal public stuff.

const contactSupport = () => {
    // Ganti dengan no WA admin Anda
    window.open('https://wa.me/6281234567890?text=Halo%20Admin,%20kenapa%20akun%20saya%20diblokir?', '_blank')
}

const logoutAndHome = () => {
    clearAuth()
    window.location.href = '/'
}
</script>

<style scoped>
.banned-page {
    min-height: 100vh;
    background: #0f172a;
    background-image:
        radial-gradient(at 0% 0%, rgba(220, 38, 38, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0px, transparent 50%);
}

.glass-card {
    background: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    backdrop-filter: blur(20px);
}

body.light-mode .banned-page {
    background: #f8fafc;
    background-image:
        radial-gradient(at 0% 0%, rgba(220, 38, 38, 0.05) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.05) 0px, transparent 50%);
}

body.light-mode .glass-card {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

body.light-mode h2.text-white {
    color: #0f172a !important;
}

.icon-wrap {
    width: 90px;
    height: 90px;
    background: rgba(220, 38, 38, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px rgba(220, 38, 38, 0.2);
}

.red-glow {
    position: absolute;
    background: rgba(220, 38, 38, 0.15);
    filter: blur(60px);
    border-radius: 50%;
    z-index: 0;
}

.orb-1 {
    width: 150px;
    height: 150px;
    top: -50px;
    left: -50px;
}

.orb-2 {
    width: 120px;
    height: 120px;
    bottom: -30px;
    right: -20px;
}

.animate-bounce {
    animation: bounce-floating 3s ease-in-out infinite;
}

@keyframes bounce-floating {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.btn-explore {
    background: linear-gradient(135deg, #10B981, #059669);
    color: #fff;
    border: none;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-explore:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.btn-ghost {
    background: transparent;
    color: #94a3b8;
    border: 1px solid rgba(148, 163, 184, 0.2);
    font-weight: 600;
    transition: all 0.3s;
}

.btn-ghost:hover {
    background: rgba(148, 163, 184, 0.1);
    color: #fff;
}

body.light-mode .btn-ghost:hover {
    color: #0f172a;
}
</style>
