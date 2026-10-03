import os
import tempfile

import mne
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import SessionLocal, Prediction, Patient
from agent_workflow import SeizureGuardWorkflow


app = FastAPI(title="SeizureGuard Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

workflow = SeizureGuardWorkflow()


# -----------------------------
# Patient request model
# -----------------------------
class PatientRequest(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str


# -----------------------------
# Home
# -----------------------------
@app.get("/")
def home():
    return {
        "message": "SeizureGuard Backend is Running!"
    }


# -----------------------------
# Predict from EDF file
# -----------------------------
@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    patient_id: str = Form(...),
    name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...)
):
    # Check file type
    if not file.filename.lower().endswith(".edf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an EDF file."
        )

    temp_path = None
    db = SessionLocal()

    try:
        # ---------------------------------
        # Save uploaded EDF temporarily
        # ---------------------------------
        file_data = await file.read()

        with tempfile.NamedTemporaryFile(
            suffix=".edf",
            delete=False
        ) as temp_file:
            temp_file.write(file_data)
            temp_path = temp_file.name

        # ---------------------------------
        # Read EDF
        # ---------------------------------
        raw = mne.io.read_raw_edf(
            temp_path,
            preload=False,
            verbose=False
        )

        # ---------------------------------
        # Check sampling rate
        # ---------------------------------
        sampling_rate = raw.info["sfreq"]

        if sampling_rate != 256:
            raise HTTPException(
                status_code=400,
                detail=f"EDF sampling rate must be 256 Hz. Found {sampling_rate} Hz."
            )

        # ---------------------------------
        # Get EEG channels
        # ---------------------------------
        eeg_channels = mne.pick_types(
            raw.info,
            eeg=True,
            exclude=[]
        )

        if len(eeg_channels) < 2:
            raise HTTPException(
                status_code=400,
                detail="EDF file must contain at least 2 EEG channels."
            )

        # Use first two EEG channels
        eeg_data = raw.get_data(
            picks=eeg_channels[:2],
            start=0,
            stop=2560
        )

        # ---------------------------------
        # Check required shape
        # ---------------------------------
        if eeg_data.shape != (2, 2560):
            raise HTTPException(
                status_code=400,
                detail=f"Unable to create required EEG shape (2, 2560). Found {eeg_data.shape}."
            )

        # ---------------------------------
        # Run complete AgentWorkflow
        # ---------------------------------
        result = workflow.run(eeg_data)

        prediction_result = result["prediction"]
        risk_result = result["risk"]

        # ---------------------------------
        # Save/update patient
        # ---------------------------------
        patient = db.query(Patient).filter(
            Patient.patient_id == patient_id
        ).first()

        if patient:
            patient.name = name
            patient.age = age
            patient.gender = gender
        else:
            patient = Patient(
                patient_id=patient_id,
                name=name,
                age=age,
                gender=gender
            )
            db.add(patient)

        # ---------------------------------
        # Save prediction
        # ---------------------------------
        new_prediction = Prediction(
            patient_id=patient_id,
            prediction=prediction_result["label"],
            confidence=prediction_result["confidence"],
            risk_level=risk_result["risk_level"]
        )

        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)

        # ---------------------------------
        # Response for frontend
        # ---------------------------------
        return {
            "patient_id": patient_id,
            "name": name,
            "age": age,
            "gender": gender,
            "prediction": prediction_result["label"],
            "confidence": prediction_result["confidence"],
            "risk_level": risk_result["risk_level"]
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

    finally:
        db.close()

        # Delete temporary EDF file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


# -----------------------------
# Get all prediction history
# -----------------------------
@app.get("/history")
def get_all_history():

    db = SessionLocal()

    try:
        records = db.query(Prediction).all()

        history = []

        for record in records:
            history.append({
                "id": record.id,
                "patient_id": record.patient_id,
                "prediction": record.prediction,
                "confidence": record.confidence,
                "risk_level": record.risk_level,
                "timestamp": record.timestamp
            })

        return {
            "history": history
        }

    finally:
        db.close()


# -----------------------------
# Get history for one patient
# -----------------------------
@app.get("/history/{patient_id}")
def get_history(patient_id: str):

    db = SessionLocal()

    try:
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
                "risk_level": record.risk_level,
                "timestamp": record.timestamp
            })

        return {"history": history}

    finally:
        db.close()


# -----------------------------
# Create patient
# -----------------------------
@app.post("/patients")
def create_patient(data: PatientRequest):

    db = SessionLocal()

    try:
        existing_patient = db.query(Patient).filter(
            Patient.patient_id == data.patient_id
        ).first()

        if existing_patient:
            return {
                "message": "Patient already exists",
                "patient_id": existing_patient.patient_id,
                "name": existing_patient.name,
                "age": existing_patient.age,
                "gender": existing_patient.gender
            }

        new_patient = Patient(
            patient_id=data.patient_id,
            name=data.name,
            age=data.age,
            gender=data.gender
        )

        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)

        return {
            "message": "Patient created successfully",
            "patient_id": new_patient.patient_id,
            "name": new_patient.name,
            "age": new_patient.age,
            "gender": new_patient.gender
        }

    finally:
        db.close()


# -----------------------------
# Get patient
# -----------------------------
@app.get("/patients/{patient_id}")
def get_patient(patient_id: str):

    db = SessionLocal()

    try:
        patient = db.query(Patient).filter(
            Patient.patient_id == patient_id
        ).first()

        if not patient:
            return {
                "message": "Patient not found"
            }

        return {
            "patient_id": patient.patient_id,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender
        }

    finally:
        db.close()
