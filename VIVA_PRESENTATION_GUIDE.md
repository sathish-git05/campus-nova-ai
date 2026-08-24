# CampusNova AI: Viva Voce Presentation & Demonstration Guide
> **Final-Year Engineering Project Defense Cheat Sheet**

---

## 🎯 1. Recommended Presentation Slide Deck Structure (10 - 12 Slides)

| Slide # | Slide Title | Key Points to Present |
|---|---|---|
| **Slide 1** | **Title Slide** | Project Title: *CampusNova AI - Smart Campus Management System (AI + IoT Powered Web Application)*, Team Members, Guide / Supervisor Name, Department & College. |
| **Slide 2** | **Problem Statement & Motivation** | Fragmented campus portals, delayed grievance redressal, lack of real-time facility safety monitoring (smoke/heat/water/power), and disconnected alumni networks. |
| **Slide 3** | **Project Objectives** | Unify 4 user roles (Student, Faculty, Alumni, Admin), automate workflows with AI, stream real-time IoT hardware telemetry, and provide exam preparation assistance. |
| **Slide 4** | **Literature Survey / Existing vs. Proposed** | Comparative matrix highlighting how CampusNova AI solves limitations of legacy ERPs and isolated IoT prototypes. |
| **Slide 5** | **System Architecture & Data Flow** | 4-Tier Architecture Diagram (Client $\leftrightarrow$ Express Gateway $\leftrightarrow$ AI / IoT Engines $\leftrightarrow$ Persistence Layer & ESP32 Nodes). |
| **Slide 6** | **AI & NLP Module Capabilities** | 24/7 Campus Chatbot, automated grievance classification & priority triage, exam question generation (Part A & Part B), and notice summarization. |
| **Slide 7** | **IoT Hardware & Sensor Network** | ESP32-WROOM-32, DHT22 (Temp/Humidity), MQ-2 (Smoke), HC-SR04 (Water Tank), ACS712 (Power), and relay controllers. |
| **Slide 8** | **Core Academic & Mentorship Modules** | Attendance tracker with 75% threshold, internal marks, interactive timetable, faculty availability booking, and alumni placement question bank. |
| **Slide 9** | **Live Demonstration** | Switching between Student, Faculty, Alumni, and Admin roles + triggering live smoke hazard simulation. |
| **Slide 10** | **Testing & Experimental Results** | 15/15 automated integration test cases passed, sub-100ms API response times, sub-50ms WebSocket telemetry latency. |
| **Slide 11** | **Conclusion & Future Scope** | Summary of contributions, RFID/Biometric attendance roadmap, and smart classroom power automation. |
| **Slide 12** | **Q&A / Thank You** | Open floor for examiner questions. |

---

## 🎬 2. Step-by-Step Live Viva Demonstration Script

Follow this sequence during your project demonstration to showcase all key features smoothly:

### Step 1: Open the Application & Overview
- Open `http://localhost:5173/` in your browser.
- **Explain to Examiner:** *"This is CampusNova AI, built with React 18, Node.js, and WebSockets. The top navbar displays our real-time ESP32 IoT telemetry stream (Temperature, Smoke PPM, and connection status) alongside a 1-click Role Switcher for evaluation."*

### Step 2: Showcase Student Academic Portal
- Navigate to **Academics & Exams**:
  - Show the **Attendance** tab: Highlight the overall percentage ($86.4\%$) and the *"Exam Eligible ($\ge 75\%$)"* badge.
  - Show the **Internal Marks** tab: Continuous assessment scores (CIA-1, CIA-2) and Model exam grades.
  - Show the **Timetable** & **Exam Schedule** tabs: Day-wise room allotments and exam hall schedules.

### Step 3: Demonstrate the 24/7 AI Assistant & Question Generator
- Click the **Campus AI** button in the top navbar:
  - Click the quick prompt *"When is my next exam?"* or ask *"Is Dr. Priya available right now?"*.
  - Switch to the **Question Generator** tab:
    - Enter Topic: *"Heuristic Search & A\* Algorithm"*.
    - Click **Generate Exam Questions**.
    - Show the generated 2-mark questions and 16-mark design problems complete with marking rubrics!

### Step 4: Demonstrate AI Grievance Auto-Triage
- Navigate to **Grievance Redressal**:
  - Click **File New Complaint**.
  - Type: Title: *"Smoke and projector spark in LH-302"*, Description: *"Severe smoke detected from the ceiling projector and AC unit tripped"*.
  - Point out how the AI NLP engine automatically predicts **Critical Priority** and **Classroom Equipment / Electrical** category.
  - Submit the complaint and show the tracking timeline.

### Step 5: Demonstrate Real-Time IoT Telemetry & Hazard Simulation
- Navigate to **IoT Telemetry Center**:
  - Point out the 4 live sensor gauge cards (Temperature, Smoke, Water Tank Level %, and Campus Power Draw in kW).
  - Click **"Simulate Smoke Spike (460 PPM)"**:
    - Watch the emergency red alert toast pop up immediately across the screen.
    - Notice the smoke gauge turn red with **Hazard** status.
  - Click **"Reset Baseline"** to restore optimal values.

### Step 6: Showcase Faculty, Alumni & Admin Roles
- Switch to **Faculty Role**: Show the live presence status toggle (`Available`, `In Class`, `Busy`) and appointment approvals.
- Switch to **Alumni Role**: Show the Microsoft SDE interview experience breakdown with DSA rounds and upvoting.
- Switch to **Admin Role**: Show campus analytics and the **Broadcast Circular** tool where the AI auto-summarizes notices into 3 bullet points.

---

## ❓ 3. Top 15 Viva Voce Questions & Model Answers

### Q1: What is the main objective and novelty of CampusNova AI?
> **Answer:** *"The objective is to unify academic management, faculty scheduling, grievance redressal, and alumni mentorship into a single platform while integrating physical IoT sensor telemetry and AI automation. The novelty lies in combining real-time environmental monitoring (smoke/heat/water/power) with automated NLP ticket triage and instant exam question generation."*

### Q2: Why did you choose WebSockets instead of traditional HTTP polling for IoT telemetry?
> **Answer:** *"HTTP polling incurs high header overhead and latency due to repetitive TCP handshakes. WebSockets establish a single, full-duplex persistent connection over `ws://localhost:5000/ws`, allowing the server to push telemetry updates and emergency hazard alerts to all connected clients with sub-50ms latency."*

### Q3: How does the AI Complaint Categorization and Priority Triage work?
> **Answer:** *"The system uses Natural Language Processing (NLP) text processing. It tokenizes and analyzes the grievance title and description against safety and operational keywords. If terms like 'fire', 'smoke', 'electric shock', or 'short circuit' are detected, it assigns Critical priority and routes the ticket to the Electrical or Safety department automatically."*

### Q4: Which microcontroller and sensors did you select, and why?
> **Answer:** *"We selected the ESP32 microcontroller due to its integrated Wi-Fi and dual-core 240MHz processor. We integrated:
> 1. **DHT22:** For digital ambient temperature and humidity.
> 2. **MQ-2:** For combustible gas and smoke concentration in PPM.
> 3. **HC-SR04:** Ultrasonic sensor measuring overhead water tank level.
> 4. **ACS712:** Hall-effect current sensor measuring campus block power draw."*

### Q5: How is user security and Role-Based Access Control (RBAC) handled?
> **Answer:** *"Passwords are encrypted using bcrypt with 10 salt rounds. Authentication uses JSON Web Tokens (JWT) signed with a secure secret. Express middleware validates the token on protected routes and verifies whether the user possesses the required role (Student, Faculty, Alumni, Admin)."*

### Q6: What happens if the external AI API (e.g. Gemini) is unreachable or offline?
> **Answer:** *"CampusNova AI implements a resilient dual-tier architecture. If the external Gemini API is unreachable, the system automatically falls back to an embedded deterministic NLP rule engine and campus knowledge base, guaranteeing 100% offline uptime and instant response."*

### Q7: How does the system compute examination eligibility?
> **Answer:** *"Attendance is tracked per class across all enrolled subjects. The formula $\text{Percentage} = (\text{Attended} / \text{Total}) \times 100$ is evaluated. If the cumulative percentage is $\ge 75\%$, the student is flagged as Exam Eligible. If between $65\% - 74\%$, a medical condonation alert is triggered."*

### Q8: What database architecture did you use and why?
> **Answer:** *"We implemented a structured JSON persistence database engine with atomic disk synchronization. It provides zero native C++ compilation overhead, seamless cross-platform compatibility, schema integrity, and instantaneous local startup for demonstration."*

### Q9: How does the virtual IoT simulator work during testing without hardware?
> **Answer:** *"The backend includes a telemetry simulator that generates realistic sensor fluctuations (e.g. $\pm 0.2^\circ\text{C}$, $\pm 0.3\text{ kW}$) and provides hazard injection triggers (`smoke_spike`, `water_low`, `temp_spike`) that dispatch genuine telemetry payloads into the ingestion pipeline just like a physical ESP32 node."*

### Q10: How can this project be scaled in a real-world university deployment?
> **Answer:** *"In production, the backend can be containerized with Docker, deployed behind an Nginx reverse proxy on AWS/DigitalOcean, with PostgreSQL for relational storage, Redis for WebSocket session clustering, and MQTT brokers (such as Mosquitto) for hundreds of distributed ESP32 nodes."*

---
*End of Viva Voce Guide.*
