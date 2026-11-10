import { Database } from '../../lib/index.js'
import bcrypt from 'bcryptjs'

export const routes = {
    category: 'v1',
    path: '/api/v1/profile',
    parameter: ['action'],
    method: 'post',
    execution: async (req, res, next) => {
        try {
            const { email } = req.user
            if (!email) {
                return res.status(401).json({ creator: global.creator, status: false, msg: 'Akses ditolak' })
            }

            const { action } = req.body
            const userRes = await Database.getUser(email)
            if (!userRes.status) {
                return res.status(404).json({ creator: global.creator, status: false, msg: 'Pengguna tidak ditemukan' })
            }
            const user = userRes.data

            if (action === 'updateProfile') {
                const { name, username, phone, profile_picture } = req.body
                // Update database
                const updateRes = await Database.userEdit(email, { name, username, phone, profile_picture })
                if (!updateRes.status) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: updateRes.msg })
                }
                return res.json({ creator: global.creator, status: true, msg: 'Profil berhasil diperbarui' })
            }

            if (action === 'updatePassword') {
                const { oldPassword, newPassword } = req.body

                if (!user.password) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: 'Akun ini terdaftar via Google. Anda tidak memiliki password.' })
                }

                const isMatch = await bcrypt.compare(oldPassword, user.password)
                if (!isMatch) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: 'Password lama tidak sesuai' })
                }

                if (newPassword.length < 6) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: 'Password baru minimal 6 karakter' })
                }

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(newPassword, salt)

                const updatePwdRes = await Database.userEdit(email, { password: hashedPassword })
                if (!updatePwdRes.status) {
                    return res.status(400).json({ creator: global.creator, status: false, msg: updatePwdRes.msg })
                }

                return res.json({ creator: global.creator, status: true, msg: 'Password berhasil diubah' })
            }

            return res.status(400).json({ creator: global.creator, status: false, msg: 'Aksi tidak valid' })

        } catch (e) {
            console.error('[Profile Update]', e)
            res.status(500).json({
                creator: global.creator,
                status: false,
                msg: e.message || 'Terjadi kesalahan pada server!'
            })
        }
    },
    error: false,
    login: true
}
