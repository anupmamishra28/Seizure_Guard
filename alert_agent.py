class AlertAgent:

    def generate_alert(self, risk_result):

        risk_level = risk_result["risk_level"]

        if risk_level == "HIGH":
            alert = True
            message = "Alert: High-risk seizure pattern detected."

        elif risk_level == "UNCERTAIN":
            alert = True
            message = "Warning: Uncertain seizure pattern detected. Further review recommended."

        else:
            alert = False
            message = "No alert. No high-risk seizure pattern detected."

        return {
            "alert": alert,
            "message": message
        }


if __name__ == "__main__":

    agent = AlertAgent()

    test_result = {
        "risk_level": "HIGH",
        "reason": "Seizure pattern detected with high confidence"
    }

    result = agent.generate_alert(test_result)

    print("\n===== ALERT AGENT =====")
    print(result)
    