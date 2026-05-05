-- ChantierFlow AI — schéma PostgreSQL

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  phone         TEXT UNIQUE NOT NULL,         -- ex: whatsapp:+33612345678
  name          TEXT,
  company_name  TEXT,
  company_siret TEXT,
  vat_rate      NUMERIC(5,2) DEFAULT 20,
  plan          TEXT DEFAULT 'basic',         -- basic | pro | premium
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  address     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotes (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  client_id   INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  number      TEXT,                            -- DV-2026-0001
  title       TEXT,
  items       JSONB,                           -- [{label, qty, unit, unit_price, total}]
  total_ht    NUMERIC(12,2),
  total_tva   NUMERIC(12,2),
  total_ttc   NUMERIC(12,2),
  status      TEXT DEFAULT 'draft',            -- draft | sent | signed | rejected
  pdf_url     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  client_id   INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  quote_id    INTEGER REFERENCES quotes(id) ON DELETE SET NULL,
  number      TEXT,                            -- F-2026-0001
  items       JSONB,
  total_ht    NUMERIC(12,2),
  total_tva   NUMERIC(12,2),
  total_ttc   NUMERIC(12,2),
  due_date    DATE,
  paid_at     TIMESTAMPTZ,
  status      TEXT DEFAULT 'sent',             -- sent | paid | overdue | cancelled
  pdf_url     TEXT,
  reminders_sent INTEGER DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  direction   TEXT NOT NULL,                   -- in | out
  body        TEXT,
  media_url   TEXT,
  media_type  TEXT,                            -- audio | image | document
  intent      TEXT,                            -- quote | invoice | reminder | photo | voice | other
  payload     JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_user ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id, created_at DESC);
