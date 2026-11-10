import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v1',
   path: '/api/v1/invoices',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const email = req.user?.email || req.session?.email
         const { page = 1, limit = 10, search = '' } = req.query
         const pageNum = parseInt(page, 10)
         const limitNum = parseInt(limit, 10)
         const skip = (pageNum - 1) * limitNum

         const options = {
            filter: { email },
            sort: { created_at: -1 },
            limit: limitNum,
            skip,
            search
         }

         const json = await Database.getAllInvoices(options)
         res.json(json)
      } catch (e) {
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