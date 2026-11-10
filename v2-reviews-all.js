import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v2',
    path: '/api/v2/reviews',
    method: 'get',
    execution: async (req, res) => {
        try {
            // Check if admin
            const type = req.user?.type
            if (type !== 'admin') {
                return res.status(401).json({ creator: global.creator, status: false, msg: 'Akses ditolak' })
            }

            const reviewsRes = await Database.getAllReviews()
            if (!reviewsRes.status) {
                return res.status(500).json({ creator: global.creator, status: false, msg: reviewsRes.msg })
            }

            res.json({ creator: global.creator, status: true, data: reviewsRes.data })

        } catch (e) {
            console.error('[Get All Reviews]', e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
