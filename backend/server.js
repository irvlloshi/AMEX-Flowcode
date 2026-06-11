require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    'https://amex-flowcode-zoqe.vercel.app',  // Vercel production
    'http://localhost:3000',                    // local React dev
    'http://localhost:8080',                    // local server
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// ── Serve the React build (production)
// Run `npm run build` inside amex-rcs-builder first, then copy the build/ folder
// next to server.js, OR point this path to wherever your build output lives.
const REACT_BUILD = path.join(__dirname, 'amex-rcs-builder', 'build');
app.use(express.static(REACT_BUILD));

// ── Proxy: React UI → this server → Vonage RCS proxy
app.post('/send-rcs', async (req, res) => {
  const { to, from, messages } = req.body;
  const rcsUrl = process.env.RCS_URL;

  if (!to || !messages?.length) {
    return res.status(400).json({ error: 'Missing "to" or "messages"' });
  }

  const results = [];
  for (const msg of messages) {
    try {
      const payload = {
        to,
        from: from || process.env.RCS_SENDER_ID,
        channel: 'rcs',
        ...msg,
      };
      console.log(`[SENDING] to=${to} type=${msg.message_type}`);
      console.log(JSON.stringify(payload, null, 2));
      const response = await axios.post(rcsUrl, payload);
      results.push({ success: true, data: response.data });
      // Small delay between messages for better UX sequencing on device
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.error('[ERROR]', err.response?.data || err.message);
      results.push({ success: false, error: err.response?.data || err.message });
    }
  }

  res.json({ results });
});

// ── Fallback: serve React app for any unmatched route (client-side routing)
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(REACT_BUILD, 'index.html'));
});

const PORT = process.env.UI_PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ AMEX RCS server running at http://localhost:${PORT}`);
  console.log(`   Send proxy:  POST http://localhost:${PORT}/send-rcs`);
  console.log(`   React UI:    http://localhost:${PORT}`);
});