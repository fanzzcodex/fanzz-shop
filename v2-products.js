import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v2',
   path: '/api/v2/products',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const type = req.user?.type
         if (type !== 'admin') {
            return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Anda tidak memiliki izin untuk melakukan tindakan ini.'
            })
         }

         const { id, page = 1, limit = 10, search = '' } = req.query

         if (id) {
            const json = await Database.getProductWithFile(id)
            res.json(json)
         } else {
            const pageNum = parseInt(page, 10)
            const limitNum = parseInt(limit, 10)
            const skip = (pageNum - 1) * limitNum

            const query = {}
            if (search) {
               query.name = { $regex: search, $options: 'i' }
            }

            const options = {
               query,
               sort: { order: 1, created_at: -1 },
               limit: limitNum,
               skip
            }

            const json = await Database.getAllProductsForAdmin(options)
            res.json(json)
         }
      } catch (e) {
         console.error(e)
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