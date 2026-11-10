import OTPService from '../../lib/services/otp.js'
import jwt from 'jsonwebtoken'
import { Database } from '../../lib/index.js'
import RedisDB from '../../lib/system/redis.js'
import WhatsApp from '../../lib/whatsapp.js'
import { sendTelegramAlert } from '../../lib/telegram.js'
import Mailer from '../../lib/mailer.js'
import EmailTemplates from '../../lib/email-templates.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/verify-otp',
    parameter: ['identifier', 'code'],
    method: 'post',
    execution: async (req, res) => {
        try {
            const { identifier, code, type = 'register' } = req.body

            if (!identifier || !code) {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Identifier dan kode OTP wajib diisi' })
            }

            const result = await OTPService.verify(identifier, code, type)
            if (!result.status) {
                return res.status(400).json({ creator: global.creator, status: false, msg: result.msg })
            }

            // If register verification, mark user as verified and issue token
            if (type === 'register') {
                let userEmail = identifier

                // Cek data temp user di redis
                const tempUserDataRaw = await RedisDB.client.get(`temp_user:${identifier}`)
                if (tempUserDataRaw) {
                    const tempUser = typeof tempUserDataRaw === 'string' ? JSON.parse(tempUserDataRaw) : tempUserDataRaw
                    userEmail = tempUser.email

                    const existingTempUser = await Database.getUser(tempUser.email)
                    if (existingTempUser.status) {
                        await Database.userEdit(tempUser.email, {
                            password: tempUser.password,
                            phone: tempUser.phone,
                            verified: true,
                            registrationType: 'manual'
                        })
                    } else {
                        // Create unverified user directly as verified
                        await Database.userAdd(tempUser.email, tempUser.username, {
                            password: tempUser.password,
                            phone: tempUser.phone,
                            verified: true,
                            registrationType: 'manual'
                        })
                    }

                    // Send Registration Alerts
                    try {
                        if (tempUser.phone) {
                            await WhatsApp.send(tempUser.phone, `Halo ${tempUser.username},\nAkun Anda di ${process.env.WEB_NAME || 'Yilzi Shop'} berhasil didaftarkan dan diverifikasi! Selamat berbelanja.\n\nJangan sampai hilang, gunakan:\nEmail: ${tempUser.email}\n\nSimpan pesan WA ini untuk notifikasi otomatis terkait pesanan Anda.`)
                        }
                        const regHtml = EmailTemplates.registrationSuccess(tempUser.username, tempUser.email)
                        await Mailer.sendMail(tempUser.email, `Pendaftaran Berhasil - ${process.env.WEB_NAME || 'Yilzi Shop'}`, regHtml)

                        // Notify Owner
                        try {
                            const ownerEmail = process.env.ADMIN_EMAIL || process.env.USER_NAME
                            const ownerPhone = process.env.OWNER_PHONE
                            const ownerHtml = EmailTemplates.broadcast ? EmailTemplates.broadcast(
                                'Pendaftaran User Baru',
                                `Halo Admin, ada user baru yang berhasil mendaftar dan verifikasi.<br><br><b>Username:</b> ${tempUser.username}<br><b>Email:</b> ${tempUser.email}<br><b>WA:</b> ${tempUser.phone || '-'}`,
                                'Registrasi'
                            ) : null

                            if (ownerEmail) await Mailer.sendMail(ownerEmail, `New User Verified: ${tempUser.username}`, ownerHtml)
                            if (ownerPhone) await WhatsApp.send(ownerPhone, `📢 *NEW USER VERIFIED*\n\nUsername: ${tempUser.username}\nEmail: ${tempUser.email}\nStatus: Aktif\n\nSilakan cek dashboard admin.`)
                        } catch (err) { console.error('[Owner Notify Error]', err.message) }

                        sendTelegramAlert(`🎉 *USER BARU VERIFIED!*\n\nUser: ${tempUser.username}\nEmail/Identifier: \`${identifier}\`\nMode: Manual OTP`)
                    } catch (e) {
                        console.error(e)
                    }

                    // Hapus temp session
                    await RedisDB.client.del(`temp_user:${identifier}`)
                } else {
                    // Fallback logik kalau sudah sempat terbuat sebelumnya
                    const userRes = await Database.getUser(identifier)
                    if (userRes.status) {
                        userEmail = userRes.data._id
                        await Database.userEdit(identifier, { verified: true })
                    }
                }

                // Auto-login after verification
                const email = userEmail
                const userType = (email === process.env.ADMIN_EMAIL) ? 'admin' : 'user'
                const auth_token = jwt.sign(
                    { email, type: userType, userAgent: req.headers['user-agent'] },
                    process.env.JWT_SECRET,
                    { expiresIn: '72h' }
                )

                // Set session
                req.session.login = true
                req.session.email = email
                req.session.token = auth_token
                req.session.type = userType

                return res.json({
                    creator: global.creator,
                    status: true,
                    msg: 'Verifikasi berhasil!',
                    data: {
                        token: auth_token,
                        type: userType,
                        created_at: Date.now(),
                        expired_at: 72 * 60 * 60 * 1000
                    }
                })
            } else if (type === 'login') {
                const tempLoginRaw = await RedisDB.client.get(`temp_login:${identifier}`)
                if (!tempLoginRaw) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: 'Sesi OTP Login kedaluwarsa atau tidak valid.' })
                }
                const tempLogin = typeof tempLoginRaw === 'string' ? JSON.parse(tempLoginRaw) : tempLoginRaw

                const auth_token = jwt.sign(
                    { email: tempLogin.email, type: tempLogin.type, userAgent: req.headers['user-agent'] },
                    process.env.JWT_SECRET,
                    { expiresIn: '72h' }
                )
                await RedisDB.client.del(`temp_login:${identifier}`)

                req.session.login = true
                req.session.email = tempLogin.email
                req.session.token = auth_token
                req.session.type = tempLogin.type

                try {
                    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
                    const userRes = await Database.getUser(tempLogin.email)
                    const userName = userRes.status ? userRes.data.name : tempLogin.email
                    sendTelegramAlert(`🔑 *LOGIN BERHASIL*\n\nUser: ${userName}\nEmail: \`${tempLogin.email}\`\nIP: ${ip}\nPlatform: Login OTP Verified`)
                } catch (e) { }

                return res.json({
                    creator: global.creator,
                    status: true,
                    msg: 'Login Berhasil!',
                    data: {
                        token: auth_token,
                        type: tempLogin.type,
                        created_at: Date.now(),
                        expired_at: 72 * 60 * 60 * 1000
                    }
                })
            }

            res.json({ creator: global.creator, status: true, msg: 'Verifikasi berhasil' })
        } catch (e) {
            console.error('[Verify OTP]', e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message || 'Terjadi kesalahan' })
        }
    },
    error: false
}
