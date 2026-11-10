import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v2',
    path: '/api/v2/users',
    parameter: [],
    method: 'get',
    execution: async (req, res) => {
        try {
            if (req.user.type !== 'admin') {
                return res.status(403).json({ creator: global.creator, status: false, msg: 'Akses ditolak.' })
            }

            const { page = 1, limit = 10, search = '' } = req.query
            const pageNum = parseInt(page, 10)
            const limitNum = parseInt(limit, 10)
            const skip = (pageNum - 1) * limitNum

            const usersResp = await Database.getAllUsers(0, 0) // get all
            if (!usersResp.status) return res.status(500).json(usersResp)

            let users = usersResp.data || []

            if (search) {
                users = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
            }

            const total = users.length
            const paginatedUsers = users.slice(skip, skip + limitNum)

            res.json({
                creator: global.creator,
                status: true,
                data: {
                    users: paginatedUsers,
                    pagination: {
                        total,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(total / limitNum)
                    }
                }
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
