"""
synthetic_dataset.py

Generates synthetic OA screening data for the demo.

IMPORTANT:
- This is SYNTHETIC data. Not real patient data.
- Not clinically validated.
- For demo and pipeline testing only.
"""

import csv
import random
import os
from datetime import datetime, timedelta

random.seed(42)


def generate_patient():
    age = int(random.triangular(28, 88, 58))

    if age >= 65:
        pain = random.choice([4, 5, 5, 6, 6, 7, 7, 8, 9])
    elif age >= 50:
        pain = random.choice([2, 3, 4, 5, 5, 6, 7])
    else:
        pain = random.choice([0, 1, 2, 2, 3, 4])

    if pain >= 7:
        stiffness = random.choice(["Severe", "Severe", "Moderate"])
        stiffness_duration = random.choices(
            ["<30min", ">=30min"], weights=[0.3, 0.7]
        )[0]
    elif pain >= 4:
        stiffness = random.choice(["Moderate", "Moderate", "Mild", "Severe"])
        stiffness_duration = random.choices(
            ["<30min", ">=30min"], weights=[0.6, 0.4]
        )[0]
    else:
        stiffness = random.choice(["Mild", "Mild", "Moderate"])
        stiffness_duration = random.choices(
            ["<30min", ">=30min"], weights=[0.85, 0.15]
        )[0]

    def p(base):
        return min(0.95, base * (pain / 10 + 0.3))

    tenderness = random.random() < p(0.7)
    reduced_flexibility = random.random() < p(0.65)
    crepitus = random.random() < p(0.55)
    swelling = random.random() < p(0.40)
    pain_after_activity = random.random() < p(0.80)
    pain_at_rest = random.random() < p(0.30)
    gives_way = random.random() < p(0.25)
    sleep_disturbance = random.random() < p(0.35)

    bmi = round(random.gauss(27, 5), 1)
    bmi = max(17.0, min(45.0, bmi))

    return {
        "age": age,
        "pain": pain,
        "stiffness": stiffness,
        "stiffness_duration": stiffness_duration,
        "tenderness": tenderness,
        "reduced_flexibility": reduced_flexibility,
        "crepitus": crepitus,
        "swelling": swelling,
        "pain_after_activity": pain_after_activity,
        "pain_at_rest": pain_at_rest,
        "gives_way": gives_way,
        "sleep_disturbance": sleep_disturbance,
        "bmi": bmi,
    }


def generate_dataset(n=200, output_path="data/dummy_patients.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    patients = []
    for i in range(n):
        p = generate_patient()
        p["patient_id"] = f"OA-{i+1:04d}"
        days_ago = random.randint(0, 180)
        p["date"] = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        patients.append(p)

    fieldnames = [
        "patient_id", "date",
        "age", "pain", "stiffness", "stiffness_duration",
        "tenderness", "reduced_flexibility", "crepitus", "swelling",
        "pain_after_activity", "pain_at_rest", "gives_way",
        "sleep_disturbance", "bmi",
    ]

    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in patients:
            writer.writerow({k: row[k] for k in fieldnames})

    print(f"Generated {n} synthetic patients -> {output_path}")


if __name__ == "__main__":
    generate_dataset(n=200)