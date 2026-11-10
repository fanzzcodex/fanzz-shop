<template>
    <div class="auth-page">
        <div class="auth-gradient-orb orb-1"></div>
        <div class="auth-gradient-orb orb-2"></div>

        <div class="auth-container animate-slide-up">
            <div class="text-center mb-4">
                <div class="auth-badge"><i class="bi bi-key-fill me-2"></i>Reset Password</div>
                <h1 class="auth-title">Lupa Password?</h1>
                <p class="auth-subtitle">Masukkan email untuk mendapatkan kode verifikasi</p>
            </div>

            <div class="auth-card">
                <!-- Step 1: Enter Email -->
                <div v-if="step === 'email'" class="auth-form">
                    <div class="form-group">
                        <label>Email Akun</label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-envelope"></i>
                            <input type="email" v-model="email" placeholder="nama@contoh.com"
                                @keyup.enter="requestReset" :disabled="isLoading">
                        </div>
                    </div>
                    <div v-if="errorMsg" class="error-banner"><i class="bi bi-exclamation-triangle-fill me-2"></i>{{
                        errorMsg }}</div>
                    <button @click="requestReset" class="btn-auth-primary" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>Lanjutkan
                    </button>
                    <div class="text-center mt-3">
                        <NuxtLink to="/login" class="auth-link"><i class="bi bi-arrow-left me-1"></i>Kembali ke Login
                        </NuxtLink>
                    </div>
                </div>

                <!-- Step 2: Choose OTP Method -->
                <div v-if="step === 'choose-otp'" class="auth-form">
                    <div class="text-center mb-4">
                        <div class="otp-icon-wrap"><i class="bi bi-shield-check"></i></div>
                        <h5 class="fw-bold mt-3">Pilih Metode Verifikasi</h5>
                        <p class="text-secondary" style="font-size:0.85rem">Pilih cara untuk menerima kode OTP reset
                            password</p>
                    </div>

                    <button @click="sendOTP('email')" class="otp-method-btn" :disabled="isLoading">
                        <i class="bi bi-envelope-fill"></i>
                        <div>
                            <strong>Email</strong>
                            <small>Kirim OTP ke {{ email }}</small>
                        </div>
                        <i class="bi bi-chevron-right"></i>
                    </button>

                    <button v-if="userPhone" @click="sendOTP('wa')" class="otp-method-btn" :disabled="isLoading">
                        <i class="bi bi-whatsapp"></i>
                        <div>
                            <strong>WhatsApp</strong>
                            <small>Kirim OTP ke {{ userPhone }}</small>
                        </div>
                        <i class="bi bi-chevron-right"></i>
                    </button>

                    <div v-if="errorMsg" class="error-banner mt-3"><i
                            class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMsg }}</div>

                    <div class="text-center mt-3">
                        <button @click="step = 'email'" class="btn btn-sm btn-link text-secondary text-decoration-none"
                            :disabled="isLoading">
                            <i class="bi bi-arrow-left me-1"></i>Kembali
                        </button>
                    </div>
                </div>

                <!-- Step 3: Enter OTP + New Password -->
                <div v-if="step === 'verify'" class="auth-form">
                    <div class="text-center mb-4">
                        <div class="otp-icon-wrap"><i class="bi bi-envelope-check"></i></div>
                        <h5 class="fw-bold mt-3">Masukkan Kode OTP</h5>
                        <p class="text-secondary" style="font-size:0.85rem">Kode dikirim ke {{ otpTarget }}</p>
                    </div>

                    <div class="otp-input-wrap mb-3">
                        <input v-for="(val, i) in otpValues" :key="i" type="text" maxlength="1" class="otp-digit"
                            :class="{ 'filled': otpValues[i] }" :ref="el => otpInputs[i] = el" v-model="otpValues[i]"
                            @input="handleOTPInput(i, $event)" @keydown.backspace="handleOTPBackspace(i, $event)"
                            :disabled="isLoading">
                    </div>

                    <div class="form-group">
                        <label>Password Baru</label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-lock"></i>
                            <input :type="showPassword ? 'text' : 'password'" v-model="newPassword"
                                placeholder="Min. 6 karakter" :disabled="isLoading">
                            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Konfirmasi Password Baru</label>
                        <div class="input-icon-wrap">
                            <i class="bi bi-lock-fill"></i>
                            <input :type="showPassword ? 'text' : 'password'" v-model="confirmPassword"
                                placeholder="Ulangi password baru" @keyup.enter="verifyAndReset" :disabled="isLoading">
                        </div>
                    </div>

                    <div v-if="errorMsg" class="error-banner"><i class="bi bi-exclamation-triangle-fill me-2"></i>{{
                        errorMsg }}</div>
                    <div v-if="successMsg" class="success-banner"><i class="bi bi-check-circle-fill me-2"></i>{{
                        successMsg }}</div>

                    <button @click="verifyAndReset" class="btn-auth-primary"
                        :disabled="isLoading || otpCode.length !== 6">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>Reset Password
                    </button>

                    <div class="d-flex justify-content-between mt-4">
                        <button @click="step = 'choose-otp'"
                            class="btn btn-sm btn-link text-secondary text-decoration-none" :disabled="isLoading">
                            <i class="bi bi-arrow-left me-1"></i>Ubah Metode
                        </button>
                        <button @click="sendOTP(otpMethod)"
                            class="btn btn-sm btn-link border-0 bg-transparent text-primary text-decoration-none fw-bold"
                            style="color:var(--primary-gradient-start) !important" :disabled="isLoading">
                            Kirim Ulang OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const config = useRuntimeConfig()
const { $api } = useNuxtApp()
const router = useRouter()

useHead({ title: 'Reset Password - Yilzi Shop' })

const step = ref('email')
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const showPassword = ref(false)
const userPhone = ref('')
const otpTarget = ref('')
const otpMethod = ref('')
const otpInputs = ref([])
const otpValues = ref(['', '', '', '', '', ''])

const otpCode = computed(() => otpValues.value.join(''))

const loadRecaptcha = () => {
    if (document.getElementById('recaptcha-script')) return
    const s = document.createElement('script')
    s.id = 'recaptcha-script'
    s.src = `https://www.google.com/recaptcha/api.js?render=${config.public.recaptchaSiteKey}`
    document.head.appendChild(s)
}

const getRecaptchaToken = async (action) => {
    try {
        if (!config.public.recaptchaSiteKey) return 'dummy-token'
        if (!window.grecaptcha) return 'dummy-token'
        await new Promise(r => window.grecaptcha.ready(r))
        const token = await window.grecaptcha.execute(config.public.recaptchaSiteKey, { action })
        return token || 'dummy-token'
    } catch { return 'dummy-token' }
}

// Step 1: Enter email -> check user exists, get phone info
const requestReset = async () => {
    if (!email.value) { errorMsg.value = 'Email wajib diisi'; return }
    isLoading.value = true; errorMsg.value = ''
    try {
        const res = await $api('/api/v1/reset-password', {
            method: 'POST',
            body: { email: email.value, step: 'request', recaptchaToken: await getRecaptchaToken('reset') }
        })
        if (res.status && res.data?.requireChoice) {
            userPhone.value = res.data.phone || ''
            step.value = 'choose-otp'
        } else if (res.status) {
            step.value = 'choose-otp'
        } else {
            errorMsg.value = res.msg
        }
    } catch (err) { errorMsg.value = err.data?.msg || 'Email tidak ditemukan' }
    finally { isLoading.value = false }
}

// Step 2: Send OTP via chosen method
const sendOTP = async (method) => {
    isLoading.value = true; errorMsg.value = ''
    otpMethod.value = method

    try {
        const res = await $api('/api/v1/reset-password', {
            method: 'POST',
            body: {
                email: email.value,
                step: 'request',
                otpMethod: method,
                recaptchaToken: await getRecaptchaToken('reset_otp')
            }
        })
        if (res.status && res.data?.useOTP) {
            otpTarget.value = res.data.target
            step.value = 'verify'
            otpValues.value = ['', '', '', '', '', '']
        } else {
            errorMsg.value = res.msg || 'Gagal mengirim OTP'
        }
    } catch (err) {
        const msg = err.data?.msg || 'Gagal mengirim OTP'
        errorMsg.value = msg
        if (msg.includes('60 detik')) {
            step.value = 'verify'
            errorMsg.value = 'OTP sudah terkirim sebelumnya. Cek email/WA Anda, atau tunggu 60 detik untuk kirim ulang.'
        }
    } finally { isLoading.value = false }
}

// Step 3: Verify OTP + set new password
const verifyAndReset = async () => {
    const code = otpCode.value
    if (!code || code.length !== 6) { errorMsg.value = 'Masukkan kode OTP 6 digit'; return }
    if (!newPassword.value) { errorMsg.value = 'Password baru wajib diisi'; return }
    if (newPassword.value.length < 6) { errorMsg.value = 'Password min. 6 karakter'; return }
    if (newPassword.value !== confirmPassword.value) { errorMsg.value = 'Password dan konfirmasi tidak cocok'; return }

    isLoading.value = true; errorMsg.value = ''
    try {
        const res = await $api('/api/v1/reset-password', {
            method: 'POST',
            body: {
                email: email.value,
                code: code,
                newPassword: newPassword.value,
                step: 'verify',
                tokenInputType: 'otp',
                target: otpTarget.value
            }
        })
        if (res.status) {
            successMsg.value = 'Password berhasil direset! Mengalihkan ke login...'
            setTimeout(() => router.push('/login'), 2000)
        } else { errorMsg.value = res.msg }
    } catch (err) { errorMsg.value = err.data?.msg || 'Gagal mereset password' }
    finally { isLoading.value = false }
}

// OTP input handlers
const handleOTPInput = (index, event) => {
    const val = event.target.value
    if (val && index < 5) {
        otpInputs.value[index + 1]?.focus()
    }
}
const handleOTPBackspace = (index, event) => {
    if (!event.target.value && index > 0) {
        otpInputs.value[index - 1]?.focus()
    }
}

onMounted(() => loadRecaptcha())
</script>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
}

.auth-gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.25;
    animation: float 12s ease-in-out infinite;
}

.orb-1 {
    width: 400px;
    height: 400px;
    background: var(--primary-gradient-start);
    top: -150px;
    left: -100px;
}

.orb-2 {
    width: 350px;
    height: 350px;
    background: var(--primary-gradient-end);
    bottom: -100px;
    right: -80px;
    animation-delay: 4s;
}

.auth-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 460px;
}

.auth-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 1rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.12));
    color: var(--primary-gradient-start);
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.8rem;
    border: 1px solid rgba(139, 92, 246, 0.2);
    margin-bottom: 1rem;
}

.auth-title {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--app-text-color);
    margin-bottom: 0.25rem;
}

.auth-subtitle {
    color: var(--app-secondary-text-color);
    font-size: 0.9rem;
}

.auth-card {
    background: var(--app-card-bg);
    border: 1px solid var(--app-border-color);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.auth-form {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--app-text-color);
    margin-bottom: 0.4rem;
}

.input-icon-wrap {
    display: flex;
    align-items: center;
    background: var(--app-surface);
    border: 1.5px solid var(--app-border-color);
    border-radius: 12px;
    padding: 0 1rem;
    transition: border-color 0.3s;
}

.input-icon-wrap:focus-within {
    border-color: var(--primary-gradient-start);
}

.input-icon-wrap i {
    color: var(--app-secondary-text-color);
    font-size: 1rem;
}

.input-icon-wrap input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0.7rem 0.75rem;
    color: var(--app-text-color);
    font-size: 0.9rem;
    outline: none;
}

.input-icon-wrap input::placeholder {
    color: var(--app-secondary-text-color);
    opacity: 0.7;
}

.toggle-password {
    background: none;
    border: none;
    color: var(--app-secondary-text-color);
    cursor: pointer;
    padding: 0.25rem;
}

.error-banner {
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    color: #EF4444;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 1rem;
}

.success-banner {
    padding: 0.75rem 1rem;
    background: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 10px;
    color: #22C55E;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 1rem;
}

.btn-auth-primary {
    width: 100%;
    padding: 0.8rem;
    background: var(--gradient-primary);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.btn-auth-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.btn-auth-primary:disabled {
    opacity: 0.7;
    cursor: default;
}

.auth-link {
    color: var(--primary-gradient-start);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.85rem;
}

.otp-icon-wrap {
    width: 64px;
    height: 64px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.12));
    color: var(--primary-gradient-start);
    border-radius: 16px;
    font-size: 1.8rem;
}

/* OTP Method buttons */
.otp-method-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: var(--app-surface);
    border: 1.5px solid var(--app-border-color);
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 0.75rem;
    text-align: left;
}

.otp-method-btn:hover {
    border-color: var(--primary-gradient-start);
    background: rgba(139, 92, 246, 0.04);
}

.otp-method-btn:disabled {
    opacity: 0.6;
    cursor: default;
}

.otp-method-btn>i:first-child {
    font-size: 1.5rem;
    color: var(--primary-gradient-start);
    width: 40px;
    text-align: center;
}

.otp-method-btn>i:last-child {
    margin-left: auto;
    color: var(--app-secondary-text-color);
}

.otp-method-btn div {
    display: flex;
    flex-direction: column;
}

.otp-method-btn strong {
    color: var(--app-text-color);
    font-size: 0.9rem;
}

.otp-method-btn small {
    color: var(--app-secondary-text-color);
    font-size: 0.78rem;
}

/* OTP Input */
.otp-input-wrap {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.otp-digit {
    width: 48px;
    height: 56px;
    text-align: center;
    font-size: 1.3rem;
    font-weight: 700;
    border: 2px solid var(--app-border-color);
    border-radius: 12px;
    background: var(--app-surface);
    color: var(--app-text-color);
    outline: none;
    transition: all 0.3s;
}

.otp-digit:focus {
    border-color: var(--primary-gradient-start);
}

.otp-digit.filled {
    border-color: #22C55E;
    color: #22C55E;
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.2);
    transform: scale(1.05);
}

.animate-slide-up {
    animation: slide-up 0.6s ease-out both;
}

@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(25px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(20px, -20px);
    }
}

@media (max-width: 480px) {
    .auth-title {
        font-size: 1.5rem;
    }

    .otp-digit {
        width: 42px;
        height: 50px;
    }
}
</style>
