import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get Student Attendance
router.get('/attendance', (req, res) => {
  const studentId = req.query.studentId || 'usr_student_1';
  const records = db.find('attendance', a => a.studentId === studentId);

  const totalClasses = records.reduce((acc, curr) => acc + curr.total, 0);
  const totalAttended = records.reduce((acc, curr) => acc + curr.attended, 0);
  const overallPercentage = totalClasses > 0 ? parseFloat(((totalAttended / totalClasses) * 100).toFixed(1)) : 0;

  res.json({
    studentId,
    overallPercentage,
    totalClasses,
    totalAttended,
    isEligibleForExams: overallPercentage >= 75.0,
    subjects: records
  });
});

// Get Student Internal Marks
router.get('/marks', (req, res) => {
  const studentId = req.query.studentId || 'usr_student_1';
  const marks = db.find('marks', m => m.studentId === studentId);

  // Compute average score
  let totalScore = 0;
  marks.forEach(m => {
    totalScore += (m.modelExam || 0);
  });
  const avgModel = marks.length > 0 ? parseFloat((totalScore / marks.length).toFixed(1)) : 0;

  res.json({
    studentId,
    averageModelScore: avgModel,
    predictedCgpa: 8.82,
    marks
  });
});

// Update or Post Marks (Faculty action)
router.post('/marks', (req, res) => {
  const { studentId, subjectCode, subjectName, internal1, internal2, modelExam, grade } = req.body;
  const existing = db.findOne('marks', m => m.studentId === studentId && m.subjectCode === subjectCode);

  if (existing) {
    const updated = db.update('marks', m => m.id === existing.id, {
      internal1: Number(internal1),
      internal2: Number(internal2),
      modelExam: Number(modelExam),
      grade
    });
    return res.json(updated);
  }

  const created = db.insert('marks', {
    studentId: studentId || 'usr_student_1',
    subjectCode,
    subjectName,
    internal1: Number(internal1),
    internal2: Number(internal2),
    modelExam: Number(modelExam),
    maxInternal: 50,
    maxModel: 100,
    grade: grade || 'A'
  });
  res.status(201).json(created);
});

// Get Weekly Timetable
router.get('/timetable', (req, res) => {
  const timetable = db.get('timetable');
  res.json(timetable);
});

// Get Semester Exam Schedule
router.get('/exams', (req, res) => {
  const exams = db.get('exams');
  res.json(exams);
});

export default router;
