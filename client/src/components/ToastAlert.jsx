import React from 'react';
import { useIoT } from '../context/IoTContext';
import { Flame, AlertTriangle, X, CheckCircle } from 'lucide-react';

export const ToastAlert = () => {
  const { activeToast, setActiveToast } = useIoT();

  if (!activeToast) return null;

  const isCritical = activeToast.type === 'CRITICAL';

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '24px',
      zIndex: 9999,
      maxWidth: '420px',
      padding: '16px 20px',
      borderRadius: 'var(--radius-md)',
      background: isCritical ? '#7f1d1d' : '#78350f',
      border: isCritical ? '2px solid #ef4444' : '2px solid #f59e0b',
      boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      color: '#fff',
      animation: 'fadeIn 0.25s ease'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: isCritical ? '#ef4444' : '#f59e0b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isCritical ? <Flame size={18} color="#fff" /> : <AlertTriangle size={18} color="#fff" />}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '2px' }}>
          {activeToast.title}
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: '1.4' }}>
          {activeToast.message}
        </div>
        <div style={{ fontSize: '0.68rem', opacity: 0.6, marginTop: '4px' }}>
          {new Date(activeToast.timestamp).toLocaleTimeString()} • ESP32 Hardware Trigger
        </div>
      </div>

      <button
        onClick={() => setActiveToast(null)}
        style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
