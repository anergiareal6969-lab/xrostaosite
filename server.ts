import express from 'express';
import pg from 'pg';
import nodemailer from 'nodemailer';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dns from 'node:dns';
import { Resend } from 'resend';

// 0. Force IPv4 for all external connections immediately
dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const app = express();

// 1. Initializations
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('[CRITICAL ERROR] DATABASE_URL is not defined in environment variables!');
}

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection and retry logic
async function connectWithRetry(retries = 5) {
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log('[INIT] Successfully connected to PostgreSQL');
      client.release();
      return;
    } catch (err) {
      retries -= 1;
      console.error(`[DB] Connection failed. Retries left: ${retries}`, err);
      if (retries === 0) throw err;
      await new Promise<void>(res => setTimeout(res, 5000));
    }
  }
}

// Error handling for the pool
pool.on('error', (err) => {
  console.error('[POSTGRES POOL ERROR]', err);
});

const transporter = process.env.EMAIL_PASSWORD
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: 'anergiareal6969@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      // CRITICAL: Force IPv4 to avoid ENETUNREACH errors on Render
      family: 4, 
      tls: {
        rejectUnauthorized: false // Helps in some restricted networks
      }
    } as any)
  : null;

if (!transporter) {
  console.warn('[WARNING] EMAIL_PASSWORD is not defined. Email sending will be disabled.');
}

async function ensureTables() {
  // Requests table - Removed UNIQUE constraint to allow multiple requests
  await pool.query(`
    CREATE TABLE IF NOT EXISTS requests (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      tshirt_id INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      user_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
      admin_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
      email_last_attempted_at TIMESTAMPTZ,
      email_last_error TEXT
    );
  `);

  await pool.query(`ALTER TABLE requests ADD COLUMN IF NOT EXISTS user_email_sent BOOLEAN NOT NULL DEFAULT FALSE;`);
  await pool.query(`ALTER TABLE requests ADD COLUMN IF NOT EXISTS admin_email_sent BOOLEAN NOT NULL DEFAULT FALSE;`);
  await pool.query(`ALTER TABLE requests ADD COLUMN IF NOT EXISTS email_last_attempted_at TIMESTAMPTZ;`);
  await pool.query(`ALTER TABLE requests ADD COLUMN IF NOT EXISTS email_last_error TEXT;`);

  // Drop the unique constraint if it exists (for existing databases)
  try {
    await pool.query(`ALTER TABLE requests DROP CONSTRAINT IF EXISTS requests_ip_address_tshirt_id_key;`);
  } catch (e) {
    console.log('[DB] Unique constraint already removed or not found');
  }

  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT,
      last_ip TEXT,
      last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('[DB] Tables ensured');
}

async function sendMailSafe(options: nodemailer.SendMailOptions) {
  let resendFailure: string | null = null;
  if (resend) {
    try {
      console.log(`[EMAIL] Sending via Resend to ${options.to}...`);
      const { data, error } = await resend.emails.send({
        from: 'xrostao <onboarding@resend.dev>',
        to: options.to as string,
        subject: options.subject as string,
        html: options.html as string,
        text: options.text as string,
      });

      if (!error) {
        console.log(`[RESEND SUCCESS] Message ID: ${data?.id}`);
        return { ok: true as const, provider: 'resend' as const };
      }

      console.error('[RESEND ERROR]', error);
      resendFailure = typeof error === 'string' ? error : JSON.stringify(error);
    } catch (err) {
      console.error('[RESEND FATAL ERROR]', err);
      resendFailure = err instanceof Error ? err.message : 'Unknown error';
    }
  }

  if (!transporter) {
    console.error('[EMAIL] No email provider configured (RESEND_API_KEY or EMAIL_PASSWORD).');
    return {
      ok: false as const,
      provider: 'none' as const,
      error: resendFailure ? `Resend failed: ${resendFailure}. No SMTP configured.` : 'No email provider configured',
    };
  }
  try {
    // Force the "from" address to be our verified sender
    const mailOptions = {
      ...options,
      from: `"xrostao clothing" <anergiareal6969@gmail.com>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Sent via SMTP: ${info.messageId} to ${options.to}`);
    return { ok: true as const, provider: 'smtp' as const };
  } catch (err) {
    console.error('[EMAIL ERROR] Full details:', err);
    const smtpError = err instanceof Error ? err.message : 'Unknown error';
    return {
      ok: false as const,
      provider: 'smtp' as const,
      error: resendFailure ? `Resend failed: ${resendFailure}. SMTP failed: ${smtpError}` : smtpError,
    };
  }
}

async function sendMailWithRetry(options: nodemailer.SendMailOptions, attempts = 2) {
  let last: Awaited<ReturnType<typeof sendMailSafe>> | null = null;
  for (let i = 0; i < attempts; i++) {
    last = await sendMailSafe(options);
    if (last.ok) return last;
    await new Promise<void>(res => setTimeout(res, 750 * (i + 1)));
  }
  return last ?? { ok: false as const, provider: 'none' as const, error: 'Unknown error' };
}

// Helper to verify SMTP on start with retries
async function verifySMTP(retries = 3) {
  if (resend) {
    console.log('[INIT] Using Resend API (No SMTP verification needed)');
    return;
  }
  if (!transporter) return;
  while (retries > 0) {
    try {
      console.log(`[INIT] SMTP Verification attempt... (Retries left: ${retries - 1})`);
      await transporter.verify();
      console.log('[INIT] SMTP connection verified and ready');
      return;
    } catch (err) {
      retries -= 1;
      console.error(`[INIT] SMTP Verification failed:`, err);
      if (retries === 0) break;
      console.log('[INIT] Waiting 5s before next SMTP retry...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

// 2. Middleware
app.use(compression()); // Compress all responses
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

// API to sync user after Google Login
app.post('/api/sync-user', async (req, res) => {
  const { email, username } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const clientIp = Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Check if user is new
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const isNewUser = checkUser.rows.length === 0;

    await pool.query(
      `INSERT INTO users (email, username, last_ip, last_login) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (email) DO UPDATE 
       SET username = $2, last_ip = $3, last_login = CURRENT_TIMESTAMP`,
      [email, username || email.split('@')[0], clientIp]
    );

    if (isNewUser) {
      console.log(`[API] New user signed up: ${email}. Sending welcome email.`);
      await sendMailSafe({
        from: 'anergiareal6969@gmail.com',
        to: email,
        subject: 'Καλώς ήρθες στην anergia! | xrostao',
        text: 'Σε ευχαριστούμε για την εγγραφή σου! Θα ενημερωθείς για όλα τα νέα drops.'
      });
    }

    res.json({ success: true, isNewUser });
  } catch (err) {
    console.error('[API] User sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// API to auto-login by IP
app.get('/api/me-by-ip', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const clientIp = Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();

  try {
    const result = await pool.query(
      'SELECT email, username FROM users WHERE last_ip = $1 ORDER BY last_login DESC LIMIT 1',
      [clientIp]
    );
    if (result.rows.length > 0) {
      res.json({ user: result.rows[0] });
    } else {
      res.json({ user: null });
    }
  } catch (err) {
    console.error('[API] IP lookup error:', err);
    res.status(500).json({ error: 'Lookup failed' });
  }
});

// Check Request
app.get('/api/check-request', async (req, res) => {
  const { tshirtId, email } = req.query;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const clientIp = Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();

  console.log(`[API] Checking request for T-Shirt ${tshirtId} from IP ${clientIp} (Email: ${email || 'none'})`);

  try {
    let query = 'SELECT *, created_at FROM requests WHERE tshirt_id = $1 AND (ip_address = $2';
    let params: any[] = [parseInt(tshirtId as string, 10), clientIp];

    if (email) {
      query += ' OR email = $3)';
      params.push(email);
    } else {
      query += ')';
    }

    const result = await pool.query(query, params);
    
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
    // 1. Save to Database (We allow multiple requests now)
    const insertResult = await pool.query(
      'INSERT INTO requests (email, ip_address, tshirt_id) VALUES ($1, $2, $3) RETURNING id',
      [email, clientIp, parseInt(tshirtId, 10)]
    );
    const requestId: number = insertResult.rows[0]?.id;
    console.log(`[API] Request saved to DB for ${email} (id: ${requestId})`);

    const userEmailTo = email.trim();
    console.log(`[API] Sending emails for request id ${requestId}: ${userEmailTo}`);

    await pool.query(
      'UPDATE requests SET email_last_attempted_at = NOW(), email_last_error = NULL WHERE id = $1',
      [requestId]
    );

    const userEmailResult = await sendMailWithRetry({
      to: userEmailTo,
      subject: 'Επιβεβαίωση Αιτήματος | anergia season by xrostao',
      text: `Λάβαμε το αίτημά σου για το T-Shirt #${tshirtId} και θα σε ενημερώσουμε μόλις υπάρξει διαθεσιμότητα για αγορά!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #000; color: #fff; border: 1px solid #333;">
          <h1 style="font-style: italic; color: #fff;">xrostao clothing</h1>
          <p style="font-size: 18px;">Λάβαμε το αίτημά σου!</p>
          <p>Θα σε ενημερώσουμε αμέσως μόλις υπάρξει διαθεσιμότητα για το <b>T-Shirt #${tshirtId}</b>.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">anergia season — xrostao.site</p>
        </div>
      `
    });

    const adminEmailResult = await sendMailWithRetry({
      to: 'anergiareal6969@gmail.com',
      subject: `ΝΕΟ ΑΙΤΗΜΑ: ${userEmailTo} | T-Shirt #${tshirtId}`,
      text: `Ο χρήστης με email: ${userEmailTo} έκανε αίτημα για το T-Shirt #${tshirtId}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #f4f4f4; color: #333;">
          <h2>Νέο Αίτημα στο xrostao!</h2>
          <p><b>Email Χρήστη:</b> ${userEmailTo}</p>
          <p><b>Προϊόν:</b> T-Shirt #${tshirtId}</p>
          <p><b>IP:</b> ${clientIp}</p>
          <hr>
          <p>Δες όλα τα αιτήματα στο admin dashboard σου.</p>
        </div>
      `
    });

    const userSent = userEmailResult.ok;
    const adminSent = adminEmailResult.ok;

    await pool.query(
      `UPDATE requests
       SET user_email_sent = $2,
           admin_email_sent = $3,
           email_last_error = $4
       WHERE id = $1`,
      [
        requestId,
        userSent,
        adminSent,
        userSent && adminSent
          ? null
          : JSON.stringify({
              user: userEmailResult.ok ? null : { provider: userEmailResult.provider, error: userEmailResult.error },
              admin: adminEmailResult.ok ? null : { provider: adminEmailResult.provider, error: adminEmailResult.error },
            }),
      ]
    );

    if (!userSent || !adminSent) {
      return res.status(502).json({
        status: 'saved_but_email_failed',
        requestId,
        emails: {
          user: userSent ? { sent: true } : { sent: false, provider: userEmailResult.provider, error: userEmailResult.error },
          admin: adminSent ? { sent: true } : { sent: false, provider: adminEmailResult.provider, error: adminEmailResult.error },
        },
      });
    }

    res.json({ status: 'success', requestId, emails: { user: { sent: true }, admin: { sent: true } } });

  } catch (err) {
    console.error('[SERVER ERROR] Request handling failed:', err);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: err instanceof Error ? err.message : 'Unknown error' 
    });
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

// Serve index.html without caching
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use(express.static(distPath, {
  maxAge: '1h', // Default for other assets
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Aggressive caching for images (1 year)
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // No cache for HTML
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
  }
}));

// 5. SPA Catch-all (MUST BE LAST)
app.get('*', (req, res) => {
  // If it's an API request that wasn't caught, return 404 JSON, not HTML
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Frontend build is missing. Run "npm run build".');
  }
});

const PORT = process.env.PORT || 5000;

async function start() {
  console.log(`[INIT] Starting server...`);
  console.log(`[INIT] DATABASE_URL present: ${!!process.env.DATABASE_URL}`);
  console.log(`[INIT] EMAIL_PASSWORD present: ${!!process.env.EMAIL_PASSWORD}`);
  console.log(`[INIT] RESEND_API_KEY present: ${!!process.env.RESEND_API_KEY}`);

  try {
    if (process.env.DATABASE_URL) {
      await connectWithRetry();
      await ensureTables();
      console.log('[INIT] Database tables checked/created');
    }
    // Don't await verifySMTP - Let the server start even if SMTP is slow
    verifySMTP();
  } catch (err) {
    console.error('[DATABASE/SMTP INIT ERROR]', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving static files from: ${distPath}`);
  });
}

start();
