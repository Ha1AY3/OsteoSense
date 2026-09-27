"""
oa_risk_engine.py

Rule-based OA risk screening engine.

Now includes:
- Red flag screening (urgent referral triggers)
- Progression risk (modifiable vs non-modifiable factors)
- Standard risk scoring (0-100)
"""

from feature_extractor import extract_features


def check_red_flags(patient):
    """
    Screen for conditions that mimic OA but need urgent referral.
    Returns a list of warning strings. Empty list = no red flags.
    """
    flags = []

    if patient.get("hip_pain") or patient.get("groin_pain"):
        flags.append("Hip involvement possible - assess hip before treating knee")

    if patient.get("morning_stiffness_over_1hr"):
        flags.append("Prolonged morning stiffness (>1hr) - consider inflammatory arthritis")

    if patient.get("night_pain_unrelated_to_activity"):
        flags.append("Night pain at rest - rule out infection or malignancy")

    if patient.get("recent_trauma"):
        flags.append("Recent trauma - exclude fracture or ligament injury")

    if patient.get("fever_or_systemic"):
        flags.append("Systemic symptoms - urgent medical assessment")

    return flags


def progression_risk(patient):
    """
    Classify progression risk from modifiable vs non-modifiable factors.
    """
    modifiable = []
    non_modifiable = []

    if patient.get("bmi", 0) >= 30:
        modifiable.append("Weight reduction (BMI >= 30)")

    if not patient.get("exercises_regularly", True):
        modifiable.append("Structured exercise program")

    if patient.get("occupation_stress"):
        modifiable.append("Occupational joint protection")

    if patient.get("age", 0) >= 60:
        non_modifiable.append("Age over 60")

    if patient.get("previous_injury"):
        non_modifiable.append("Previous joint injury")

    if len(modifiable) >= 2:
        risk = "High progression risk - multiple modifiable factors"
    elif len(modifiable) == 1:
        risk = "Moderate progression risk"
    else:
        risk = "Lower progression risk"

    return {
        "progression_risk": risk,
        "modifiable_factors": modifiable,
        "non_modifiable_factors": non_modifiable,
    }


def calculate_risk(patient):
    """
    Main engine. Accepts raw patient dict, returns full result dict.
    """
    features = extract_features(patient)

    # --- Check red flags FIRST ---
    red_flags = check_red_flags(patient)
    progression = progression_risk(patient)

    score = 0
    factors = []

    # --- PAIN (max 20) ---
    if features["pain"] >= 7:
        score += 20
        factors.append("Severe pain (7+/10)")
    elif features["pain"] >= 4:
        score += 12
        factors.append("Moderate pain (4-6/10)")
    elif features["pain"] >= 1:
        score += 4
        factors.append("Mild pain")

    # --- STIFFNESS (max 15) ---
    if features["stiffness"] == "Severe":
        score += 15
        factors.append("Severe joint stiffness")
    elif features["stiffness"] == "Moderate":
        score += 9
        factors.append("Moderate joint stiffness")
    else:
        score += 3

    # --- STIFFNESS DURATION (max 10) ---
    if features["stiffness_duration_long"]:
        score += 10
        factors.append("Morning stiffness >=30 min")

    # --- TENDERNESS (max 8) ---
    if features["tenderness"]:
        score += 8
        factors.append("Joint tenderness on pressure")

    # --- REDUCED FLEXIBILITY (max 12) ---
    if features["reduced_flexibility"]:
        score += 12
        factors.append("Reduced joint flexibility")

    # --- CREPITUS (max 10) ---
    if features["crepitus"]:
        score += 10
        factors.append("Crepitus (grating/cracking)")

    # --- SWELLING (max 8) ---
    if features["swelling"]:
        score += 8
        factors.append("Joint swelling")

    # --- PAIN AFTER ACTIVITY (max 10) ---
    if features["pain_after_activity"]:
        score += 10
        factors.append("Pain worse after activity")

    # --- PAIN AT REST (max 5) ---
    if features["pain_at_rest"]:
        score += 5
        factors.append("Pain at rest")

    # --- GIVES WAY (max 5) ---
    if features["gives_way"]:
        score += 5
        factors.append("Joint gives way")

    # --- SLEEP DISTURBANCE (max 5) ---
    if features["sleep_disturbance"]:
        score += 5
        factors.append("Sleep disturbed by pain")

    # --- AGE (max 12) ---
    if features["age"] >= 60:
        score += 12
        factors.append("Age over 60")
    elif features["age"] >= 45:
        score += 6
        factors.append("Age over 45")

    # --- BMI (max 8) ---
    if features["bmi"] >= 30:
        score += 8
        factors.append(f"BMI {features['bmi']} (obese range)")
    elif features["bmi"] >= 25:
        score += 4
        factors.append(f"BMI {features['bmi']} (overweight range)")

    # --- CAP AT 100 ---
    score = min(score, 100)

    # --- RISK LEVEL (thresholds 50 / 75) ---
    if score >= 75:
        risk_level = "Higher Risk"
        recommendation = (
            "Refer to orthopedics / rheumatology for clinical "
            "evaluation and imaging."
        )
    elif score >= 50:
        risk_level = "Moderate Risk"
        recommendation = (
            "Advise lifestyle changes (weight, exercise). "
            "Follow up in 4 weeks; refer if worsening."
        )
    else:
        risk_level = "Lower Risk"
        recommendation = (
            "Reassure. Provide self-management advice. "
            "Reassess if symptoms worsen."
        )

    # --- RED FLAG OVERRIDE ---
    # If red flags present, override normal output
    if red_flags:
        return {
            "risk_score": score,
            "risk_level": "Red Flag - Refer Urgently",
            "factors": factors,
            "red_flags": red_flags,
            "progression_risk": progression["progression_risk"],
            "modifiable_factors": progression["modifiable_factors"],
            "recommendation": "Seek immediate medical assessment: " + "; ".join(red_flags),
        }

    # --- NORMAL RETURN ---
    return {
        "risk_score": score,
        "risk_level": risk_level,
        "factors": factors,
        "red_flags": [],
        "progression_risk": progression["progression_risk"],
        "modifiable_factors": progression["modifiable_factors"],
        "recommendation": recommendation,
    }