async function runTests() {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Running Comprehensive CampusNova AI Backend & AI/IoT Endpoint Tests...\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('Health Check', async () => {
    const res = await fetch(`${BASE}/health`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Health status not ok');
  });

  // 2. Auth Role Switch
  await test('Auth: Role Switch to Student', async () => {
    const res = await fetch(`${BASE}/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'student' })
    });
    const data = await res.json();
    if (data.user.role !== 'student') throw new Error('Failed to switch to student role');
  });

  // 3. Academics: Attendance & Marks
  await test('Academics: Attendance & Marks', async () => {
    const res = await fetch(`${BASE}/academics/attendance?studentId=usr_student_1`);
    const data = await res.json();
    if (!data.subjects || data.subjects.length === 0) throw new Error('No subjects in attendance');
    if (data.overallPercentage < 75) throw new Error('Overall percentage calculated incorrectly');
  });

  // 4. Academics: Timetable & Exams
  await test('Academics: Timetable & Exams', async () => {
    const res = await fetch(`${BASE}/academics/timetable`);
    const tt = await res.json();
    if (tt.length < 5) throw new Error('Timetable missing days');
    const resEx = await fetch(`${BASE}/academics/exams`);
    const exams = await resEx.json();
    if (exams.length < 5) throw new Error('Exams schedule missing entries');
  });

  // 5. Materials: List & Filter
  await test('Materials: Query & Filter', async () => {
    const res = await fetch(`${BASE}/materials?type=Lecture Notes`);
    const list = await res.json();
    if (!Array.isArray(list)) throw new Error('Materials not returning array');
  });

  // 6. Faculty: Availability & Appointments
  await test('Faculty: Availability Status & Appointment Flow', async () => {
    const res = await fetch(`${BASE}/faculty`);
    const list = await res.json();
    if (list.length === 0) throw new Error('Faculty list is empty');
  });

  // 7. AI: Chat Assistant
  await test('AI: 24/7 Campus Chatbot', async () => {
    const res = await fetch(`${BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'When is my AI exam and what is my attendance?',
        userContext: { name: 'Rohan Sharma', role: 'student', department: 'CSE' }
      })
    });
    const data = await res.json();
    if (!data.reply || data.reply.length < 10) throw new Error('AI reply is empty');
  });

  // 8. AI: Automated Complaint Classification
  await test('AI: Auto Complaint Triage & Categorization', async () => {
    const res = await fetch(`${BASE}/ai/classify-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Smoke in Server Room and AC unit tripped',
        description: 'Smoke detected near rack 4 and HVAC unit is offline',
        location: 'Server Room B'
      })
    });
    const data = await res.json();
    if (data.priority !== 'Critical') throw new Error(`Expected Critical priority, got ${data.priority}`);
    if (!data.category.includes('Electrical') && !data.category.includes('Safety')) throw new Error('Category mismatch');
  });

  // 9. AI: Exam Question Generator
  await test('AI: Question Bank Generator', async () => {
    const res = await fetch(`${BASE}/ai/generate-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Artificial Intelligence',
        topic: 'A* Search & Heuristic Admissibility',
        unit: 'Unit 1'
      })
    });
    const data = await res.json();
    if (!data.twoMarkQuestions || data.twoMarkQuestions.length === 0) throw new Error('No 2-mark questions generated');
    if (!data.sixteenMarkQuestions || data.sixteenMarkQuestions.length === 0) throw new Error('No 16-mark questions generated');
  });

  // 10. IoT: Telemetry Ingestion & Hazard Simulator
  await test('IoT: Live Telemetry & Smoke Hazard Simulation', async () => {
    const res = await fetch(`${BASE}/iot/simulate-hazard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'smoke_spike', customValue: 450 })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Hazard simulation failed');
    if (data.updated.smoke.value !== 450) throw new Error('Smoke telemetry not updated');
    if (data.updated.smoke.status !== 'Hazard') throw new Error('Smoke status did not transition to Hazard');
  });

  // 11. IoT: Reset Baseline
  await test('IoT: Reset to Normal Baseline', async () => {
    const res = await fetch(`${BASE}/iot/simulate-hazard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'reset' })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Reset failed');
  });

  // 12. Buses & Transit Tracking
  await test('Transit: Campus Bus Routes & ETAs', async () => {
    const res = await fetch(`${BASE}/buses`);
    const buses = await res.json();
    if (buses.length < 3) throw new Error('Bus routes missing');
  });

  // 13. Events & Registration
  await test('Events: List & 1-Click Registration Toggle', async () => {
    const res = await fetch(`${BASE}/events`);
    const events = await res.json();
    if (events.length === 0) throw new Error('No events found');
    const firstId = events[0].id;
    const regRes = await fetch(`${BASE}/events/${firstId}/register`, { method: 'POST' });
    const regData = await regRes.json();
    if (!regData.success) throw new Error('Event registration toggle failed');
  });

  // 14. Alumni: Placement Insights
  await test('Alumni: Placement Stories & Upvoting', async () => {
    const res = await fetch(`${BASE}/alumni`);
    const posts = await res.json();
    if (posts.length === 0) throw new Error('No alumni posts found');
    const upRes = await fetch(`${BASE}/alumni/${posts[0].id}/upvote`, { method: 'POST' });
    const upData = await upRes.json();
    if (!upData.upvotes) throw new Error('Upvote counter failed');
  });

  // 15. Admin: Overview & AI Broadcast
  await test('Admin: Analytics Overview & AI Summarized Broadcast', async () => {
    const res = await fetch(`${BASE}/admin/overview`);
    const data = await res.json();
    if (!data.metrics) throw new Error('Metrics missing in admin overview');

    const broadRes = await fetch(`${BASE}/admin/circulars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'End-Semester Timetable Clearance',
        originalText: 'Final exam fees must be paid before Sept 05. Hall tickets will be issued online.',
        targetRole: 'student',
        category: 'Academics'
      })
    });
    const broadData = await broadRes.json();
    if (!broadData.aiSummary || broadData.aiSummary.length === 0) throw new Error('AI summary not generated for broadcast');
  });

  console.log(`\n==============================================`);
  console.log(`🎉 ALL TESTS COMPLETED: ${passed} Passed | ${failed} Failed`);
  console.log(`==============================================`);
}

runTests();
