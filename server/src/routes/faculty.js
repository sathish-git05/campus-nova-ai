import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List all faculty members and availability
router.get('/', (req, res) => {
  const facultyList = db.find('users', u => u.role === 'faculty').map(f => {
    const { password, ...safe } = f;
    return safe;
  });
  res.json(facultyList);
});

// Faculty update availability status
router.patch('/status', (req, res) => {
  const { facultyId, status, statusNote, officeHours, cabin } = req.body;
  if (!facultyId || !status) {
    return res.status(400).json({ error: 'Faculty ID and status are required' });
  }

  const updated = db.update('users', u => u.id === facultyId, {
    status,
    ...(statusNote !== undefined && { statusNote }),
    ...(officeHours !== undefined && { officeHours }),
    ...(cabin !== undefined && { cabin })
  });

  if (!updated) return res.status(404).json({ error: 'Faculty member not found' });
  const { password, ...safe } = updated;
  res.json(safe);
});

// List appointments (filtered by student or faculty)
router.get('/appointments', (req, res) => {
  const { facultyId, studentId, role } = req.query;
  let appointments = db.get('appointments');

  if (facultyId) {
    appointments = appointments.filter(a => a.facultyId === facultyId);
  } else if (studentId) {
    appointments = appointments.filter(a => a.studentId === studentId);
  }

  res.json(appointments);
});

// Student Book Appointment
router.post('/appointments', (req, res) => {
  const { facultyId, facultyName, studentId, studentName, studentRoll, date, timeSlot, purpose } = req.body;
  if (!facultyId || !date || !timeSlot || !purpose) {
    return res.status(400).json({ error: 'Faculty, date, time slot, and purpose are required' });
  }

  const newAppointment = db.insert('appointments', {
    facultyId,
    facultyName: facultyName || 'Faculty Member',
    studentId: studentId || 'usr_student_1',
    studentName: studentName || 'Rohan Sharma',
    studentRoll: studentRoll || '23CS1042',
    date,
    timeSlot,
    purpose,
    status: 'Pending',
    facultyRemarks: '',
    createdAt: new Date().toISOString()
  });

  res.status(201).json(newAppointment);
});

// Faculty Update Appointment Status (Approve / Reject / Reschedule / Complete)
router.patch('/appointments/:id', (req, res) => {
  const { status, facultyRemarks, timeSlot, date } = req.body;
  const apt = db.findOne('appointments', a => a.id === req.params.id);
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });

  const updated = db.update('appointments', a => a.id === req.params.id, {
    ...(status && { status }),
    ...(facultyRemarks !== undefined && { facultyRemarks }),
    ...(timeSlot && { timeSlot }),
    ...(date && { date })
  });

  res.json(updated);
});

export default router;
