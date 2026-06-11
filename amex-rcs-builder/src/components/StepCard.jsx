import React from 'react';

function getStepTitle(step) {
  if (step.type === 'text' || step.type === 'suggested_replies') {
    const t = step.data.text || '';
    return t.substring(0, 52) + (t.length > 52 ? '…' : '');
  }
  if (step.type === 'standalone_card') return step.data.title || 'Untitled Card';
  if (step.type === 'carousel') return `${step.data.cards?.length || 0} swipeable cards`;
  if (step.type === 'open_url') return step.data.buttonLabel || 'Open URL';
  if (step.type === 'dial') return step.data.buttonLabel || 'Click to Call';
  return '';
}

function getPreviewText(step) {
  if (step.type === 'standalone_card') return (step.data.description || '').substring(0, 60) + '…';
  if (step.type === 'carousel') return step.data.cards?.map(c => c.title).join(' · ') || '';
  if (step.type === 'open_url') return step.data.url || '';
  if (step.type === 'dial') return step.data.phoneNumber || '';
  return '';
}

export default function StepCard({ step, index, total, selected, onSelect, onDelete, onMoveUp, onMoveDown }) {
  const sugs = step.data.suggestions || [];
  const chips = sugs.slice(0, 4);

  return (
    <div className={`step-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="step-header">
        <div className="step-num">{index + 1}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="step-type-badge">{step.icon} {step.label}</div>
          <div className="step-title">{getStepTitle(step)}</div>
          {getPreviewText(step) && <div className="step-preview">{getPreviewText(step)}</div>}
        </div>
      </div>
      {chips.length > 0 && (
        <div className="chip-preview">
          {chips.map((s, i) => (
            <span key={i} className={`chip ${s.type !== 'reply' ? 'action' : ''}`}>{s.text}</span>
          ))}
        </div>
      )}
      <div className="step-actions">
        {index > 0 && <button className="step-move-btn" onClick={onMoveUp}>↑</button>}
        {index < total - 1 && <button className="step-move-btn" onClick={onMoveDown}>↓</button>}
        <button className="btn-danger" onClick={onDelete}>✕</button>
      </div>
    </div>
  );
}