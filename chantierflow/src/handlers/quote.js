import { extractQuote } from '../services/openai.js';
import { renderQuotePDF } from '../services/pdf.js';
import { uploadFile } from '../services/storage.js';
import { sendMessage } from '../services/whatsapp.js';
import { findOrCreateClient, nextQuoteNumber, createQuote } from '../db/index.js';

function recalcTotals(items, vatRate) {
    const total_ht = items.reduce((s, i) => s + Number(i.total || (i.qty * i.unit_price) || 0), 0);
    const total_tva = +(total_ht * (vatRate / 100)).toFixed(2);
    const total_ttc = +(total_ht + total_tva).toFixed(2);
    return { total_ht: +total_ht.toFixed(2), total_tva, total_ttc };
}

export async function handleQuote({ user, text, replyTo }) {
    await sendMessage(replyTo, '🔨 Je prépare votre devis…');

    const ai = await extractQuote(text);
    const vatRate = ai.vat_rate || user.vat_rate || 10;
    const totals = recalcTotals(ai.items, vatRate);

    const client = ai.client_name
        ? await findOrCreateClient(user.id, { name: ai.client_name })
        : null;

    const number = await nextQuoteNumber(user.id);
    const pdfBuffer = await renderQuotePDF({
        user,
        client,
        number,
        title: ai.title,
        items: ai.items,
        vat_rate: vatRate,
        ...totals,
    });

    const pdfUrl = await uploadFile(pdfBuffer, `quotes/${user.id}/${number}.pdf`);

    await createQuote({
        user_id: user.id,
        client_id: client?.id ?? null,
        number,
        title: ai.title,
        items: ai.items,
        ...totals,
        pdf_url: pdfUrl,
    });

    await sendMessage(
        replyTo,
        `✅ Devis ${number} prêt — *${totals.total_ttc.toLocaleString('fr-FR')} € TTC*\n` +
        `📄 ${ai.title}\n\n` +
        `Voulez-vous l'envoyer au client ? Répondez "envoyer à <numéro>" ou je vous le renvoie ci-dessous.`,
        pdfUrl
    );

    return { intent: 'quote', number, total_ttc: totals.total_ttc, pdf_url: pdfUrl };
}
