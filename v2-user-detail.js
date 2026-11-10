import { Database } from '../../lib/index.js'

export const routes = {
    category: 'v2',
    path: '/api/v2/user/:email',
    parameter: [],
    method: 'get',
    execution: async (req, res) => {
        try {
            if (req.user.type !== 'admin') {
                return res.status(403).json({ creator: global.creator, status: false, msg: 'Akses ditolak.' })
            }

            const { email } = req.params;
            const resUser = await Database.getUser(email);
            if (!resUser.status) return res.status(404).json(resUser);

            const user = resUser.data;

            // Fetch spending and transactions
            const resInvoices = await Database.getAllInvoices({ filter: { email }, limit: 0 });
            let totalSpent = 0;
            let totalTransactions = 0;

            if (resInvoices.status) {
                const paidInvoices = resInvoices.data.invoices.filter(i => i.status === 'Paid');
                totalTransactions = paidInvoices.length;
                totalSpent = paidInvoices.reduce((acc, i) => acc + (i.amount || 0), 0);
            }

            res.json({
                creator: global.creator,
                status: true,
                data: {
                    user: user,
                    stats: {
                        totalSpent,
                        totalTransactions
                    }
                }
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({ creator: global.creator, status: false, msg: e.message })
        }
    },
    error: false,
    login: true
}
