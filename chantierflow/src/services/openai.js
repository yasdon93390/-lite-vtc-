import OpenAI from 'openai';
import 'dotenv/config';
import {
    INTENT_SYSTEM, QUOTE_SYSTEM, INVOICE_SYSTEM,
    PHOTO_SYSTEM, REMINDER_SYSTEM, CLIENT_UPDATE_SYSTEM
} from '../prompts/index.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL_TEXT = 'gpt-4o-mini';
const MODEL_VISION = 'gpt-4o';

async function jsonChat(system, user, model = MODEL_TEXT) {
    const r = await client.chat.completions.create({
        model,
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
        ],
        temperature: 0.4,
    });
    return JSON.parse(r.choices[0].message.content);
}

export async function classifyIntent({ text, hasMedia, mediaType }) {
    if (hasMedia && mediaType?.startsWith('audio')) return { intent: 'voice', confidence: 1 };
    if (hasMedia && mediaType?.startsWith('image')) return { intent: 'photo', confidence: 1 };
    return jsonChat(INTENT_SYSTEM, text || '');
}

export async function extractQuote(description) {
    return jsonChat(QUOTE_SYSTEM, description);
}

export async function extractInvoice(description) {
    return jsonChat(INVOICE_SYSTEM, description);
}

export async function generatePhotoCaption(imageUrl, userHint = '') {
    const r = await client.chat.completions.create({
        model: MODEL_VISION,
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: PHOTO_SYSTEM },
            {
                role: 'user',
                content: [
                    { type: 'text', text: userHint || 'Voici une photo de mon chantier.' },
                    { type: 'image_url', image_url: { url: imageUrl } }
                ]
            }
        ],
        temperature: 0.7,
    });
    return JSON.parse(r.choices[0].message.content);
}

export async function generateReminder({ invoiceNumber, amount, dueDate, daysLate, clientName }) {
    const ctx = `Facture ${invoiceNumber} de ${amount} € émise au client ${clientName}, échue le ${dueDate}, en retard de ${daysLate} jours.`;
    return jsonChat(REMINDER_SYSTEM, ctx);
}

export async function generateClientUpdate(description) {
    return jsonChat(CLIENT_UPDATE_SYSTEM, description);
}

export async function transcribeAudio(buffer, filename = 'audio.ogg') {
    const file = new File([buffer], filename, { type: 'audio/ogg' });
    const r = await client.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'fr',
    });
    return r.text;
}
