import { Database, Utils, Payment } from '../../lib/index.js'

export const routes = {
   category: 'v1',
   path: '/api/v1/checkout',
   parameter: ['item'],
   method: 'post',
   execution: async (req, res, next) => {
      try {
         const { item, additional_information } = req.body

         const product = await Database.getProduct(item)
         if (!product.status) return res.status(400).json(product)

         const email = req.user?.email || req.session?.email

         const pendingInvoices = await Database.getAllInvoices({ filter: { email, status: 'Pending' } })
         if (pendingInvoices.status && pendingInvoices.data.invoices.length >= 3) {
            return res.status(400).json({
               creator: global.creator,
               status: false,
               msg: 'Anda memiliki limit 3 pembayaran yang masih tertunda. Harap selesaikan atau tunggu pembayaran dibatalkan sebelum membuat yang baru.'
            })
         }

         const price = Utils.calculatePriceWithTax(parseInt(product.data.price), process.env.TAX)

         const options = {
            email: email,
            product_id: product.data._id,
            product_name: product.data.name
         }

         const json = await Payment.createPayment(price.total, 'qris', options)
         if (!json.status) return res.status(400).json(json)

         const invoice = await Database.invoiceAdd(email, {
            id: json.data.id,
            amount: price.total,
            items: [{
               id: product.data._id,
               name: product.data.name,
               price: product.data.price,
               fee: price.fee,
               quantity: 1
            }],
            additional_information,
            qr: json.data.qr,
            method: 'qris',
            receipt: json.data.receipt
         })

         if (!invoice.status) return res.status(400).json(invoice)

         // Notifikasi Unpaid ke user
         try {
            const buyerRes = await Database.getUser(email)
            if (buyerRes.status) {
               const total = new Intl.NumberFormat('id-ID').format(price.total)
               if (buyerRes.data.phone) {
                  const WhatsApp = (await import('../../lib/whatsapp.js')).default;
                  await WhatsApp.send(buyerRes.data.phone, `*PESANAN DIBUAT (BELUM DIBAYAR)*\n\nHalo ${buyerRes.data.name},\nPesanan Anda dengan Invoice *${json.data.id}* telah dibuat. Tagihan Anda sebesar Rp${total}.\nMohon segera selesaikan pembayaran Anda sebelum hangus.\n\nLink Cek Tagihan:\n${process.env.DOMAIN || 'http://localhost:3000'}/invoice/${json.data.id}`)
               }
               const Mailer = (await import('../../lib/mailer.js')).default
               const EmailTemplates = (await import('../../lib/email-templates.js')).default
               const pendingHtml = EmailTemplates.paymentPending ? EmailTemplates.paymentPending({
                  customerName: buyerRes.data.name,
                  invoiceId: json.data.id,
                  productName: product.data.name,
                  totalAmount: price.total
               }) : null
               if (pendingHtml) {
                  await Mailer.sendMail(email, `Menunggu Pembayaran - Invoice #${json.data.id}`, pendingHtml)
               }
            }
         } catch (e) { console.error('[Checkout Email]', e.message) }

         res.json({
            creator: global.creator,
            status: true,
            data: {
               id: json.data.id,
               redirect: `/invoice/${json.data.id}`
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