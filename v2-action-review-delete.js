import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v2',
    path: '/api/v2/reviews/:id',
    method: 'delete',
    execution: async (req, res) => {
        try {
            // Check if admin
            const type = req.user?.type
            if (type !== 'admin') {
                return res.status(401).json({ creator: global.creator, status: false, msg: 'Akses ditolak' })
            }

            const { id } = req.params
            const { productId } = req.query // optional

            const deleteRes = await Database.reviewDelete(id, productId)
            if (!deleteRes.status) {
                return res.status(400).json({ creator: global.creator, status: false, msg: deleteRes.msg })
            }

            res.json({ creator: global.creator, status: true, msg: deleteRes.msg })

        } catch (e) {
            console.error('[Delete Review]', e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
