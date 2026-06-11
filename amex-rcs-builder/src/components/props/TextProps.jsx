import React from 'react';
import SuggestionEditor from '../SuggestionEditor';

export default function TextProps({ step, onUpdate }) {
  const set = (key, val) => onUpdate(s => ({ ...s, data: { ...s.data, [key]: val } }));
  return (
    <>
      <div className="props-title">{step.icon} {step.label}</div>
      <div className="prop-group">
        <label className="prop-label">Message Text</label>
        <textarea className="prop-textarea" rows={4} value={step.data.text || ''} onChange={e => set('text', e.target.value)} />
      </div>
      <SuggestionEditor suggestions={step.data.suggestions} onChange={val => set('suggestions', val)} />
    </>
  );
}