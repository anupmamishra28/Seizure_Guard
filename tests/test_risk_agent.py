from risk_agent import RiskAgent


def test_high_risk():
    agent = RiskAgent()

    prediction_result = {
        "prediction": 1,
        "confidence": 0.85
    }

    result = agent.assess_risk(prediction_result)

    assert result["risk_level"] == "HIGH"


def test_uncertain_risk():
    agent = RiskAgent()

    prediction_result = {
        "prediction": 1,
        "confidence": 0.50
    }

    result = agent.assess_risk(prediction_result)

    assert result["risk_level"] == "UNCERTAIN"


def test_low_risk():
    agent = RiskAgent()

    prediction_result = {
        "prediction": 0,
        "confidence": 0.90
    }

    result = agent.assess_risk(prediction_result)

    assert result["risk_level"] == "LOW"


def test_unknown_risk():
    agent = RiskAgent()

    prediction_result = {
        "prediction": 1,
        "confidence": None
    }

    result = agent.assess_risk(prediction_result)

    assert result["risk_level"] == "UNKNOWN"