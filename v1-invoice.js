import { Database, Utils } from '../../lib/index.js'

export const routes = {
   category: 'data',
   path: '/api/v1/invoice',
   method: 'get',
   parameter: ['id'],
   execution: async (req, res, next) => {
      try {
         const { id } = req.query

         const invoiceRes = await Database.getInvoice(id)
         if (!invoiceRes.status) {
            return res.status(404).json(invoiceRes)
         }

         const invoice = invoiceRes.data

         if (['Paid', 'Lunas'].includes(invoice.status)) {
            const hostUrl = `https://${req.get('Host')}` // Force HTTPS

            const paidAt = invoice.paid_at ? new Date(invoice.paid_at) : null
            const isMoreThan1Hour =
               paidAt && (Date.now() - paidAt.getTime()) > 60 * 60 * 1000

            if (invoice.items?.[0]?.file) {
               if (isMoreThan1Hour) {
                  invoice.items = invoice.items.map(item => {
                     if (item.file) {
                        item.file.data = null
                     }
                     return item
                  })
               }
               return res.json({
                  creator: global.creator,
                  status: true,
                  data: invoice
               })
            }

            const itemsWithFiles = await Promise.all(
               invoice.items.map(async (item) => {
                  const productRes = await Database.getProductWithFile(item.id)
                  if (productRes.status && productRes.data.file) {
                     const fileData = productRes.data.file

                     if (isMoreThan1Hour) {
                        fileData.data = null
                     } else if (fileData.type === 'local') {
                        if (!/download\?token=/.test(fileData.data)) {
                           const token = Utils.genTokenFromUrl(
                              `${hostUrl}/${fileData.data}`,
                              `${item.name}.${fileData.extension}`
                           )
                           fileData.data = `${hostUrl}/api/v1/download?token=${token}`
                        }
                     }

                     return { ...item, file: fileData }
                  }
                  return item
               })
            )

            invoice.items = itemsWithFiles

            await Database.invoiceUpdate(id, { items: itemsWithFiles })
         }

         res.json({
            creator: global.creator,
            status: true,
            data: invoice
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
   error: false
}