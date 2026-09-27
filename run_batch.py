import csv
from collections import Counter
from oa_risk_engine import calculate_risk

INPUT = "data/dummy_patients.csv"
OUTPUT = "data/screening_results.csv"

FIELDS = [
    "patient_id", "age", "pain",
    "risk_score", "risk_level",
    "progression_risk", "recommendation"
]


def load_patients(path):
    with open(path) as f:
        return list(csv.DictReader(f))


def row_to_patient(row):
    return {
        "age": int(row["age"]),
        "bmi": float(row.get("bmi", 25.0)),
        "pain": int(row["pain"]),
        "stiffness": row["stiffness"],
        "stiffness_duration": row.get("stiffness_duration", "<30min"),
        "tenderness": row.get("tenderness", "False") == "True",
        "reduced_flexibility": row.get("reduced_flexibility", "False") == "True",
        "crepitus": row.get("crepitus", "False") == "True",
        "swelling": row.get("swelling", "False") == "True",
        "pain_after_activity": row.get("pain_after_activity", "False") == "True",
        "pain_at_rest": row.get("pain_at_rest", "False") == "True",
        "gives_way": row.get("gives_way", "False") == "True",
        "sleep_disturbance": row.get("sleep_disturbance", "False") == "True",
    }


def main():
    rows = load_patients(INPUT)
    results = []
    counter = Counter()

    for row in rows:
        patient = row_to_patient(row)
        r = calculate_risk(patient)
        counter[r["risk_level"]] += 1
        results.append({
            "patient_id": row["patient_id"],
            "age": row["age"],
            "pain": row["pain"],
            "risk_score": r["risk_score"],
            "risk_level": r["risk_level"],
            "progression_risk": r.get("progression_risk", "n/a"),
            "recommendation": r["recommendation"],
        })

    with open(OUTPUT, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(results)

    print(f"Screened {len(rows)} patients -> {OUTPUT}")
    print("\nRisk distribution:")
    for level in ["Lower Risk", "Moderate Risk", "Higher Risk", "Red Flag - Refer Urgently"]:
        count = counter.get(level, 0)
        if count > 0 or level != "Red Flag - Refer Urgently":
            print(f"  {level}: {count}")


if __name__ == "__main__":
    main()