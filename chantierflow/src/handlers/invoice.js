import { extractInvoice } from '../services/openai.js';
import { renderInvoicePDF } from '../services/pdf.js';
import { uploadFile } from '../services/storage.js';
import { sendMessage } from '../services/whatsapp.js';
import { q, nextInvoiceNumber, createInvoice } from '../db/index.js';

export async function handleInvoice({ user, text, replyTo }) {
    await sendMessage(replyTo, '🧾 Je prépare la facture…');

    const ai = await extractInvoice(text);

    // Cherche le dernier devis signé/envoyé correspondant
    const r = await q(
        `SELECT q.*, c.name AS client_name, c.address AS client_address, c.email AS client_email, c.phone AS client_phone
         FROM quotes q LEFT JOIN clients c ON c.id = q.client_id
         WHERE q.user_id = $1
           AND ($2::text IS NULL OR LOWER(c.name) LIKE LOWER('%' || $2 || '%') OR q.title ILIKE '%' || $2 || '%')
         ORDER BY q.created_at DESC LIMIT 1`,
        [user.id, ai.client_hint ?? null]
    );

    if (!r.rows.length) {
        await sendMessage(replyTo, '❌ Aucun devis trouvé. Précise le client : "facture le devis Dupont".');
        return null;
    }

    const quote = r.rows[0];
    const pct = ai.type === 'acompte' ? (ai.percentage || 30) : (ai.type === 'situation' ? (ai.percentage || 50) : 100);

    const items = quote.items.map(it => ({
        ...it,
        qty: +(it.qty * pct / 100).toFixed(2),
        total: +(it.total * pct / 100).toFixed(2),
    }));
    const total_ht = +(quote.total_ht * pct / 100).toFixed(2);
    const total_tva = +(quote.total_tva * pct / 100).toFixed(2);
    const total_ttc = +(quote.total_ttc * pct / 100).toFixed(2);

    const number = await nextInvoiceNumber(user.id);
    const due = new Date(); due.setDate(due.getDate() + 30);

    const pdf = await renderInvoicePDF({
        user,
        client: { name: quote.client_name, address: quote.client_address, email: quote.client_email, phone: quote.client_phone },
        number,
        title: pct < 100 ? `${quote.title} — ${ai.type === 'acompte' ? 'Acompte' : 'Situation'} ${pct}%` : quote.title,
        items, vat_rate: user.vat_rate, total_ht, total_tva, total_ttc,
        due_date: due,
    });

    const pdfUrl = await uploadFile(pdf, `invoices/${user.id}/${number}.pdf`);

    await createInvoice({
        user_id: user.id,
        client_id: quote.client_id,
        quote_id: quote.id,
        number, items, total_ht, total_tva, total_ttc,
        due_date: due, pdf_url: pdfUrl,
    });

    await sendMessage(
        replyTo,
        `✅ Facture ${number} émise — *${total_ttc.toLocaleString('fr-FR')} € TTC*\n` +
        `Échéance : ${due.toLocaleDateString('fr-FR')}`,
        pdfUrl
    );

    return { intent: 'invoice', number, total_ttc, pdf_url: pdfUrl };
}
