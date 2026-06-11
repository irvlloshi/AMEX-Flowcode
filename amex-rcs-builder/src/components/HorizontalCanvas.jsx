import React, { useState } from 'react';
import { T } from '../theme';

const TYPE_META = {
  text:              { label: 'Text',         icon: '💬', color: T.blue,   bg: T.blueLight },
  standalone_card:   { label: 'Rich Card',    icon: '🃏', color: T.purple, bg: T.purpleLight },
  carousel:          { label: 'Carousel',     icon: '🎠', color: T.yellow, bg: T.yellowLight },
  suggested_replies: { label: 'Quick Replies',icon: '💡', color: T.green,  bg: T.greenLight },
  open_url:          { label: 'Open URL',     icon: '🔗', color: T.blue,   bg: T.blueLight },
  dial:              { label: 'Call',         icon: '📞', color: T.green,  bg: T.greenLight },
};

function getStepTitle(step) {
  if (step.type === 'text' || step.type === 'suggested_replies') {
    const t = step.data.text || '';
    return t.substring(0, 40) + (t.length > 40 ? '…' : '');
  }
  if (step.type === 'standalone_card') return step.data.title || 'Untitled Card';
  if (step.type === 'carousel') return `${step.data.cards?.length || 0} Cards`;
  if (step.type === 'open_url') return step.data.buttonLabel || 'Open URL';
  if (step.type === 'dial') return step.data.buttonLabel || 'Call Button';
  return '';
}

function getStepSubtitle(step) {
  if (step.type === 'standalone_card') return (step.data.description || '').substring(0, 45) + '…';
  if (step.type === 'carousel') return step.data.cards?.map(c => c.title).join(', ') || '';
  if (step.type === 'open_url') return step.data.url?.substring(0, 35) || '';
  if (step.type === 'dial') return step.data.phoneNumber || '';
  return '';
}

// ── Arrow connector between cards ──
function Arrow({ color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 2px' }}>
      <div style={{ width: 28, height: 2, background: color || T.gray300, borderRadius: 99 }} />
      <div style={{
        width: 0, height: 0,
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderLeft: `7px solid ${color || T.gray300}`,
        marginLeft: -1,
      }} />
    </div>
  );
}

// ── Individual step card ──
function StepCard({ step, index, total, selected, onSelect, onDelete, onMoveLeft, onMoveRight }) {
  const [hovered, setHovered] = useState(false);
  const meta = TYPE_META[step.type] || { label: step.label, icon: '📦', color: T.gray500, bg: T.gray100 };
  const sugs = step.data.suggestions || [];

  // Card image for rich card / carousel preview
  const imgUrl = step.type === 'standalone_card'
    ? step.data.mediaUrl
    : step.type === 'carousel'
    ? step.data.cards?.[0]?.mediaUrl
    : null;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 260,
        flexShrink: 0,
        background: T.white,
        borderRadius: T.radius,
        border: `2px solid ${selected ? meta.color : hovered ? T.gray200 : T.gray100}`,
        boxShadow: selected
          ? `0 0 0 4px ${meta.color}20, ${T.shadowMd}`
          : hovered ? T.shadowMd : T.shadow,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top accent */}
      <div style={{
        height: 4, background: selected ? meta.color : hovered ? meta.color + '80' : T.gray100,
        transition: 'background 0.15s',
      }} />

      {/* Image preview strip (rich card / carousel only) */}
      {imgUrl && (
        <div style={{ height: 100, overflow: 'hidden', background: T.gray100 }}>
          <img
            src={imgUrl} alt=""
            style={{ width: '100%', height: 100, objectFit: 'cover' }}
            onError={e => e.target.style.display = 'none'}
          />
        </div>
      )}
      {!imgUrl && (step.type === 'standalone_card' || step.type === 'carousel') && (
        <div style={{
          height: 90, background: `linear-gradient(135deg, ${meta.color}20, ${meta.color}10)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>
          {meta.icon}
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '10px 10px 8px', flex: 1 }}>
        {/* Step number + type badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
            color: meta.color, background: meta.bg, borderRadius: 99, padding: '2px 6px',
          }}>
            {meta.icon} {meta.label}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: T.gray400,
            background: T.gray100, borderRadius: 99, padding: '2px 6px',
          }}>
            #{index + 1}
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 14, fontWeight: 600, color: T.gray800,
          lineHeight: 1.4, marginBottom: 3,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {getStepTitle(step)}
        </div>

        {/* Subtitle */}
        {getStepSubtitle(step) && (
          <div style={{
            fontSize: 12, color: T.gray400, lineHeight: 1.4,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {getStepSubtitle(step)}
          </div>
        )}

        {/* Suggestion chips */}
        {sugs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 7 }}>
            {sugs.slice(0, 2).map((s, i) => (
              <span key={i} style={{
                fontSize: 11, fontWeight: 600, borderRadius: 99, padding: '3px 8px',
                background: s.type === 'reply' ? T.blueLight : T.yellowLight,
                color: s.type === 'reply' ? T.blue : T.yellow,
                border: `1px solid ${s.type === 'reply' ? T.blueMid : '#FDE68A'}`,
                whiteSpace: 'nowrap',
              }}>
                {s.text.substring(0, 12)}
              </span>
            ))}
            {sugs.length > 2 && (
              <span style={{ fontSize: 9, color: T.gray400 }}>+{sugs.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Action bar — visible on hover/select */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 4,
        padding: '6px 8px', borderTop: `1px solid ${T.gray100}`,
        opacity: hovered || selected ? 1 : 0,
        transition: 'opacity 0.15s',
        background: T.gray50,
      }}>
        {index > 0 && (
          <button
            onClick={e => { e.stopPropagation(); onMoveLeft(); }}
            title="Move left"
            style={actionBtn(T.gray500)}
          >←</button>
        )}
        {index < total - 1 && (
          <button
            onClick={e => { e.stopPropagation(); onMoveRight(); }}
            title="Move right"
            style={actionBtn(T.gray500)}
          >→</button>
        )}
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          title="Delete step"
          style={actionBtn(T.red)}
        >✕</button>
      </div>
    </div>
  );
}

function actionBtn(color) {
  return {
    width: 24, height: 24, borderRadius: 6, border: 'none',
    background: `${color}15`, color, cursor: 'pointer',
    fontSize: 11, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s',
  };
}

// ── QR Code badge shown at start of flow ──
function QrBadge({ qrCodeUrl }) {
  if (!qrCodeUrl) return null;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      flexShrink: 0, marginRight: 4,
    }}>
      <div style={{
        width: 72, background: T.white, borderRadius: T.radiusSm,
        border: `2px solid ${T.blue}`, padding: 6,
        boxShadow: `0 0 0 4px ${T.blueLight}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <img src={qrCodeUrl} alt="QR Code" style={{ width: 56, height: 56, objectFit: 'contain' }} />
        <span style={{ fontSize: 8, fontWeight: 700, color: T.blue, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Scan to Start
        </span>
      </div>
      {/* Connector from QR to first step */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>
      </div>
    </div>
  );
}

// ── Main horizontal canvas ──
export default function HorizontalCanvas({ steps, selectedId, onSelect, onDelete, onMove, onClear, onSendFlow, qrCodeUrl }) {
  return (
    <main style={{
      display: 'flex', flexDirection: 'column',
      background: T.gray100, overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px 12px', flexShrink: 0,
        borderBottom: `1px solid ${T.gray200}`, background: T.white,
      }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: T.gray900 }}>Customer Journey</h2>
          <p style={{ fontSize: 11, color: T.gray400, marginTop: 2 }}>
            {steps.length === 0
              ? 'Add messages from the left panel to build your campaign'
              : `${steps.length} message${steps.length !== 1 ? 's' : ''} · Read left → right`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {steps.length > 0 && (
            <button onClick={onClear} style={ghostBtn()}>🗑 Clear</button>
          )}
          <button onClick={onSendFlow} style={primaryBtn()}>▶ Send Campaign</button>
        </div>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', padding: '32px 24px' }}>
        {steps.length === 0 ? (
          /* Empty state */
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 300, background: T.white, borderRadius: T.radius,
            border: `2px dashed ${T.gray200}`, padding: 48, textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.gray700, marginBottom: 8 }}>
              Build your RCS campaign
            </div>
            <div style={{ fontSize: 13, color: T.gray400, maxWidth: 340, lineHeight: 1.7 }}>
              Click any component in the left panel to add it here. Messages flow left → right, just like a real conversation.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['👋 Welcome Flow', '📊 Savings Calculator', '🧑‍💼 Escalation'].map(t => (
                <div key={t} style={{
                  background: T.blueLight, color: T.blue, borderRadius: 99,
                  padding: '5px 14px', fontSize: 12, fontWeight: 600,
                }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Flow row */
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content', paddingBottom: 16 }}>

            {/* QR Code entry point */}
            {qrCodeUrl && (
              <>
                <QrBadge qrCodeUrl={qrCodeUrl} />
                <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', marginBottom: 28 }}>
                  <Arrow color={T.blue} />
                </div>
              </>
            )}

            {/* Steps */}
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <StepCard
                  step={step} index={i} total={steps.length}
                  selected={step.id === selectedId}
                  onSelect={() => onSelect(step.id)}
                  onDelete={() => onDelete(step.id)}
                  onMoveLeft={() => onMove(step.id, -1)}
                  onMoveRight={() => onMove(step.id, 1)}
                />
                {i < steps.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', marginBottom: 28 }}>
                    <Arrow color={TYPE_META[step.type]?.color || T.gray300} />
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Add step hint at end */}
            <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', marginBottom: 28 }}>
              <Arrow color={T.gray200} />
            </div>
            <div style={{
              width: 60, height: 60, borderRadius: T.radius,
              border: `2px dashed ${T.gray200}`, background: T.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: T.gray300, flexShrink: 0,
              alignSelf: 'center', marginBottom: 28,
            }}>
              +
            </div>
          </div>
        )}

        {/* Step labels row (shown below cards) */}
        {steps.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content', marginTop: 8 }}>
            {qrCodeUrl && <div style={{ width: 72 + 39, flexShrink: 0 }} />}
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <div style={{ width: 180, flexShrink: 0, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: T.gray400, fontWeight: 500 }}>
                    Step {i + 1}
                  </div>
                </div>
                {i < steps.length - 1 && <div style={{ width: 39, flexShrink: 0 }} />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function primaryBtn() {
  return {
    background: T.blue, color: T.white, border: 'none',
    borderRadius: T.radiusXs, padding: '8px 16px',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    boxShadow: `0 2px 8px ${T.blue}40`,
  };
}

function ghostBtn() {
  return {
    background: T.white, color: T.gray600,
    border: `1.5px solid ${T.gray200}`,
    borderRadius: T.radiusXs, padding: '8px 14px',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
  };
}