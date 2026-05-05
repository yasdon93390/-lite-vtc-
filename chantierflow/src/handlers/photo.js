import { sendMessage } from '../services/whatsapp.js';
import { generatePhotoCaption } from '../services/openai.js';

export async function handlePhoto({ user, mediaUrl, text, replyTo }) {
    await sendMessage(replyTo, '📸 Je génère un post Instagram…');

    const result = await generatePhotoCaption(mediaUrl, text);

    const post =
        `✨ *${result.title}*\n\n` +
        `${result.caption}\n\n` +
        result.hashtags.join(' ');

    await sendMessage(replyTo,
        `📱 *Post prêt à publier* ✅\n\n${post}\n\n` +
        `_Copiez-collez sur Instagram avec votre photo._`);

    return { intent: 'photo', caption: result.caption, hashtags: result.hashtags };
}
