import React from 'react';
import { T } from '../theme';
import SuggestionEditor from './SuggestionEditor';

const TYPE_META = {
  text:              { label: 'Text Message',  icon: '💬', color: '#016FD0', bg: '#EBF4FF' },
  standalone_card:   { label: 'Rich Card',     icon: '🃏', color: '#7C3AED', bg: '#F5F3FF' },
  carousel:          { label: 'Carousel',      icon: '🎠', color: '#F79009', bg: '#FFFAEB' },
  suggested_replies: { label: 'Quick Replies', icon: '💡', color: '#12B76A', bg: '#ECFDF3' },
  open_url:          { label: 'Open URL',      icon: '🔗', color: '#016FD0', bg: '#EBF4FF' },
  dial:              { label: 'Click to Call', icon: '📞', color: '#12B76A', bg: '#ECFDF3' },
};

export default function EditPanel({ step, onUpdate }) {
  if (!step) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>👈</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.gray700, marginBottom: 6 }}>No step selected</div>
        <div style={{ fontSize: 12, color: T.gray400, lineHeight: 1.6 }}>
          Click any step in the flow to edit its content here.
        </div>
      </div>
    );
  }

  const set = (key, val) => onUpdate(step.id, s => ({ ...s, data: { ...s.data, [key]: val } }));
  const meta = TYPE_META[step.type] || {};

  return (
    <div style={{ padding: 16 }}>
      {/* Step type header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        background: meta.bg || T.gray50, borderRadius: T.radiusSm, marginBottom: 16,
        border: `1px solid ${meta.color}30`,
      }}>
        <span style={{ fontSize: 20 }}>{meta.icon}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{meta.label}</div>
          <div style={{ fontSize: 11, color: T.gray500 }}>Edit the content below</div>
        </div>
      </div>

      {/* Text / Suggested Replies */}
      {(step.type === 'text' || step.type === 'suggested_replies') && (
        <>
          <Field label="Message Text" hint="What the customer will read">
            <textarea value={step.data.text || ''} onChange={e => set('text', e.target.value)} rows={4} style={inputStyle()} placeholder="Type your message here…" />
          </Field>
          <SuggestionEditor suggestions={step.data.suggestions || []} onChange={val => set('suggestions', val)} />
        </>
      )}

      {/* Standalone Card */}
      {step.type === 'standalone_card' && (
        <>
          <Field label="Card Title"><input style={inputStyle()} type="text" value={step.data.title || ''} onChange={e => set('title', e.target.value)} placeholder="e.g. Watch Your Savings Grow" /></Field>
          <Field label="Description"><textarea style={inputStyle()} rows={3} value={step.data.description || ''} onChange={e => set('description', e.target.value)} /></Field>
          <Field label="Image URL" hint="Publicly accessible link">
            <input style={inputStyle()} type="text" value={step.data.mediaUrl || ''} onChange={e => set('mediaUrl', e.target.value)} placeholder="https://example.com/image.jpg" />
          </Field>
          {step.data.mediaUrl && (
            <div style={{ marginBottom: 14, borderRadius: T.radiusSm, overflow: 'hidden', height: 90 }}>
              <img src={step.data.mediaUrl} alt="preview" style={{ width: '100%', height: 90, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <Field label="Media Height">
              <select style={inputStyle()} value={step.data.mediaHeight || 'MEDIUM'} onChange={e => set('mediaHeight', e.target.value)}>
                <option>SHORT</option><option>MEDIUM</option><option>TALL</option>
              </select>
            </Field>
            <Field label="Orientation">
              <select style={inputStyle()} value={step.data.orientation || 'VERTICAL'} onChange={e => set('orientation', e.target.value)}>
                <option>VERTICAL</option><option>HORIZONTAL</option>
              </select>
            </Field>
          </div>
          <SuggestionEditor suggestions={step.data.suggestions || []} onChange={val => set('suggestions', val)} />
        </>
      )}

      {/* Carousel */}
      {step.type === 'carousel' && (
        <>
          <Field label="Card Width">
            <select style={inputStyle()} value={step.data.cardWidth || 'MEDIUM'} onChange={e => onUpdate(step.id, s => ({ ...s, data: { ...s.data, cardWidth: e.target.value } }))}>
              <option>SMALL</option><option>MEDIUM</option>
            </select>
          </Field>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: T.gray400, marginBottom: 8 }}>
            Cards ({step.data.cards?.length || 0})
          </div>
          {(step.data.cards || []).map((card, ci) => (
            <CarouselCardEditor
              key={ci} card={card} index={ci}
              onChange={(key, val) => onUpdate(step.id, s => {
                const cards = s.data.cards.map((c, i) => i === ci ? { ...c, [key]: val } : c);
                return { ...s, data: { ...s.data, cards } };
              })}
              onRemove={() => onUpdate(step.id, s => ({ ...s, data: { ...s.data, cards: s.data.cards.filter((_, i) => i !== ci) } }))}
            />
          ))}
          <button
            onClick={() => onUpdate(step.id, s => ({ ...s, data: { ...s.data, cards: [...s.data.cards, { title: 'New Card', description: 'Description', mediaUrl: '', mediaHeight: 'MEDIUM', suggestions: [] }] } }))}
            style={{ width: '100%', padding: '8px', background: 'none', border: `1.5px dashed ${T.gray300}`, borderRadius: T.radiusXs, color: T.gray500, cursor: 'pointer', fontSize: 12, fontWeight: 600, marginTop: 4 }}
          >
            + Add Card
          </button>
        </>
      )}

      {/* Open URL */}
      {step.type === 'open_url' && (
        <>
          <Field label="Message Text"><textarea style={inputStyle()} rows={3} value={step.data.text || ''} onChange={e => set('text', e.target.value)} /></Field>
          <Field label="Button Label"><input style={inputStyle()} type="text" value={step.data.buttonLabel || ''} onChange={e => set('buttonLabel', e.target.value)} /></Field>
          <Field label="URL"><input style={inputStyle()} type="text" value={step.data.url || ''} placeholder="https://…" onChange={e => set('url', e.target.value)} /></Field>
          <Field label="Postback ID" hint="Internal tracking ID"><input style={inputStyle()} type="text" value={step.data.postbackData || ''} onChange={e => set('postbackData', e.target.value)} /></Field>
        </>
      )}

      {/* Dial */}
      {step.type === 'dial' && (
        <>
          <Field label="Message Text"><textarea style={inputStyle()} rows={3} value={step.data.text || ''} onChange={e => set('text', e.target.value)} /></Field>
          <Field label="Button Label"><input style={inputStyle()} type="text" value={step.data.buttonLabel || ''} onChange={e => set('buttonLabel', e.target.value)} /></Field>
          <Field label="Phone Number"><input style={inputStyle()} type="tel" value={step.data.phoneNumber || ''} placeholder="+1…" onChange={e => set('phoneNumber', e.target.value)} /></Field>
          <Field label="Postback ID" hint="Internal tracking ID"><input style={inputStyle()} type="text" value={step.data.postbackData || ''} onChange={e => set('postbackData', e.target.value)} /></Field>
        </>
      )}
    </div>
  );
}

function CarouselCardEditor({ card, index, onChange, onRemove }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ border: `1.5px solid ${T.gray200}`, borderRadius: T.radiusSm, marginBottom: 8, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: T.gray50, cursor: 'pointer' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.gray700 }}>
          {card.mediaUrl ? '🖼 ' : '🃏 '}Card {index + 1}{card.title ? ` — ${card.title.substring(0, 18)}` : ''}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: T.gray400 }}>{open ? '▲' : '▼'}</span>
          <button onClick={e => { e.stopPropagation(); onRemove(); }} style={{ background: 'none', border: 'none', color: T.red, cursor: 'pointer', fontSize: 13 }}>✕</button>
        </div>
      </div>
      {open && (
        <div style={{ padding: 12 }}>
          <Field label="Title"><input style={inputStyle()} type="text" value={card.title || ''} onChange={e => onChange('title', e.target.value)} /></Field>
          <Field label="Description"><input style={inputStyle()} type="text" value={card.description || ''} onChange={e => onChange('description', e.target.value)} /></Field>
          <Field label="Image URL">
            <input style={inputStyle()} type="text" value={card.mediaUrl || ''} onChange={e => onChange('mediaUrl', e.target.value)} placeholder="https://example.com/image.jpg" />
          </Field>
        {card.mediaUrl?.trim() && (
            <div style={{ marginBottom: 10, borderRadius: T.radiusXs, overflow: 'hidden', height: 120 }}>
              <img src={card.mediaUrl} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: T.radiusXs }} onError={e => e.target.style.display = 'none'} />
            </div>
          )}
          <Field label="Media Height">
            <select style={inputStyle()} value={card.mediaHeight || 'MEDIUM'} onChange={e => onChange('mediaHeight', e.target.value)}>
              <option>SHORT</option><option>MEDIUM</option><option>TALL</option>
            </select>
          </Field>
        </div>
      )}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 5 }}>
        <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: T.gray500 }}>{label}</label>
        {hint && <span style={{ fontSize: 10, color: T.gray400 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function inputStyle() {
  return {
    width: '100%', padding: '8px 10px', fontSize: 12,
    border: `1.5px solid ${T.gray200}`, borderRadius: T.radiusXs,
    background: T.white, color: T.gray900, outline: 'none',
    transition: 'border-color 0.15s', fontFamily: T.font,
  };
}