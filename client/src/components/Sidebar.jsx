import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  UserCheck,
  AlertCircle,
  Search,
  Bus,
  Calendar,
  Briefcase,
  Activity,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'faculty', 'alumni', 'admin'] },
    { id: 'academics', label: 'Academics & Exams', icon: GraduationCap, roles: ['student', 'faculty', 'admin'] },
    { id: 'materials', label: 'Study Notes & PYQs', icon: FileText, roles: ['student', 'faculty', 'alumni', 'admin'] },
    { id: 'faculty', label: 'Faculty Availability', icon: UserCheck, roles: ['student', 'faculty', 'admin'] },
    { id: 'grievances', label: 'Grievance Redressal', icon: AlertCircle, roles: ['student', 'faculty', 'admin'] },
    { id: 'lostfound', label: 'Lost & Found', icon: Search, roles: ['student', 'faculty', 'alumni', 'admin'] },
    { id: 'buses', label: 'Campus Bus Transit', icon: Bus, roles: ['student', 'faculty', 'admin'] },
    { id: 'events', label: 'Events & Culturals', icon: Calendar, roles: ['student', 'faculty', 'alumni', 'admin'] },
    { id: 'alumni', label: 'Alumni & Placements', icon: Briefcase, roles: ['student', 'faculty', 'alumni', 'admin'] },
    { id: 'iot', label: 'IoT Telemetry Center', icon: Activity, roles: ['student', 'faculty', 'alumni', 'admin'], highlight: true },
    { id: 'admin', label: 'Admin Command', icon: ShieldCheck, roles: ['admin'] }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(user?.role || 'student'));

  return (
    <aside style={{
      width: '260px',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      borderRight: '1px solid var(--border-subtle)'
    }}>
      <div style={{ padding: '0 12px 16px 12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Campus Navigation
      </div>

      {filteredItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '11px 16px',
              borderRadius: 'var(--radius-md)',
              border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
              background: isActive 
                ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)' 
                : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <Icon 
              size={18} 
              color={isActive ? 'var(--accent-primary)' : 'currentColor'} 
              style={{ flexShrink: 0 }}
            />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.highlight && (
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            )}
          </button>
        );
      })}
    </aside>
  );
};
