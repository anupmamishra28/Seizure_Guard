from fastapi import FastAPI
from pydantic import BaseModel
from database import SessionLocal, Prediction, Patient
from agent_workflow import SeizureGuardWorkflow


app = FastAPI(title="SeizureGuard Backend")

workflow = SeizureGuardWorkflow()





# Input: exactly 24 extracted EEG features
class PredictionRequest(BaseModel):
    patient_id: str
    eeg_data: list[list[float]]

class PatientRequest(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str


@app.get("/")
def home():
    return {
        "message": "SeizureGuard Backend is Running!"
    }


@app.post("/predict")
def predict(data: PredictionRequest):

    db = SessionLocal()

    # Run EEG through the complete agent workflow
    result = workflow.run(data.eeg_data)

    prediction_result = result["prediction"]
    risk_result = result["risk"]
    alert_result = result["alert"]

    # Save prediction to database
    new_prediction = Prediction(
        patient_id=data.patient_id,
        prediction=prediction_result["label"],
        confidence=prediction_result["confidence"],
        risk_level=risk_result["risk_level"]
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    db.close()

    return {
        "patient_id": data.patient_id,
        "prediction": prediction_result,
        "risk": risk_result,
        "alert": alert_result
    }

@app.get("/history/{patient_id}")
def get_history(patient_id: str):

    db = SessionLocal()

    records = db.query(Prediction).filter(
        Prediction.patient_id == patient_id
    ).all()

    history = []

    for record in records:
        history.append({
            "id": record.id,
            "patient_id": record.patient_id,
            "prediction": record.prediction,
            "confidence": record.confidence,
            "timestamp": record.timestamp
        })

    db.close()

    return history

@app.post("/patients")
def create_patient(data: PatientRequest):

    db = SessionLocal()

    new_patient = Patient(
        patient_id=data.patient_id,
        name=data.name,
        age=data.age,
        gender=data.gender
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    db.close()

    return {
        "message": "Patient created successfully",
        "patient_id": new_patient.patient_id,
        "name": new_patient.name,
        "age": new_patient.age,
        "gender": new_patient.gender
    }

@app.get("/patients/{patient_id}")
def get_patient(patient_id: str):

    db = SessionLocal()

    patient = db.query(Patient).filter(
        Patient.patient_id == patient_id
    ).first()

    db.close()

    if not patient:
        return {"message": "Patient not found"}

    return {
        "patient_id": patient.patient_id,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender
    }

