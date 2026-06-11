import React from 'react';

export default function OpenUrlProps({ step, onUpdate }) {
  const set = (key, val) => onUpdate(s => ({ ...s, data: { ...s.data, [key]: val } }));
  const d = step.data;
  return (
    <>
      <div className="props-title">{step.icon} {step.label}</div>
      <div className="prop-group"><label className="prop-label">Message Text</label><textarea className="prop-textarea" value={d.text || ''} onChange={e => set('text', e.target.value)} /></div>
      <div className="prop-group"><label className="prop-label">Button Label</label><input className="prop-input" type="text" value={d.buttonLabel || ''} onChange={e => set('buttonLabel', e.target.value)} /></div>
      <div className="prop-group"><label className="prop-label">URL</label><input className="prop-input" type="text" value={d.url || ''} placeholder="https://..." onChange={e => set('url', e.target.value)} /></div>
      <div className="prop-group"><label className="prop-label">Postback Data</label><input className="prop-input" type="text" value={d.postbackData || ''} onChange={e => set('postbackData', e.target.value)} /></div>
    </>
  );
}