import React, { useState } from 'react';
import TextProps from './props/TextProps';
import StandaloneCardProps from './props/StandaloneCardProps';
import CarouselProps from './props/CarouselProps';
import OpenUrlProps from './props/OpenUrlProps';
import DialProps from './props/DialProps';
import PhonePreview from './PhonePreview';
import SendPanel from './SendPanel';

const TABS = [
  { id: 'props', label: '✏️ Edit' },
  { id: 'preview', label: '📱 Preview' },
  { id: 'send', label: '🚀 Send' },
];

export default function PropertiesPanel({ step, steps, onUpdate, showToast }) {
  const [activeTab, setActiveTab] = useState('props');

  const update = (updater) => {
    if (!step) return;
    onUpdate(step.id, updater);
  };

  const renderProps = () => {
    if (!step) {
      return (
        <div className="no-select">
          <div className="no-select-icon">👆</div>
          <h4>Select a step to edit</h4>
          <p>Click any step in the flow to edit its content, buttons, and settings here.</p>
        </div>
      );
    }
    switch (step.type) {
      case 'text':
      case 'suggested_replies':
        return <TextProps step={step} onUpdate={update} />;
      case 'standalone_card':
        return <StandaloneCardProps step={step} onUpdate={update} />;
      case 'carousel':
        return <CarouselProps step={step} onUpdate={update} />;
      case 'open_url':
        return <OpenUrlProps step={step} onUpdate={update} />;
      case 'dial':
        return <DialProps step={step} onUpdate={update} />;
      default:
        return null;
    }
  };

  return (
    <div className="properties">
      <div className="props-header">
        <div className="props-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="props-body">
        {activeTab === 'props' && renderProps()}
        {activeTab === 'preview' && <PhonePreview steps={steps} />}
        {activeTab === 'send' && <SendPanel steps={steps} showToast={showToast} />}
      </div>
    </div>
  );
}