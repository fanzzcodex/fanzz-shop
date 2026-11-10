import { Database } from '../../lib/index.js'
import { sendTelegramAlert } from '../../lib/telegram.js'
import WhatsApp from '../../lib/whatsapp.js'
import Mailer from '../../lib/mailer.js'
import EmailTemplates from '../../lib/email-templates.js'

export const routes = {
    category: 'v2',
    path: '/api/v2/users/status',
    parameter: ['email', 'action'],
    method: 'post',
    execution: async (req, res) => {
        try {
            if (req.user.type !== 'admin') {
                return res.status(403).json({ creator: global.creator, status: false, msg: 'Akses ditolak.' })
            }

            const { email, action, reason } = req.body
            const targetUserRes = await Database.getUser(email)
            if (!targetUserRes.status) return res.status(404).json(targetUserRes)

            const targetUser = targetUserRes.data
            if (targetUser.type === 'admin') {
                return res.status(400).json({ creator: global.creator, status: false, msg: 'Tidak bisa memblokir admin.' })
            }

            targetUser.status = action === 'block' ? 'blocked' : 'active'
            targetUser.blockReason = reason || ''

            // Simpan perubahan profil user
            await Database.redis.set(`user:${email}`, JSON.stringify(targetUser))

            // Tambah inbox
            const inboxMsg = action === 'block' ?
                `Akun Anda telah di-blokir oleh Admin. Alasan: ${reason}` :
                `Akun Anda telah di-unblock. Selamat datang kembali!`
            await Database.addInbox(email, { title: 'Pemberitahuan Akun', message: inboxMsg, tag: 'Penting' })

            // Kirim WhatsApp (bila nomor tersedia)
            const waMsg = action === 'block' ?
                `Halo *${targetUser.name}*,\n\nMohon maaf, profil Anda di ${process.env.WEB_NAME || 'Yilzi Shop'} telah kami *Blokir* dengan alasan:\n_"${reason}"_\n\nJika Anda merasa ini kesalahan, silakan hubungi Customer Service kami.` :
                `Halo *${targetUser.name}*,\n\nHore! Profil Anda telah *Berhasil Diaktifkan Kembali*! Anda sekarang dapat melakukan transaksi seperti biasa di ${process.env.WEB_NAME || 'Yilzi Shop'}.\nSelamat berbelanja!`

            if (targetUser.phone) {
                await WhatsApp.send(targetUser.phone, waMsg)
            }

            // Kirim Email
            const emailHtml = EmailTemplates.accountStatus(targetUser.name, action, reason)
            await Mailer.sendMail(email, action === 'block' ? 'Pemberitahuan Pemblokiran Akun' : 'Akun Diaktifkan Kembali', emailHtml);


            // Kirim bot telegram
            sendTelegramAlert(`Akun ${email} telah di-${action} oleh Admin.\nAlasan: ${reason || 'Tidak ada'}`)

            res.json({ creator: global.creator, status: true, msg: `User berhasil di-${action}!` })
        } catch (e) {
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
