import express from 'express';
import pg from 'pg';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// 1. Initializations
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://anergia_user:gjyyxZaOaxiX9mUMLW9ZyMMmRrSuyMf9@dpg-d7hkrlcvikkc73ab76bg-a.frankfurt-postgres.render.com/anergia",
  ssl: { rejectUnauthorized: false }
});

const transporter = process.env.EMAIL_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anergiareal6969@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

async function sendMailSafe(options: nodemailer.SendMailOptions) {
  if (!transporter) return false;
  try {
    await transporter.sendMail(options);
    return true;
  } catch (err) {
    console.error('[EMAIL ERROR]', err);
    return false;
  }
}

// 2. Middleware
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 3. API ROUTES (Explicitly defined before static files)
// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'checking...' });
});

// Check Request
app.get('/api/check-request', async (req, res) => {
  const { tshirtId } = req.query;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const clientIp = Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();

  console.log(`[API] Checking request for T-Shirt ${tshirtId} from IP ${clientIp}`);

  try {
    const result = await pool.query(
      'SELECT *, created_at FROM requests WHERE ip_address = $1 AND tshirt_id = $2',
      [clientIp, parseInt(tshirtId as string, 10)]
    );
    
    if (result.rows.length === 0) {
      return res.json({ requested: false, canPurchase: false });
    }

    const requestDate = new Date(result.rows[0].created_at);
    const now = new Date();
    const hoursPassed = (now.getTime() - requestDate.getTime()) / (1000 * 60 * 60);
    const canPurchase = (process.env.ENABLE_PURCHASE === 'true') && hoursPassed >= 24;

    res.json({ 
      requested: true, 
      canPurchase,
      hoursRemaining: Math.max(0, 24 - hoursPassed)
    });
  } catch (err) {
    console.error('[DATABASE ERROR]', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Submit Request
app.post('/api/request', async (req, res) => {
  const { email, tshirtId } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const clientIp = Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();

  console.log(`[API] New request for T-Shirt ${tshirtId} from ${email} (IP: ${clientIp})`);

  if (!email || !tshirtId) {
    return res.status(400).json({ error: 'Email and T-Shirt ID are required' });
  }

  try {
    const check = await pool.query(
      'SELECT * FROM requests WHERE ip_address = $1 AND tshirt_id = $2',
      [clientIp, parseInt(tshirtId, 10)]
    );

    if (check.rows.length > 0) {
      const reminderMailSent = await sendMailSafe({
        from: 'anergiareal6969@gmail.com',
        to: email,
        subject: 'Μην πατάς το χρυσό κουμπί!',
        text: 'Έχουμε ήδη λάβει το αίτημά σου! Σε ευχαριστούμε!',
      });
      return res.json({ status: 'already_requested', reminderMailSent });
    }

    // Save to DB
    await pool.query(
      'INSERT INTO requests (email, ip_address, tshirt_id) VALUES ($1, $2, $3)',
      [email, clientIp, parseInt(tshirtId, 10)]
    );

    // Send confirmation emails
    const mailText = `Νέο αίτημα από ${email} για το T-Shirt #${tshirtId}`;
    const adminMailSent = await sendMailSafe({
      from: 'anergiareal6969@gmail.com',
      to: 'anergiareal6969@gmail.com',
      subject: 'Νέο Αίτημα xrostao!',
      text: mailText
    });

    const userMailSent = await sendMailSafe({
      from: 'anergiareal6969@gmail.com',
      to: email,
      subject: 'Επιβεβαίωση Αιτήματος - xrostao',
      text: 'Λάβαμε το αίτημά σου! Θα ενημερωθείς μόλις κυκλοφορήσουν οι μπλούζες.'
    });

    res.json({ status: 'success', adminMailSent, userMailSent });
  } catch (err) {
    console.error('[SERVER ERROR]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: 'Internal server error', details: message });
  }
});

// Admin view (Simple verification page)
app.get('/admin-dashboard-xrostao', async (req, res) => {
  try {
    const result = await pool.query('SELECT email, ip_address, tshirt_id, created_at FROM requests ORDER BY created_at DESC');
    let html = `
      <html>
        <head>
          <title>Xrostao Admin</title>
          <style>
            body { font-family: sans-serif; background: #111; color: #eee; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #444; padding: 12px; text-align: left; }
            th { background: #222; }
            tr:nth-child(even) { background: #1a1a1a; }
            .status { color: #4ade80; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Aιτήματα Χρηστών (Database)</h1>
          <p class="status">Σύνολο: ${result.rows.length}</p>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>IP Address</th>
                <th>T-Shirt ID</th>
                <th>Ημερομηνία</th>
              </tr>
            </thead>
            <tbody>
              ${result.rows.map(row => `
                <tr>
                  <td>${row.email}</td>
                  <td>${row.ip_address}</td>
                  <td>${row.tshirt_id}</td>
                  <td>${new Date(row.created_at).toLocaleString('el-GR')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).send('Error loading admin dashboard');
  }
});

// 4. Static Files (ONLY AFTER API ROUTES)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// 5. SPA Catch-all (MUST BE LAST)
app.get('*', (req, res) => {
  // If it's an API request that wasn't caught, return 404 JSON, not HTML
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Frontend build is missing. Run "npm run build".');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${distPath}`);
});
