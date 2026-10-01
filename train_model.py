import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib


# ==============================
# 1. LOAD FEATURES
# ==============================

data = pd.read_csv("features.csv")

# Separate features and labels
X = data.drop("label", axis=1)
y = data["label"]

print("X shape:", X.shape)
print("y shape:", y.shape)

print("\nClass distribution:")
print(y.value_counts())


# ==============================
# 2. TRAIN-TEST SPLIT
# ==============================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ==============================
# 3. SMOTE
# ==============================

smote = SMOTE(random_state=42)

X_train, y_train = smote.fit_resample(
    X_train,
    y_train
)

print("\nClass distribution after SMOTE:")
print(pd.Series(y_train).value_counts())


# ==============================
# 4. SCALE FEATURES
# ==============================

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


# ==============================
# 5. RANDOM FOREST
# ==============================

model = RandomForestClassifier(
    n_estimators=100,
    class_weight=None,
    random_state=42
)

model.fit(X_train, y_train)


# ==============================
# 6. PREDICTIONS
# ==============================

y_pred = model.predict(X_test)


# ==============================
# 7. EVALUATION
# ==============================

print("\nCONFUSION MATRIX:")
print(confusion_matrix(y_test, y_pred))

print("\nCLASSIFICATION REPORT:")
print(classification_report(y_test, y_pred))


# ==============================
# 8. SAVE MODEL
# ==============================

joblib.dump(model, "seizure_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\nModel training completed!")
print("Saved seizure_model.pkl and scaler.pkl")