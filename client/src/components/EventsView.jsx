import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  CheckCircle2,
  Sparkles,
  Trophy
} from 'lucide-react';

export const EventsView = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Technical Hackathon',
    date: '2026-09-15',
    time: '09:30 AM onwards',
    venue: 'Auditorium Hall',
    description: '',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    organizer: 'Dept of CSE & IIC'
  });

  const loadEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleToggleRegister = async (id) => {
    try {
      await api.toggleEventRegistration(id);
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createEvent(newEvent);
      setShowCreateModal(false);
      setNewEvent({
        title: '',
        category: 'Technical Hackathon',
        date: '2026-09-15',
        time: '09:30 AM onwards',
        venue: 'Auditorium Hall',
        description: '',
        bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        organizer: `${user?.name} (${user?.role})`
      });
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Campus Events & Cultural Activities</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Hackathons, national symposiums, cultural fests & career bootcamps
          </span>
        </div>

        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <Plus size={16} /> Publish New Event
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
        {events.map(evt => (
          <div key={evt.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ height: '190px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img
                src={evt.bannerUrl}
                alt={evt.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                <span className="badge badge-primary" style={{ backdropFilter: 'blur(8px)', background: 'rgba(99, 102, 241, 0.85)', color: '#fff' }}>
                  {evt.category}
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: '12px', right: '14px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={13} /> {evt.registrationsCount || 0} Registered
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: '1.3' }}>
                {evt.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                {evt.description}
              </p>

              <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} color="var(--accent-primary)" />
                  <span><strong>Date:</strong> {evt.date} • {evt.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} color="var(--accent-secondary)" />
                  <span><strong>Venue:</strong> {evt.venue}</span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  Organized by: {evt.organizer}
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Deadline: {evt.registrationDeadline}
              </span>

              <button
                onClick={() => handleToggleRegister(evt.id)}
                className={`btn btn-sm ${evt.isRegistered ? 'btn-secondary' : 'btn-primary'}`}
                style={{
                  background: evt.isRegistered ? 'rgba(16, 185, 129, 0.15)' : undefined,
                  color: evt.isRegistered ? '#34d399' : undefined,
                  borderColor: evt.isRegistered ? '#10b981' : undefined
                }}
              >
                {evt.isRegistered ? (
                  <>
                    <CheckCircle2 size={14} /> Registered
                  </>
                ) : (
                  'Register Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '520px', padding: '28px', background: 'var(--bg-secondary)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Publish New Campus Event</h2>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. AI Innovation Summit 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Event Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Technical Hackathon">Technical Hackathon</option>
                    <option value="Cultural Fest">Cultural Fest</option>
                    <option value="Career & Placement">Career & Placement</option>
                    <option value="Workshop & Seminar">Workshop & Seminar</option>
                    <option value="Sports Tournament">Sports Tournament</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue & Room</label>
                <input
                  type="text"
                  placeholder="e.g. Main Auditorium / AI Lab 3"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Highlights</label>
                <textarea
                  rows="3"
                  placeholder="Key topics, eligibility, prize pool..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
