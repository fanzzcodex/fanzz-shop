import bcrypt from 'bcryptjs'
import { Database } from '../../lib/index.js'
import OTPService from '../../lib/services/otp.js'
import Recaptcha from '../../lib/services/recaptcha.js'
import RedisDB from '../../lib/system/redis.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/register',
    parameter: ['email', 'password', 'username'],
    method: 'post',
    execution: async (req, res) => {
        try {
            const { email, password, username, phone, otpMethod, recaptchaToken } = req.body

            // Validate required fields
            if (!email || !password || !username) {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Email, username, dan password wajib diisi' })
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Format email tidak valid' })
            }

            // Validate password length
            if (password.length < 6) {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Password minimal 6 karakter' })
            }

            // Validate username
            if (username.length < 3 || username.length > 30) {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Username harus 3-30 karakter' })
            }

            // Verify reCAPTCHA
            const captcha = await Recaptcha.verify(recaptchaToken)
            if (!captcha.status) {
                return res.status(400).json({ creator: global.creator, status: false, msg: captcha.msg })
            }

            // Check if user already exists
            const existingUser = await Database.getUser(email)
            let isUnverifiedResend = false

            if (existingUser.status) {
                if (existingUser.data.verified === false) {
                    const isValidPassword = await bcrypt.compare(password, existingUser.data.password)
                    if (isValidPassword) {
                        isUnverifiedResend = true
                    } else {
                        return res.status(400).json({ creator: global.creator, status: false, msg: 'Email sudah terdaftar. Silakan login.' })
                    }
                } else {
                    return res.status(400).json({ creator: global.creator, status: false, msg: 'Email sudah terdaftar. Silakan login.' })
                }
            }

            // Check Username
            const usernameExist = await Database.getUser(username)
            if (usernameExist.status && usernameExist.data._id !== email) {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Username sudah digunakan. Silakan ganti.' })
            }

            // Check Phone
            if (phone) {
                const phoneSearch = await Database.getAllUsers()
                if (phoneSearch.status) {
                    const isStolen = phoneSearch.data.find(u => u.phone === phone && u._id !== email)
                    if (isStolen) return res.status(400).json({ creator: global.creator, status: false, msg: 'Nomor WA sudah digunakan akun lain. Silakan ganti.' })
                }
            }

            if (!otpMethod) {
                return res.json({
                    creator: global.creator,
                    status: true,
                    msg: 'Data valid. Silakan pilih metode OTP.',
                    data: { requireOTP: false }
                })
            }

            // Send OTP if method specified
            if (otpMethod && (otpMethod === 'wa' || otpMethod === 'email')) {
                const target = otpMethod === 'wa' ? phone : email
                if (!target) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: otpMethod === 'wa' ? 'Nomor telepon wajib untuk verifikasi WhatsApp' : 'Email wajib untuk verifikasi' })
                }

                // Only create temp_user if it doesn't exist yet (avoid overwriting on resend)
                const existingTemp = await RedisDB.client.get(`temp_user:${target}`)
                if (!existingTemp) {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(password, salt)

                    const tempUserData = {
                        email,
                        username,
                        phone: phone || '',
                        password: hashedPassword,
                        registrationType: 'manual'
                    }
                    await RedisDB.client.set(`temp_user:${target}`, JSON.stringify(tempUserData), { ex: 1800 })
                }

                // Send OTP and CHECK the result
                const otpResult = await OTPService.send(target, otpMethod, 'register')
                if (!otpResult.status) {
                    return res.status(429).json({ creator: global.creator, status: false, msg: otpResult.msg })
                }

                return res.json({
                    creator: global.creator,
                    status: true,
                    msg: otpResult.msg || 'OTP berhasil dikirim. Silakan verifikasi akun Anda.',
                    data: { requireOTP: true, otpMethod, target: otpMethod === 'wa' ? phone : email }
                })
            }

            res.json({
                creator: global.creator,
                status: true,
                msg: 'Registrasi berhasil!',
                data: { requireOTP: false }
            })
        } catch (e) {
            console.error('[Register]', e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message || 'Terjadi kesalahan pada server' })
        }
    },
    error: false
}
