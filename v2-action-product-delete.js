import { Assistant as Groq, Database } from '../../lib/index.js'

export const routes = {
   category: 'v2',
   path: '/api/v2/product/:id',
   method: 'delete',
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

         const { id } = req.params

         if (!id) {
            return res.status(400).json({
               creator: global.creator,
               status: false,
               msg: 'ID produk wajib disertakan.'
            })
         }

         const json = await Database.productDelete(id)

         if (json.status) {
            await Groq.reloadProductData()
            res.status(200).json(json)
         } else {
            res.status(404).json(json)
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