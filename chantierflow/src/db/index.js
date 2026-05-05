import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : undefined,
});

export const q = (text, params) => pool.query(text, params);

// ============ USERS ============

export async function getOrCreateUser(phone) {
    const existing = await q('SELECT * FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length) return existing.rows[0];
    const created = await q(
        `INSERT INTO users (phone, company_name, vat_rate)
         VALUES ($1, $2, $3) RETURNING *`,
        [phone, process.env.COMPANY_NAME ?? 'Mon entreprise', Number(process.env.COMPANY_VAT_RATE ?? 20)]
    );
    return created.rows[0];
}

export async function updateUser(id, patch) {
    const fields = Object.keys(patch);
    if (!fields.length) return;
    const sets = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    await q(`UPDATE users SET ${sets} WHERE id = $1`, [id, ...fields.map(f => patch[f])]);
}

// ============ CLIENTS ============

export async function findOrCreateClient(userId, { name, phone, email, address }) {
    if (!name) return null;
    const existing = await q(
        'SELECT * FROM clients WHERE user_id = $1 AND LOWER(name) = LOWER($2) LIMIT 1',
        [userId, name]
    );
    if (existing.rows.length) return existing.rows[0];
    const created = await q(
        `INSERT INTO clients (user_id, name, phone, email, address)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, name, phone ?? null, email ?? null, address ?? null]
    );
    return created.rows[0];
}

// ============ QUOTES ============

export async function nextQuoteNumber(userId) {
    const r = await q(
        `SELECT COUNT(*)::int AS c FROM quotes
         WHERE user_id = $1 AND created_at >= date_trunc('year', NOW())`,
        [userId]
    );
    const num = String(r.rows[0].c + 1).padStart(4, '0');
    return `DV-${new Date().getFullYear()}-${num}`;
}

export async function createQuote(quote) {
    const r = await q(
        `INSERT INTO quotes (user_id, client_id, number, title, items, total_ht, total_tva, total_ttc, status, pdf_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'sent',$9) RETURNING *`,
        [quote.user_id, quote.client_id, quote.number, quote.title,
         JSON.stringify(quote.items), quote.total_ht, quote.total_tva, quote.total_ttc, quote.pdf_url]
    );
    return r.rows[0];
}

// ============ INVOICES ============

export async function nextInvoiceNumber(userId) {
    const r = await q(
        `SELECT COUNT(*)::int AS c FROM invoices
         WHERE user_id = $1 AND created_at >= date_trunc('year', NOW())`,
        [userId]
    );
    const num = String(r.rows[0].c + 1).padStart(4, '0');
    return `F-${new Date().getFullYear()}-${num}`;
}

export async function createInvoice(inv) {
    const r = await q(
        `INSERT INTO invoices
            (user_id, client_id, quote_id, number, items, total_ht, total_tva, total_ttc, due_date, pdf_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [inv.user_id, inv.client_id, inv.quote_id ?? null, inv.number,
         JSON.stringify(inv.items), inv.total_ht, inv.total_tva, inv.total_ttc,
         inv.due_date, inv.pdf_url]
    );
    return r.rows[0];
}

export async function listOverdueInvoices() {
    const r = await q(
        `SELECT i.*, u.phone AS user_phone, u.name AS user_name, c.name AS client_name, c.phone AS client_phone
         FROM invoices i
         JOIN users u ON u.id = i.user_id
         LEFT JOIN clients c ON c.id = i.client_id
         WHERE i.status = 'sent' AND i.due_date < CURRENT_DATE`
    );
    return r.rows;
}

export async function markInvoicePaid(invoiceId) {
    await q(`UPDATE invoices SET status='paid', paid_at=NOW() WHERE id=$1`, [invoiceId]);
}

export async function bumpReminder(invoiceId) {
    await q(
        `UPDATE invoices
         SET reminders_sent = reminders_sent + 1, last_reminder_at = NOW(),
             status = CASE WHEN status='sent' THEN 'overdue' ELSE status END
         WHERE id = $1`,
        [invoiceId]
    );
}

// ============ MESSAGES ============

export async function logMessage(m) {
    await q(
        `INSERT INTO messages (user_id, direction, body, media_url, media_type, intent, payload)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [m.user_id, m.direction, m.body ?? null, m.media_url ?? null,
         m.media_type ?? null, m.intent ?? null, m.payload ? JSON.stringify(m.payload) : null]
    );
}
