import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v1',
   path: '/api/v1/products',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const { id, page = 1, limit = 4 } = req.query

         if (id) {
            const json = await Database.getProduct(id)
            return res.json(json)
         }

         const pageNum = parseInt(page, 10) || 1
         const limitNum = parseInt(limit, 10) || 4
         const skip = (pageNum - 1) * limitNum

         const options = {
            query: { show: true },
            sort: { order: 1, created_at: -1 },
            limit: limitNum,
            skip: skip
         }

         const json = await Database.getAllProducts(options)
         res.json(json)
      } catch (e) {
         console.error(e)
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message || 'Terjadi kesalahan pada server!'
         })
      }
   },
   error: false
}