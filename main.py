from fastapi import FastAPI
from pydantic import BaseModel, Field
import joblib
import numpy as np
from database import SessionLocal, Prediction, Patient


app = FastAPI(title="SeizureGuard Backend")


# Load trained ML model and scaler
model = joblib.load("ml_model/seizure_model.pkl")
scaler = joblib.load("ml_model/scaler.pkl")


# Input: exactly 24 extracted EEG features
class PredictionRequest(BaseModel):
    patient_id: str
    features: list[float] = Field(..., min_length=24, max_length=24)

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

    # Convert features into NumPy array
    features = np.array(data.features).reshape(1, -1)

    # Scale features using the trained scaler
    scaled_features = scaler.transform(features)

    # Make prediction
    prediction = model.predict(scaled_features)[0]

    # Get probability/confidence
    probabilities = model.predict_proba(scaled_features)[0]
    confidence = float(max(probabilities))

    # Determine risk level for project display
    if int(prediction) == 1:
        risk_level = "High" if confidence >= 0.8 else "Moderate"
    else:
        risk_level = "Low"

    # Save prediction to database
    new_prediction = Prediction(
    patient_id=data.patient_id,
    prediction=str(int(prediction)),
    confidence=confidence,
    risk_level=risk_level
)

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    db.close()

    return {
    "patient_id": data.patient_id,
    "prediction": "Seizure" if int(prediction) == 1 else "No Seizure",
    "confidence": round(confidence, 4),
    "risk_level": risk_level
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

