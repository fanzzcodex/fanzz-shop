import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/review',
    parameter: ['productId', 'rating'],
    method: 'post',
    execution: async (req, res) => {
        try {
            const { email } = req.user
            if (!email) {
                return res.status(401).json({ creator: global.creator, status: false, msg: 'Akses ditolak' })
            }

            const { productId, rating, comment } = req.body

            // Check if user has purchased this product
            const invoicesRes = await Database.getAllInvoices({ filter: { email, status: 'Paid' }, limit: 0 })
            if (!invoicesRes.status) {
                return res.status(500).json({ creator: global.creator, status: false, msg: 'Gagal memverifikasi pembelian' })
            }

            const paidInvoices = invoicesRes.data.invoices || []
            let hasPurchased = false
            for (const inv of paidInvoices) {
                // If the product is inside inv.productNames or we need to check inv.items
                // Since getAllInvoices populates productNames, but not the items directly with IDs in the simplified view.
                // We should get full invoice details or rely on Database check
            }

            // To be accurate, let's fetch user's full invoices
            const invoiceKeys = await Database.redis.smembers(`invoices:user:${email}`)
            for (const key of invoiceKeys) {
                let invoiceStr = await Database.redis.get(`invoice:${key}`)
                if (invoiceStr) {
                    try {
                        const invoice = typeof invoiceStr === 'string' ? JSON.parse(invoiceStr) : invoiceStr
                        if (invoice.status === 'Paid') {
                            if (invoice.items && invoice.items.some(item => item.id === productId)) {
                                hasPurchased = true
                                break
                            }
                        }
                    } catch (e) {
                        console.warn(`[Review] Skipping malformed invoice ${key}`);
                    }
                }
            }

            if (!hasPurchased) {
                return res.status(403).json({ creator: global.creator, status: false, msg: 'Anda harus membeli produk ini terlebih dahulu untuk memberikan ulasan' })
            }

            const userRes = await Database.getUser(email)
            const userName = userRes.status ? userRes.data.name : 'User'

            const reviewRes = await Database.reviewAdd(productId, email, userName, rating, comment)
            if (!reviewRes.status) {
                return res.status(400).json({ creator: global.creator, status: false, msg: reviewRes.msg })
            }

            res.json({ creator: global.creator, status: true, msg: reviewRes.msg })

        } catch (e) {
            console.error('[Add Review]', e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
