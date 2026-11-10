<template>
    <div class="legal-page overflow-hidden position-relative">
        <div class="ambient-glow glow-1"></div>

        <div class="container position-relative z-1 py-5">
            <div class="glass-doc-header text-center mb-5 animate-slide-up">
                <span
                    class="d-inline-block px-3 py-1 mb-3 rounded-pill bg-primary bg-opacity-10 text-primary fw-bold text-uppercase tracking-wider small">
                    Kebijakan Informasi
                </span>
                <h1 class="display-4 fw-black text-gradient">Privacy Policy</h1>
                <p class="text-secondary lead max-w-700 mx-auto mt-3">
                    Komitmen kami melindungi privasi dan keamanan data Anda sesuai dengan standar perlindungan informasi
                    internasional.
                </p>
            </div>

            <div class="row justify-content-center animate-slide-up" style="animation-delay: 0.2s">
                <div class="col-lg-10 col-xl-8">
                    <div class="glass-paper p-4 p-md-5 custom-content-typography">
                        <p class="text-secondary fst-italic mb-5 border-start border-4 border-primary ps-3">Terakhir
                            diperbarui: 3 Maret 2026</p>

                        <h3 class="fw-bold text-app mb-3">1. Pengumpulan Informasi Pribadi</h3>
                        <p>Yilzi Shop mengumpulkan informasi pribadi yang Anda berikan secara langsung saat Anda:</p>
                        <ul>
                            <li>Mendaftar untuk membuat akun;</li>
                            <li>Berlangganan newsletter atau pembaruan produk;</li>
                            <li>Melakukan transaksi pembelian;</li>
                            <li>Menghubungi layanan dukungan pelanggan kami.</li>
                        </ul>
                        <p>Informasi yang kami simpan dapat meliputi nama lengkap, <em>email</em>, nomor telepon
                            (WhatsApp), serta riwayat transaksi. Kami tidak menyimpan informasi kartu kredit klien di
                            <em>database</em> lokal.</p>

                        <hr class="glass-divider my-5" />

                        <h3 class="fw-bold text-app mb-3">2. Penggunaan Informasi Pribadi</h3>
                        <p>Data yang dikumpulkan akan kami gunakan murni untuk kepentingan berikut:</p>
                        <ul>
                            <li>Memproses dan mempercepat konfirmasi pesanan aset digital Anda;</li>
                            <li>Mengirimkan lisensi atau akses ke produk yang telah Anda beli;</li>
                            <li>Berkomunikasi mengenai akun Anda, termasuk fitur keamanan akun (OTP) serta notifikasi
                                transaksi;</li>
                            <li>Mengukur performa website guna meningkatkan kualitas fitur layanan kami.</li>
                        </ul>

                        <hr class="glass-divider my-5" />

                        <h3 class="fw-bold text-app mb-3">3. Perlindungan & Keamanan Data</h3>
                        <p>Keamanan siber merupakan prioritas tertinggi kami. Seluruh lalu lintas transmisi data
                            diamankan menggunakan sambungan terenkripsi (<strong>SSL/TLS</strong>). Kredensial penting,
                            terutama kata sandi <em>(password)</em>, akan melalui metode hashing menggunakan logaritma
                            standar industri modern. Tim internal pun dibatasi aksesnya hanya kepada hal yang relevan
                            untuk keberlangsungan dukungan komersial.</p>

                        <hr class="glass-divider my-5" />

                        <h3 class="fw-bold text-app mb-3">4. Pihak Ketiga & Integrasi</h3>
                        <p>Terkadang, kami melibatkan pihak ketiga terpercaya semata-mata demi memenuhi kewajiban
                            operasional, contohnya penyedia gerbang pembayaran *(Payment Gateway)*. Mereka tunduk pada
                            kewajiban kerahasiaan yang ketat dan dilarang menyalahgunakan titik temu data.</p>
                        <div class="glass-warning my-4 p-4 rounded-4 border-start border-4 border-warning">
                            <strong>Catatan:</strong> Situs ini dilindungi oleh Google reCAPTCHA dan Kebijakan Privasi
                            serta Ketentuan Layanan Google berlaku bersamanya.
                        </div>

                        <hr class="glass-divider my-5" />

                        <h3 class="fw-bold text-app mb-3">5. Perubahan Atas Kebijakan Privasi</h3>
                        <p>Kami berhak merevisi <em>Privacy Policy</em> ini mengikuti perkembangan regulasi kapan pun
                            kami rasa perlu. Pembaruan yang signifikan akan kami beritahukan langsung melalui surel atau
                            panel pengumuman dalam portal area klien Anda.</p>

                        <div class="mt-5 pt-4 text-center">
                            <p class="text-secondary fw-medium">Jika Anda memiliki pertanyaan lebih lanjut mengenai
                                Privasi, silakan klik tombol di bawah.</p>
                            <NuxtLink to="/contact"
                                class="btn-premium px-4 py-2 mt-2 rounded-pill d-inline-block text-decoration-none">
                                Hubungi Tim Privasi Kami
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useHead } from '#app'

useHead({
    title: 'Privacy Policy - Yilzi Shop',
    meta: [
        { name: 'description', content: 'Kebijakan privasi Yilzi Shop mengenai pengumpulan, perlindungan, dan penggunaan data Anda.' }
    ]
})
</script>

<style scoped>
.legal-page {
    min-height: 100vh;
}

/* Typography */
.fw-black {
    font-weight: 900;
}

.tracking-wider {
    letter-spacing: 0.1em;
}

.text-app {
    color: var(--app-text-color);
}

.text-gradient {
    background: linear-gradient(to right, #a78bfa, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.max-w-700 {
    max-width: 700px;
}

/* Backgrounds */
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
    left: 50%;
    transform: translateX(-50%);
}

/* Glasss Surfaces */
.glass-doc-header {
    margin-top: 2rem;
}

.glass-paper {
    background: var(--app-card-bg);
    border: 1px solid var(--app-border-color);
    border-radius: 24px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}

.dark-mode .glass-paper {
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.glass-divider {
    border-color: var(--app-border-color);
    opacity: 0.5;
    width: 60%;
    margin-left: auto;
    margin-right: auto;
}

.glass-warning {
    background: rgba(245, 158, 11, 0.05);
    color: #f59e0b;
}

/* Custom Content Layout */
.custom-content-typography p {
    color: var(--app-secondary-text-color);
    line-height: 1.8;
    font-size: 1.05rem;
    margin-bottom: 1.25rem;
}

.custom-content-typography ul {
    color: var(--app-secondary-text-color);
    margin-bottom: 1.5rem;
    padding-left: 1.25rem;
}

.custom-content-typography li {
    margin-bottom: 0.75rem;
    line-height: 1.6;
    position: relative;
    list-style: none;
}

.custom-content-typography li::before {
    content: "•";
    color: #8b5cf6;
    font-weight: bold;
    position: absolute;
    left: -1.25rem;
}

.btn-premium {
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    color: white;
    border: none;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
}

.btn-premium:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(139, 92, 246, 0.6);
    color: white;
}

/* Animations */
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
