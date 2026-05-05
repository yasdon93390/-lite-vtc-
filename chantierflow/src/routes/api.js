import express from 'express';
import { q, markInvoicePaid } from '../db/index.js';

const router = express.Router();

router.use(express.json());

router.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

router.get('/users', async (req, res) => {
    const r = await q('SELECT id, phone, name, company_name, plan, created_at FROM users ORDER BY created_at DESC');
    res.json(r.rows);
});

router.get('/quotes', async (req, res) => {
    const r = await q(
        `SELECT q.id, q.number, q.title, q.total_ttc, q.status, q.pdf_url, q.created_at,
                u.company_name, c.name AS client_name
         FROM quotes q JOIN users u ON u.id = q.user_id
         LEFT JOIN clients c ON c.id = q.client_id
         ORDER BY q.created_at DESC LIMIT 200`
    );
    res.json(r.rows);
});

router.get('/invoices', async (req, res) => {
    const r = await q(
        `SELECT i.id, i.number, i.total_ttc, i.status, i.due_date, i.pdf_url, i.created_at,
                u.company_name, c.name AS client_name
         FROM invoices i JOIN users u ON u.id = i.user_id
         LEFT JOIN clients c ON c.id = i.client_id
         ORDER BY i.created_at DESC LIMIT 200`
    );
    res.json(r.rows);
});

router.post('/invoices/:id/paid', async (req, res) => {
    await markInvoicePaid(req.params.id);
    res.json({ ok: true });
});

export default router;
