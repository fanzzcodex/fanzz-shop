export const routes = {
   category: 'v1',
   path: '/api/v1/logout',
   method: 'post',
   execution: async (req, res, next) => {
      try {
         req.session.login = false
         req.session.email = null
         req.session.token = null
         req.session.type = null
         req.session = null
         res.json({
            creator: global.creator,
            status: true,
            msg: 'Logout berhasil'
         })
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