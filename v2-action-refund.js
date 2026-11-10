import { Database } from '../../lib/index.js'
import Utils from '../../lib/functions.js'
import RedisDB from '../../lib/system/redis.js'

export const routes = {
    category: 'v2',
    path: '/api/v2/refund',
    parameter: ['action'],
    method: 'post',
    execution: async (req, res) => {
        try {
            const { email, role } = req.user
            if (!email) {
                return res.status(401).json({ creator: global.creator, status: false, msg: 'Akses ditolak' })
            }

            const { action, transaction_id, category, reason, proof_image, status, admin_reason } = req.body

            // Helper function for sending response
            const sendResponse = (isSuccess, message, data = null) => {
                const response = { creator: global.creator, status: isSuccess, msg: message }
                if (data) response.data = data
                return res.status(isSuccess ? 200 : 400).json(response)
            }

            const db = RedisDB.client

            // 1. BUYER: Ajukan Refund
            if (action === 'requestRefund') {
                if (!transaction_id || !category) {
                    return sendResponse(false, 'Data refund tidak lengkap')
                }

                // Cek apakah transaksi ada dan milik user
                let transaction = await db.get(`order:${transaction_id}`)
                if (!transaction) return sendResponse(false, 'Transaksi tidak ditemukan')
                transaction = JSON.parse(transaction)

                if (transaction.email !== email && role !== 'admin') {
                    return sendResponse(false, 'Anda tidak memiliki akses ke transaksi ini')
                }

                if (transaction.status !== 'Paid') {
                    return sendResponse(false, 'Hanya transaksi yang sudah dibayar (Paid) yang bisa direfund')
                }

                // Cek apakah sudah pernah refund
                const existingRefund = await db.get(`refund:${transaction_id}`)
                if (existingRefund) {
                    return sendResponse(false, 'Refund untuk transaksi ini sudah diajukan sebelumnya')
                }

                const refundData = {
                    refund_id: 'RF-' + Utils.makeId(8).toUpperCase(),
                    transaction_id,
                    email,
                    category,
                    reason: reason || '',
                    proof_image: proof_image || '', // base64 string
                    amount: transaction.amount,
                    status: 'pending', // pending, accepted, rejected
                    admin_reason: '',
                    created_at: new Date().toISOString()
                }

                await db.set(`refund:${transaction_id}`, JSON.stringify(refundData))
                await db.sadd('refunds:all', transaction_id)
                await db.sadd(`refunds:user:${email}`, transaction_id)

                // Update status order to Reflexion
                transaction.status = 'Refund Requested'
                await db.set(`order:${transaction_id}`, JSON.stringify(transaction))

                return sendResponse(true, 'Pengajuan refund berhasil dikirim', refundData)
            }

            // 2. ADMIN: Action Refund (Accept / Reject)
            else if (action === 'adminAction') {
                if (role !== 'admin') return sendResponse(false, 'Akses terbatas untuk Admin')

                if (!transaction_id || !status) return sendResponse(false, 'Data tidak lengkap')

                let refund = await db.get(`refund:${transaction_id}`)
                if (!refund) return sendResponse(false, 'Data refund tidak ada')
                refund = JSON.parse(refund)

                if (refund.status !== 'pending') {
                    return sendResponse(false, 'Status refund sudah diproses')
                }

                if (status === 'rejected' && (!admin_reason || admin_reason.trim() === '')) {
                    return sendResponse(false, 'Tolong sertakan alasan penolakan (admin_reason)')
                }

                let transaction = await db.get(`order:${transaction_id}`)
                transaction = JSON.parse(transaction)

                if (status === 'accepted') {
                    // Update saldo buyer
                    let buyerRes = await Database.getUser(refund.email)
                    if (buyerRes.status) {
                        let buyer = buyerRes.data
                        let currentBalance = parseInt(buyer.balance || 0)
                        let refundAmount = parseInt(refund.amount || 0)
                        await Database.userEdit(refund.email, { balance: currentBalance + refundAmount })
                    }
                    transaction.status = 'Refunded'
                } else if (status === 'rejected') {
                    transaction.status = 'Paid' // Kembalikan ke paid
                }

                refund.status = status
                refund.admin_reason = admin_reason || ''
                refund.processed_at = new Date().toISOString()

                await db.set(`refund:${transaction_id}`, JSON.stringify(refund))
                await db.set(`order:${transaction_id}`, JSON.stringify(transaction))

                return sendResponse(true, `Refund berhasil di-${status}`)
            }

            // 3. GET LIST REFUND
            else if (action === 'list') {
                const refundKeys = role === 'admin'
                    ? await db.smembers('refunds:all')
                    : await db.smembers(`refunds:user:${email}`);

                let refunds = []
                for (const key of refundKeys) {
                    let r = await db.get(`refund:${key}`)
                    if (r) refunds.push(JSON.parse(r))
                }

                // Sort newest first
                refunds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

                return sendResponse(true, 'Ok', refunds)
            }

            return res.status(400).json({ creator: global.creator, status: false, msg: 'Aksi tidak valid' })

        } catch (e) {
            console.error('[Refund API]', e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message || 'Server error' })
        }
    },
    error: false,
    login: true
}
