import numpy as np

from feature_agent import FeatureAgent
from prediction_agent import PredictionAgent
from risk_agent import RiskAgent
from alert_agent import AlertAgent


def test_complete_agent_workflow():
    # Create all agents
    feature_agent = FeatureAgent()
    prediction_agent = PredictionAgent()
    risk_agent = RiskAgent()
    alert_agent = AlertAgent()

    # Sample EEG data
    eeg_segment = np.zeros((2, 2560))

    # Step 1: Extract features
    features = feature_agent.extract_features(eeg_segment)

    assert len(features) == 24

    # Step 2: Predict
    prediction = prediction_agent.predict(features)

    assert isinstance(prediction, dict)
    assert "prediction" in prediction
    assert "confidence" in prediction

    # Step 3: Assess risk
    risk = risk_agent.assess_risk(prediction)

    assert isinstance(risk, dict)
    assert "risk_level" in risk

    # Step 4: Generate alert
    alert = alert_agent.generate_alert(risk)

    # Final result should be generated
    assert alert is not None