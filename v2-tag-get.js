import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v2',
   path: '/api/v2/tags',
   method: 'get',
   execution: async (req, res) => {
      try {
         const json = await Database.getAllTags()
         res.status(json.status ? 200 : 500).json(json)
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