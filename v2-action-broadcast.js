import { Database } from '../../lib/index.js'
import Mailer from '../../lib/mailer.js'
import EmailTemplates from '../../lib/email-templates.js'

export const routes = {
    category: 'v2',
    path: '/api/v2/broadcast',
    parameter: ['title', 'message', 'tag'],
    method: 'post',
    execution: async (req, res) => {
        try {
            if (req.user.type !== 'admin') {
                return res.status(403).json({ creator: global.creator, status: false, msg: 'Akses ditolak.' })
            }

            const { title, message, tag } = req.body
            const usersRes = await Database.getAllUsers({ limit: 0 })
            const users = usersRes.data || []

            let inboxCount = 0
            let emailCount = 0
            const emailErrors = []

            for (let u of users) {
                if (u.role !== 'admin') {
                    const userEmail = u.email || u._id
                    if (userEmail) {
                        // Add to inbox
                        await Database.addInbox(userEmail, { title, message, tag })
                        inboxCount++

                        // Send email notification
                        try {
                            const emailHtml = EmailTemplates.broadcast(title, message, tag)
                            await Mailer.sendMail(userEmail, `${tag ? `[${tag}] ` : ''}${title}`, emailHtml)
                            emailCount++
                        } catch (emailErr) {
                            console.error(`[Broadcast Email] Failed to send to ${userEmail}:`, emailErr.message)
                            emailErrors.push(userEmail)
                        }
                    }
                }
            }

            let msg = `Pesan broadcast sukses dikirim ke ${inboxCount} user (inbox) dan ${emailCount} email terkirim!`
            if (emailErrors.length > 0) {
                msg += ` (${emailErrors.length} email gagal terkirim)`
            }

            res.json({ creator: global.creator, status: true, msg })
        } catch (e) {
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
