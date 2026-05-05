import twilio from 'twilio';
import axios from 'axios';
import 'dotenv/config';

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_WHATSAPP_FROM;

const client = sid && token ? twilio(sid, token) : null;

export async function sendMessage(to, body, mediaUrl) {
    if (!client) {
        console.warn('[whatsapp] Twilio non configuré, message non envoyé:', { to, body, mediaUrl });
        return { sid: 'mock' };
    }
    const payload = { from: FROM, to, body };
    if (mediaUrl) payload.mediaUrl = [mediaUrl];
    return client.messages.create(payload);
}

export async function downloadMedia(url) {
    if (!sid || !token) throw new Error('Twilio credentials manquants');
    const r = await axios.get(url, {
        responseType: 'arraybuffer',
        auth: { username: sid, password: token },
    });
    return {
        buffer: Buffer.from(r.data),
        contentType: r.headers['content-type'],
    };
}
