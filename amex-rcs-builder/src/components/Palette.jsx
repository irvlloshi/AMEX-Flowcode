import React from 'react';

const COMPONENTS = [
  { section: 'Messages', items: [
    { type: 'text', icon: '💬', name: 'Text Message', desc: 'Send a plain text message' },
    { type: 'suggested_replies', icon: '💡', name: 'Quick Replies', desc: 'Text + tap-to-reply buttons' },
  ]},
  { section: 'Rich Cards', items: [
    { type: 'standalone_card', icon: '🃏', name: 'Rich Card', desc: 'Image, title, description & buttons' },
    { type: 'carousel', icon: '🎠', name: 'Carousel', desc: 'Swipeable multi-card layout' },
  ]},
  { section: 'Actions', items: [
    { type: 'open_url', icon: '🔗', name: 'Open URL', desc: 'Button that opens a webpage' },
    { type: 'dial', icon: '📞', name: 'Click to Call', desc: 'One-tap phone call button' },
  ]},
  { section: '⚡ AMEX Quick Start', items: [
    { type: 'template_welcome', icon: '👋', name: 'Welcome Flow', desc: 'Intro message + benefits carousel + amount picker', isTemplate: true },
    { type: 'template_calculator', icon: '📊', name: 'Growth Estimator', desc: 'Savings calculator rich card', isTemplate: true },
    { type: 'template_escalation', icon: '🧑‍💼', name: 'Escalation Card', desc: 'Transfer to human or Voice AI', isTemplate: true },
  ]},
];

export default function Palette({ onAddStep, onAddTemplate }) {
  const handleClick = (type) => {
    if (type.startsWith('template_')) {
      onAddTemplate(type.replace('template_', ''));
    } else {
      onAddStep(type);
    }
  };

  return (
    <div className="palette">
      <div className="palette-intro">
        <div className="palette-intro-title">🏗️ Build your RCS flow</div>
        <div className="palette-intro-sub">Click any block below to add it to your conversation. Use Quick Start templates to get going fast.</div>
      </div>
      {COMPONENTS.map(section => (
        <React.Fragment key={section.section}>
          <div className="palette-section-title">{section.section}</div>
          {section.items.map(item => (
            <div
              key={item.type}
              className={`component-card ${item.isTemplate ? 'template-card' : ''}`}
              onClick={() => handleClick(item.type)}
            >
              <div className="component-card-icon">{item.icon}</div>
              <div>
                <div className="component-card-name">{item.name}</div>
                <div className="component-card-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}