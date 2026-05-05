import { sendMessage } from '../services/whatsapp.js';
import { q } from '../db/index.js';

export async function handleReminder({ user, text, replyTo }) {
    const r = await q(
        `SELECT i.*, c.name AS client_name, c.phone AS client_phone
         FROM invoices i LEFT JOIN clients c ON c.id = i.client_id
         WHERE i.user_id = $1 AND i.status IN ('sent','overdue')
           AND i.due_date < CURRENT_DATE
         ORDER BY i.due_date ASC`,
        [user.id]
    );

    if (!r.rows.length) {
        await sendMessage(replyTo, '✅ Aucune facture en retard. Bravo 💪');
        return null;
    }

    const lines = r.rows.map(i => {
        const days = Math.ceil((Date.now() - new Date(i.due_date)) / 86400000);
        return `• *${i.client_name || 'Client'}* — ${i.number} — ${Number(i.total_ttc).toLocaleString('fr-FR')} € (J+${days})`;
    });

    await sendMessage(replyTo,
        `⚠️ *${r.rows.length} facture(s) en retard*\n\n${lines.join('\n')}\n\n` +
        `Tapez "relance auto" pour que j'envoie un message à chaque client impayé.`);

    return { intent: 'reminder', count: r.rows.length };
}
