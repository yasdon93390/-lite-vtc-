import 'dotenv/config';
import fs from 'node:fs/promises';
import { pool } from './index.js';

const sql = await fs.readFile(new URL('./schema.sql', import.meta.url), 'utf8');
await pool.query(sql);
console.log('✅ Schéma DB initialisé');
await pool.end();
