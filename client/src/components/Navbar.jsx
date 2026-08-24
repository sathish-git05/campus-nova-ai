import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useIoT } from '../context/IoTContext';
import { 
  Sparkles, 
  Wifi, 
  WifiOff, 
  UserCheck, 
  Bell, 
  Sun, 
  Moon,
  GraduationCap,
  ShieldAlert,
  Flame
} from 'lucide-react';

export const Navbar = ({ onToggleAI, isAIOpen, activeTheme, onToggleTheme }) => {
  const { user, switchRole, loading } = useAuth();
  const { isConnected, sensors, alerts } = useIoT();

  const roleColors = {
    student: 'badge-primary',
    faculty: 'badge-success',
    alumni: 'badge-cyan',
    admin: 'badge-danger'
  };

  const isHazardActive = sensors?.smoke?.value > 300 || sensors?.temperature?.value > 38;

  return (
    <header className="glass-panel" style={{
      margin: '16px 24px 0 24px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: '16px',
      zIndex: 40
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
        }}>
          <GraduationCap size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CampusNova <span style={{ color: '#06b6d4', WebkitTextFillColor: '#06b6d4' }}>AI</span>
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>v1.0 IoT</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Smart Campus Ecosystem</span>
        </div>
      </div>

      {/* IoT Status & Live Telemetry Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: isHazardActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          border: isHazardActive ? '1px solid var(--accent-danger)' : '1px solid var(--border-subtle)'
        }}>
          <span className={`pulse-dot ${isHazardActive ? 'pulse-danger' : ''}`} />
          <div style={{ fontSize: '0.78rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isConnected ? <Wifi size={13} color="#10b981" /> : <WifiOff size={13} color="#ef4444" />}
              {isConnected ? 'ESP32 Live' : 'IoT Offline'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
              🌡️ {sensors?.temperature?.value || 24.8}°C
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: sensors?.smoke?.value > 300 ? '#ef4444' : 'var(--text-primary)', fontWeight: 600 }}>
              💨 {sensors?.smoke?.value || 48} PPM
            </span>
          </div>
        </div>

        {/* Viva Quick Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '4px 6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, padding: '0 4px' }}>ROLE:</span>
          {['student', 'faculty', 'alumni', 'admin'].map((r) => (
            <button
              key={r}
              disabled={loading}
              onClick={() => switchRole(r)}
              className="btn btn-sm"
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                textTransform: 'capitalize',
                background: user?.role === r ? 'var(--accent-primary)' : 'transparent',
                color: user?.role === r ? '#ffffff' : 'var(--text-secondary)',
                border: 'none'
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
            <span className={`badge ${roleColors[user?.role] || 'badge-primary'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={onToggleAI}
          className="btn btn-primary"
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '8px 16px',
            fontSize: '0.82rem',
            background: isAIOpen ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' : undefined
          }}
        >
          <Sparkles size={16} />
          <span>Campus AI</span>
        </button>
      </div>
    </header>
  );
};
