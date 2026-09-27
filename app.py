from fastapi import FastAPI
from pydantic import BaseModel
# Importing directly from the files visible in your sidebar
from oa_risk_engine import calculate_risk 
from feature_extractor import extract_features
import uvicorn

app = FastAPI()

# This defines exactly what data Module 2 will send
class PatientData(BaseModel):
    age: int
    pain: int
    stiffness: str
    stiffness_duration: str
    tenderness: bool
    reduced_flexibility: bool
    crepitus: bool
    swelling: bool
    pain_after_activity: bool
    pain_at_rest: bool
    gives_way: bool
    sleep_disturbance: bool   
    bmi: float

@app.post("/calculate_risk")
def calculate(patient: PatientData):
    try:
        # Convert the incoming data to a standard dictionary
        patient_dict = patient.dict()
        
        # 1. Use her feature extractor
        features = extract_features(patient_dict)
        
        # 2. Use her risk engine to get the score
        result = calculate_risk(features)
        
        # Return the result back to your Java code
        return result
        
    except Exception as e:
        return {"error": str(e), "risk_score": 50, "risk_level": "Error"}

if __name__ == "__main__":
    print("Starting Module 1 AI Server on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)