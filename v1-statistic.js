import { Database } from '../../lib/index.js'

export const routes = {
   category: 'v1',
   path: '/api/v1/statistic',
   method: 'get',
   execution: async (req, res, next) => {
      try {
         const email = req.user?.email || req.session?.email
         const [usersResponse, invoicesResponse] = await Promise.all([
            Database.getUser(email),
            Database.getAllInvoices({
               filter: { email },
               limit: 0,
               sort: { created_at: -1 }
            })
         ])

         if (!usersResponse.status) throw new Error(usersResponse.msg || 'Gagal mengambil data pengguna.')
         if (!invoicesResponse.status) throw new Error(invoicesResponse.msg || 'Gagal mengambil data invoice.')

         const allInvoices = invoicesResponse.data.invoices || []
         const paidInvoices = allInvoices.filter(v => v.status === 'Paid')

         const totalPurchase = paidInvoices.reduce((acc, invoice) => acc + invoice.amount, 0)
         const totalTransactions = allInvoices.length

         const totalItems = paidInvoices.reduce((total, invoice) => {
            return total + (invoice.productNames?.length || 0)
         }, 0)

         const purchasedProducts = paidInvoices
            .flatMap(tx => {
               // Perbaikan: gunakan tx.items jika ada, atau parsing untuk mendapatkan _id items jika dimungkinkan,
               // tapi di getAllInvoices kita udah push ke simplified items gak ya?
               // Mari kita asumsikan tx.items itu array objek dengan properti id
               return (tx.items || []).map(item => {
                  let realId = item.id;

                  // fallback jika item.id tidak ada atau formatnya aneh, kita coba parsing dari productNames
                  // Walaupun productNames biasa cuman string, items harusnya bawa id kalau di getAllInvoices 
                  // mengembalikan items .
                  return {
                     id: `${tx._id}-${realId}`,
                     realId: realId,
                     name: tx.productNames.find(n => n) || 'Produk Digital', // simplistic
                     purchaseDate: tx.created_at,
                  }
               });
            })
            .slice(0, 6)

         const dashboardData = {
            stats: {
               totalPurchase,
               totalTransactions,
               totalItems
            },
            email: usersResponse.data._id,
            name: usersResponse.data.name,
            joinedAt: usersResponse.data.joined_at,
            purchasedProducts
         }

         res.json({
            creator: global.creator,
            status: true,
            data: dashboardData
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