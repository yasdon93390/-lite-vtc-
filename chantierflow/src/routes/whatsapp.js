import express from 'express';
import { getOrCreateUser } from '../db/index.js';
import { routeMessage } from '../handlers/router.js';

const router = express.Router();

// Twilio sends application/x-www-form-urlencoded
router.post('/whatsapp', express.urlencoded({ extended: false }), async (req, res) => {
    // Acknowledge immediately so Twilio doesn't time out
    res.set('Content-Type', 'text/xml').send('<Response></Response>');

    try {
        const from = req.body.From;          // "whatsapp:+33612345678"
        const body = (req.body.Body || '').trim();
        const numMedia = parseInt(req.body.NumMedia || '0', 10);
        const mediaUrl = numMedia > 0 ? req.body.MediaUrl0 : null;
        const mediaType = numMedia > 0 ? req.body.MediaContentType0 : null;

        if (!from) return;

        const user = await getOrCreateUser(from);
        await routeMessage({
            user,
            text: body,
            mediaUrl,
            mediaType,
            replyTo: from,
        });
    } catch (err) {
        console.error('[webhook] error', err);
    }
});

export default router;
