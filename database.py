"""
database.py

SQLite-backed patient record storage for Module 3.

Responsibilities:
- Create tables on first run (patients, assessments, outcomes)
- Register new patients
- Save assessments (inputs + Module 1 output)
- Record clinician-confirmed outcomes (for ML training labels)
- Retrieve patient history
- Search patients
- Export labeled training data for future ML model
"""

import sqlite3
import json
import os
import csv
from datetime import datetime

DB_PATH = "data/osteosense.db"


def get_connection():
    """Open a connection to the SQLite database."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables if they don't exist. Safe to call on every run."""
    conn = get_connection()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            patient_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            sex TEXT,
            location TEXT,
            created_at TEXT
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS assessments (
            assessment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            age INTEGER,
            bmi REAL,
            pain INTEGER,
            stiffness TEXT,
            stiffness_duration TEXT,
            tenderness INTEGER,
            reduced_flexibility INTEGER,
            crepitus INTEGER,
            swelling INTEGER,
            pain_after_activity INTEGER,
            pain_at_rest INTEGER,
            gives_way INTEGER,
            sleep_disturbance INTEGER,
            risk_score INTEGER,
            risk_level TEXT,
            progression_risk TEXT,
            recommendation TEXT,
            factors_json TEXT,
            red_flags_json TEXT,
            modifiable_json TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS outcomes (
            outcome_id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT NOT NULL,
            assessment_id INTEGER,
            confirmed_diagnosis TEXT,
            diagnosis_method TEXT,
            kl_grade INTEGER,
            diagnosis_date TEXT,
            clinician_notes TEXT,
            recorded_at TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
        )
    """)

    conn.commit()
    conn.close()
    print(f"Database ready: {DB_PATH}")


def register_patient(patient_id, name, age, sex, location):
    """Insert a new patient. Does nothing if patient_id already exists."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        INSERT OR IGNORE INTO patients
        (patient_id, name, age, sex, location, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (patient_id, name, age, sex, location, datetime.now().isoformat()))
    conn.commit()
    conn.close()


def save_assessment(patient_id, patient_dict, result_dict):
    """
    Save one assessment row.
    patient_dict: the 13 raw inputs
    result_dict:  the output of calculate_risk()
    """
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        INSERT INTO assessments (
            patient_id, timestamp,
            age, bmi, pain, stiffness, stiffness_duration,
            tenderness, reduced_flexibility, crepitus, swelling,
            pain_after_activity, pain_at_rest, gives_way, sleep_disturbance,
            risk_score, risk_level, progression_risk, recommendation,
            factors_json, red_flags_json, modifiable_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        patient_id,
        datetime.now().isoformat(),
        patient_dict.get("age"),
        patient_dict.get("bmi"),
        patient_dict.get("pain"),
        patient_dict.get("stiffness"),
        patient_dict.get("stiffness_duration"),
        int(bool(patient_dict.get("tenderness", False))),
        int(bool(patient_dict.get("reduced_flexibility", False))),
        int(bool(patient_dict.get("crepitus", False))),
        int(bool(patient_dict.get("swelling", False))),
        int(bool(patient_dict.get("pain_after_activity", False))),
        int(bool(patient_dict.get("pain_at_rest", False))),
        int(bool(patient_dict.get("gives_way", False))),
        int(bool(patient_dict.get("sleep_disturbance", False))),
        result_dict.get("risk_score"),
        result_dict.get("risk_level"),
        result_dict.get("progression_risk"),
        result_dict.get("recommendation"),
        json.dumps(result_dict.get("factors", [])),
        json.dumps(result_dict.get("red_flags", [])),
        json.dumps(result_dict.get("modifiable_factors", [])),
    ))
    conn.commit()
    conn.close()


def record_outcome(patient_id, confirmed_diagnosis,
                   diagnosis_method=None, kl_grade=None,
                   clinician_notes=None):
    # Verify patient exists before recording outcome
    if not get_patient(patient_id):
        print(f"Error: patient {patient_id} does not exist. Register the patient first.")
        return

    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        INSERT INTO outcomes
        (patient_id, confirmed_diagnosis, diagnosis_method,
         kl_grade, diagnosis_date, clinician_notes, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        patient_id,
        confirmed_diagnosis,
        diagnosis_method,
        kl_grade,
        datetime.now().isoformat(),
        clinician_notes,
        datetime.now().isoformat(),
    ))
    conn.commit()
    conn.close()


def export_training_data(output_path="data/training_data.csv"):
    """
    Join assessments with outcomes to produce a supervised dataset.
    Only rows WITH a confirmed outcome are exported.
    """
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT
            a.patient_id,
            a.timestamp,
            a.age, a.bmi, a.pain, a.stiffness, a.stiffness_duration,
            a.tenderness, a.reduced_flexibility, a.crepitus, a.swelling,
            a.pain_after_activity, a.pain_at_rest, a.gives_way, a.sleep_disturbance,
            a.risk_score, a.risk_level,
            o.confirmed_diagnosis, o.kl_grade, o.diagnosis_method
        FROM assessments a
        INNER JOIN outcomes o ON a.patient_id = o.patient_id
        WHERE o.confirmed_diagnosis IS NOT NULL
          AND o.confirmed_diagnosis != 'Unknown'
    """)
    rows = c.fetchall()
    conn.close()

    if not rows:
        print("No labeled data yet. Cannot export training data.")
        return None

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([k for k in rows[0].keys()])
        writer.writerows([list(r) for r in rows])

    print(f"Exported {len(rows)} labeled rows -> {output_path}")
    return output_path


def get_patient(patient_id):
    """Return one patient row, or None."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM patients WHERE patient_id = ?", (patient_id,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None


def get_assessments(patient_id):
    """Return all assessments for a patient, newest first."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT * FROM assessments
        WHERE patient_id = ?
        ORDER BY timestamp DESC
    """, (patient_id,))
    rows = c.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def search_patients(query):
    """Search patients by ID or name (partial match)."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT * FROM patients
        WHERE patient_id LIKE ? OR name LIKE ?
        ORDER BY created_at DESC
    """, (f"%{query}%", f"%{query}%"))
    rows = c.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def count_stats():
    """Return quick stats for the dashboard."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM patients")
    total_patients = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM assessments")
    total_assessments = c.fetchone()[0]
    c.execute("""
        SELECT risk_level, COUNT(*) FROM assessments
        GROUP BY risk_level
    """)
    by_level = dict(c.fetchall())
    conn.close()
    return {
        "total_patients": total_patients,
        "total_assessments": total_assessments,
        "by_risk_level": by_level,
    }


if __name__ == "__main__":
    init_db()
    print("Module 3 database initialized.")