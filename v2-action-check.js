import { Database, Payment, Utils } from '../../lib/index.js'
import WhatsApp from '../../lib/whatsapp.js'
import { sendTelegramAlert } from '../../lib/telegram.js'
import Mailer from '../../lib/mailer.js'
import EmailTemplates from '../../lib/email-templates.js'

const processingInvoices = new Set()

export const routes = {
   category: 'v1',
   path: '/api/v1/check',
   parameter: ['id'],
   method: 'post',
   execution: async (req, res, next) => {
      const { id } = req.body

      if (processingInvoices.has(id)) {
         return res.status(429).json({
            creator: global.creator,
            status: false,
            msg: 'Pengecekan untuk invoice ini sedang berlangsung. Harap tunggu sebentar.'
         })
      }

      try {
         processingInvoices.add(id)
         const iv = await Database.getInvoice(id)
         if (!iv.status) return res.status(404).json(iv)
         if (iv.data.status === 'Paid') return res.json({
            creator: global.creator,
            status: true,
            msg: 'Invoice sudah lunas.'
         })

         const paymentResult = await Payment.checkPayment(iv.data.receipt)
         if (!paymentResult.status) return res.json(paymentResult)

         await Database.invoiceUpdate(id, { status: 'Paid' })

         // Collect product info for receipt
         const itemDetails = []
         for (let item of iv.data.items) {
            await Database.productIncrementSales(item.id, item.quantity)
            await Database.productDecrementStock(item.id, item.quantity)

            const productRes = await Database.getProductWithFile(item.id)
            if (productRes.status) {
               itemDetails.push({
                  id: item.id,
                  name: productRes.data.name,
                  quantity: item.quantity || 1,
                  price: productRes.data.price
               })
            }
         }

         // Send Receipt Email to Buyer
         const buyerRes = await Database.getUser(iv.data.email)
         const buyerName = buyerRes.status ? buyerRes.data.name : iv.data.email
         const totalAmount = iv.data.amount

         try {
            const receiptHtml = EmailTemplates.paymentSuccess({
               customerName: buyerName,
               email: iv.data.email,
               invoiceId: id,
               items: itemDetails,
               totalAmount,
               date: iv.data.created_at || new Date()
            })
            await Mailer.sendMail(iv.data.email, `Pembayaran Berhasil - Invoice #${id}`, receiptHtml)
         } catch (e) { console.error('[Email Receipt]', e.message) }

         // Send Notification Email to Owner
         try {
            const ownerHtml = EmailTemplates.ownerPaymentNotification({
               customerName: buyerName,
               customerEmail: iv.data.email,
               invoiceId: id,
               productName: itemDetails.map(i => i.name).join(', '),
               totalAmount
            })
            await Mailer.sendMail(process.env.EMAIL_FROM || process.env.EMAIL_USER, `💰 Pembayaran Baru #${id}`, ownerHtml)
         } catch (e) { console.error('[Email Owner]', e.message) }

         // Send WA Notifications
         if (buyerRes.status) {
            const phone = buyerRes.data.phone
            const totalFormatted = new Intl.NumberFormat('id-ID').format(totalAmount)
            if (phone) {
               await WhatsApp.send(phone, `*Pembayaran Berhasil!*\n\nHalo ${buyerName},\nTerima kasih, pembayaran untuk Invoice *${id}* sebesar Rp${totalFormatted} telah kami terima.\nBarang/Layanan Anda segera diproses.`)
            }
            const ownerPhone = process.env.OWNER_PHONE || '6281359123789'
            await WhatsApp.send(ownerPhone, `*ORDER MASUK!*\n\nCustomer: ${buyerName} (${iv.data.email})\nInvoice: ${id}\nAmount: Rp${totalFormatted}`)
         }

         sendTelegramAlert(`💰 *Pembayaran Sukses*\n\nInvoice: \`${id}\`\nEmail: \`${iv.data.email}\`\nJumlah: Rp${new Intl.NumberFormat('id-ID').format(totalAmount)}`)

         res.json({
            creator: global.creator,
            status: true,
            msg: 'Pembayaran berhasil dikonfirmasi.'
         })
      } catch (e) {
         console.error(e)
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message || 'Terjadi kesalahan pada server!'
         })
      } finally {
         processingInvoices.delete(id)
      }
   },
   error: false
}
