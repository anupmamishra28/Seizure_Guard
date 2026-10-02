import os
import joblib
import numpy as np
import pandas as pd


class PredictionAgent:

    def __init__(self):

        # Find project root directory
        base_dir = os.path.dirname(os.path.abspath(__file__))

        # Paths to trained model and scaler
        model_path = os.path.join(
            base_dir,
            "ml_model",
            "seizure_model.pkl"
        )

        scaler_path = os.path.join(
            base_dir,
            "ml_model",
            "scaler.pkl"
        )

        # Load trained model and scaler
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)

        print("Model and scaler loaded successfully!")


    def predict(self, features):

        # Convert input into numpy array
        features = np.asarray(features)

        # If one-dimensional, convert to 2D
        if features.ndim == 1:
            features = features.reshape(1, -1)

        # Our model expects exactly 24 features
        if features.shape[1] != 24:
            raise ValueError(
                f"Expected 24 features, "
                f"but received {features.shape[1]}"
            )

        # Apply the same scaler used during training
        feature_names = [
            "ch1_mean", "ch1_std", "ch1_variance", "ch1_min",
            "ch1_max", "ch1_rms", "ch1_energy", "ch1_delta_power",
            "ch1_theta_power", "ch1_alpha_power", "ch1_beta_power",
            "ch1_gamma_power",
            "ch2_mean", "ch2_std", "ch2_variance", "ch2_min",
            "ch2_max", "ch2_rms", "ch2_energy", "ch2_delta_power",
            "ch2_theta_power", "ch2_alpha_power", "ch2_beta_power",
            "ch2_gamma_power"
        ]

        features = pd.DataFrame(
            features,
            columns=feature_names
        )

        scaled_features = self.scaler.transform(features)

        # Make prediction
        prediction = self.model.predict(scaled_features)[0]

        # Get confidence
        if hasattr(self.model, "predict_proba"):
            probabilities = self.model.predict_proba(
                scaled_features
            )[0]

            confidence = float(max(probabilities))
        else:
            confidence = None

        # Convert numerical prediction to readable label
        if prediction == 1:
            label = "Seizure"
        else:
            label = "Normal"

        return {
            "prediction": int(prediction),
            "label": label,
            "confidence": confidence
        }


# Test the agent
if __name__ == "__main__":

    agent = PredictionAgent()

    # Temporary test input: 24 features
    test_features = np.zeros(24)

    result = agent.predict(test_features)

    print("\n===== PREDICTION AGENT =====")
    print(result)
