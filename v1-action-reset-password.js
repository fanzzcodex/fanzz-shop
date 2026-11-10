import bcrypt from 'bcryptjs'
import { Database } from '../../lib/index.js'
import OTPService from '../../lib/services/otp.js'
import Recaptcha from '../../lib/services/recaptcha.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/reset-password',
    method: 'post',
    execution: async (req, res) => {
        try {
            const { email, code, newPassword, step, recaptchaToken } = req.body

            // Step 1: Request OTP
            if (step === 'request') {
                const { otpMethod } = req.body;
                if (!email) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: 'Email wajib diisi' })
                }

                // Verify reCAPTCHA
                const captcha = await Recaptcha.verify(recaptchaToken)
                if (!captcha.status) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: captcha.msg })
                }

                // Check user exists
                const userRes = await Database.getUser(email)
                if (!userRes.status) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: 'Email tidak terdaftar' })
                }

                const user = userRes.data
                if (!user.password) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: 'Akun ini terdaftar via Google. Tidak memerlukan reset password.' })
                }

                // Get method details
                if (!otpMethod) {
                    return res.json({ creator: global.creator, status: true, data: { requireChoice: true, phone: user.phone || '' } })
                }

                // Send OTP or Link
                if (otpMethod === 'wa') {
                    if (!user.phone) return res.status(400).json({ creator: global.creator, status: false, msg: 'Nomor WhatsApp tidak terdaftar' })
                    const otpRes = await OTPService.send(user.phone, 'wa', 'reset')
                    if (!otpRes.status) return res.status(429).json({ creator: global.creator, status: false, msg: otpRes.msg })
                    return res.json({ creator: global.creator, status: true, msg: 'Kode OTP berhasil dikirim ke WhatsApp!', data: { useOTP: true, target: user.phone } })
                } else if (otpMethod === 'email') {
                    const otpRes = await OTPService.send(email, 'email', 'reset')
                    if (!otpRes.status) return res.status(429).json({ creator: global.creator, status: false, msg: otpRes.msg })
                    return res.json({ creator: global.creator, status: true, msg: 'Kode OTP berhasil dikirim ke Email!', data: { useOTP: true, target: email } })
                }
            }

            // Step 2: Verify OTP and set new password
            if (step === 'verify') {
                const { tokenInputType, target, token } = req.body;
                let targetEmail = email;

                if (newPassword.length < 6) { return res.status(400).json({ creator: global.creator, status: false, msg: 'Password baru minimal 6 karakter' }) }

                const { default: RedisDB } = await import('../../lib/system/redis.js')
                if (tokenInputType === 'link') {
                    if (!token) return res.status(400).json({ status: false, msg: 'Token tidak ditemukan!' })
                    const emailFromToken = await RedisDB.client.get(`reset_link:${token}`)
                    if (!emailFromToken) return res.status(400).json({ status: false, msg: 'Link reset tidak valid atau sudah kedaluwarsa.' })
                    targetEmail = emailFromToken
                    await RedisDB.client.del(`reset_link:${token}`)
                } else if (tokenInputType === 'otp') {
                    if (!target || !code) return res.status(400).json({ status: false, msg: 'Kode OTP tidak disediakan' })
                    const verifyResult = await OTPService.verify(target, code, 'reset')
                    if (!verifyResult.status) return res.status(400).json({ creator: global.creator, status: false, msg: verifyResult.msg })
                } else {
                    return res.status(400).json({ status: false, msg: 'Metode validasi reset tidak disediakan!' })
                }

                // Hash new password
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(newPassword, salt)

                // Update password
                await Database.userEdit(targetEmail, { password: hashedPassword })

                // Send Notifications
                try {
                    const userAfter = await Database.getUser(targetEmail)
                    const u = userAfter.data
                    const EmailTemplates = (await import('../../lib/email-templates.js')).default
                    const Mailer = (await import('../../lib/mailer.js')).default
                    const pwdHtml = EmailTemplates.passwordChanged(u.name)
                    await Mailer.sendMail(targetEmail, `Peringatan Keamanan: Password Diubah - ${process.env.WEB_NAME || 'Yilzi Shop'}`, pwdHtml)
                    if (u.phone) {
                        const WhatsApp = (await import('../../lib/whatsapp.js')).default;
                        await WhatsApp.send(u.phone, `🔒 *Peringatan Keamanan*\n\nPassword akun Anda di ${process.env.WEB_NAME || 'Yilzi Shop'} baru saja diganti.\nJika Anda merasa tidak melakukannya, segera hubungi Customer Service.`)
                    }
                    const { sendTelegramAlert } = await import('../../lib/telegram.js')
                    sendTelegramAlert(`🚨 *PASSWORD RESET*\n\nUser: ${u.name}\nEmail: \`${targetEmail}\`\nSistem: Password berhasil diubah.`)
                } catch (e) {
                    console.error(e)
                }

                return res.json({
                    creator: global.creator,
                    status: true,
                    msg: 'Password berhasil direset. Silakan login dengan password baru.'
                })
            }

            res.status(400).json({ creator: global.creator, status: false, msg: 'Step tidak valid' })
        } catch (e) {
            console.error('[Reset Password]', e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message || 'Terjadi kesalahan' })
        }
    },
    error: false
}
