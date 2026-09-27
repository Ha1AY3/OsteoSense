from oa_risk_engine import calculate_risk


MILD = {
    "age": 35, "bmi": 23.0,
    "pain": 2, "stiffness": "Mild", "stiffness_duration": "<30min",
    "tenderness": False, "reduced_flexibility": False,
    "crepitus": False, "swelling": False,
    "pain_after_activity": False, "pain_at_rest": False,
    "gives_way": False, "sleep_disturbance": False,
}

MODERATE = {
    "age": 52, "bmi": 28.5,
    "pain": 5, "stiffness": "Moderate", "stiffness_duration": ">=30min",
    "tenderness": True, "reduced_flexibility": True,
    "crepitus": False, "swelling": False,
    "pain_after_activity": True, "pain_at_rest": False,
    "gives_way": False, "sleep_disturbance": False,
}

SEVERE = {
    "age": 68, "bmi": 33.0,
    "pain": 8, "stiffness": "Severe", "stiffness_duration": ">=30min",
    "tenderness": True, "reduced_flexibility": True,
    "crepitus": True, "swelling": True,
    "pain_after_activity": True, "pain_at_rest": True,
    "gives_way": True, "sleep_disturbance": True,
}

REDFLAG = {
    "age": 45, "bmi": 26.0,
    "pain": 4, "stiffness": "Moderate", "stiffness_duration": "<30min",
    "tenderness": True, "reduced_flexibility": False,
    "crepitus": False, "swelling": False,
    "pain_after_activity": True, "pain_at_rest": False,
    "gives_way": False, "sleep_disturbance": False,
    "recent_trauma": True,
}


def show(label, patient):
    r = calculate_risk(patient)
    print(f"\n=== {label} ===")
    print(f"Score: {r['risk_score']}")
    print(f"Level: {r['risk_level']}")
    print(f"Factors: {r['factors']}")
    print(f"Red flags: {r.get('red_flags', [])}")
    print(f"Progression: {r.get('progression_risk', 'n/a')}")
    print(f"Modifiable: {r.get('modifiable_factors', [])}")
    print(f"Recommendation: {r['recommendation']}")


show("MILD", MILD)
show("MODERATE", MODERATE)
show("SEVERE", SEVERE)
show("RED FLAG CASE", REDFLAG)