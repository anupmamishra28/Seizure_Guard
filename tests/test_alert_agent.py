from alert_agent import AlertAgent


def test_alert_for_high_risk():
    agent = AlertAgent()

    risk_result = {
        "risk_level": "HIGH"
    }

    result = agent.generate_alert(risk_result)

    assert result is not None


def test_alert_for_low_risk():
    agent = AlertAgent()

    risk_result = {
        "risk_level": "LOW"
    }

    result = agent.generate_alert(risk_result)

    assert result is not None


def test_alert_for_uncertain_risk():
    agent = AlertAgent()

    risk_result = {
        "risk_level": "UNCERTAIN"
    }

    result = agent.generate_alert(risk_result)

    assert result is not None