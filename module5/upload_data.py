import csv
import requests
import time
import os

# URL of your running Java Backend
API_URL = "http://localhost:8080/api/assessments"
CSV_FILE = "dummy_patients.csv"  # <-- FIXED FILE NAME HERE

def upload_csv():
    print(f"🚀 Starting bulk upload to Java Backend...")
    print(f"📂 Looking for CSV at: {os.path.abspath(CSV_FILE)}")
    
    if not os.path.exists(CSV_FILE):
        print(f"❌ ERROR: {CSV_FILE} not found in current folder!")
        print(f"Current folder: {os.getcwd()}")
        return
    
    success_count = 0
    error_count = 0

    with open(CSV_FILE, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        print(f"📄 Found CSV columns: {reader.fieldnames}")
        
        for i, row in enumerate(reader):
            try:
                # Map CSV columns to Java JSON format
                stiffness_duration = row.get('stiffness_duration', '<30min')
                if stiffness_duration == '<30min':
                    stiffness_duration = '15-30min'
                
                payload = {
                    "patientId": row.get('patient_id', f'UNKNOWN_{i}'),
                    "patientName": f"Patient {row.get('patient_id', f'{i}')}",
                    "age": int(row.get('age', 50)),
                    "gender": "Female",
                    "bmi": float(row.get('bmi', 25.0)),
                    "pain": int(row.get('pain', 5)),
                    "stiffness": row.get('stiffness', 'Moderate'),
                    "stiffnessDuration": stiffness_duration,
                    "tenderness": str(row.get('tenderness', 'False')).lower() == 'true',
                    "reducedFlexibility": str(row.get('reduced_flexibility', 'False')).lower() == 'true',
                    "crepitus": str(row.get('crepitus', 'False')).lower() == 'true',
                    "swelling": str(row.get('swelling', 'False')).lower() == 'true',
                    "painAfterActivity": str(row.get('pain_after_activity', 'False')).lower() == 'true',
                    "painAtRest": str(row.get('pain_at_rest', 'False')).lower() == 'true',
                    "walkingDifficulty": False,
                    "stairDifficulty": False,
                    "mobilityLimitation": False,
                    "givesWay": str(row.get('gives_way', 'False')).lower() == 'true',
                    "sleepDisturbance": str(row.get('sleep_disturbance', 'False')).lower() == 'true'
                }

                # Send to Java Backend
                response = requests.post(API_URL, json=payload, timeout=5)
                
                if response.status_code == 200:
                    success_count += 1
                    if success_count % 20 == 0:
                        print(f"✅ Uploaded {success_count} patients so far...")
                else:
                    error_count += 1
                    print(f"❌ Failed {row.get('patient_id')}: Status {response.status_code}")
                    
            except Exception as e:
                error_count += 1
                print(f"⚠️ Error processing row {i}: {str(e)}")
            
            time.sleep(0.05)

    print(f"\n{'='*50}")
    print(f"🎉 UPLOAD COMPLETE!")
    print(f"✅ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"{'='*50}")

if __name__ == "__main__":
    upload_csv()