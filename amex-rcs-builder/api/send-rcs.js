const axios = require('axios');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
      const response = await axios.post(rcsUrl, payload);
      results.push({ success: true, data: response.data });
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.error('[ERROR]', err.response?.data || err.message);
      results.push({ success: false, error: err.response?.data || err.message });
    }
  }

  return res.status(200).json({ results });
};
