import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v2',
    path: '/api/v2/direct-message',
    parameter: ['email', 'title', 'message', 'tag'],
    method: 'post',
    execution: async (req, res) => {
        try {
            if (req.user.type !== 'admin') {
                return res.status(403).json({ creator: global.creator, status: false, msg: 'Akses ditolak.' })
            }

            const { email, title, message, tag } = req.body
            const userRes = await Database.getUser(email)
            if (!userRes.status) {
                return res.status(404).json({ creator: global.creator, status: false, msg: 'User tidak ditemukan.' })
            }

            await Database.addInbox(email, { title, message, tag })

            res.json({ creator: global.creator, status: true, msg: `Pesan sukses dikirim ke ${email}!` })
        } catch (e) {
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
