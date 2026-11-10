import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v2',
   path: '/api/v2/products/order',
   method: 'put',
   execution: async (req, res) => {
      try {
         if (req.user?.type !== 'admin') {
            return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Anda tidak memiliki izin untuk melakukan tindakan ini.'
            })
         }

         const { orderedIds } = req.body

         if (!orderedIds) {
            return res.status(400).json({
               creator: global.creator,
               status: false,
               msg: 'Array ID urutan wajib diisi.'
            })
         }

         const json = await Database.productUpdateOrder(orderedIds)
         res.status(json.status ? 200 : 500).json(json)
      } catch (e) {
         console.error('Error in /api/v2/products/order:', e)
         res.status(500).json({
            creator: global.creator,
            tatus: false,
            msg: e.message || 'Terjadi kesalahan pada server'
         })
      }
   },
   error: false,
   login: true
}