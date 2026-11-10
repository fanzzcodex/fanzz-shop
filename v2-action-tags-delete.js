import { Assistant as Groq, Database } from '../../lib/index.js'

export const routes = {
   category: 'v2',
   path: '/api/v2/tags/:id',
   method: 'delete',
   execution: async (req, res) => {
      try {
         if (req.user?.type !== 'admin') {
            return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Anda tidak memiliki izin untuk melakukan tindakan ini.'
            })
         }
         const { id } = req.params
         const json = await Database.tagDelete(id)
         if (json.status) {
            await Groq.reloadProductData()
         }
         res.status(json.status ? 200 : 400).json(json)
      } catch (e) {
         console.error(e)
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   },
   error: false,
   login: true
}