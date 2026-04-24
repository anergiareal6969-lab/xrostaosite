import express from 'express';
import pg from 'pg';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.EMAIL_PASSWORD) {
  console.error('FATAL ERROR: EMAIL_PASSWORD is not defined in .env file');
} else {
  console.log('EMAIL_PASSWORD loaded from .env');
}

const app = express();
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  connectionString: "postgresql://anergia_user:gjyyxZaOaxiX9mUMLW9ZyMMmRrSuyMf9@dpg-d7hkrlcvikkc73ab76bg-a.frankfurt-postgres.render.com/anergia",
  ssl: {
    rejectUnauthorized: false
  }
});

// Create table if not exists
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        tshirt_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database init error:', err);
  }
};
initDb();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anergiareal6969@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.get('/api/check-request', async (req, res) => {
  const { tshirtId } = req.query;
  const xForwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(xForwardedFor) ? xForwardedFor[0] : (xForwardedFor || req.socket.remoteAddress || 'unknown');

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
    
    // Purchase is enabled if env is true AND 24 hours have passed
    const isPurchaseEnabled = process.env.ENABLE_PURCHASE === 'true';
    const canPurchase = isPurchaseEnabled && hoursPassed >= 24;

    res.json({ 
      requested: true, 
      canPurchase,
      hoursRemaining: Math.max(0, 24 - hoursPassed)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/request', async (req, res) => {
  const { email, tshirtId } = req.body;
  const tid = parseInt(tshirtId, 10);
  const xForwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(xForwardedFor) ? xForwardedFor[0] : (xForwardedFor || req.socket.remoteAddress || 'unknown');

  if (!email || isNaN(tid)) {
    return res.status(400).json({ error: 'Missing email or tshirtId' });
  }

  try {
    // Check if already requested for this tshirt
    const check = await pool.query(
      'SELECT * FROM requests WHERE ip_address = $1 AND tshirt_id = $2',
      [ip, tid]
    );

    if (check.rows.length > 0) {
      // Send the "Don't press the golden button" email
      const mailOptions = {
        from: 'anergiareal6969@gmail.com',
        to: email,
        subject: 'Μην πατάς το χρυσό κουμπί!',
        text: 'Μην πατάς το χρυσό κουμπί, δεν θα γίνει τίποτα. Απλά τώρα που έχεις κάνει αίτημα σε μια μπλούζα θα μένει πράσινο, έχουμε λάβει ήδη το αίτημά σου, σε ευχαριστούμεεεε!!!'
      };
      await transporter.sendMail(mailOptions);
      return res.json({ status: 'already_requested' });
    }

    // Save to DB
    await pool.query(
      'INSERT INTO requests (email, ip_address, tshirt_id) VALUES ($1, $2, $3)',
      [email, ip, tid]
    );

    // Email to Admin
    const adminMail = {
      from: 'anergiareal6969@gmail.com',
      to: 'anergiareal6969@gmail.com',
      subject: 'Νέο Αίτημα!',
      text: `Ο χρήστης με το email ${email} έχει στείλει αίτημα για το T-Shirt #${tshirtId}.`
    };

    // Email to User
    const userMail = {
      from: 'anergiareal6969@gmail.com',
      to: email,
      subject: 'Επιβεβαίωση Αιτήματος - xrostao',
      text: 'Μόλις τώρα καλέ μου φίλε άνεργε έχεις κάνει αίτημα. Αφού καταχωρήσουμε όλα τα αιτήματα μαζί από όλους τους χρήστες, μια μέρα μπορεί να κυκλοφορήσουν οι μπλούζες. Θα κυκλοφορήσουν εννοώ σίγουρα, απλά πότε δεν ξέρεις!!'
    };

    // Send emails sequentially for better reliability
    console.log('Attempting to send admin email...');
    await transporter.sendMail(adminMail);
    console.log('Admin email sent.');

    console.log('Attempting to send user email...');
    await transporter.sendMail(userMail);
    console.log('User email sent.');

    res.json({ status: 'success' });
  } catch (err) {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ error: 'Server error', details: err instanceof Error ? err.message : String(err) });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
