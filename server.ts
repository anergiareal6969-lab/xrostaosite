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

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://anergia_user:gjyyxZaOaxiX9mUMLW9ZyMMmRrSuyMf9@dpg-d7hkrlcvikkc73ab76bg-a.frankfurt-postgres.render.com/anergia",
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('[DATABASE ERROR] Error acquiring client', err.stack);
  }
  console.log('[DATABASE] Successfully connected to PostgreSQL');
  release();
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anergiareal6969@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

// 1. Logging Middleware (MUST BE FIRST)
app.use((req, res, next) => {
  console.log(`[REQUEST] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 2. CORS and JSON
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 3. API ROUTES (Directly on app for maximum reliability)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/check-request', async (req, res) => {
  const { tshirtId } = req.query;
  const xForwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(xForwardedFor) ? xForwardedFor[0] : (xForwardedFor || req.socket.remoteAddress || 'unknown');

  console.log(`[API] GET /api/check-request - tshirtId: ${tshirtId}, IP: ${ip}`);

  try {
    const result = await pool.query(
      'SELECT *, created_at FROM requests WHERE ip_address = $1 AND tshirt_id = $2',
      [ip, parseInt(tshirtId as string, 10)]
    );
    
    if (result.rows.length === 0) {
      return res.json({ requested: false, canPurchase: false });
    }

    const requestDate = new Date(result.rows[0].created_at);
    const now = new Date();
    const hoursPassed = (now.getTime() - requestDate.getTime()) / (1000 * 60 * 60);
    
    const isPurchaseEnabled = process.env.ENABLE_PURCHASE === 'true';
    const canPurchase = isPurchaseEnabled && hoursPassed >= 24;

    res.json({ 
      requested: true, 
      canPurchase,
      hoursRemaining: Math.max(0, 24 - hoursPassed)
    });
  } catch (err) {
    console.error('[API ERROR] /api/check-request:', err);
    res.status(500).json({ error: 'Database error', details: err instanceof Error ? err.message : String(err) });
  }
});

app.post('/api/request', async (req, res) => {
  const { email, tshirtId } = req.body;
  const tid = parseInt(tshirtId, 10);
  const xForwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(xForwardedFor) ? xForwardedFor[0] : (xForwardedFor || req.socket.remoteAddress || 'unknown');

  console.log(`[API] POST /api/request - email: ${email}, tshirtId: ${tshirtId}, IP: ${ip}`);

  if (!email || isNaN(tid)) {
    return res.status(400).json({ error: 'Missing email or tshirtId' });
  }

  try {
    const check = await pool.query(
      'SELECT * FROM requests WHERE ip_address = $1 AND tshirt_id = $2',
      [ip, tid]
    );

    if (check.rows.length > 0) {
      const mailOptions = {
        from: 'anergiareal6969@gmail.com',
        to: email,
        subject: 'Μην πατάς το χρυσό κουμπί!',
        text: 'Μην πατάς το χρυσό κουμπί, δεν θα γίνει τίποτα. Απλά τώρα που έχεις κάνει αίτημα σε μια μπλούζα θα μένει πράσινο, έχουμε λάβει ήδη το αίτημά σου, σε ευχαριστούμεεεε!!!'
      };
      await transporter.sendMail(mailOptions);
      return res.json({ status: 'already_requested' });
    }

    await pool.query(
      'INSERT INTO requests (email, ip_address, tshirt_id) VALUES ($1, $2, $3)',
      [email, ip, tid]
    );

    const adminMail = {
      from: 'anergiareal6969@gmail.com',
      to: 'anergiareal6969@gmail.com',
      subject: 'Νέο Αίτημα!',
      text: `Ο χρήστης με το email ${email} έχει στείλει αίτημα για το T-Shirt #${tshirtId}.`
    };

    const userMail = {
      from: 'anergiareal6969@gmail.com',
      to: email,
      subject: 'Επιβεβαίωση Αιτήματος - xrostao',
      text: 'Μόλις τώρα καλέ μου φίλε άνεργε έχεις κάνει αίτημα. Αφού καταχωρήσουμε όλα τα αιτήματα μαζί από όλους τους χρήστες, μια μέρα μπορεί να κυκλοφορήσουν οι μπλούζες. Θα κυκλοφορήσουν εννοώ σίγουρα, απλά πότε δεν ξερέις!!'
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.json({ status: 'success' });
  } catch (err) {
    console.error('[SERVER ERROR] /api/request:', err);
    res.status(500).json({ error: 'Server error', details: err instanceof Error ? err.message : String(err) });
  }
});

// 4. Static Files and SPA Routing
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA Catch-all: ONLY for requests that are NOT /api
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    console.log(`[404] API route not found: ${req.method} ${req.path}`);
    return res.status(404).json({ error: `API route ${req.method} ${req.path} not found` });
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
