# OsteoSense — Frontend ↔ Backend API Map

> **Generated**: 2026-09-25
> **Backend location**: `OsteoSense/`
> **Backend architecture**: Two servers — Python FastAPI (Module 1, port 8001) + Java Spring Boot (Module 2, port 8080)

---

## Architecture Overview

```
┌──────────────────┐      ┌──────────────────────┐      ┌─────────────────────┐
│   Next.js        │      │  Spring Boot (8080)   │      │  FastAPI (8001)     │
│   Frontend       │─────▶│  /api/assessments/*   │─────▶│  /calculate_risk    │
│   (port 3000)    │      │  H2 in-memory DB      │      │  Rule-based engine  │
└──────────────────┘      └──────────────────────┘      └─────────────────────┘
                                                               │
                                                         ┌─────▼─────┐
                                                         │ SQLite DB │
                                                         │ (Module 3)│
                                                         └───────────┘
```

**Important**: The frontend talks **only** to Spring Boot (port 8080). Spring Boot internally calls FastAPI (port 8001) for risk calculation. The Python SQLite database (`database.py`) is a separate Module 3 storage layer used by Python CLI scripts — not exposed via HTTP.

---

## Endpoint Map

### Spring Boot REST API (Port 8080) — Primary Frontend API

| # | Endpoint | Method | Request Body | Response Body | Auth | Status | Frontend Screen |
|---|----------|--------|-------------|---------------|------|--------|----------------|
| 1 | `POST /api/assessments` | POST | `Assessment` JSON (see schema below) | `Assessment` with AI results populated | None | ✅ Fully implemented | Symptom Assessment → Submit |
| 2 | `GET /api/assessments` | GET | — | `Assessment[]` | None | ✅ Fully implemented | Dashboard (recent), Assessments list |
| 3 | `GET /api/assessments/{id}` | GET | — | `Assessment` or 404 | None | ✅ Fully implemented | Assessment detail view |
| 4 | `GET /api/assessments/patient/{patientId}` | GET | — | `Assessment[]` | None | ✅ Fully implemented | Patient Record (history) |
| 5 | `GET /api/assessments/high-risk` | GET | — | `Assessment[]` (Higher Risk only) | None | ✅ Fully implemented | Dashboard analytics |
| 6 | `GET /api/assessments/stats` | GET | — | `{ totalScreenings, highRiskCases, moderateRisk, lowerRisk }` | None | ✅ Fully implemented | Dashboard stats cards |
| 7 | `GET /api/assessments/health` | GET | — | `"Module 2 is running! ✅"` | None | ✅ Fully implemented | Connectivity check |

### FastAPI AI Server (Port 8001) — Called by Spring Boot internally

| # | Endpoint | Method | Request Body | Response Body | Auth | Status | Frontend Screen |
|---|----------|--------|-------------|---------------|------|--------|----------------|
| 8 | `POST /calculate_risk` | POST | `PatientData` (see schema) | `RiskResult` (see schema) | None | ✅ Fully implemented | Not called directly by frontend |

---

## Request/Response Schemas

### Assessment (Spring Boot — POST /api/assessments)

**Request Body** (JSON sent by frontend):
```typescript
interface AssessmentRequest {
  patientId: string;         // e.g. "P1024"
  patientName: string;       // e.g. "Rajesh Kumar"
  age: number;               // 0-120
  gender: string;            // "Male" | "Female" | "Other"
  bmi: number;               // 15.0-50.0
  pain: number;              // 0-10 (severity scale)
  stiffness: string;         // "Mild" | "Moderate" | "Severe"
  stiffnessDuration: string; // "<30min" | ">=30min"
  tenderness: boolean;
  reducedFlexibility: boolean;
  crepitus: boolean;
  swelling: boolean;
  painAfterActivity: boolean;
  painAtRest: boolean;
  walkingDifficulty: boolean;   // Extra field in Java model (not sent to AI)
  stairDifficulty: boolean;     // Extra field in Java model (not sent to AI)
  mobilityLimitation: boolean;  // Extra field in Java model (not sent to AI)
  givesWay: boolean;
  sleepDisturbance: boolean;
}
```

**Response Body** (JSON returned after AI processing):
```typescript
interface AssessmentResponse {
  id: number;                // Auto-generated
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  bmi: number;
  pain: number;
  stiffness: string;
  stiffnessDuration: string;
  tenderness: boolean;
  reducedFlexibility: boolean;
  crepitus: boolean;
  swelling: boolean;
  painAfterActivity: boolean;
  painAtRest: boolean;
  walkingDifficulty: boolean;
  stairDifficulty: boolean;
  mobilityLimitation: boolean;
  givesWay: boolean;
  sleepDisturbance: boolean;
  // --- AI-populated fields ---
  riskScore: number | null;     // 0-100
  riskLevel: string | null;     // "Lower Risk" | "Moderate Risk" | "Higher Risk" | "Red Flag - Refer Urgently"
  factors: string | null;       // Comma-separated string (NOT array)
  recommendation: string | null;
  assessmentDate: string | null; // "yyyy-MM-dd HH:mm:ss"
}
```

### Stats Response (GET /api/assessments/stats)
```typescript
interface StatsResponse {
  totalScreenings: number;
  highRiskCases: number;
  moderateRisk: number;
  lowerRisk: number;
}
```

### PatientData (FastAPI — internal, for reference)
```typescript
interface PatientData {
  age: number;
  pain: number;
  stiffness: string;           // "Mild" | "Moderate" | "Severe"
  stiffness_duration: string;  // "<30min" | ">=30min"
  tenderness: boolean;
  reduced_flexibility: boolean;
  crepitus: boolean;
  swelling: boolean;
  pain_after_activity: boolean;
  pain_at_rest: boolean;
  gives_way: boolean;
  sleep_disturbance: boolean;
  bmi: number;
}
```

### RiskResult (FastAPI — internal, for reference)
```typescript
interface RiskResult {
  risk_score: number;           // 0-100
  risk_level: string;           // "Lower Risk" | "Moderate Risk" | "Higher Risk" | "Red Flag - Refer Urgently"
  factors: string[];
  red_flags: string[];
  progression_risk: string;
  modifiable_factors: string[];
  recommendation: string;
}
```

---

## What Exists vs What's Missing

### ✅ EXISTS in Backend
| Feature | Location | Notes |
|---------|----------|-------|
| Assessment CRUD | Spring Boot `/api/assessments` | Full create/read |
| AI Risk Calculation | FastAPI `/calculate_risk` | Rule-based, works |
| Dashboard Stats | `GET /api/assessments/stats` | Counts only |
| High-Risk Filtering | `GET /api/assessments/high-risk` | Works |
| Patient History by ID | `GET /api/assessments/patient/{id}` | Works |
| Health Check | `GET /api/assessments/health` | Works |

### ❌ MISSING — No Backend API Exists
| Feature | Required by Frontend Screen | Workaround |
|---------|---------------------------|------------|
| **Authentication / Login** | Login Screen | No auth API exists. Use dev-safe bypass. |
| **Patient Registration API** | Patient Registration | No separate patient CRUD in Spring Boot. Patient info is embedded in Assessment. |
| **Patient List / Search API** | Patients list, search | No patient list endpoint. Can derive unique patients from `GET /api/assessments`. |
| **Patient Count** | Dashboard | No patient count. Stats only has `totalScreenings`. |
| **Report Generation API** | Report Screen | `report.py` is a Python CLI module, not exposed via HTTP. Frontend must generate reports client-side. |
| **Sensor Status API** | Sensor Assessment | No sensor hardware integration exists. |
| **Offline Sync API** | Offline Mode | No sync endpoint exists. |
| **Language/Translation API** | Language Selector | No i18n backend. Frontend-only concern. |
| **User Profile / Settings** | Settings | No user management. |

### ⚠️ IMPORTANT SCHEMA NOTES
1. **`factors` field discrepancy**: FastAPI returns `factors` as `string[]` (array). Spring Boot stores and returns it as a comma-separated `string`. Frontend must split on `, ` to display as list.
2. **`red_flags`, `progression_risk`, `modifiable_factors`**: These fields exist in FastAPI's response but are **NOT** captured by the Spring Boot `Assessment` model or `AIRiskResponse` model. They are lost in the Module1Client → Assessment mapping.
3. **Patient data is NOT separate**: Spring Boot has no `Patient` entity — patient info (`patientId`, `patientName`, `age`, `gender`) is stored inline within each `Assessment` record.
4. **H2 in-memory database**: Spring Boot uses `ddl-auto=create`. All data is lost on server restart.
5. **No CORS on FastAPI**: Not relevant since frontend doesn't call FastAPI directly.
6. **Assessment Java model has extra fields** not in the Python schema: `walkingDifficulty`, `stairDifficulty`, `mobilityLimitation`, `patientName`, `gender`. These are stored but not sent to the AI engine.

---

## Frontend Screen → API Mapping

| Screen | API Calls | Notes |
|--------|-----------|-------|
| **Login** | `GET /api/assessments/health` | Connection check only. No auth API. |
| **Dashboard** | `GET /api/assessments/stats`, `GET /api/assessments` (recent) | Derive patient count from unique patientIds. |
| **Patient Registration** | None (data collected in memory) | Patient info submitted as part of assessment. |
| **Symptom Assessment** | None (form state) | Collect all questionnaire fields in form state. |
| **Sensor Assessment** | None | No sensor API. Show placeholder UI. |
| **AI Analysis** | `POST /api/assessments` | Submit full assessment. Show loading during POST. |
| **Risk Result** | Response from POST above | Display riskScore, riskLevel, factors, recommendation. |
| **Patient Record** | `GET /api/assessments/patient/{patientId}` | List all assessments for patient. |
| **Report** | `GET /api/assessments/{id}` | Fetch assessment data, generate PDF client-side. |
| **Offline Mode** | All endpoints | Architecture only — no sync API. |
