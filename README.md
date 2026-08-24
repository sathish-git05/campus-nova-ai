# CampusNova AI: Smart Campus Management System
> **AI + IoT Powered Web Application**  
> *Final-Year Engineering Project Submission*

---

## 🌟 Overview
**CampusNova AI** is a next-generation, unified digital campus ecosystem integrating **Artificial Intelligence** and **Internet of Things (IoT)** telemetry to connect **Students, Faculty, Alumni, and College Administrators** on a single responsive platform.

---

## 🚀 Key Functional Modules

1. **Academic Management Portal:**
   - Real-time subject-wise attendance tracking (minimum 75% exam eligibility warning & condonation calculation).
   - Continuous Internal Assessment (CIA) marks & Model Exam predictions.
   - Interactive weekly timetable grid (Monday - Friday).
   - End-semester university exam dates, room allotments, and session details.

2. **Study Resources & PYQ Repository:**
   - Filterable official lecture notes, Anna University/Autonomous Previous Year Question Papers (PYQs), and Important Questions.
   - Download counter and resource upload modal for faculty members.

3. **Faculty Real-Time Availability & Appointments:**
   - Live faculty presence status toggles (`Available`, `In Class`, `Busy`, `On Leave`).
   - Cabin locations, official office hours, and status notes.
   - One-on-one student appointment booking, approval, and rescheduling system.

4. **Campus Grievance Redressal (AI Auto-Triage):**
   - Natural Language Processing (NLP) text classification that automatically tags issue category (`Classroom Equipment`, `Electrical & Safety`, `Sanitation & Water`, `Hostel`, `Academic`) and urgency (`Critical`, `High`, `Medium`, `Low`).
   - Auto-routing to responsible maintenance departments with progress timeline tracking.

5. **24/7 Campus & Academic AI Assistant Suite:**
   - Conversational AI chatbot for syllabus doubts, college rules, bus routes, exam dates, and faculty availability.
   - **AI Exam Question Generator:** Synthesizes 2-mark conceptual questions and 16-mark comprehensive analytical questions with marking rubrics.
   - **AI Circular Summarizer:** Automatically condenses lengthy administrative circulars into 3 actionable bullet points.

6. **Real-Time IoT Campus Telemetry & Emergency Safety:**
   - **DHT22:** Server room & lab ambient temperature and relative humidity.
   - **MQ-2:** Combustible gas and smoke detection (hazard threshold: 300 PPM).
   - **HC-SR04:** Overhead water tank depth percentage and reservoir capacity (Liters).
   - **ACS712:** Central academic block current draw and energy consumption (kW).
   - **Relay Controllers:** Classroom smart projector & AI lab power states.
   - **Viva Emergency Simulator:** Interactive simulation toolbar to demonstrate smoke hazards, tank depletion, and heat spikes on demand.

7. **Campus Bus Transit Tracker:**
   - Live route tracking, boarding stops, driver contacts, and arrival ETA countdowns.

8. **Events & Cultural Activities Hub:**
   - Technical hackathons (HackNova 2026), symposiums, and cultural fests with 1-click registration.

9. **Alumni Placement & Career Mentorship:**
   - Round-by-round interview experiences for product companies (Microsoft, Google, Zoho, TCS).
   - Company-specific interview questions, DSA roadmaps, and upvoting.

10. **Admin Command Center:**
    - Campus-wide metrics, grievance resolution pipeline, user directory, and AI-summarized notice broadcasts.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, Vanilla CSS Custom Design System (Glassmorphism & Dark/Light modes), Lucide Icons.
- **Backend:** Node.js, Express.js, WebSockets (`ws`), JSON-persisted Database Engine with atomic persistence.
- **AI & NLP:** Google Gemini API integration with high-fidelity local NLP & Knowledge Base fallback.
- **IoT Firmware:** ESP32 C++ (Arduino Framework) in `iot-firmware/CampusNova_ESP32_Firmware.ino`.

---

## 🏃 How to Run the Project Locally

### 1. Start the Backend Server:
```powershell
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000` (WebSocket endpoint: `ws://localhost:5000/ws`)*

### 2. Start the Frontend Client:
```powershell
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 3. Run Automated Endpoint Verification Tests:
```powershell
node test_all_endpoints.js
```

---

## 🎓 Final Year Project Viva Demo Guide

1. **Switch Roles Instantly:** Use the top navbar role switcher (`Student`, `Faculty`, `Alumni`, `Admin`) to showcase role-specific permissions and dashboards.
2. **Demonstrate AI Chat & Question Generator:** Open the **Campus AI** floating drawer, test quick prompt queries, and switch to the **Question Generator** tab to generate exam questions.
3. **Demonstrate AI Grievance Auto-Triage:** Under **Grievance Redressal**, click **File New Complaint**, type an issue description like *"Smoke and projector spark in LH-302"*, and watch the AI instantly predict **Critical Priority** and **Classroom Equipment / Electrical** category.
4. **Demonstrate Real-Time IoT Hazard Alert:** Under **IoT Telemetry Center**, click **"Simulate Smoke Spike (460 PPM)"**. An emergency red alert toast will pop up across the campus dashboard, and the gauge will turn red. Click **"Reset Baseline"** to return to normal.
