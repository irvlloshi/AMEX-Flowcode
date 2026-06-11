import React from 'react';

export default function CarouselProps({ step, onUpdate }) {
  const d = step.data;

  const setCardWidth = (val) => onUpdate(s => ({ ...s, data: { ...s.data, cardWidth: val } }));

  const updateCard = (ci, key, val) => onUpdate(s => {
    const cards = s.data.cards.map((c, i) => i === ci ? { ...c, [key]: val } : c);
    return { ...s, data: { ...s.data, cards } };
  });

  const addCard = () => onUpdate(s => ({
    ...s, data: { ...s.data, cards: [...s.data.cards, { title: 'New Card', description: 'Card description', mediaUrl: '', mediaHeight: 'MEDIUM', suggestions: [] }] }
  }));

  const removeCard = (ci) => onUpdate(s => ({
    ...s, data: { ...s.data, cards: s.data.cards.filter((_, i) => i !== ci) }
  }));

  return (
    <>
      <div className="props-title">{step.icon} {step.label}</div>
      <div className="prop-group">
        <label className="prop-label">Card Width</label>
        <select className="prop-select" value={d.cardWidth || 'MEDIUM'} onChange={e => setCardWidth(e.target.value)}>
          <option>SMALL</option><option>MEDIUM</option>
        </select>
      </div>
      <div className="prop-group">
        <label className="prop-label">Cards ({d.cards?.length || 0})</label>
        {(d.cards || []).map((card, ci) => (
          <div key={ci} className="carousel-card-editor">
            <div className="carousel-card-label">Card {ci + 1}</div>

            <div className="carousel-card-field-label">Title</div>
            <input className="carousel-card-input" type="text" value={card.title || ''} placeholder="Card title" onChange={e => updateCard(ci, 'title', e.target.value)} />

            <div className="carousel-card-field-label">Description</div>
            <input className="carousel-card-input" type="text" value={card.description || ''} placeholder="Card description" onChange={e => updateCard(ci, 'description', e.target.value)} />

            <div className="carousel-card-field-label">Image URL</div>
            <input className="carousel-card-input" type="text" value={card.mediaUrl || ''} placeholder="https://example.com/image.jpg" onChange={e => updateCard(ci, 'mediaUrl', e.target.value)} />

            {card.mediaUrl?.trim() ? (
              <div className="img-preview">
                <img src={card.mediaUrl} alt={`card ${ci + 1}`} onError={e => { e.target.style.display = 'none'; }} />
              </div>
            ) : (
              <div className="img-placeholder">No image — paste a URL above</div>
            )}

            <div className="carousel-card-field-label">Media Height</div>
            <select className="carousel-card-select" value={card.mediaHeight || 'MEDIUM'} onChange={e => updateCard(ci, 'mediaHeight', e.target.value)}>
              <option value="SHORT">SHORT</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="TALL">TALL</option>
            </select>

            <button className="btn-danger" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => removeCard(ci)}>Remove Card</button>
          </div>
        ))}
        <button className="btn-dashed" onClick={addCard}>+ Add Card</button>
      </div>
    </>
  );
}