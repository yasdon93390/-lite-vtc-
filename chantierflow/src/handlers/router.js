import { classifyIntent } from '../services/openai.js';
import { sendMessage } from '../services/whatsapp.js';
import { handleQuote } from './quote.js';
import { handleInvoice } from './invoice.js';
import { handleVoice } from './voice.js';
import { handlePhoto } from './photo.js';
import { handleReminder } from './reminder.js';
import { handleClientUpdate } from './client_update.js';
import { logMessage } from '../db/index.js';

const HELP =
`👋 *Bienvenue sur ChantierFlow AI*

Je suis votre assistant 24/7 sur WhatsApp. Voici ce que je sais faire :

📝 *Devis* — "fais-moi un devis pour rénovation salle de bain 5m²"
🧾 *Facture* — "facture le chantier Dupont"
🎙️ *Vocal* — envoyez un message vocal, je le transcris et j'agis
📸 *Marketing* — envoyez une photo, je génère un post Instagram
⚠️ *Relances* — "qui me doit de l'argent ?"
✏️ *Client* — "préviens Dupont que je passe demain à 14h"

Allez-y 👷`;

export async function routeMessage({ user, text, mediaUrl, mediaType, replyTo }) {
    await logMessage({
        user_id: user.id, direction: 'in', body: text,
        media_url: mediaUrl, media_type: mediaType,
    });

    if (text && /^(menu|aide|help|\?|hello|salut|bonjour)$/i.test(text.trim())) {
        await sendMessage(replyTo, HELP);
        return { intent: 'help' };
    }

    const { intent } = await classifyIntent({
        text, hasMedia: !!mediaUrl, mediaType,
    });

    try {
        switch (intent) {
            case 'voice':
                return await handleVoice({ user, mediaUrl, replyTo });
            case 'photo':
                return await handlePhoto({ user, mediaUrl, text, replyTo });
            case 'quote':
                return await handleQuote({ user, text, replyTo });
            case 'invoice':
                return await handleInvoice({ user, text, replyTo });
            case 'reminder':
                return await handleReminder({ user, text, replyTo });
            case 'client_update':
                return await handleClientUpdate({ user, text, replyTo });
            case 'help':
            default:
                await sendMessage(replyTo, HELP);
                return { intent: 'help' };
        }
    } catch (err) {
        console.error('[router] error', err);
        await sendMessage(replyTo,
            `❌ Désolé, une erreur est survenue. Réessayez ou tapez "aide" pour la liste des commandes.`);
        return { intent: 'error', error: err.message };
    }
}
