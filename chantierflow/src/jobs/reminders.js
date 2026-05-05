import 'dotenv/config';
import { listOverdueInvoices, bumpReminder, q } from '../db/index.js';
import { generateReminder } from '../services/openai.js';
import { sendMessage } from '../services/whatsapp.js';

const STEPS = [3, 10, 20]; // jours après échéance pour les 3 relances

async function runOnce() {
    const overdue = await listOverdueInvoices();
    console.log(`[reminders] ${overdue.length} factures en retard`);

    for (const inv of overdue) {
        const daysLate = Math.ceil((Date.now() - new Date(inv.due_date)) / 86400000);
        const stepIdx = inv.reminders_sent;
        if (stepIdx >= STEPS.length) continue;            // déjà 3 relances
        if (daysLate < STEPS[stepIdx]) continue;          // pas encore l'heure

        if (!inv.client_phone) {
            console.warn(`[reminders] facture ${inv.number}: pas de téléphone client`);
            continue;
        }

        const { message } = await generateReminder({
            invoiceNumber: inv.number,
            amount: Number(inv.total_ttc).toFixed(2),
            dueDate: new Date(inv.due_date).toLocaleDateString('fr-FR'),
            daysLate,
            clientName: inv.client_name || 'Madame, Monsieur',
        });

        const to = inv.client_phone.startsWith('whatsapp:')
            ? inv.client_phone
            : `whatsapp:${inv.client_phone}`;

        await sendMessage(to, message);
        await bumpReminder(inv.id);

        // notifier l'artisan
        await sendMessage(inv.user_phone,
            `✉️ Relance N°${stepIdx + 1} envoyée à *${inv.client_name}* pour la facture ${inv.number}.`);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    runOnce().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}

export { runOnce };
