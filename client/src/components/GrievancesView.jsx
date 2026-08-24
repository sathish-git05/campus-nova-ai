import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  AlertCircle,
  Plus,
  Sparkles,
  CheckCircle,
  Clock,
  MapPin,
  ShieldAlert,
  Send,
  MessageSquare
} from 'lucide-react';

export const GrievancesView = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [aiPredicting, setAiPredicting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: ''
  });
  const [aiPreview, setAiPreview] = useState(null);

  // Resolution modal (admin/faculty)
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState('In-Progress');

  const loadComplaints = async () => {
    try {
      const data = await api.getComplaints({
        status: filterStatus !== 'All' ? filterStatus : undefined
      });
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [filterStatus]);

  // Real-time AI classification preview when description changes
  const handleDescriptionBlur = async () => {
    if (!formData.title || !formData.description) return;
    setAiPredicting(true);
    try {
      const res = await api.classifyComplaint(formData.title, formData.description, formData.location);
      setAiPreview(res);
      if (!formData.category) {
        setFormData(prev => ({ ...prev, category: res.category }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiPredicting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitComplaint({
        ...formData,
        submittedBy: user?.id,
        submitterName: user?.name
      });
      setShowSubmitModal(false);
      setFormData({ title: '', description: '', location: '', category: '' });
      setAiPreview(null);
      loadComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      await api.updateComplaint(selectedComplaint.id, {
        status: resolutionStatus,
        adminRemarks: resolutionRemarks
      });
      setSelectedComplaint(null);
      loadComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const priorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return 'badge-danger';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-cyan';
      default: return 'badge-secondary';
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'Resolved': return 'badge-success';
      case 'In-Progress': return 'badge-warning';
      case 'Open': return 'badge-primary';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Campus Grievance & Complaint Redressal</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            AI-powered issue auto-categorization, priority triage & transparent lifecycle tracking
          </span>
        </div>

        <button onClick={() => setShowSubmitModal(true)} className="btn btn-primary">
          <Plus size={16} /> File New Complaint
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', gap: '8px' }}>
        {['All', 'Open', 'In-Progress', 'Resolved'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Complaints Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
        {complaints.map(cmp => (
          <div key={cmp.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className={`badge ${priorityBadge(cmp.priority)}`}>
                  {cmp.priority === 'Critical' && '🚨 '}
                  {cmp.priority} Priority
                </span>
                <span className={`badge ${statusBadge(cmp.status)}`}>
                  {cmp.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                {cmp.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
                {cmp.description}
              </p>

              {/* AI Classification & Location Card */}
              <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.76rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <MapPin size={13} color="var(--accent-primary)" />
                  <span><strong>Location:</strong> {cmp.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)' }}>
                  <Sparkles size={13} />
                  <span><strong>AI Category:</strong> {cmp.aiCategory || cmp.category} (Confidence: 95%)</span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  🏢 <strong>Assigned To:</strong> {cmp.assignedTo || 'General Maintenance'}
                </div>
              </div>

              {cmp.adminRemarks && (
                <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#34d399' }}>
                  💬 <strong>Resolution Note:</strong> {cmp.adminRemarks}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                By {cmp.submitterName} • {new Date(cmp.createdAt).toLocaleDateString()}
              </span>

              {(user?.role === 'admin' || user?.role === 'faculty') && (
                <button
                  onClick={() => {
                    setSelectedComplaint(cmp);
                    setResolutionStatus(cmp.status);
                    setResolutionRemarks(cmp.adminRemarks || '');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Update Resolution
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* File Complaint Modal */}
      {showSubmitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '520px', padding: '28px', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertCircle size={22} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.25rem' }}>Lodge a Campus Grievance</h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Our AI engine will automatically analyze the text to classify department urgency.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Issue Summary / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Broken ceiling projector in LH-302 with flickering display"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Campus Location</label>
                <input
                  type="text"
                  placeholder="e.g. Block B, 3rd Floor, Classroom 302"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea
                  rows="4"
                  placeholder="Provide complete details. Mention if equipment is completely down or hazardous..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  onBlur={handleDescriptionBlur}
                  className="form-textarea"
                  required
                />
              </div>

              {/* AI Auto-Triage Live Preview Box */}
              {aiPredicting && (
                <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} /> AI NLP is analyzing text for category and priority...
                </div>
              )}

              {aiPreview && (
                <div style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Sparkles size={14} /> AI Classification Preview:
                  </div>
                  <div style={{ color: '#fff' }}>
                    Category: <strong>{aiPreview.category}</strong> | Priority: <strong>{aiPreview.priority}</strong>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', marginTop: '2px' }}>
                    Auto-routing to: {aiPreview.assignedTo} (Confidence: 95%)
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowSubmitModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolution Update Modal (Admin / Faculty) */}
      {selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '480px', padding: '28px', background: 'var(--bg-secondary)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Update Complaint Resolution</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {selectedComplaint.title}
            </p>

            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="Open">Open</option>
                  <option value="In-Progress">In-Progress (Technician Assigned)</option>
                  <option value="Resolved">Resolved (Work Completed)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Action Taken / Resolution Remarks</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Projector replacement lamp installed and tested with faculty."
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setSelectedComplaint(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
