class RiskAgent:

    def assess_risk(self, prediction_result):

        prediction = prediction_result["prediction"]
        confidence = prediction_result["confidence"]

        # No confident probability available
        if confidence is None:
            return {
                "risk_level": "UNKNOWN",
                "reason": "Confidence score unavailable"
            }

        # Project-level risk logic
        if prediction == 1 and confidence >= 0.70:
            risk_level = "HIGH"
            reason = "Seizure pattern detected with high confidence"

        elif prediction == 1:
            risk_level = "UNCERTAIN"
            reason = "Seizure pattern detected with lower confidence"

        else:
            risk_level = "LOW"
            reason = "No seizure pattern detected"

        return {
            "risk_level": risk_level,
            "reason": reason
        }


if __name__ == "__main__":

    agent = RiskAgent()

    test_result = {
        "prediction": 1,
        "label": "Seizure",
        "confidence": 0.85
    }

    result = agent.assess_risk(test_result)

    print("\n===== RISK AGENT =====")
    print(result)