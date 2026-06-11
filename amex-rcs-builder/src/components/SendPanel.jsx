import React, { useState } from 'react';
import { buildPayloads } from '../utils/buildPayload';

export default function SendPanel({ steps, showToast }) {
  const [from, setFrom] = useState('amex-hysa');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState(null);
  const [counts, setCounts] = useState({ sent: 0, failed: 0 });
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!to.trim()) { showToast('⚠️ Enter a phone number'); return; }
    if (steps.length === 0) { showToast('⚠️ Add steps to your flow first'); return; }

    const payloads = buildPayloads(steps);
    setStatus('sending');
    setSending(true);
    showToast('📤 Sending…');

    try {
      const API = process.env.REACT_APP_API_URL || 'https://amex-flowcode.onrender.com';
      const res = await fetch(`${API}/send-rcs`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: to.trim(), from: from || 'amex-hysa', messages: payloads })
      });
      if (res.ok) {
        const data = await res.json();
        const sent = data.results?.filter(r => r.success).length || 0;
        const failed = data.results?.filter(r => !r.success).length || 0;
        setCounts({ sent, failed });
        setStatus(failed === 0 ? 'success' : 'partial');
        showToast(failed === 0 ? `✅ ${sent} message(s) sent!` : `⚠️ ${failed} failed`);
        setSending(false);
        return;
      }
    } catch (_) {}

    setStatus('error');
    setSending(false);
    showToast('❌ Could not reach backend');
  };

  return (
    <>
      <div className="send-hero">
        <div className="send-hero-title">📱 Send to a real phone</div>
        <div className="send-hero-sub">Test your RCS flow by sending it to any RCS-enabled Android device. Make sure <code>server.js</code> is running first.</div>
      </div>

      <div className="send-field-group">
        <label className="send-field-label">RCS Agent ID (From)</label>
        <input
          className="send-input"
          type="text"
          value={from}
          placeholder="amex-hysa"
          onChange={e => setFrom(e.target.value)}
        />
      </div>

      <div className="send-field-group">
        <label className="send-field-label">Recipient Phone Number</label>
        <input
          className="send-input"
          type="tel"
          value={to}
          placeholder="+1 (555) 000-0000"
          onChange={e => setTo(e.target.value)}
        />
      </div>

      <button className="send-btn" onClick={send} disabled={sending}>
        {sending ? '⏳ Sending…' : `📤 Send ${steps.length} message${steps.length !== 1 ? 's' : ''} now`}
      </button>

      {status === 'sending' && (
        <div className="status-card sending">
          <div className="status-icon">📤</div>
          <div className="status-title blue">Sending {steps.length} message(s)…</div>
          <div className="status-sub" style={{ color: '#64748b' }}>Delivering to {to}</div>
        </div>
      )}
      {status === 'success' && (
        <div className="status-card success">
          <div className="status-icon">✅</div>
          <div className="status-title green">{counts.sent} message{counts.sent !== 1 ? 's' : ''} delivered!</div>
          <div className="status-sub green">Check your phone — it should arrive within seconds 📱</div>
        </div>
      )}
      {status === 'partial' && (
        <div className="status-card warning">
          <div className="status-icon">⚠️</div>
          <div className="status-title yellow">{counts.sent} sent, {counts.failed} failed</div>
          <div className="status-sub yellow">Check the terminal for error details</div>
        </div>
      )}
      {status === 'error' && (
        <div className="status-card error">
          <div className="status-icon">❌</div>
          <div className="status-title red">Proxy server not running</div>
          <div className="status-sub red">
            Open a terminal and run:<br />
            <code className="status-code">node server.js</code><br /><br />
            Then try sending again.
          </div>
        </div>
      )}
    </>
  );
}