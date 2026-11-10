import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/inbox/read',
    parameter: [],
    method: 'post',
    execution: async (req, res) => {
        try {
            const { email } = req.user
            if (!email) return res.status(401).json({ creator: global.creator, status: false, msg: 'Akses ditolak' })

            await Database.markInboxRead(email)

            res.json({ creator: global.creator, status: true, msg: 'Invoice ditandai sudah dibaca' })
        } catch (e) {
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
