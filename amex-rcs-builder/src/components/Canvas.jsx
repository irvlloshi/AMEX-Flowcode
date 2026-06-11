import React from 'react';
import StepCard from './StepCard';

export default function Canvas({ steps, selectedId, onSelect, onDelete, onMove, onClear, onSendFlow }) {
  return (
    <div className="canvas">
      <div className="canvas-header">
        <div className="canvas-header-left">
          <h2>
            Conversation Flow
            {steps.length > 0 && <span className="canvas-step-count">{steps.length} step{steps.length !== 1 ? 's' : ''}</span>}
          </h2>
          <p>Build your message sequence — click a step to edit it</p>
        </div>
        <div className="canvas-actions">
          {steps.length > 0 && (
            <button className="btn-outline" onClick={onClear}>🗑 Clear all</button>
          )}
          <button className="btn-primary" onClick={onSendFlow}>📱 Send to Phone</button>
        </div>
      </div>

      {steps.length === 0 ? (
        <div className="empty-canvas">
          <div className="empty-canvas-icon">💬</div>
          <h3>Start building your RCS campaign</h3>
          <p>Click any block on the left to add it here, or use a Quick Start template to get going in seconds.</p>
          <div className="empty-canvas-hint">
            <span className="empty-hint-chip">👋 Welcome Flow</span>
            <span className="empty-hint-chip">📊 Growth Estimator</span>
            <span className="empty-hint-chip">🧑‍💼 Escalation</span>
          </div>
        </div>
      ) : (
        steps.map((step, i) => (
          <div key={step.id} className="flow-step">
            {i > 0 && <div className={`flow-connector ${step.id === selectedId ? 'active' : ''}`} />}
            <StepCard
              step={step}
              index={i}
              total={steps.length}
              selected={step.id === selectedId}
              onSelect={() => onSelect(step.id)}
              onDelete={(e) => { e.stopPropagation(); onDelete(step.id); }}
              onMoveUp={(e) => { e.stopPropagation(); onMove(step.id, -1); }}
              onMoveDown={(e) => { e.stopPropagation(); onMove(step.id, 1); }}
            />
          </div>
        ))
      )}
    </div>
  );
}
