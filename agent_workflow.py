from Agents.feature_agent import FeatureAgent
from Agents.prediction_agent import PredictionAgent
from Agents.risk_agent import RiskAgent
from Agents.alert_agent import AlertAgent


class SeizureGuardWorkflow:

    def __init__(self):
        self.feature_agent = FeatureAgent()
        self.prediction_agent = PredictionAgent()
        self.risk_agent = RiskAgent()
        self.alert_agent = AlertAgent()

    def run(self, eeg_segment):

        # Step 1: Extract 24 features from EEG
        features = self.feature_agent.extract_features(
            eeg_segment
        )

        # Step 2: Predict seizure pattern
        prediction_result = self.prediction_agent.predict(
            features
        )

        # Step 3: Assess risk
        risk_result = self.risk_agent.assess_risk(
            prediction_result
        )

        # Step 4: Generate alert
        alert_result = self.alert_agent.generate_alert(
            risk_result
        )

        return {
            "features": features,
            "prediction": prediction_result,
            "risk": risk_result,
            "alert": alert_result
        }


if __name__ == "__main__":

    import numpy as np

    workflow = SeizureGuardWorkflow()

    # Dummy EEG segment for integration testing
    test_segment = np.zeros((2, 2560))

    result = workflow.run(test_segment)

    print("\n===================================")
    print("       SEIZUREGUARD WORKFLOW")
    print("===================================")

    print("\nFeature count:")
    print(len(result["features"]))

    print("\nPrediction:")
    print(result["prediction"])

    print("\nRisk:")
    print(result["risk"])

    print("\nAlert:")
    print(result["alert"])

    print("\n===================================")