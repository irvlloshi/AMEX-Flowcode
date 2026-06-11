import React from 'react';
import { T } from '../theme';
import { inputStyle } from './EditPanel';

export default function SuggestionEditor({ suggestions, onChange }) {
  const update = (idx, key, val) => onChange(suggestions.map((s, i) => i === idx ? { ...s, [key]: val } : s));
  const add = () => onChange([...suggestions, { text: 'Button', type: 'reply', value: 'postback_' + Date.now() }]);
  const remove = (idx) => onChange(suggestions.filter((_, i) => i !== idx));

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: T.gray400 }}>
          Buttons & Replies
        </div>
        <button onClick={add} style={{ fontSize: 11, fontWeight: 600, color: T.blue, background: T.blueLight, border: 'none', borderRadius: 99, padding: '3px 10px', cursor: 'pointer' }}>
          + Add
        </button>
      </div>
      {suggestions.length === 0 && (
        <div style={{ fontSize: 11, color: T.gray400, textAlign: 'center', padding: '10px 0', fontStyle: 'italic' }}>
          No buttons yet — click + Add
        </div>
      )}
      {suggestions.map((sug, si) => (
        <div key={si} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <select value={sug.type} onChange={e => update(si, 'type', e.target.value)} style={{ ...inputStyle(), width: 76, flexShrink: 0, fontSize: 11 }}>
            <option value="reply">Reply</option>
            <option value="url">URL</option>
            <option value="dial">Dial</option>
          </select>
          <input type="text" value={sug.text} onChange={e => update(si, 'text', e.target.value)} placeholder="Label" style={{ ...inputStyle(), flex: 1 }} />
          <input type="text" value={sug.value} onChange={e => update(si, 'value', e.target.value)} placeholder={sug.type === 'url' ? 'https://…' : sug.type === 'dial' ? '+1…' : 'postback_id'} style={{ ...inputStyle(), flex: 1.5 }} />
          <button onClick={() => remove(si)} style={{ background: 'none', border: 'none', color: T.red, cursor: 'pointer', fontSize: 16, padding: '0 2px', flexShrink: 0 }}>✕</button>
        </div>
      ))}
    </div>
  );
}