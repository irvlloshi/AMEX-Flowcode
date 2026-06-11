import React from 'react';
import SuggestionEditor from '../SuggestionEditor';

export default function StandaloneCardProps({ step, onUpdate }) {
  const set = (key, val) => onUpdate(s => ({ ...s, data: { ...s.data, [key]: val } }));
  const d = step.data;
  return (
    <>
      <div className="props-title">{step.icon} {step.label}</div>
      <div className="prop-group"><label className="prop-label">Card Title</label><input className="prop-input" type="text" value={d.title || ''} onChange={e => set('title', e.target.value)} /></div>
      <div className="prop-group"><label className="prop-label">Description</label><textarea className="prop-textarea" value={d.description || ''} onChange={e => set('description', e.target.value)} /></div>
      <div className="prop-group"><label className="prop-label">Media Image URL</label><input className="prop-input" type="text" value={d.mediaUrl || ''} placeholder="https://..." onChange={e => set('mediaUrl', e.target.value)} /></div>
      {d.mediaUrl && (
        <div className="prop-group">
          <img src={d.mediaUrl} alt="preview" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.style.display = 'none'} />
        </div>
      )}
      <div className="prop-group">
        <label className="prop-label">Media Height</label>
        <select className="prop-select" value={d.mediaHeight || 'MEDIUM'} onChange={e => set('mediaHeight', e.target.value)}>
          <option>SHORT</option><option>MEDIUM</option><option>TALL</option>
        </select>
      </div>
      <div className="prop-group">
        <label className="prop-label">Orientation</label>
        <select className="prop-select" value={d.orientation || 'VERTICAL'} onChange={e => set('orientation', e.target.value)}>
          <option>VERTICAL</option><option>HORIZONTAL</option>
        </select>
      </div>
      <SuggestionEditor suggestions={d.suggestions} onChange={val => set('suggestions', val)} />
    </>
  );
}