import React from 'react';

const now = new Date();
const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function PhonePreview({ steps }) {
  return (
    <div className="phone-wrap">
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-status-bar">
            <span className="phone-carrier">Vonage</span>
            <span className="phone-time">{timeStr}</span>
          </div>
          <div className="phone-chat-header">
            <div className="phone-chat-avatar">A</div>
            <div>
              <div className="phone-chat-name">American Express</div>
              <div className="phone-chat-verified">✓ Verified Business</div>
            </div>
          </div>
          {steps.length === 0 ? (
            <div className="phone-empty">
              <div className="phone-empty-icon">💬</div>
              <div>Add steps to preview</div>
            </div>
          ) : (
            steps.slice(0, 5).map((step, i) => <PhoneMessage key={i} step={step} />)
          )}
          {steps.length > 5 && (
            <div style={{ textAlign: 'center', fontSize: 10, color: '#999', padding: '4px 0' }}>
              +{steps.length - 5} more steps
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PhoneMessage({ step }) {
  if (step.type === 'text' || step.type === 'suggested_replies') {
    return (
      <>
        <div className="phone-msg">{(step.data.text || '').substring(0, 100)}</div>
        {step.data.suggestions?.length > 0 && (
          <div className="phone-chips">
            {step.data.suggestions.slice(0, 3).map((s, i) => (
              <div key={i} className="phone-chip">{s.text}</div>
            ))}
          </div>
        )}
      </>
    );
  }
  if (step.type === 'standalone_card') {
    return (
      <div className="phone-card">
        <div className="phone-card-img">
          {step.data.mediaUrl
            ? <img src={step.data.mediaUrl} alt="card" onError={e => e.target.style.display = 'none'} />
            : '🏦'}
        </div>
        <div className="phone-card-body">
          <div className="phone-card-title">{(step.data.title || '').substring(0, 30)}</div>
          <div className="phone-card-desc">{(step.data.description || '').substring(0, 55)}…</div>
          {step.data.suggestions?.slice(0, 2).map((s, i) => (
            <button key={i} className="phone-action-btn">{s.text}</button>
          ))}
        </div>
      </div>
    );
  }
  if (step.type === 'carousel') {
    const firstCard = step.data.cards?.[0];
    return (
      <div className="phone-card">
        <div className="phone-card-img">
          {firstCard?.mediaUrl
            ? <img src={firstCard.mediaUrl} alt="carousel" onError={e => e.target.style.display = 'none'} />
            : `🎠`}
        </div>
        <div className="phone-card-body">
          <div className="phone-card-title">{firstCard?.title || 'Carousel'}</div>
          <div className="phone-card-desc">{step.data.cards?.length} cards — swipe to see more</div>
        </div>
      </div>
    );
  }
  if (step.type === 'open_url') {
    return (
      <div className="phone-msg">
        {step.data.text || ''}
        <button className="phone-action-btn" style={{ marginTop: 5 }}>🔗 {step.data.buttonLabel || 'Open'}</button>
      </div>
    );
  }
  if (step.type === 'dial') {
    return (
      <div className="phone-msg">
        {step.data.text || ''}
        <button className="phone-action-btn" style={{ marginTop: 5, background: '#16a34a' }}>📞 {step.data.buttonLabel || 'Call'}</button>
      </div>
    );
  }
  return null;
}