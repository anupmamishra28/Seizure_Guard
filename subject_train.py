import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import confusion_matrix, classification_report
from imblearn.over_sampling import SMOTE


# ==========================================
# LOAD DATA
# ==========================================

data = pd.read_csv("subject_features.csv")

feature_columns = [
    col for col in data.columns
    if col not in ["label", "subject"]
]

X = data[feature_columns]
y = data["label"]


# ==========================================
# TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ==========================================
# SMOTE — TRAIN ONLY
# ==========================================

smote = SMOTE(random_state=42)

X_train, y_train = smote.fit_resample(
    X_train,
    y_train
)

print("After SMOTE:")
print(y_train.value_counts())


# ==========================================
# HISTOGRAM GRADIENT BOOSTING
# ==========================================

model = HistGradientBoostingClassifier(
    max_iter=300,
    learning_rate=0.05,
    max_leaf_nodes=31,
    l2_regularization=1.0,
    random_state=42
)

model.fit(
    X_train,
    y_train
)


# ==========================================
# PREDICTION
# ==========================================

y_pred = model.predict(X_test)


# ==========================================
# RESULTS
# ==========================================

print("\n====================================")
print("HISTOGRAM GRADIENT BOOSTING")
print("====================================")

print("\nCONFUSION MATRIX:")

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)

print("\nCLASSIFICATION REPORT:")

print(
    classification_report(
        y_test,
        y_pred
    )
)