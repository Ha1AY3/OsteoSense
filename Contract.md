# OsteoSense — Interface Contracts

## Module 1 → OA Risk Engine
**File:** `oa_risk_engine.py`

### Input (patient dict)
```python
{
    "age": int,                    # 0-120
    "bmi": float,                  # 15.0-50.0
    "pain": int,                   # 0-10
    "stiffness": str,              # "Mild" | "Moderate" | "Severe"
    "stiffness_duration": str,     # "<30min" | ">=30min"
    "tenderness": bool,
    "reduced_flexibility": bool,
    "crepitus": bool,
    "swelling": bool,
    "pain_after_activity": bool,
    "pain_at_rest": bool,
    "gives_way": bool,
    "sleep_disturbance": bool
}

Output (result dict)
{
    "risk_score": int,             # 0-100
    "risk_level": str,             # "Lower Risk" | "Moderate Risk" | "Higher Risk" | "Red Flag - Refer Urgently"
    "factors": list[str],
    "red_flags": list[str],
    "progression_risk": str,
    "modifiable_factors": list[str],
    "recommendation": str
}

Module 3 → Patient Records
File: database.py

from database import (
    init_db,              # call once at startup
    register_patient,     # register new patient
    save_assessment,      # save screening result
    get_patient,          # fetch one patient
    get_assessments,      # fetch all assessments for a patient
    search_patients,      # search by ID or name
    record_outcome,       # record clinician-confirmed diagnosis
    export_training_data, # export labeled CSV for ML
    count_stats           # dashboard stats
)


Function signatures
python
init_db()

register_patient(patient_id: str, name: str, age: int,
                 sex: str, location: str)

save_assessment(patient_id: str,
                patient_dict: dict,     # same 13-field input dict
                result_dict: dict)      # same output dict from calculate_risk()

get_patient(patient_id: str) -> dict | None

get_assessments(patient_id: str) -> list[dict]

search_patients(query: str) -> list[dict]

record_outcome(patient_id: str, confirmed_diagnosis: str,
               diagnosis_method: str = None,
               kl_grade: int = None,
               clinician_notes: str = None)

export_training_data(output_path: str = "data/training_data.csv")

count_stats() -> {
    "total_patients": int,
    "total_assessments": int,
    "by_risk_level": dict
}
Database location
data/osteosense.db (SQLite)


Module 4 → Report Generation
File: report.py

python
from report import generate_text_report, save_text_report

generate_text_report(patient_id: str, assessment_id: int = None) -> str
save_text_report(patient_id: str, assessment_id: int = None,
                 output_path: str = "data/last_report.txt") -> str


Integration flow for Module 2 (UI)


from database import init_db, register_patient, save_assessment
from oa_risk_engine import calculate_risk

init_db()

# When health worker submits the form:
patient = { ...13 fields from UI... }
result = calculate_risk(patient)
save_assessment(patient_id, patient, result)

# Then display result to the health worker
