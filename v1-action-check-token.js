import { Database } from '../../lib/index.js'
import jwt from 'jsonwebtoken'

export const routes = {
   category: 'action',
   path: '/api/v1/check-token',
   parameter: ['token'],
   method: 'post',
   execution: async (req, res, next) => {
      try {
         const { token } = req.body

         if (!token) {
            return res.status(401).json({
               creator: global.creator,
               status: false,
               msg: 'Token not provided.'
            })
         }

         let decoded
         try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
         } catch (err) {
            return res.status(401).json({
               creator: global.creator,
               status: false,
               msg: 'Invalid or expired token.'
            })
         }

         if (!decoded.email) {
            return res.status(401).json({
               creator: global.creator,
               status: false,
               msg: 'Token payload is missing required data.'
            })
         }

         const userResult = await Database.getUser(decoded.email)
         if (!userResult.status) {
            return res.status(401).json({
               creator: global.creator,
               status: false,
               msg: 'User associated with this token no longer exists.'
            })
         }

         // Throw 403 dynamically if blocked
         if (userResult.data.status === 'blocked' || userResult.data.role === 'banned') {
            return res.status(403).json({
               creator: global.creator,
               status: false,
               isBlocked: true,
               msg: 'Akun Anda telah ditangguhkan.'
            })
         }

         res.json({
            creator: global.creator,
            status: true,
            msg: 'Token is valid.'
         })
      } catch (e) {
         console.error(e)
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   },
   error: false
}