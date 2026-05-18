import express from 'express';
import pg from 'pg';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const distPath = path.join(__dirname, 'dist');
const shouldServeFrontend = process.env.SERVE_FRONTEND === 'true';

function parseCsvEnv(value?: string) {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...parseCsvEnv(process.env.FRONTEND_ORIGIN),
  ...parseCsvEnv(process.env.CORS_ALLOWED_ORIGINS),
]);

// 1. Initializations
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('[CRITICAL ERROR] DATABASE_URL is not defined in environment variables!');
}

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: !DATABASE_URL || DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
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

async function ensureTables() {
  // Requests table - One request per signed-in user email
  await pool.query(`
    CREATE TABLE IF NOT EXISTS requests (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      tshirt_id INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE requests DROP CONSTRAINT IF EXISTS requests_ip_address_tshirt_id_key;`);
  await pool.query(`ALTER TABLE requests DROP CONSTRAINT IF EXISTS requests_email_key;`);

  // Keep only the latest request per email before restoring uniqueness.
  await pool.query(`
    DELETE FROM requests
    WHERE id NOT IN (
      SELECT DISTINCT ON (email) id
      FROM requests
      ORDER BY email, created_at DESC, id DESC
    );
  `);

  await pool.query(`ALTER TABLE requests ADD CONSTRAINT requests_email_key UNIQUE (email);`);

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

// 2. Middleware
app.use(compression()); // Compress all responses
app.use(cors({
  origin(origin, callback) {
    // Requests without Origin include curl, uptime probes, and search engine fetches.
    if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
}));
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
    await pool.query(
      `INSERT INTO users (email, username, last_ip, last_login) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (email) DO UPDATE 
       SET username = $2, last_ip = $3, last_login = CURRENT_TIMESTAMP`,
      [email, username || email.split('@')[0], clientIp]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[API] User sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Check Request
app.get('/api/check-request', async (req, res) => {
  const { tshirtId, email } = req.query;

  console.log(`[API] Checking request for T-Shirt ${tshirtId} (Email: ${email || 'none'})`);

  if (!email) {
    return res.json({ requested: false, canPurchase: false });
  }

  try {
    const result = await pool.query(
      'SELECT tshirt_id, created_at FROM requests WHERE email = $1 LIMIT 1',
      [email]
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
      requestedTshirtId: result.rows[0].tshirt_id,
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
    const insertResult = await pool.query(
      `INSERT INTO requests (email, ip_address, tshirt_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
       SET ip_address = EXCLUDED.ip_address,
           tshirt_id = EXCLUDED.tshirt_id,
           created_at = NOW()
       RETURNING id, tshirt_id, created_at`,
      [email, clientIp, parseInt(tshirtId, 10)]
    );
    const requestId: number = insertResult.rows[0]?.id;
    console.log(`[API] Request saved to DB for ${email} (id: ${requestId})`);
    res.json({
      status: 'success',
      requestId,
      requestedTshirtId: insertResult.rows[0]?.tshirt_id,
      createdAt: insertResult.rows[0]?.created_at,
    });

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
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    const result = await pool.query(`
      SELECT
        requests.email,
        requests.ip_address,
        requests.tshirt_id,
        requests.created_at,
        COALESCE(users.username, split_part(requests.email, '@', 1)) AS username
      FROM requests
      LEFT JOIN users ON users.email = requests.email
      ORDER BY requests.created_at DESC
    `);
    let html = `
      <html>
        <head>
          <title>Xrostao Admin</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; font-family: Arial, sans-serif; background: #0f0f0f; color: #f5f5f5; padding: 24px; }
            .wrap { max-width: 1100px; margin: 0 auto; }
            .header { margin-bottom: 24px; }
            .title { font-size: 32px; font-weight: 800; margin: 0 0 8px; }
            .status { color: #4ade80; font-weight: 700; margin: 0; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
            .card { background: #181818; border: 1px solid #2a2a2a; border-radius: 18px; padding: 18px; }
            .name { font-size: 20px; font-weight: 800; margin: 0 0 10px; }
            .row { margin: 8px 0; color: #d4d4d4; word-break: break-word; }
            .label { display: block; color: #8f8f8f; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
            .empty { padding: 24px; border-radius: 18px; background: #181818; border: 1px solid #2a2a2a; color: #a3a3a3; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="header">
              <h1 class="title">Αιτήματα Χρηστών</h1>
              <p class="status">Σύνολο αιτημάτων: ${result.rows.length}</p>
            </div>
            ${result.rows.length === 0
              ? '<div class="empty">Δεν υπάρχουν αιτήματα ακόμα.</div>'
              : `<div class="grid">
                  ${result.rows.map(row => `
                    <div class="card">
                      <h2 class="name">${row.username}</h2>
                      <div class="row">
                        <span class="label">Email</span>
                        ${row.email}
                      </div>
                      <div class="row">
                        <span class="label">T-Shirt</span>
                        #${row.tshirt_id}
                      </div>
                      <div class="row">
                        <span class="label">IP</span>
                        ${row.ip_address}
                      </div>
                      <div class="row">
                        <span class="label">Ημερομηνία</span>
                        ${new Date(row.created_at).toLocaleString('el-GR')}
                      </div>
                    </div>
                  `).join('')}
                </div>`
            }
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).send('Error loading admin dashboard');
  }
});

if (shouldServeFrontend) {
  // 4. Static Files (ONLY AFTER API ROUTES)
  app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.use(express.static(distPath, {
    maxAge: '1h',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      if (filePath.match(/\.(js|css|woff2?)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      }
    }
  }));

  // 5. SPA Catch-all (MUST BE LAST)
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }

    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      if (req.path.startsWith('/tshirt/')) {
        res.setHeader('X-Robots-Tag', 'noindex, follow');
      }
      return res.sendFile(indexPath);
    }

    return res.status(500).send('Frontend build is missing. Run "npm run build".');
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      service: 'xrostao api',
      status: 'ok',
      health: '/api/health',
    });
  });

  app.use((req, res) => {
    if (req.url.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }

    return res.status(404).json({
      error: 'Frontend is hosted separately. Use the static site URL for pages.',
    });
  });
}

async function start() {
  console.log(`[INIT] Starting server...`);
  console.log(`[INIT] DATABASE_URL present: ${!!process.env.DATABASE_URL}`);
  console.log(`[INIT] CLEAR_REQUESTS_ON_START enabled: ${process.env.CLEAR_REQUESTS_ON_START === 'true'}`);
  console.log(`[INIT] SERVE_FRONTEND enabled: ${shouldServeFrontend}`);
  console.log(`[INIT] Allowed frontend origins: ${allowedOrigins.size ? Array.from(allowedOrigins).join(', ') : '(all origins allowed)'}`);

  try {
    if (process.env.DATABASE_URL) {
      await connectWithRetry();
      await ensureTables();
      console.log('[INIT] Database tables checked/created');
      if (process.env.CLEAR_REQUESTS_ON_START === 'true') {
        const result = await pool.query('TRUNCATE TABLE requests RESTART IDENTITY;');
        console.log('[INIT] Requests table cleared (profiles/users preserved)');
      }
    }
  } catch (err) {
    console.error('[DATABASE INIT ERROR]', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (shouldServeFrontend) {
      console.log(`Serving static files from: ${distPath}`);
    } else {
      console.log('Running in API-only mode');
    }
  });
}

start();
