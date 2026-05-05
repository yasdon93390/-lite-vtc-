import { generateClientUpdate } from '../services/openai.js';
import { sendMessage } from '../services/whatsapp.js';

export async function handleClientUpdate({ user, text, replyTo }) {
    const { message } = await generateClientUpdate(text);

    // On pourrait extraire le numéro client mais MVP : on renvoie à l'artisan pour validation
    await sendMessage(replyTo,
        `✏️ *Message rédigé* — copiez ou répondez "envoyer" :\n\n${message}`);
    return { intent: 'client_update', message };
}
