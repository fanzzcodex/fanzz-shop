<template>
    <div class="offline-page overflow-hidden position-relative">
        <div class="ambient-glow glow-1"></div>

        <div
            class="container min-vh-100 d-flex flex-column justify-content-center align-items-center text-center position-relative z-1">

            <div class="glass-offline-card p-4 p-md-5 mx-auto animate-slide-up" style="max-width: 500px;">
                <div class="icon-wrapper mb-4 mx-auto d-flex justify-content-center align-items-center">
                    <i class="bi bi-wifi-off display-2 text-danger"></i>
                </div>

                <h2 class="display-6 fw-bold text-white mb-3">
                    Anda Sedang Offline
                </h2>
                <p class="lead text-secondary mb-4 opacity-75 fs-5">
                    Tampaknya koneksi internet Anda terputus. Silakan periksa jaringan Wi-Fi atau Data Seluler Anda,
                    lalu coba segarkan halaman.
                </p>

                <button @click="reloadPage"
                    class="btn-premium px-5 py-3 rounded-pill d-inline-flex align-items-center gap-2">
                    <i class="bi bi-arrow-clockwise"></i> Coba Lagi
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useHead } from '#app'

useHead({ title: 'Offline - Yilzi Shop' })

const reloadPage = () => {
    if (typeof window !== 'undefined') {
        window.location.reload()
    }
}
</script>

<style scoped>
.offline-page {
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

/* Ambient Background */
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
    background: #ef4444;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    animation: pulse 10s infinite alternate;
}

.icon-wrapper {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid rgba(239, 68, 68, 0.3);
}

.glass-offline-card {
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 32px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-premium {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border: none;
    font-weight: 700;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4);
}

.btn-premium:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(239, 68, 68, 0.6);
    color: white;
}

/* Animations */
@keyframes pulse {
    0% {
        opacity: 0.1;
    }

    100% {
        opacity: 0.2;
        transform: translateX(-50%) scale(1.1);
    }
}

.animate-slide-up {
    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
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
