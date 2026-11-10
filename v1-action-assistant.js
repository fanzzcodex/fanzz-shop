import { Assistant as Groq } from '../../lib/index.js'

export const routes = {
   category: 'v1',
   path: '/api/v1/assistant',
   method: 'post',
   execution: async (req, res, next) => {
      try {
         const { id, message, history } = req.body

         const json = await Groq.chat(message, id)
         if (!json.status) throw new Error(json.msg)

         res.json(json)
      } catch (e) {
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message || 'An error occurred with the assistant.'
         })
      }
   },
   error: false
}