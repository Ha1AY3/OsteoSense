"""
outcome_entry.py

Simple CLI for recording clinician-confirmed outcomes.
Used after a patient's follow-up visit.
"""

from database import record_outcome


def main():
    print("=== Record Confirmed Diagnosis ===")
    patient_id = input("Patient ID: ").strip()
    diagnosis = input("Diagnosis (OA / No OA / Inflammatory / Other): ").strip()
    method = input("Method (clinical / xray / mri / specialist): ").strip() or None
    kl_input = input("KL grade (0-4, leave blank if unknown): ").strip()
    kl = int(kl_input) if kl_input else None
    notes = input("Notes (optional): ").strip() or None

    record_outcome(
        patient_id=patient_id,
        confirmed_diagnosis=diagnosis,
        diagnosis_method=method,
        kl_grade=kl,
        clinician_notes=notes,
    )
    print(f"Outcome recorded for {patient_id}.")


if __name__ == "__main__":
    main()