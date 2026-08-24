import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Plus,
  BookOpen
} from 'lucide-react';

export const AcademicsView = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('attendance'); // attendance, marks, timetable, exams
  const [attendance, setAttendance] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Faculty marks entry modal
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [newMark, setNewMark] = useState({
    studentId: 'usr_student_1',
    subjectCode: 'CS3501',
    subjectName: 'Artificial Intelligence & ML',
    internal1: 48,
    internal2: 46,
    modelExam: 94,
    grade: 'A+'
  });

  const loadAcademics = async () => {
    try {
      const att = await api.getAttendance(user?.id);
      setAttendance(att);
      const mrk = await api.getMarks(user?.id);
      setMarksData(mrk);
      const tt = await api.getTimetable();
      setTimetable(tt);
      const ex = await api.getExams();
      setExams(ex);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAcademics();
  }, [user]);

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    try {
      await api.postMarks(newMark);
      setShowMarksModal(false);
      loadAcademics();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Sub-Tabs */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Academic Management Hub</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Attendance records, internal assessments, schedules & examinations
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          {[
            { id: 'attendance', label: '📊 Attendance' },
            { id: 'marks', label: '📝 Internal Marks' },
            { id: 'timetable', label: '🗓️ Timetable' },
            { id: 'exams', label: '🎓 Exam Schedule' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className="btn btn-sm"
              style={{
                background: activeSubTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: activeSubTab === tab.id ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 14px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Attendance Breakdown */}
      {activeSubTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Summary Metric */}
          <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Overall Cumulative Attendance</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                {attendance?.overallPercentage || 86.4}%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Classes: {attendance?.totalClasses || 208} | Attended: {attendance?.totalAttended || 180}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                <CheckCircle2 size={16} /> Exam Eligible (Threshold: 75%)
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                No attendance shortage condonation required
              </div>
            </div>
          </div>

          {/* Subject Breakdown List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Subject-Wise Attendance Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {attendance?.subjects?.map(sub => (
                <div key={sub.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span className="badge badge-primary" style={{ marginRight: '8px' }}>{sub.subjectCode}</span>
                      <strong style={{ fontSize: '0.95rem' }}>{sub.subjectName}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '10px' }}>Faculty: {sub.faculty}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: sub.percentage >= 75 ? '#10b981' : '#ef4444' }}>
                        {sub.percentage}%
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {sub.attended} / {sub.total} Classes
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${sub.percentage}%`,
                      height: '100%',
                      background: sub.percentage >= 75 ? 'linear-gradient(90deg, #10b981, #06b6d4)' : '#ef4444',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Internal Marks */}
      {activeSubTab === 'marks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Continuous Internal Assessment (CIA) & Model Exam</h2>
            {user?.role === 'faculty' && (
              <button onClick={() => setShowMarksModal(true)} className="btn btn-primary btn-sm">
                <Plus size={16} /> Enter / Update Student Marks
              </button>
            )}
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto', padding: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Subject Code</th>
                  <th style={{ padding: '12px' }}>Subject Name</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Internal 1 (50)</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Internal 2 (50)</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Model Exam (100)</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Projected Grade</th>
                </tr>
              </thead>
              <tbody>
                {marksData?.marks?.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 600, color: 'var(--accent-primary)' }}>{m.subjectCode}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 500 }}>{m.subjectName}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{m.internal1}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{m.internal2}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981' }}>{m.modelExam}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span className="badge badge-success">{m.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Timetable */}
      {activeSubTab === 'timetable' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Day Selector */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`btn btn-sm ${selectedDay === day ? 'btn-primary' : 'btn-secondary'}`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Schedule for {selectedDay}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {timetable.find(t => t.day === selectedDay)?.slots?.map((slot, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      padding: '8px 12px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--accent-primary)'
                    }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      {slot.time}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{slot.subject}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Faculty: {slot.faculty}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-primary">{slot.code}</span>
                    <span className="badge badge-cyan">
                      <MapPin size={12} /> {slot.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Exam Schedule */}
      {activeSubTab === 'exams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Semester 5 End-Semester University Examination Schedule</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {exams.map(ex => (
                <div key={ex.id} style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-primary">{ex.subjectCode}</span>
                    <span className="badge badge-warning">{ex.session} (Forenoon)</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{ex.subjectName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>📅 <strong>Date:</strong> {ex.date}</div>
                    <div>⏰ <strong>Time:</strong> {ex.time}</div>
                    <div>📍 <strong>Venue:</strong> {ex.hall}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Faculty Marks Entry Modal */}
      {showMarksModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '480px', padding: '24px', background: 'var(--bg-secondary)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Enter Student Assessment Marks</h2>
            <form onSubmit={handleSaveMarks}>
              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input
                  type="text"
                  value={newMark.subjectCode}
                  onChange={(e) => setNewMark({ ...newMark, subjectCode: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  value={newMark.subjectName}
                  onChange={(e) => setNewMark({ ...newMark, subjectName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Internal 1 (out of 50)</label>
                  <input
                    type="number"
                    value={newMark.internal1}
                    onChange={(e) => setNewMark({ ...newMark, internal1: e.target.value })}
                    className="form-input"
                    max="50"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Internal 2 (out of 50)</label>
                  <input
                    type="number"
                    value={newMark.internal2}
                    onChange={(e) => setNewMark({ ...newMark, internal2: e.target.value })}
                    className="form-input"
                    max="50"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Model Exam (out of 100)</label>
                <input
                  type="number"
                  value={newMark.modelExam}
                  onChange={(e) => setNewMark({ ...newMark, modelExam: e.target.value })}
                  className="form-input"
                  max="100"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowMarksModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
