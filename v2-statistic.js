import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v2',
   path: '/api/v2/statistic',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         // No need to check type here — authorization middleware already ensures admin for v2 routes

         const [productsResponse, usersResponse, allInvoicesResponse] = await Promise.all([
            Database.getAllProductsForAdmin({ query: {}, limit: 0 }),
            Database.getAllUsers(),
            Database.getAllInvoices({ filter: {}, limit: 0 })
         ])

         if (!productsResponse.status) throw new Error(productsResponse.msg || 'Gagal mengambil data produk')
         if (!usersResponse.status) throw new Error(usersResponse.msg || 'Gagal mengambil data pengguna')
         if (!allInvoicesResponse.status) throw new Error(allInvoicesResponse.msg || 'Gagal mengambil data invoice')

         const allProducts = productsResponse.data.products || []
         const allUsers = usersResponse.data || []
         const allInvoices = allInvoicesResponse.data.invoices || []
         const paidInvoices = allInvoices.filter(inv => inv.status === 'Paid')

         const totalRevenue = paidInvoices.reduce((acc, invoice) => acc + (invoice.amount || 0), 0)
         const totalSales = paidInvoices.reduce((acc, invoice) => acc + (invoice.productNames?.length || 0), 0)
         const totalProducts = allProducts.length

         const thirtyDaysAgo = new Date()
         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
         const newCustomers = allUsers.filter(user => user.joined_at && new Date(user.joined_at) > thirtyDaysAgo).length

         // Top selling products
         const topProducts = [...allProducts]
            .filter(product => (product.sales || 0) > 0)
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 8)
            .map(p => ({ id: p._id, name: p.name, sales: p.sales || 0 }))

         // Monthly revenue data (last 6 months)
         const now = new Date()
         const monthlyRevenue = []
         for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
            const monthName = monthStart.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })

            let revenue = 0
            let count = 0
            paidInvoices.forEach(inv => {
               const d = new Date(inv.paid_at || inv.created_at)
               if (d >= monthStart && d <= monthEnd) {
                  revenue += inv.amount || 0
                  count++
               }
            })
            monthlyRevenue.push({ month: monthName, revenue, transactions: count })
         }

         // User registration trend (last 6 months)
         const userTrend = []
         for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
            const monthName = monthStart.toLocaleDateString('id-ID', { month: 'short' })

            const count = allUsers.filter(u => {
               const d = new Date(u.joined_at)
               return d >= monthStart && d <= monthEnd
            }).length

            userTrend.push({ month: monthName, count })
         }

         // Top users by spending
         const userSpending = {}
         paidInvoices.forEach(inv => {
            if (inv.email) {
               userSpending[inv.email] = (userSpending[inv.email] || 0) + (inv.amount || 0)
            }
         })
         const topUsers = Object.entries(userSpending)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([email, total]) => {
               const user = allUsers.find(u => u._id === email)
               return { email, name: user?.name || email, totalSpending: total }
            })

         // Current vs last month comparison
         const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
         const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
         const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

         let currentMonthRevenue = 0
         let lastMonthRevenue = 0
         paidInvoices.forEach(inv => {
            const d = new Date(inv.paid_at || inv.created_at)
            if (d >= currentMonthStart) currentMonthRevenue += inv.amount || 0
            else if (d >= lastMonthStart && d <= lastMonthEnd) lastMonthRevenue += inv.amount || 0
         })

         res.json({
            creator: global.creator,
            status: true,
            data: {
               stats: { totalRevenue, totalSales, totalProducts, newCustomers, totalUsers: allUsers.length },
               monthlyRevenue,
               userTrend,
               topProducts,
               topUsers,
               comparison: { currentMonth: currentMonthRevenue, lastMonth: lastMonthRevenue }
            }
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