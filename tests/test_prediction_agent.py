import numpy as np
import pytest

from prediction_agent import PredictionAgent


def test_prediction_with_valid_features():
    agent = PredictionAgent()

    # PredictionAgent expects exactly 24 features
    features = np.zeros(24)

    result = agent.predict(features)

    # Result should be a dictionary
    assert isinstance(result, dict)

    # These keys should be present
    assert "prediction" in result
    assert "label" in result
    assert "confidence" in result


def test_prediction_label():
    agent = PredictionAgent()

    features = np.zeros(24)

    result = agent.predict(features)

    # Label should be one of the labels used by the project
    assert result["label"] in ["Seizure", "Normal"]


def test_invalid_number_of_features():
    agent = PredictionAgent()

    # Only 10 features instead of 24
    features = np.zeros(10)

    # The agent should reject incorrect input
    with pytest.raises(ValueError):
        agent.predict(features)