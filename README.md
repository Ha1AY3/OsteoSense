<div align="center">

# OsteoSense

### AI-assisted, sensor-enabled osteoarthritis screening and risk stratification

<br />

**Accessible frontline musculoskeletal healthcare for community health workers**

<br />

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python%203-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

</div>

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Data Flow](#data-flow)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Current Prototype](#current-prototype)
- [Planned Development](#planned-development)
- [Safety and Clinical Scope](#safety-and-clinical-scope)
- [Roadmap](#roadmap)
---

## Overview

OsteoSense is a medical pilot platform for community-level osteoarthritis (OA) screening. It combines a structured clinical questionnaire, bio-acoustic and movement sensor telemetry, and machine-learning risk stratification into a single offline-capable workflow designed for community health workers (CHWs) operating at the frontline.

The system is intended for **preliminary screening and referral support** — not as a replacement for clinical diagnosis.

### Core Capabilities

| Capability | Description |
|------------|-------------|
| **CHW Screening Workflow** | Guided multi-step assessment from patient registration through risk stratification |
| **3D Anatomical Visualisation** | Interactive biomechanics and cine-loop showcases built with Three.js |
| **Risk Analytics** | Population-level and per-patient risk dashboards |
| **Automated Referral Reports** | Standardised, clinician-ready PDF output |
| **Multi-lingual Voice Synthesis** | Accessible output for low-literacy and regional-language settings |
| **Bio-acoustic + Sensor Telemetry** | Signal ingestion feeding the ML risk engine |

---

## System Architecture

OsteoSense is composed of three independently deployable services.

```mermaid
flowchart TB

    subgraph FE["FRONTEND PORTAL"]
        direction TB

        FSTACK["Next.js 15 · React 19 · Tailwind · Three.js"]

        subgraph FM["Application Modules"]
            direction LR
            SCREEN["CHW Screening Workflow"]
            VIZ["3D Anatomical Visualisation"]
            ANALYTICS["Analytics & Report Generator"]
        end

        FSTACK --> FM
    end

    subgraph BE["BACKEND API"]
        direction TB

        BSTACK["Spring Boot 3 · Java 17"]

        subgraph BM["Backend Services"]
            direction LR
            PATIENT["Patient Records"]
            ASSESS["Assessment Orchestration"]
            VOICE["Voice Synthesis"]
        end

        BSTACK --> BM
    end

    subgraph AI["AI / ML SERVICE :8001"]
        direction TB

        ASTACK["FastAPI · Python 3"]

        subgraph RISK["OA Risk Engine"]
            direction TB
            DATA["Clinical + Bio-acoustic Data"]
            MODEL["XGBoost / Random Forest"]

            DATA --> MODEL
        end

        ASTACK --> RISK
    end

    DB[("SQLite / Local Persistent Storage")]

    FM -->|"REST / JSON"| BM
    ASSESS -->|"REST / JSON"| AI
    BM --> DB
    AI --> DB
```


### Service Responsibilities

| Service | Stack | Port | Role |
|---------|-------|------|------|
| **Frontend Portal** | Next.js 15, React 19, Tailwind, Three.js | `3000` | CHW workflow, 3D visualisation, analytics, reporting |
| **Backend API** | Spring Boot 3, Java 17 | `8080` | Patient records, assessment orchestration, risk scores, voice synthesis |
| **AI / ML Service** | FastAPI, Python 3 | `8001` | OA risk engine (XGBoost / Random Forest) |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | Next.js 15 (App Router), React 19 |
| **Styling** | Tailwind CSS |
| **3D / Visualisation** | Three.js, React Three Fiber |
| **Backend Framework** | Spring Boot 3 |
| **Backend Language** | Java 17 |
| **AI Service** | FastAPI, Python 3 |
| **ML Models** | XGBoost, Random Forest |
| **Database** | SQLite (local persistent storage) |
| **Sensor Telemetry** | Bio-acoustic sensors, movement sensors |
| **Voice Synthesis** | Multi-lingual TTS (backend-integrated) |

---

## Repository Structure
<h2>Project Structure</h2>

<pre>
osteosense/
│
├── README.md
├── Contract.md
├── AGENTS.md / CLAUDE.md
│
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   │
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── dashboard/
│       │   └── page.tsx
│       │
│       ├── patients/
│       │   ├── page.tsx
│       │   └── [patientId]/
│       │       └── page.tsx
│       │
│       ├── assessments/
│       │   ├── page.tsx
│       │   ├── new/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       ├── page.tsx
│       │       └── report/
│       │           └── page.tsx
│       │
│       ├── analytics/
│       │   └── page.tsx
│       ├── reports/
│       │   └── page.tsx
│       └── settings/
│           └── page.tsx
│
├── components/
│   ├── 3d/
│   ├── canvas/
│   ├── assessment/
│   ├── dashboard/
│   ├── layout/
│   ├── providers/
│   ├── report/
│   └── ui/
│
├── hooks/
│   ├── use-patients.ts
│   ├── use-assessments.ts
│   └── use-connectivity.ts
│
├── lib/
│   ├── utils.ts
│   ├── api/
│   │   ├── client.ts
│   │   └── assessments.ts
│   └── i18n/
│       └── translations.ts
│
├── types/
│   └── index.ts
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/sih/module2/
│       │       ├── Module2Application.java
│       │       ├── controller/
│       │       │   └── AssessmentController.java
│       │       ├── service/
│       │       │   ├── AssessmentService.java
│       │       │   └── Module1Client.java
│       │       ├── repository/
│       │       │   └── AssessmentRepository.java
│       │       └── model/
│       │           ├── Assessment.java
│       │           └── AIRiskResponse.java
│       │
│       └── resources/
│           └── application.properties
│
├── app.py
├── feature_extractor.py
├── oa_risk_engine.py
├── database.py
├── outcome_entry.py
├── report.py
├── run_batch.py
├── synthetic_dataset.py
│
├── test_database.py
├── test_database_full.py
├── test_risk.py
│
├── module5/
│   ├── upload_data.py
│   └── dummy_patients.csv
│
├── docs/
│   └── FRONTEND_BACKEND_MAP.md
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── pom.xml
</pre>

---

## Data Flow

```mermaid
flowchart TB

    PATIENT["Patient"]

    REG["CHW Registration<br/>(Next.js UI)"]

    CLINICAL["Clinical<br/>Questionnaire"]

    SENSOR["Sensor Telemetry<br/>Bio-acoustic + Movement"]

    API["Backend API<br/>(Spring Boot :8080)"]

    AI["AI / ML Service<br/>(FastAPI :8001)<br/>XGBoost / Random Forest"]

    RISK["Preliminary OA Risk<br/>Score + Stratification"]

    DB[("SQLite Persistence")]

    REPORT["Referral Report<br/>(PDF / Digital)"]

    EVAL["Further Clinical<br/>Evaluation"]


    PATIENT --> REG

    REG --> CLINICAL
    REG --> SENSOR

    SENSOR --> CLINICAL

    CLINICAL --> API
    SENSOR --> API

    API --> AI
    AI --> RISK
    RISK --> DB
    DB --> REPORT
    REPORT --> EVAL


    classDef patient fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    classDef frontend fill:#172554,stroke:#60a5fa,stroke-width:2px,color:#f8fafc
    classDef input fill:#1e293b,stroke:#64748b,stroke-width:1.5px,color:#f8fafc
    classDef backend fill:#312e81,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    classDef ai fill:#1e3a5f,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    classDef result fill:#164e63,stroke:#22d3ee,stroke-width:2px,color:#f8fafc
    classDef database fill:#1f2937,stroke:#a78bfa,stroke-width:2px,color:#f8fafc
    classDef report fill:#374151,stroke:#94a3b8,stroke-width:2px,color:#f8fafc
    classDef evaluation fill:#14532d,stroke:#4ade80,stroke-width:2px,color:#f8fafc


    class PATIENT patient
    class REG frontend
    class CLINICAL,SENSOR input
    class API backend
    class AI ai
    class RISK result
    class DB database
    class REPORT report
    class EVAL evaluation
```

<hr />

<h2>Getting Started</h2>

<p>
  Follow the steps below to run the OsteoSense frontend, backend API,
  and AI/ML service locally.
</p>

<h3>Prerequisites</h3>

<p>Make sure the following are installed:</p>

<ul>
  <li><strong>Node.js</strong> 18+ and npm</li>
  <li><strong>Java</strong> 17+ and Maven</li>
  <li><strong>Python</strong> 3.10+</li>
</ul>

<h3>1. Frontend Development Server</h3>

<p>Install the frontend dependencies:</p>

<pre><code>npm install</code></pre>

<p>Start the Next.js development server:</p>

<pre><code>npm run dev</code></pre>

<p>
  The frontend will be available at:
  <a href="http://localhost:3000">
    <code>http://localhost:3000</code>
  </a>
</p>

<h3>2. Spring Boot Backend Server</h3>

<p>Start the backend using Maven:</p>

<pre><code>mvn spring-boot:run</code></pre>

<p>
  The backend API will be available at:
  <a href="http://localhost:8080">
    <code>http://localhost:8080</code>
  </a>
</p>

<h3>3. Python AI Engine</h3>

<p>Start the FastAPI AI/ML service:</p>

<pre><code>python app.py</code></pre>

<p>
  The AI service will be available at:
  <a href="http://localhost:8001">
    <code>http://localhost:8001</code>
  </a>
</p>

<blockquote>
  <strong>Important:</strong>
  The AI service on port <code>8001</code> must be running before the
  backend processes assessment requests that require OA risk
  stratification.
</blockquote>

---

## Configuration

OsteoSense uses separate configuration points for the frontend, Spring Boot backend, and AI/ML service.

| **File** | **Purpose** |
| --- | --- |
| `src/main/resources/application.properties` | Spring Boot backend configuration |
| `lib/api/client.ts` | Frontend API client and backend base URL |
| `.env.local` | Frontend environment variables |
| `oa_risk_engine.py` | ML model loading and inference configuration |

Keep environment-specific credentials, API keys, and other secrets outside the source-controlled codebase.

---

## Current Prototype

The current prototype provides an end-to-end screening workflow covering patient registration, structured assessment, sensor telemetry ingestion, AI-assisted risk stratification, and referral support.

### Implemented

| **Capability** | **Description** |
| --- | --- |
| **CHW Screening Workflow** | Next.js clinician portal with a multi-step assessment workflow |
| **3D Visualisation** | Interactive anatomical biomechanics visualisation using Three.js |
| **Backend API** | Spring Boot REST API for patient and assessment operations |
| **AI / ML Service** | FastAPI service providing the OA risk engine |
| **Risk Modelling** | XGBoost and Random Forest based risk estimation |
| **Persistence** | SQLite-based local persistent storage |
| **Referral Reports** | Structured referral report generation |
| **Voice Synthesis** | Multi-lingual voice synthesis endpoint |
| **Sensor Telemetry** | Bio-acoustic and movement sensor telemetry ingestion |

---

## Planned Development

The following capabilities are planned or currently in progress as OsteoSense evolves toward broader validation and deployment.

| **Planned Capability** | **Purpose** | **Status** |
| --- | --- | --- |
| **Bio-acoustic ML Integration** | Integrate real bio-acoustic sensor features directly into the ML inference pipeline | In Progress |
| **Sensor Fusion** | Combine clinical, acoustic, movement, and other sensor features | Planned |
| **Camera-based Movement Analysis** | Expand movement-derived feature extraction | Planned |
| **Multi-lingual Coverage** | Expand language support for frontline CHW deployments | Planned |
| **Offline Synchronisation** | Support distributed deployments with intermittent connectivity | Planned |
| **Automated PDF Export** | Generate downloadable and shareable referral reports | Planned |
| **Clinical Validation** | Validate the ML model using appropriately labelled clinical data | Planned |
| **Field Testing** | Evaluate usability and workflow performance with community health workers | Planned |

---

## Safety and Clinical Scope

**OsteoSense is a screening and decision-support tool.**

OsteoSense is designed to support community health workers by providing structured assessment information and preliminary osteoarthritis risk stratification.

OsteoSense does **not**:

- Confirm an osteoarthritis diagnosis
- Replace a physician or qualified clinical assessment
- Replace radiological or other diagnostic examinations
- Prescribe treatment
- Independently determine a patient's clinical condition

The system provides preliminary screening information intended to help identify individuals who may require further professional evaluation.

**Final diagnosis and clinical decisions remain the responsibility of qualified healthcare professionals.**

---

## Roadmap

```mermaid
flowchart LR

    P1["Phase 1<br/>CHW Questionnaire &<br/>Clinician UI"]
    P2["Phase 2<br/>3D Anatomical<br/>Visualisation"]
    P3["Phase 3<br/>Spring Boot Backend<br/>& REST API"]
    P4["Phase 4<br/>FastAPI AI Service<br/>& Risk Engine"]
    P5["Phase 5<br/>Sensor Telemetry<br/>Integration"]
    P6["Phase 6<br/>ML Model Validation<br/>with Clinical Data"]
    P7["Phase 7<br/>Field Testing<br/>with CHWs"]
    P8["Phase 8<br/>Regulatory &<br/>Compliance Review"]

    P1 --> P2 --> P3 --> P4 --> P5 --> P6 --> P7 --> P8

    classDef complete fill:#14532d,stroke:#4ade80,stroke-width:2px,color:#f8fafc
    classDef progress fill:#713f12,stroke:#facc15,stroke-width:2px,color:#f8fafc
    classDef planned fill:#1e293b,stroke:#64748b,stroke-width:2px,color:#f8fafc

    class P1,P2,P3,P4 complete
    class P5 progress
    class P6,P7,P8 planned
```

---

<div align="center">

## OsteoSense

**AI-assisted screening for accessible frontline musculoskeletal healthcare.**

<sub>
OsteoSense is a prototype and is not intended to replace professional
medical diagnosis, clinical judgement, or treatment decisions.
</sub>

</div>
