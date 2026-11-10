import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/profile',
    method: 'get',
    execution: async (req, res, next) => {
        try {
            const { email } = req.user
            if (!email) {
                return res.status(401).json({ creator: global.creator, status: false, msg: 'Akses ditolak' })
            }

            const userRes = await Database.getUser(email)
            if (!userRes.status) {
                return res.status(404).json({ creator: global.creator, status: false, msg: 'Pengguna tidak ditemukan' })
            }

            const user = userRes.data
            delete user.password // Jangan kirim password ke frontend

            res.json({
                creator: global.creator,
                status: true,
                data: user
            })
        } catch (e) {
            console.error('[Profile Get]', e)
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
