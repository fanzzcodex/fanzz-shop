import { Utils } from '../../lib/index.js'
import { extension } from 'mime-types'
import Jwt from 'jsonwebtoken'
import axios from 'axios'

export const routes = {
   category: 'v1',
   path: '/api/v1/download',
   parameter: ['token'],
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const { token } = req.query
         const decoded = Jwt.verify(token, process.env.JWT_SECRET)
         const url = decoded?.url
         const filename = decoded?.filename
         const cookie = decoded?.cookie

         const headers = cookie ? { cookie } : {}

         const response = await axios.get(url, {
            headers,
            responseType: 'stream'
         })

         if (response.status !== 200) {
            res.status(response.status).send('Failed to fetch file')
            return
         }

         const contentType = response.headers['content-type'] || 'application/octet-stream'
         const contentLength = response.headers['content-length'] || 0
         const fname = filename || `${process.env.WEB_NAME || 'Yilzi Shop'} - ` + Utils.makeId(6) + '.' + (extension(contentType) || 'bin')

         res.set('Content-Type', contentType)
         res.set('Content-Length', contentLength)
         res.set('Content-Disposition', 'attachment; filename=' + fname)
         res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
         res.set('Pragma', 'no-cache')
         res.set('Expires', '0')

         response.data.pipe(res).on('error', e => {
            res.status(500).send(e.message)
            res.destroy(e)
         })
      } catch (e) {
         console.error(e)
         res.status(500).send(e.message)
      }
   },
   error: false
}