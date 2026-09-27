"""
test_database_full.py

End-to-end test of Module 3 database.
"""

import os
from database import (
    init_db, register_patient, save_assessment,
    get_patient, get_assessments, search_patients,
    record_outcome, export_training_data, count_stats,
    DB_PATH, get_connection
)
from oa_risk_engine import calculate_risk


def section(title):
    print(f"\n{'=' * 55}")
    print(f"  {title}")
    print(f"{'=' * 55}")


# --- 0. Fresh start ---
section("0. Fresh database")
if os.path.exists(DB_PATH):
    os.remove(DB_PATH)
    print(f"Removed old database: {DB_PATH}")
init_db()


# --- 1. Register two patients ---
section("1. Register patients")
register_patient("OA-001", "Rahul Kumar", 56, "Male", "Assam")
register_patient("OA-002", "Priya Sharma", 62, "Female", "Meghalaya")
print("Registered: OA-001 (Rahul), OA-002 (Priya)")


# --- 2. Save assessments ---
section("2. Save assessments")

patient1_v1 = {
    "age": 56, "bmi": 28.0,
    "pain": 4, "stiffness": "Moderate", "stiffness_duration": "<30min",
    "tenderness": True, "reduced_flexibility": False,
    "crepitus": False, "swelling": False,
    "pain_after_activity": True, "pain_at_rest": False,
    "gives_way": False, "sleep_disturbance": False,
}

patient1_v2 = {
    "age": 56, "bmi": 29.5,
    "pain": 7, "stiffness": "Severe", "stiffness_duration": ">=30min",
    "tenderness": True, "reduced_flexibility": True,
    "crepitus": True, "swelling": True,
    "pain_after_activity": True, "pain_at_rest": True,
    "gives_way": False, "sleep_disturbance": True,
}

patient2_v1 = {
    "age": 62, "bmi": 31.0,
    "pain": 6, "stiffness": "Moderate", "stiffness_duration": ">=30min",
    "tenderness": True, "reduced_flexibility": True,
    "crepitus": False, "swelling": False,
    "pain_after_activity": True, "pain_at_rest": False,
    "gives_way": False, "sleep_disturbance": False,
}

for pid, p in [
    ("OA-001", patient1_v1),
    ("OA-001", patient1_v2),
    ("OA-002", patient2_v1),
]:
    result = calculate_risk(p)
    save_assessment(pid, p, result)
    print(f"Saved {pid}: score={result['risk_score']} level={result['risk_level']}")


# --- 3. Patient lookup ---
section("3. Get patient OA-001")
p = get_patient("OA-001")
print(p)


# --- 4. Assessment history ---
section("4. Assessment history for OA-001")
history = get_assessments("OA-001")
for h in history:
    print(f"  {h['timestamp'][:19]}  pain={h['pain']}  score={h['risk_score']}  {h['risk_level']}")


# --- 5. Search ---
section("5. Search for 'Priya'")
results = search_patients("Priya")
for r in results:
    print(f"  {r['patient_id']}: {r['name']}")


# --- 6. Record valid outcome ---
section("6. Record outcome for OA-001 (valid)")
record_outcome("OA-001", "OA", "xray", 2, "KL grade 2 confirmed")


# --- 7. Record invalid outcome ---
section("7. Record outcome for OA-999 (invalid — should be rejected)")
record_outcome("OA-999", "OA", "xray", 2, "Should not be saved")


# --- 8. Stats ---
section("8. Database statistics")
stats = count_stats()
print(stats)


# --- 9. Export training data ---
section("9. Export training data")
export_training_data()


# --- 10. Verify counts ---
section("10. Final verification")
conn = get_connection()
c = conn.cursor()
c.execute("SELECT COUNT(*) FROM patients")
n_patients = c.fetchone()[0]
c.execute("SELECT COUNT(*) FROM assessments")
n_assessments = c.fetchone()[0]
c.execute("SELECT COUNT(*) FROM outcomes")
n_outcomes = c.fetchone()[0]
conn.close()

print(f"  Patients:    {n_patients}  (expected 2)")
print(f"  Assessments: {n_assessments}  (expected 3)")
print(f"  Outcomes:    {n_outcomes}  (expected 1)")

if n_patients == 2 and n_assessments == 3 and n_outcomes == 1:
    print("\n  ALL CHECKS PASSED")
else:
    print("\n  SOMETHING IS WRONG — counts don't match")