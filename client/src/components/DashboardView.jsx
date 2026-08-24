import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIoT } from '../context/IoTContext';
import { api } from '../services/api';
import {
  GraduationCap,
  Calendar,
  AlertCircle,
  Activity,
  Flame,
  Droplet,
  Zap,
  Thermometer,
  Clock,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Bell
} from 'lucide-react';

export const DashboardView = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { sensors, alerts } = useIoT();
  const [attendance, setAttendance] = useState(null);
  const [circulars, setCirculars] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const att = await api.getAttendance(user?.id);
        setAttendance(att);
        const circ = await api.getCirculars();
        setCirculars(circ.slice(0, 3));
        const evts = await api.getEvents();
        setEvents(evts.slice(0, 2));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };
    loadDashboardData();
  }, [user]);

  const isHazard = sensors?.smoke?.value > 300 || sensors?.temperature?.value > 38;

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-primary">CampusNova AI Hub</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Welcome back,</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user?.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              {user?.role === 'student' && `${user?.year} • ${user?.department} • Roll No: ${user?.rollNo}`}
              {user?.role === 'faculty' && `${user?.designation} • ${user?.department}`}
              {user?.role === 'alumni' && `${user?.designation} at ${user?.company} • ${user?.batch}`}
              {user?.role === 'admin' && `${user?.designation} • System Administrator`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setActiveTab('iot')} className="btn btn-secondary">
              <Activity size={16} color="var(--accent-secondary)" />
              <span>IoT Telemetry</span>
            </button>
            <button onClick={() => setActiveTab('academics')} className="btn btn-primary">
              <GraduationCap size={16} />
              <span>Academic Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Campus IoT Quick Glance Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--accent-secondary)" />
            Real-Time Campus Infrastructure Telemetry (ESP32 Stream)
          </h2>
          <button onClick={() => setActiveTab('iot')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Open Telemetry Center <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid-responsive-4">
          {/* Temperature */}
          <div className="glass-panel card-interactive" onClick={() => setActiveTab('iot')} style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Server Room Temp</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Thermometer size={18} color="#ef4444" />
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {sensors?.temperature?.value || 24.8} {sensors?.temperature?.unit || '°C'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span className={`badge ${sensors?.temperature?.value > 35 ? 'badge-danger' : 'badge-success'}`}>
                {sensors?.temperature?.status || 'Optimal'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Humidity: {sensors?.temperature?.humidity || 52}%</span>
            </div>
          </div>

          {/* Smoke Safety */}
          <div className="glass-panel card-interactive" onClick={() => setActiveTab('iot')} style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MQ-2 Smoke Safety</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: sensors?.smoke?.value > 300 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={18} color={sensors?.smoke?.value > 300 ? '#ef4444' : '#10b981'} />
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: sensors?.smoke?.value > 300 ? '#ef4444' : 'var(--text-primary)' }}>
              {sensors?.smoke?.value || 48} <span style={{ fontSize: '1rem' }}>PPM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span className={`badge ${sensors?.smoke?.value > 300 ? 'badge-danger' : 'badge-success'}`}>
                {sensors?.smoke?.status || 'Safe'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Threshold: 300 PPM</span>
            </div>
          </div>

          {/* Water Tank */}
          <div className="glass-panel card-interactive" onClick={() => setActiveTab('iot')} style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overhead Water Tank</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplet size={18} color="#06b6d4" />
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {sensors?.waterLevel?.value || 78}%
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span className="badge badge-cyan">
                {sensors?.waterLevel?.status || 'Sufficient'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{(sensors?.waterLevel?.liters || 15600).toLocaleString()} L</span>
            </div>
          </div>

          {/* Electricity */}
          <div className="glass-panel card-interactive" onClick={() => setActiveTab('iot')} style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Campus Energy Load</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="#f59e0b" />
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {sensors?.electricity?.value || 18.4} <span style={{ fontSize: '1rem' }}>kW</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span className="badge badge-warning">
                {sensors?.electricity?.status || 'Normal'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>230V Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Academics / Activity & Circulars with AI Summary */}
      <div className="grid-responsive-2">
        {/* Academic Highlights & Timetable */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} color="var(--accent-primary)" />
              Academic Status & Quick Stats
            </h2>
            <button onClick={() => setActiveTab('academics')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
              Full Details →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Overall Attendance</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {attendance?.overallPercentage || 86.4}%
              </div>
              <span className="badge badge-success" style={{ marginTop: '6px', fontSize: '0.68rem' }}>Exam Eligible (≥75%)</span>
            </div>

            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Predicted CGPA</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
                8.82 / 10.0
              </div>
              <span className="badge badge-primary" style={{ marginTop: '6px', fontSize: '0.68rem' }}>Distinction Class</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Today's Key Classes & Labs
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Artificial Intelligence & ML</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LH-302 • Dr. Priya Sundaram</div>
                </div>
                <span className="badge badge-primary">09:00 - 10:00 AM</span>
              </div>

              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>IoT Systems & Sensor Laboratory</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IoT Lab 2 • Dr. K. Swaminathan</div>
                </div>
                <span className="badge badge-cyan">01:15 - 03:15 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Circulars & AI-Summarized Announcements */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="#f59e0b" />
              Campus Notices (AI-Summarized)
            </h2>
            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
              <Sparkles size={11} /> Auto-Summary
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {circulars.map(cir => (
              <div key={cir.id} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#ffffff', marginBottom: '6px' }}>
                  {cir.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <ul style={{ paddingLeft: '16px' }}>
                    {cir.aiSummary?.map((s, idx) => (
                      <li key={idx} style={{ marginBottom: '2px' }}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>📢 {cir.publishedBy}</span>
                  <span>{cir.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
