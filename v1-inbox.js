import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/inbox',
    parameter: [],
    method: 'get',
    execution: async (req, res) => {
        try {
            const { email } = req.user
            if (!email) return res.status(401).json({ creator: global.creator, status: false, msg: 'Akses ditolak' })

            const inboxRes = await Database.getInbox(email)
            if (!inboxRes.status) return res.status(500).json({ creator: global.creator, status: false, msg: inboxRes.msg })

            res.json({ creator: global.creator, status: true, data: inboxRes.data })
        } catch (e) {
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
