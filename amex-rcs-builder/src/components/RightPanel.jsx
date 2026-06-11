import React from 'react';
import { T } from '../theme';
import EditPanel from './EditPanel';
import PhonePreview from './PhonePreview';
import SendPanel from './SendPanel';

export default function RightPanel({ step, steps, activeTab, onTabChange, onUpdate, showToast, qrCodeUrl, onQrCodeChange }) {
  const tabs = [
    { id: 'edit',    label: '✏️ Edit' },
    { id: 'preview', label: '📱 Preview' },
    { id: 'send',    label: '🚀 Send' },
  ];

  return (
    <aside style={{
      background: T.white, borderLeft: `1px solid ${T.gray200}`,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.gray200}`, padding: '0 16px', flexShrink: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1, padding: '14px 4px', fontSize: 12, fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab.id ? T.blue : T.gray400,
              borderBottom: `2px solid ${activeTab === tab.id ? T.blue : 'transparent'}`,
              marginBottom: -1, transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* QR Code section — always visible at top of right panel */}
      <QrCodeUploader qrCodeUrl={qrCodeUrl} onChange={onQrCodeChange} />

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'edit'    && <EditPanel step={step} onUpdate={onUpdate} />}
        {activeTab === 'preview' && <PhonePreview steps={steps} />}
        {activeTab === 'send'    && <SendPanel steps={steps} showToast={showToast} />}
      </div>
    </aside>
  );
}

// ── QR Code Uploader ──────────────────────────────────────────────────────────
function QrCodeUploader({ qrCodeUrl, onChange }) {
  const [dragging, setDragging] = React.useState(false);
  const fileRef = React.useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{
      borderBottom: `1px solid ${T.gray200}`,
      padding: '12px 16px', background: T.gray50, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: T.gray500 }}>
          📷 Campaign QR Code
        </div>
        {qrCodeUrl && (
          <button
            onClick={() => onChange(null)}
            style={{ fontSize: 10, color: T.red, background: T.redLight, border: 'none', borderRadius: 99, padding: '2px 8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Remove
          </button>
        )}
      </div>

      {qrCodeUrl ? (
        /* Preview */
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 56, height: 56, borderRadius: T.radiusXs, overflow: 'hidden',
            border: `2px solid ${T.blue}`, flexShrink: 0,
            boxShadow: `0 0 0 3px ${T.blueLight}`,
          }}>
            <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.gray700 }}>QR Code uploaded ✓</div>
            <div style={{ fontSize: 10, color: T.gray400, marginTop: 2, lineHeight: 1.5 }}>
              Shown at the start of the flow canvas. Customers scan this to begin the conversation.
            </div>
            <button
              onClick={() => fileRef.current.click()}
              style={{ fontSize: 10, color: T.blue, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4, fontWeight: 600 }}
            >
              Replace image →
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current.click()}
          style={{
            border: `2px dashed ${dragging ? T.blue : T.gray300}`,
            borderRadius: T.radiusSm, padding: '14px 12px',
            textAlign: 'center', cursor: 'pointer',
            background: dragging ? T.blueLight : T.white,
            transition: 'all 0.15s',
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 4 }}>📷</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: dragging ? T.blue : T.gray600 }}>
            {dragging ? 'Drop to upload' : 'Upload QR Code'}
          </div>
          <div style={{ fontSize: 10, color: T.gray400, marginTop: 2 }}>
            Drag & drop or click to browse
          </div>
        </div>
      )}

      <input
        ref={fileRef} type="file" accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  );
}