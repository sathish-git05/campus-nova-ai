import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  Phone
} from 'lucide-react';

export const FacultyView = () => {
  const { user } = useAuth();
  const [facultyList, setFacultyList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Status update for faculty role
  const [myStatus, setMyStatus] = useState(user?.status || 'Available');
  const [myStatusNote, setMyStatusNote] = useState(user?.statusNote || '');

  // Booking Form State
  const [booking, setBooking] = useState({
    date: '2026-08-26',
    timeSlot: '02:30 PM - 03:00 PM',
    purpose: 'Final-Year Project Review & Doubts Discussion'
  });

  const loadData = async () => {
    try {
      const fac = await api.getFacultyList();
      setFacultyList(fac);
      const apts = await api.getAppointments(
        user?.role === 'faculty' ? user?.id : undefined,
        user?.role === 'student' ? user?.id : undefined
      );
      setAppointments(apts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateStatus = async (newStatus) => {
    setMyStatus(newStatus);
    try {
      await api.updateFacultyStatus({
        facultyId: user?.id,
        status: newStatus,
        statusNote: myStatusNote
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.bookAppointment({
        facultyId: selectedFaculty.id,
        facultyName: selectedFaculty.name,
        studentId: user?.id || 'usr_student_1',
        studentName: user?.name || 'Student',
        studentRoll: user?.rollNo || '23CS1042',
        date: booking.date,
        timeSlot: booking.timeSlot,
        purpose: booking.purpose
      });
      setShowBookModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAppointmentAction = async (id, status, remarks) => {
    try {
      await api.updateAppointment(id, { status, facultyRemarks: remarks });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Available': return 'badge-success';
      case 'In Class': return 'badge-primary';
      case 'Busy': return 'badge-warning';
      case 'On Leave': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Faculty Real-Time Availability & Appointments</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Live faculty presence tracking, office hours, and one-on-one booking management
          </span>
        </div>
      </div>

      {/* Faculty Self-Status Manager (Visible to Faculty users) */}
      {user?.role === 'faculty' && (
        <div className="glass-panel" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
          <h2 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} color="var(--accent-primary)" />
            Your Live Campus Availability Status
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {['Available', 'In Class', 'Busy', 'On Leave'].map(st => (
              <button
                key={st}
                onClick={() => handleUpdateStatus(st)}
                className={`btn btn-sm ${myStatus === st ? (st === 'Available' ? 'btn-primary' : 'btn-secondary') : 'btn-secondary'}`}
                style={{
                  background: myStatus === st ? (st === 'Available' ? '#10b981' : '#6366f1') : undefined,
                  borderColor: myStatus === st ? '#fff' : undefined
                }}
              >
                {st === 'Available' && '🟢 '}
                {st === 'In Class' && '🔵 '}
                {st === 'Busy' && '🟡 '}
                {st === 'On Leave' && '🔴 '}
                {st}
              </button>
            ))}

            <input
              type="text"
              placeholder="Status Note (e.g. In Cabin till 4:30 PM for doubts)"
              value={myStatusNote}
              onChange={(e) => setMyStatusNote(e.target.value)}
              onBlur={() => handleUpdateStatus(myStatus)}
              className="form-input"
              style={{ maxWidth: '380px', fontSize: '0.82rem', padding: '6px 12px' }}
            />
          </div>
        </div>
      )}

      {/* Faculty Directory Grid */}
      <div>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Faculty Directory & Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
          {facultyList.map(fac => (
            <div key={fac.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <img
                    src={fac.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                    alt={fac.name}
                    style={{ width: '54px', height: '54px', borderRadius: '14px', objectFit: 'cover', border: '2px solid var(--border-glow)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{fac.name}</h3>
                      <span className={`badge ${statusColor(fac.status)}`}>
                        {fac.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 500 }}>
                      {fac.designation}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {fac.department}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color="var(--accent-primary)" />
                    <span><strong>Cabin:</strong> {fac.cabin || 'Academic Block'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <Clock size={14} color="#f59e0b" />
                    <span><strong>Office Hours:</strong> {fac.officeHours || '02:00 PM - 04:30 PM'}</span>
                  </div>
                  {fac.statusNote && (
                    <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '2px' }}>
                      💬 <em>"{fac.statusNote}"</em>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  📞 {fac.phone || '+91 98765 00000'}
                </span>

                {user?.role === 'student' && (
                  <button
                    onClick={() => { setSelectedFaculty(fac); setShowBookModal(true); }}
                    className="btn btn-primary btn-sm"
                  >
                    <Calendar size={14} /> Request Appointment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Requests Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
          {user?.role === 'faculty' ? 'Incoming Student Appointment Requests' : 'Your Appointment Bookings'}
        </h2>

        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No appointments scheduled at this moment.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {appointments.map(apt => (
              <div key={apt.id} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{apt.purpose}</strong>
                    <span className={`badge ${apt.status === 'Approved' ? 'badge-success' : apt.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    📅 {apt.date} • ⏰ {apt.timeSlot} • 
                    {user?.role === 'faculty' ? ` Student: ${apt.studentName} (${apt.studentRoll})` : ` Faculty: ${apt.facultyName}`}
                  </div>
                  {apt.facultyRemarks && (
                    <div style={{ fontSize: '0.76rem', color: '#34d399', marginTop: '4px' }}>
                      💬 Faculty Note: {apt.facultyRemarks}
                    </div>
                  )}
                </div>

                {user?.role === 'faculty' && apt.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleAppointmentAction(apt.id, 'Approved', 'Appointment confirmed. Please arrive on time.')}
                      className="btn btn-sm btn-primary"
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleAppointmentAction(apt.id, 'Rejected', 'Currently unavailable at this slot. Please pick another date.')}
                      className="btn btn-sm btn-danger"
                    >
                      <XCircle size={14} /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookModal && selectedFaculty && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '480px', padding: '28px', background: 'var(--bg-secondary)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Book Appointment with {selectedFaculty.name}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Office Hours: {selectedFaculty.officeHours} • Cabin: {selectedFaculty.cabin}
            </p>

            <form onSubmit={handleBookSubmit}>
              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input
                  type="date"
                  value={booking.date}
                  onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <select
                  value={booking.timeSlot}
                  onChange={(e) => setBooking({ ...booking, timeSlot: e.target.value })}
                  className="form-select"
                >
                  <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                  <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM</option>
                  <option value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
                  <option value="03:30 PM - 04:00 PM">03:30 PM - 04:00 PM</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Purpose / Discussion Agenda</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Discussing project architecture and paper submission review"
                  value={booking.purpose}
                  onChange={(e) => setBooking({ ...booking, purpose: e.target.value })}
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowBookModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
