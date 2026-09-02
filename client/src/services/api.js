const API_BASE = '/api';

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async switchRole(role) {
    const res = await fetch(`${API_BASE}/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  async getProfile(id) {
    const res = await fetch(`${API_BASE}/auth/profile/${id}`);
    return res.json();
  },

  // Academics
  async getAttendance(studentId) {
    const res = await fetch(`${API_BASE}/academics/attendance?studentId=${studentId || ''}`);
    return res.json();
  },

  async getMarks(studentId) {
    const res = await fetch(`${API_BASE}/academics/marks?studentId=${studentId || ''}`);
    return res.json();
  },

  async postMarks(data) {
    const res = await fetch(`${API_BASE}/academics/marks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getTimetable() {
    const res = await fetch(`${API_BASE}/academics/timetable`);
    return res.json();
  },

  async getExams() {
    const res = await fetch(`${API_BASE}/academics/exams`);
    return res.json();
  },

  // Materials & PYQs
  async getMaterials(type, search) {
    let url = `${API_BASE}/materials?`;
    if (type) url += `type=${encodeURIComponent(type)}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    return res.json();
  },

  async uploadMaterial(data) {
    const res = await fetch(`${API_BASE}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async downloadMaterial(id) {
    const res = await fetch(`${API_BASE}/materials/${id}/download`, { method: 'POST' });
    return res.json();
  },

  // Faculty
  async getFacultyList() {
    const res = await fetch(`${API_BASE}/faculty`);
    return res.json();
  },

  async updateFacultyStatus(data) {
    const res = await fetch(`${API_BASE}/faculty/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAppointments(facultyId, studentId) {
    let url = `${API_BASE}/faculty/appointments?`;
    if (facultyId) url += `facultyId=${facultyId}&`;
    if (studentId) url += `studentId=${studentId}`;
    const res = await fetch(url);
    return res.json();
  },

  async bookAppointment(data) {
    const res = await fetch(`${API_BASE}/faculty/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateAppointment(id, data) {
    const res = await fetch(`${API_BASE}/faculty/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Grievances
  async getComplaints(filter = {}) {
    const params = new URLSearchParams(filter);
    const res = await fetch(`${API_BASE}/grievances?${params.toString()}`);
    return res.json();
  },

  async submitComplaint(data) {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateComplaint(id, data) {
    const res = await fetch(`${API_BASE}/grievances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Lost & Found
  async getLostFound(type, status) {
    let url = `${API_BASE}/lost-found?`;
    if (type) url += `type=${type}&`;
    if (status) url += `status=${status}`;
    const res = await fetch(url);
    return res.json();
  },

  async reportLostFound(data) {
    const res = await fetch(`${API_BASE}/lost-found`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateLostFoundStatus(id, status) {
    const res = await fetch(`${API_BASE}/lost-found/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Buses
  async getBuses() {
    const res = await fetch(`${API_BASE}/buses`);
    return res.json();
  },

  // Events
  async getEvents() {
    const res = await fetch(`${API_BASE}/events`);
    return res.json();
  },

  async toggleEventRegistration(id) {
    const res = await fetch(`${API_BASE}/events/${id}/register`, { method: 'POST' });
    return res.json();
  },

  async createEvent(data) {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Alumni
  async getAlumniPosts(company, search) {
    let url = `${API_BASE}/alumni?`;
    if (company) url += `company=${encodeURIComponent(company)}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    return res.json();
  },

  async postAlumniStory(data) {
    const res = await fetch(`${API_BASE}/alumni`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async upvoteAlumniPost(id) {
    const res = await fetch(`${API_BASE}/alumni/${id}/upvote`, { method: 'POST' });
    return res.json();
  },

  // IoT
  async getIoTStatus() {
    const res = await fetch(`${API_BASE}/iot/status`);
    return res.json();
  },

  async simulateHazard(type, customValue) {
    const res = await fetch(`${API_BASE}/iot/simulate-hazard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, customValue })
    });
    return res.json();
  },

  async toggleEquipment(equipmentId, powerState) {
    const res = await fetch(`${API_BASE}/iot/equipment/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipmentId, powerState })
    });
    return res.json();
  },

  // AI
  async askAI(message, userContext) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userContext })
    });
    return res.json();
  },

  async classifyComplaint(title, description, location) {
    const res = await fetch(`${API_BASE}/ai/classify-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, location })
    });
    return res.json();
  },

  async generateQuestions(subject, topic, unit) {
    const res = await fetch(`${API_BASE}/ai/generate-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, topic, unit })
    });
    return res.json();
  },

  // Admin
  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`);
    return res.json();
  },

  async getCirculars() {
    const res = await fetch(`${API_BASE}/admin/circulars`);
    return res.json();
  },

  async broadcastCircular(data) {
    const res = await fetch(`${API_BASE}/admin/circulars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
