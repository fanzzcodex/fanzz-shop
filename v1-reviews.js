import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/reviews/:productId',
    method: 'get',
    execution: async (req, res) => {
        try {
            const { productId } = req.params

            const reviewsRes = await Database.getReviews(productId)
            if (!reviewsRes.status) {
                return res.status(500).json({ creator: global.creator, status: false, msg: reviewsRes.msg })
            }

            res.json({ creator: global.creator, status: true, data: reviewsRes.data })

        } catch (e) {
            console.error('[Get Reviews]', e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: false
}
