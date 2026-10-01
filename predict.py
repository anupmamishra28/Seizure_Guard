import pandas as pd
import joblib

# Load trained model and scaler
model = joblib.load("seizure_model.pkl")
scaler = joblib.load("scaler.pkl")

# Load features
data = pd.read_csv("features.csv")

# Separate features and labels
X = data.drop("label", axis=1)
y = data["label"]

# Scale features
X_scaled = scaler.transform(X)

# Predict
predictions = model.predict(X_scaled)

# Count predictions
normal_count = sum(predictions == 0)
seizure_count = sum(predictions == 1)

print("\n===== SEIZURE DETECTION RESULTS =====")

print(f"Total segments: {len(predictions)}")
print(f"Predicted Normal: {normal_count}")
print(f"Predicted Seizure: {seizure_count}")

print("\nActual data:")
print(f"Actual Normal: {sum(y == 0)}")
print(f"Actual Seizure: {sum(y == 1)}")

print("\n===== SEIZURE SEGMENTS =====")

for i in range(len(y)):
    if y.iloc[i] == 1:
        result = "SEIZURE" if predictions[i] == 1 else "MISSED"

        print(
            f"Segment {i+1}: "
            f"Actual = SEIZURE | "
            f"Prediction = {result}"
        )

print("\n====================================")