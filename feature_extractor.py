"""
feature_extractor.py

Converts raw patient input into a normalized feature dict
that the risk engine consumes.

Why this exists:
- Keeps engine clean (no input parsing logic)
- Makes engine ML-ready (same features feed a model later)
- Single place to add camera/sensor features in the future
"""


def extract_features(patient):
    """
    Input:  raw patient dict (from UI or CSV)
    Output: normalized feature dict

    Each feature is a number the engine can score directly.
    Booleans become 0/1, strings stay categorical.
    """
    features = {}

    # --- Demographic ---
    features["age"] = int(patient["age"])
    features["bmi"] = float(patient.get("bmi", 25.0))

    # --- Pain ---
    features["pain"] = int(patient["pain"])
    features["pain_high"] = int(patient["pain"] >= 7)
    features["pain_moderate"] = int(4 <= patient["pain"] < 7)

    # --- Stiffness ---
    features["stiffness"] = patient["stiffness"]
    features["stiffness_duration_long"] = int(
        patient.get("stiffness_duration") == ">=30min"
    )

    # --- Boolean symptoms ---
    for key in [
        "tenderness",
        "reduced_flexibility",
        "crepitus",
        "swelling",
        "pain_after_activity",
        "pain_at_rest",
        "gives_way",
        "sleep_disturbance",
    ]:
        features[key] = int(bool(patient.get(key, False)))

    return features