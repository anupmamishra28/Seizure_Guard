# SeizureGuard

SeizureGuard is a machine-learning based EEG analysis system designed to analyze EEG signals and provide seizure prediction, risk assessment, and alert information.

The project combines EEG signal processing, machine learning, a multi-agent workflow, FastAPI backend, React frontend, and SQLite database to create an end-to-end seizure monitoring system.

---

## 1. Project Overview

SeizureGuard processes EEG (Electroencephalogram) data and passes it through multiple stages:

1. EEG data is uploaded through the application.
2. Important features are extracted from the EEG signal.
3. A trained machine learning model predicts whether seizure activity is detected.
4. A risk level is calculated using the prediction and confidence.
5. An alert is generated based on the risk level.
6. Patient and prediction information can be stored and viewed through the system.

---

## 2. Problem Statement

Seizures can be difficult to detect continuously because EEG signals contain a large amount of complex information.

The objective of SeizureGuard is to provide a software-based system that can:

- Process EEG signals.
- Extract useful signal features.
- Apply a machine learning model for prediction.
- Calculate seizure risk.
- Generate alerts based on the detected risk.
- Store patient and prediction information.

---

## 3. Objectives

The main objectives of the project are:

- Analyze EEG signals using Python.
- Extract important statistical and frequency-domain features.
- Use a trained ML model for seizure prediction.
- Classify the risk level of the patient.
- Generate alerts for high-risk situations.
- Provide REST APIs for EEG prediction and patient information.
- Store prediction history using a database.
- Provide a simple frontend for interacting with the system.
- Test the major components of the application.

---

## 4. How SeizureGuard Works

The overall workflow is:

EEG File
   ↓
EEG Data Validation
   ↓
Feature Extraction
   ↓
Machine Learning Prediction
   ↓
Risk Assessment
   ↓
Alert Generation
   ↓
Prediction Result + History

The backend accepts an EEG file in EDF format and processes the signal before generating the final result.

---

## 5. System Architecture

                ┌──────────────────┐
                │  React Frontend  │
                └────────┬─────────┘
                         │
                         ↓
                ┌──────────────────┐
                │  FastAPI Backend │
                └────────┬─────────┘
                         │
                         ↓
                ┌──────────────────┐
                │   EEG Processing │
                └────────┬─────────┘
                         │
                         ↓
                ┌──────────────────┐
                │ Feature Extraction│
                └────────┬─────────┘
                         │
                         ↓
                ┌──────────────────┐
                │   ML Prediction  │
                └────────┬─────────┘
                         │
                         ↓
                ┌──────────────────┐
                │ Risk Assessment  │
                └────────┬─────────┘
                         │
                         ↓
                ┌──────────────────┐
                │ Alert Generation │
                └──────────────────┘

---

## 6. Agent Architecture

SeizureGuard uses a workflow consisting of multiple agents.

### Feature Agent

The Feature Agent extracts useful information from the EEG signal.

It extracts statistical and frequency-domain features such as:

- Mean
- Standard deviation
- Variance
- Minimum
- Maximum
- RMS
- Energy
- Delta power
- Theta power
- Alpha power
- Beta power
- Gamma power

For the two EEG channels used by the system, the feature extraction process produces 24 features.

---

### Prediction Agent

The Prediction Agent uses the trained machine learning model to make a prediction.

It:

1. Loads the trained model.
2. Loads the feature scaler.
3. Validates the input features.
4. Scales the extracted features.
5. Generates the prediction.
6. Calculates the prediction confidence.

The trained model and scaler are stored in:

ml_model/
├── seizure_model.pkl
└── scaler.pkl

---

### Risk Agent

The Risk Agent determines the risk level based on the prediction and confidence.

The current logic is:

| Condition | Risk Level |
|---|---|
| Seizure prediction = 1 and confidence ≥ 0.70 | HIGH |
| Seizure prediction = 1 and confidence < 0.70 | UNCERTAIN |
| Seizure prediction = 0 | LOW |
| Confidence unavailable | UNKNOWN |

---

### Alert Agent

The Alert Agent generates an appropriate response based on the risk level.

- HIGH → Alert generated
- UNCERTAIN → Warning/alert generated
- LOW → No alert
- UNKNOWN → No alert

---

## 7. EEG Feature Extraction

The project uses EEG signal processing techniques to extract useful features.

The system uses the Welch method for power spectral density analysis.

Frequency-domain features are calculated for:

- Delta
- Theta
- Alpha
- Beta
- Gamma

These features help convert raw EEG signals into numerical information that can be given to the machine learning model.

---

## 8. Machine Learning

SeizureGuard uses a trained machine learning model for seizure prediction.

The prediction pipeline is:

EEG Signal
    ↓
Feature Extraction
    ↓
24 Features
    ↓
Feature Scaling
    ↓
Trained ML Model
    ↓
Prediction + Confidence

The trained model and scaler are stored as `.pkl` files in the `ml_model` directory.

---

## 9. Backend API

The backend is developed using FastAPI.

### Available Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check whether backend is running |
| POST | `/predict` | Upload EEG file and get prediction |
| GET | `/history` | Get prediction history |
| GET | `/history/{patient_id}` | Get history for a specific patient |
| POST | `/patients` | Add patient information |
| GET | `/patients/{patient_id}` | Get patient information |

### `/predict`

The prediction endpoint accepts:

- EDF EEG file
- Patient ID
- Patient name
- Age
- Gender

The response contains information such as:

- Patient ID
- Patient name
- Age
- Gender
- Prediction
- Confidence
- Risk level

---

## 10. Database

The project uses SQLite with SQLAlchemy.

The database is used to store information related to:

- Patients
- EEG predictions
- Prediction history

This allows previous prediction results to be accessed through the history APIs.

---

## 11. Frontend

The frontend is developed using:

- React
- TypeScript
- Vite
- Axios
- React Router
- Tailwind CSS
- Lucide React

The frontend communicates with the FastAPI backend through HTTP APIs.

---

## 12. Project Structure

Seizure_Guard/
│
├── Agents/
│   ├── feature_agent.py
│   ├── prediction_agent.py
│   ├── risk_agent.py
│   ├── alert_agent.py
│   └── agent_workflow.py
│
├── ml_model/
│   ├── seizure_model.pkl
│   └── scaler.pkl
│
├── tests/
│   ├── test_feature_agent.py
│   ├── test_prediction_agent.py
│   ├── test_risk_agent.py
│   ├── test_alert_agent.py
│   ├── test_integration.py
│   ├── test_ml_model.py
│   ├── test_functional.py
│   └── TEST_REPORT.md
│
├── main.py
├── requirements.txt
├── train_model.py
├── train_svm.py
├── prepare_data.py
├── preprocess.py
├── predict.py
└── README.md

---

## 13. Technologies Used

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite

### Machine Learning & Signal Processing

- Scikit-learn
- NumPy
- SciPy
- MNE
- Joblib

### Frontend

- React
- TypeScript
- Vite
- Axios
- Tailwind CSS

### Testing

- Pytest
- FastAPI TestClient

---

## 14. Installation

### Clone the Repository

```bash
git clone https://github.com/anupmamishra28/Seizure_Guard.git
cd Seizure_Guard