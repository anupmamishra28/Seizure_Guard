import numpy as np
import pandas as pd
from scipy.signal import welch

# ==========================================
# LOAD FILTERED DATA
# ==========================================

segments = np.load("filtered_segments.npy")
labels = np.load("filtered_labels.npy")
subjects = np.load("filtered_subjects.npy")

print("Segments shape:", segments.shape)
print("Labels shape:", labels.shape)
print("Subjects shape:", subjects.shape)


# ==========================================
# FEATURE EXTRACTION
# 12 FEATURES PER CHANNEL
# 24 FEATURES TOTAL
# ==========================================

def extract_features(data):

    features = []

    for segment in data:

        segment_features = []

        for channel in segment:

            # ------------------------------
            # TIME-DOMAIN FEATURES
            # ------------------------------

            mean = np.mean(channel)

            std = np.std(channel)

            variance = np.var(channel)

            minimum = np.min(channel)

            maximum = np.max(channel)

            rms = np.sqrt(np.mean(channel ** 2))

            energy = np.sum(channel ** 2)


            # ------------------------------
            # FREQUENCY-DOMAIN FEATURES
            # ------------------------------

            frequencies, power = welch(
                channel,
                fs=256,
                nperseg=256
            )

            delta = np.sum(
                power[
                    (frequencies >= 0.5) &
                    (frequencies < 4)
                ]
            )

            theta = np.sum(
                power[
                    (frequencies >= 4) &
                    (frequencies < 8)
                ]
            )

            alpha = np.sum(
                power[
                    (frequencies >= 8) &
                    (frequencies < 13)
                ]
            )

            beta = np.sum(
                power[
                    (frequencies >= 13) &
                    (frequencies < 30)
                ]
            )

            gamma = np.sum(
                power[
                    (frequencies >= 30) &
                    (frequencies <= 40)
                ]
            )


            # 12 features for this channel

            segment_features.extend([
                mean,
                std,
                variance,
                minimum,
                maximum,
                rms,
                energy,
                delta,
                theta,
                alpha,
                beta,
                gamma
            ])

        features.append(segment_features)

    return np.array(features)


# ==========================================
# EXTRACT FEATURES
# ==========================================

print("\nExtracting features...")

X = extract_features(segments)

print("Feature matrix shape:", X.shape)


# ==========================================
# CREATE FEATURE NAMES
# ==========================================

feature_names = []

feature_types = [
    "mean",
    "std",
    "variance",
    "minimum",
    "maximum",
    "rms",
    "energy",
    "delta_power",
    "theta_power",
    "alpha_power",
    "beta_power",
    "gamma_power"
]

for channel in range(1, 3):

    for feature in feature_types:

        feature_names.append(
            f"ch{channel}_{feature}"
        )


# ==========================================
# CREATE DATAFRAME
# ==========================================

df = pd.DataFrame(
    X,
    columns=feature_names
)

df["label"] = labels

df["subject"] = subjects


# ==========================================
# DISPLAY INFORMATION
# ==========================================

print("\nFeature matrix with labels and subjects:")
print(df.shape)

print("\nClass distribution:")

print(
    df["label"].value_counts()
)

print("\nSubject distribution:")

print(
    df["subject"].value_counts()
)


# ==========================================
# SAVE FEATURES
# ==========================================

df.to_csv(
    "subject_features.csv",
    index=False
)

print("\nSaved:")
print("subject_features.csv")