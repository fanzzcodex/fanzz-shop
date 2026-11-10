import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v1',
   path: '/api/v1/products/featured',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const json = await Database.getFeaturedProduct()
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