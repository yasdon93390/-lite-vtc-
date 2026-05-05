import 'dotenv/config';
import express from 'express';
import cron from 'node-cron';
import path from 'node:path';

import whatsappRoutes from './src/routes/whatsapp.js';
import apiRoutes from './src/routes/api.js';
import { runOnce as runReminders } from './src/jobs/reminders.js';

const app = express();

// Serve local PDFs/images when S3 is disabled
app.use('/files', express.static(path.resolve('storage'), { fallthrough: true }));

// Routes
app.use('/webhooks', whatsappRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => res.json({
    name: 'ChantierFlow AI',
    status: 'running',
    docs: 'POST /webhooks/whatsapp (Twilio webhook)',
}));

// Cron — relance impayés tous les jours à 10h Europe/Paris
cron.schedule('0 10 * * *', () => {
    console.log('[cron] daily reminders run');
    runReminders().catch(console.error);
}, { timezone: 'Europe/Paris' });

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`✅ ChantierFlow AI running on :${PORT}`);
});
