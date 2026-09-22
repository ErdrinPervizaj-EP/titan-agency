import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const submissionsFile = path.join(__dirname, 'submissions.json');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', (req, res) => {
  const { name, email, company, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  const entry = {
    name,
    email,
    company: company ?? '',
    message,
    receivedAt: new Date().toISOString(),
  };

  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(submissionsFile, 'utf-8'));
  } catch {
    existing = [];
  }
  existing.push(entry);
  fs.writeFileSync(submissionsFile, JSON.stringify(existing, null, 2));

  console.log('New contact submission:', entry);
  res.status(201).json({ ok: true });
});

const DEMO_EMAIL = 'demo@titannetwork.io';
const DEMO_PASSWORD = 'Demo1234!';

app.post('/api/login', (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  res.status(200).json({ ok: true, user: { email, name: 'Demo User' } });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Titan Network API listening on http://localhost:${PORT}`));
