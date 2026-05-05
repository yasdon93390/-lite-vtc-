import { downloadMedia, sendMessage } from '../services/whatsapp.js';
import { transcribeAudio, classifyIntent } from '../services/openai.js';
import { handleQuote } from './quote.js';
import { handleInvoice } from './invoice.js';
import { handleReminder } from './reminder.js';
import { handleClientUpdate } from './client_update.js';

export async function handleVoice({ user, mediaUrl, replyTo }) {
    await sendMessage(replyTo, '🎙️ Je transcris votre message vocal…');

    const { buffer } = await downloadMedia(mediaUrl);
    const text = await transcribeAudio(buffer);

    await sendMessage(replyTo, `📝 Transcription :\n_${text}_`);

    // Reroute to text intent
    const { intent } = await classifyIntent({ text, hasMedia: false });

    switch (intent) {
        case 'quote':         return handleQuote({ user, text, replyTo });
        case 'invoice':       return handleInvoice({ user, text, replyTo });
        case 'reminder':      return handleReminder({ user, text, replyTo });
        case 'client_update': return handleClientUpdate({ user, text, replyTo });
        default:
            await sendMessage(replyTo,
                `Je ne suis pas sûr de l'action à faire. Vous pouvez écrire :\n` +
                `• "fais-moi un devis pour…"\n• "facture le chantier …"\n• "relance …"\n• "préviens … que …"`);
            return { intent: 'voice', transcription: text };
    }
}
