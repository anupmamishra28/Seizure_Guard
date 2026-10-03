import numpy as np
import joblib


def test_model_and_scaler_load():
    model = joblib.load("seizure_model.pkl")
    scaler = joblib.load("scaler.pkl")

    assert model is not None
    assert scaler is not None


def test_model_prediction():
    model = joblib.load("seizure_model.pkl")
    scaler = joblib.load("scaler.pkl")

    # Model expects 24 features
    features = np.zeros((1, 24))

    scaled_features = scaler.transform(features)
    prediction = model.predict(scaled_features)

    assert prediction.shape == (1,)
    assert prediction[0] in [0, 1]


def test_model_prediction_is_numeric():
    model = joblib.load("seizure_model.pkl")
    scaler = joblib.load("scaler.pkl")

    features = np.ones((1, 24))

    scaled_features = scaler.transform(features)
    prediction = model.predict(scaled_features)

    assert isinstance(prediction[0], (int, np.integer))