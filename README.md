# OsteoSense

AI-assisted, sensor-enabled osteoarthritis (OA) screening and risk stratification platform for accessible frontline musculoskeletal healthcare.

---

## Architecture Overview

OsteoSense is a comprehensive medical pilot system comprising:
1. **Frontend Portal (Next.js 15, React 19, Tailwind CSS, Three.js)**:
   - Interactive 3D anatomical biomechanics & cine-loop showcases.
   - Clinical Community Health Worker (CHW) screening workflow.
   - Comprehensive patient management, risk analytics, and standardized referral report generator.
2. **Backend API (Spring Boot 3, Java 17)**:
   - RESTful endpoints for patient records, assessments, risk stratification scores, and multi-lingual voice synthesis.
3. **AI / ML Service (FastAPI, Python 3)**:
   - Osteoarthritis risk engine with XGBoost/Random Forest models trained on clinical datasets and bio-acoustic sensor telemetry.

---

## Getting Started

### 1. Frontend Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 2. Spring Boot Backend Server
```bash
mvn spring-boot:run
```
Runs at `http://localhost:8080`.

### 3. Python AI Engine
```bash
python app.py
```
Runs at `http://localhost:8001`.
