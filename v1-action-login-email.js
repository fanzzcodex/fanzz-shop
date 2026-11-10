import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Database } from '../../lib/index.js'
import Recaptcha from '../../lib/services/recaptcha.js'
import { sendTelegramAlert } from '../../lib/telegram.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/login-email',
    parameter: ['email', 'password'],
    method: 'post',
    execution: async (req, res) => {
        try {
            const { email, password, recaptchaToken } = req.body

            if (!email || !password) {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Email dan password wajib diisi' })
            }

            // Verify reCAPTCHA
            const captcha = await Recaptcha.verify(recaptchaToken)
            if (!captcha.status) {
                return res.status(400).json({ creator: global.creator, status: false, msg: captcha.msg })
            }

            // Get user
            const userRes = await Database.getUser(email)
            if (!userRes.status) {
                return res.status(401).json({ creator: global.creator, status: false, msg: 'Email atau password salah' })
            }

            const user = userRes.data

            // Check if user registered with Google (no password)
            if (!user.password) {
                return res.status(400).json({
                    creator: global.creator,
                    status: false,
                    msg: 'Akun ini terdaftar via Google. Silakan login dengan Google.',
                    data: { useGoogle: true }
                })
            }

            // Check if banned
            if (user.role === 'banned' || user.status === 'blocked') {
                return res.status(403).json({ creator: global.creator, status: false, isBlocked: true, msg: 'Akun Andatelah ditangguhkan oleh Administrator.' })
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({ creator: global.creator, status: false, msg: 'Email atau password salah' })
            }

            const { otpMethod } = req.body

            // Require OTP branch
            if (!otpMethod) {
                return res.json({
                    creator: global.creator,
                    status: true,
                    msg: 'Verifikasi Device/Akun Anda',
                    data: { requireOTP: true, phone: user.phone || '' }
                })
            }

            // Send OTP
            const target = otpMethod === 'wa' ? user.phone : user._id
            if (!target) return res.status(400).json({ status: false, msg: 'Target (Nomor/Email) tidak tersedia' })

            const { default: RedisDB } = await import('../../lib/system/redis.js')
            const { default: OTPService } = await import('../../lib/services/otp.js')

            const tempLogin = {
                email: user._id,
                type: user.role === 'admin' ? 'admin' : 'user'
            }
            // Only store temp_login if not already stored
            const existingTempLogin = await RedisDB.client.get(`temp_login:${target}`)
            if (!existingTempLogin) {
                await RedisDB.client.set(`temp_login:${target}`, JSON.stringify(tempLogin), { ex: 300 })
            }

            const otpRes = await OTPService.send(target, otpMethod, 'login')
            if (!otpRes.status) {
                return res.status(429).json({ creator: global.creator, status: false, msg: otpRes.msg })
            }

            return res.json({
                creator: global.creator,
                status: true,
                msg: otpRes.msg || 'OTP berhasil dikirim',
                data: {
                    requireOTP: true,
                    otpMethod,
                    target
                }
            })
        } catch (e) {
            console.error('[Login Email]', e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message || 'Terjadi kesalahan' })
        }
    },
    error: false
}
