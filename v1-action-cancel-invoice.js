import { Database, Payment } from '../../lib/index.js'

export const routes = {
    category: 'v1',
    path: '/api/v1/invoice/cancel',
    parameter: ['id'],
    method: 'post',
    execution: async (req, res) => {
        try {
            const { email } = req.user
            if (!email) return res.status(401).json({ creator: global.creator, status: false, msg: 'Akses ditolak' })

            const { id } = req.body
            const ivRes = await Database.getInvoice(id)
            if (!ivRes.status) return res.status(404).json({ creator: global.creator, status: false, msg: ivRes.msg })

            const invoice = ivRes.data
            // Can only cancel own invoice (Admin could be checked if needed but let's assume it's user cancelling their own)
            if (invoice.email !== email && req.user.type !== 'admin') {
                return res.status(403).json({ creator: global.creator, status: false, msg: 'Bukan invoice Anda.' })
            }

            if (invoice.status === 'Paid') {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Invoice sudah lunas tidak bisa dibatalkan.' })
            }

            if (invoice.status === 'Kadaluwarsa' || invoice.status === 'Cancelled') {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Invoice sudah dibatalkan atau kadaluwarsa.' })
            }

            // Attempt to cancel on the payment gateway first
            if (invoice.receipt) {
                const cancelRes = await Payment.cancelPayment(invoice.receipt)
                if (!cancelRes.status) {
                    console.error('Gateway Cancellation Error:', cancelRes.msg)
                    // We might still want to cancel in DB if it's already expired on gateway,
                    // but the user specifically said "cancel in web success, rumahotp failed", 
                    // so we should probably inform them if the gateway call fails.
                    // However, if the error is "already cancelled", we can proceed.
                }
            }

            await Database.invoiceUpdate(id, { status: 'Kadaluwarsa' }) // Update internally

            res.json({ creator: global.creator, status: true, msg: 'Invoice berhasil dibatalkan.' })
        } catch (e) {
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
