"""
report.py

Generate a text-based screening report for a patient assessment.
"""

import json
from database import get_patient, get_assessments


def generate_text_report(patient_id, assessment_id=None):
    patient = get_patient(patient_id)
    if not patient:
        return f"No patient found with ID {patient_id}"

    assessments = get_assessments(patient_id)
    if not assessments:
        return f"No assessments found for patient {patient_id}"

    if assessment_id:
        a = next((x for x in assessments if x["assessment_id"] == assessment_id), None)
        if not a:
            return f"Assessment {assessment_id} not found"
    else:
        a = assessments[0]

    factors = json.loads(a["factors_json"] or "[]")
    red_flags = json.loads(a["red_flags_json"] or "[]")
    modifiable = json.loads(a["modifiable_json"] or "[]")

    lines = []
    lines.append("=" * 50)
    lines.append("         OSTEOSENSE SCREENING REPORT")
    lines.append("=" * 50)
    lines.append("")
    lines.append(f"Patient ID:   {patient['patient_id']}")
    lines.append(f"Name:         {patient['name']}")
    lines.append(f"Age:          {patient['age']}")
    lines.append(f"Sex:          {patient['sex']}")
    lines.append(f"Location:     {patient['location']}")
    lines.append(f"Assessment:   {a['timestamp'][:10]}")
    lines.append("")
    lines.append("-" * 50)
    lines.append("SYMPTOMS REPORTED")
    lines.append("-" * 50)
    lines.append(f"Pain:                 {a['pain']}/10")
    lines.append(f"Stiffness:            {a['stiffness']}")
    lines.append(f"Stiffness duration:   {a['stiffness_duration']}")
    lines.append(f"Tenderness:           {'Yes' if a['tenderness'] else 'No'}")
    lines.append(f"Reduced flexibility:  {'Yes' if a['reduced_flexibility'] else 'No'}")
    lines.append(f"Crepitus:             {'Yes' if a['crepitus'] else 'No'}")
    lines.append(f"Swelling:             {'Yes' if a['swelling'] else 'No'}")
    lines.append(f"Pain after activity:  {'Yes' if a['pain_after_activity'] else 'No'}")
    lines.append(f"Pain at rest:         {'Yes' if a['pain_at_rest'] else 'No'}")
    lines.append(f"Gives way:            {'Yes' if a['gives_way'] else 'No'}")
    lines.append(f"Sleep disturbance:    {'Yes' if a['sleep_disturbance'] else 'No'}")
    lines.append("")
    lines.append("-" * 50)
    lines.append("SCREENING RESULT")
    lines.append("-" * 50)
    lines.append(f"Risk Score:           {a['risk_score']}/100")
    lines.append(f"Risk Level:           {a['risk_level']}")
    lines.append(f"Progression Risk:     {a['progression_risk']}")
    lines.append("")

    if red_flags:
        lines.append("-" * 50)
        lines.append("RED FLAGS")
        lines.append("-" * 50)
        for flag in red_flags:
            lines.append(f"  ! {flag}")
        lines.append("")

    if factors:
        lines.append("-" * 50)
        lines.append("CONTRIBUTING FACTORS")
        lines.append("-" * 50)
        for f in factors:
            lines.append(f"  - {f}")
        lines.append("")

    if modifiable:
        lines.append("-" * 50)
        lines.append("MODIFIABLE FACTORS")
        lines.append("-" * 50)
        for m in modifiable:
            lines.append(f"  - {m}")
        lines.append("")

    lines.append("-" * 50)
    lines.append("RECOMMENDATION")
    lines.append("-" * 50)
    lines.append(a["recommendation"])
    lines.append("")
    lines.append("=" * 50)
    lines.append("AI-assisted screening prototype.")
    lines.append("Not a definitive clinical diagnosis.")
    lines.append("=" * 50)

    return "\n".join(lines)


def save_text_report(patient_id, assessment_id=None,
                     output_path="data/last_report.txt"):
    text = generate_text_report(patient_id, assessment_id)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)
    return output_path


if __name__ == "__main__":
    print(generate_text_report("OA-001"))