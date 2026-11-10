import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v2',
   path: '/api/v2/invoices',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         if (req.user?.type !== 'admin') {
            return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Anda tidak memiliki izin untuk melakukan tindakan ini.'
            })
         }

         const { page = 1, limit = 10, search = '', statusFilter = '' } = req.query
         const pageNum = parseInt(page, 10)
         const limitNum = parseInt(limit, 10)
         const skip = (pageNum - 1) * limitNum

         const filter = {}
         if (statusFilter) {
            filter.status = statusFilter
         }

         const options = {
            filter: filter,
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