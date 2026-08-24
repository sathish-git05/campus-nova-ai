import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  Radio,
  Sparkles,
  Send,
  Calendar,
  CheckCircle2,
  Activity
} from 'lucide-react';

export const AdminView = () => {
  const [overview, setOverview] = useState(null);
  const [circulars, setCirculars] = useState([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    originalText: '',
    targetRole: 'all',
    category: 'Academics'
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const loadAdminData = async () => {
    try {
      const data = await api.getAdminOverview();
      setOverview(data);
      const circ = await api.getCirculars();
      setCirculars(circ);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    setIsBroadcasting(true);
    try {
      await api.broadcastCircular({
        ...broadcastData,
        publishedBy: 'Office of Dean Academics & Administration'
      });
      setShowBroadcastModal(false);
      setBroadcastData({
        title: '',
        originalText: '',
        targetRole: 'all',
        category: 'Academics'
      });
      loadAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Admin Command & Campus Analytics</h1>
            <span className="badge badge-danger">ADMINISTRATOR</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            High-level campus oversight, AI broadcast communications, and grievance triage
          </span>
        </div>

        <button onClick={() => setShowBroadcastModal(true)} className="btn btn-primary">
          <Radio size={16} /> Broadcast Circular (AI-Summarized)
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid-responsive-4">
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Registered Users</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>
            {overview?.metrics?.totalUsers || 5}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {overview?.metrics?.studentCount || 1} Students • {overview?.metrics?.facultyCount || 2} Faculty
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Pending Grievances</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: overview?.metrics?.openComplaints > 0 ? '#f59e0b' : '#10b981', marginTop: '4px' }}>
            {overview?.metrics?.openComplaints || 2}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px' }}>
            {overview?.metrics?.criticalComplaints || 0} Critical Priority
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Active Campus Events</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-secondary)', marginTop: '4px' }}>
            {overview?.metrics?.totalEvents || 3}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            HackNova & Vibrance 2026
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>IoT Sensor Health</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            4 Nodes Active
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Temp: {overview?.metrics?.serverTemp || 24.8}°C • Smoke: {overview?.metrics?.smokePPM || 48} PPM
          </div>
        </div>
      </div>

      {/* Broadcast Circulars List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Published Campus Circulars & AI Summaries</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {circulars.map(cir => (
            <div key={cir.id} style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '1rem', color: '#fff' }}>{cir.title}</strong>
                <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>Role: {cir.targetRole}</span>
              </div>

              <div style={{ padding: '10px 14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Sparkles size={12} /> AI 3-Point Takeaway Summary:
                </div>
                <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {cir.aiSummary?.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {cir.originalText}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '10px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Published by: {cir.publishedBy}</span>
                <span>{cir.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Circular Modal */}
      {showBroadcastModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '560px', padding: '28px', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Radio size={20} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.25rem' }}>Broadcast Campus-Wide Notice</h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Our AI engine will automatically summarize this announcement into 3 concise bullet points for students and faculty.
            </p>

            <form onSubmit={handleBroadcastSubmit}>
              <div className="form-group">
                <label className="form-label">Circular Title</label>
                <input
                  type="text"
                  placeholder="e.g. End Semester Exam Fee Clearance & Hall Ticket Download Notice"
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select
                    value={broadcastData.targetRole}
                    onChange={(e) => setBroadcastData({ ...broadcastData, targetRole: e.target.value })}
                    className="form-select"
                  >
                    <option value="all">Everyone (All Roles)</option>
                    <option value="student">Students Only</option>
                    <option value="faculty">Faculty Only</option>
                    <option value="alumni">Alumni Only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={broadcastData.category}
                    onChange={(e) => setBroadcastData({ ...broadcastData, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Events">Events</option>
                    <option value="Administration">Administration</option>
                    <option value="Safety">Safety & Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Official Circular Text</label>
                <textarea
                  rows="5"
                  placeholder="Type or paste the complete announcement text..."
                  value={broadcastData.originalText}
                  onChange={(e) => setBroadcastData({ ...broadcastData, originalText: e.target.value })}
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowBroadcastModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isBroadcasting} className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>{isBroadcasting ? 'AI Summarizing & Broadcasting...' : 'Broadcast Circular'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
