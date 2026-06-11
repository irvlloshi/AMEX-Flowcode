import React, { useState, useCallback, useRef } from 'react';
import { STEP_DEFAULTS, TEMPLATES } from './data/defaults';
import AppHeader from './components/Header';
import Palette from './components/Palette';
import HorizontalCanvas from './components/HorizontalCanvas';
import RightPanel from './components/RightPanel';
import ToastNotification from './components/Toast';
import { T } from './theme';

let stepCounter = 0;


const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: ${T.font}; background: ${T.gray100}; color: ${T.gray900}; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.gray300}; border-radius: 99px; }
  input, textarea, select, button { font-family: inherit; }
  textarea { resize: vertical; }
`;

export default function App() {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.prepend(style);
    return () => document.head.removeChild(style);
  }, []);

  const [steps, setSteps] = useState(() =>
    TEMPLATES.welcome.map(t => ({ ...JSON.parse(JSON.stringify(t)), id: ++stepCounter }))
  );
  const [selectedId, setSelectedId] = useState(steps[0]?.id || null);
  const [activeTab, setActiveTab] = useState('edit');
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // base64 or object URL
  const [toast, setToast] = useState({ msg: '', show: false, type: 'success' });
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true, type });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  }, []);

  const addStep = useCallback((type) => {
    const def = JSON.parse(JSON.stringify(STEP_DEFAULTS[type]));
    def.id = ++stepCounter;
    setSteps(prev => [...prev, def]);
    setSelectedId(def.id);
    setActiveTab('edit');
    showToast(`Added ${def.label}`);
  }, [showToast]);

  const addTemplate = useCallback((name) => {
    const newSteps = TEMPLATES[name].map(t => ({ ...JSON.parse(JSON.stringify(t)), id: ++stepCounter }));
    setSteps(prev => [...prev, ...newSteps]);
    setSelectedId(newSteps[0].id);
    setActiveTab('edit');
    showToast(`Template loaded: ${name}`);
  }, [showToast]);

  const deleteStep = useCallback((id) => {
    setSteps(prev => {
      const next = prev.filter(s => s.id !== id);
      if (selectedId === id) setSelectedId(next[next.length - 1]?.id || null);
      return next;
    });
    showToast('Step removed', 'info');
  }, [selectedId, showToast]);

  const moveStep = useCallback((id, dir) => {
    setSteps(prev => {
      const arr = [...prev];
      const idx = arr.findIndex(s => s.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  }, []);

  const clearFlow = useCallback(() => {
    setSteps([]); setSelectedId(null);
    showToast('Flow cleared', 'info');
  }, [showToast]);

  const updateStep = useCallback((id, updater) => {
    setSteps(prev => prev.map(s => s.id === id ? updater(s) : s));
  }, []);

  const selectedStep = steps.find(s => s.id === selectedId) || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <AppHeader steps={steps} />
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 360px', flex: 1, overflow: 'hidden' }}>
        <Palette onAddStep={addStep} onAddTemplate={addTemplate} />
        <HorizontalCanvas
          steps={steps}
          selectedId={selectedId}
          onSelect={(id) => { setSelectedId(id); setActiveTab('edit'); }}
          onDelete={deleteStep}
          onMove={moveStep}
          onClear={clearFlow}
          onSendFlow={() => setActiveTab('send')}
          qrCodeUrl={qrCodeUrl}
        />
        <RightPanel
          step={selectedStep}
          steps={steps}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onUpdate={updateStep}
          showToast={showToast}
          qrCodeUrl={qrCodeUrl}
          onQrCodeChange={setQrCodeUrl}
        />
      </div>
      <ToastNotification {...toast} />
    </div>
  );
}