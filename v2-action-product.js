import { Assistant as Groq, Database } from '../../lib/index.js'
import multer from 'multer'
import { productUploads, processFiles } from '../../middlewares/only/upload.js'

export const routes = {
   category: 'v2',
   path: '/api/v2/product',
   method: 'post',
   middleware: [productUploads, processFiles],
   execution: async (req, res, next) => {
      try {
         const userType = req.user?.type
         if (userType !== 'admin') {
            return res.status(403).json({
               creator: global.creator,
               status: false,
               msg: 'Anda tidak memiliki izin untuk melakukan tindakan ini.'
            })
         }

         const productData = req.body

         delete productData.file_upload_destination
         delete productData.file_url

         if (productData.type === 'add') {
            delete productData.type
            productData.is_featured = productData.is_featured === 'true'

            if (typeof productData.additional_information === 'string') {
               productData.additional_information = JSON.parse(productData.additional_information)
            }

            const json = await Database.productAdd(productData)
            if (json.status) {
               await Groq.reloadProductData()
            }
            return res.status(json.status ? 201 : 400).json(json)
         } else if (productData.type === 'edit') {
            const productId = productData.id
            if (!productId) return res.status(400).json({
               creator: global.creator,
               status: false,
               msg: 'ID Produk wajib disertakan.'
            })
            delete productData.type

            productData.is_featured = productData.is_featured === 'true'
            productData.show = productData.show === 'true'
            if (productData.original_price) productData.original_price = parseInt(productData.original_price, 10)
            if (productData.price) productData.price = parseInt(productData.price, 10)

            if (typeof productData.additional_information === 'string') {
               productData.additional_information = JSON.parse(productData.additional_information)
            }

            const json = await Database.productUpdate(productId, productData)
            if (json.status) {
               await Groq.reloadProductData()
            }
            return res.status(json.status ? 200 : 400).json(json)
         } else {
            return res.status(400).json({
               creator: global.creator,
               status: false,
               msg: 'Tipe operasi tidak valid.'
            })
         }
      } catch (e) {
         console.error(e)
         if (e instanceof multer.MulterError) {
            return res.status(400).json({
               creator: global.creator,
               status: false,
               msg: `Error Multer: ${e.message}`
            })
         }
         res.status(500).json({
            creator: global.creator,
            status: false,
            msg: e.message || 'Terjadi kesalahan pada server.'
         })
      }
   },
   error: false,
   login: true
}