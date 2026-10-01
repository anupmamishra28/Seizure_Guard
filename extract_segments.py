import mne
import numpy as np


# ============================================================
# FUNCTION TO PROCESS ONE EEG RECORDING
# ============================================================

def process_eeg(file_path, seizures):

    print("\nLoading:", file_path)

    raw = mne.io.read_raw_edf(
        file_path,
        preload=True,
        verbose=False
    )

    data = raw.get_data()
    sfreq = raw.info["sfreq"]

    print("EEG shape:", data.shape)
    print("Sampling frequency:", sfreq)

    # 10-second window
    window_size = 10
    samples_per_window = int(window_size * sfreq)

    segments = []
    labels = []

    total_samples = data.shape[1]

    # Divide recording into 10-second windows
    for start in range(
        0,
        total_samples - samples_per_window + 1,
        samples_per_window
    ):

        end = start + samples_per_window

        start_time = start / sfreq
        end_time = end / sfreq

        # Default = normal
        label = 0

        # Check whether window overlaps a seizure
        for seizure_start, seizure_end in seizures:

            if start_time < seizure_end and end_time > seizure_start:
                label = 1
                break

        segment = data[:, start:end]

        segments.append(segment)
        labels.append(label)

    segments = np.array(segments)
    labels = np.array(labels)

    print("Segments:", segments.shape)
    print("Normal:", np.sum(labels == 0))
    print("Seizure:", np.sum(labels == 1))

    return segments, labels


# ============================================================
# SUB-002
# ============================================================

file_002 = "sub-002_ses-01_task-szMonitoring_run-01_eeg.edf"

seizures_002 = [
    (4046, 4066),
    (10629, 10810)
]


segments_002, labels_002 = process_eeg(
    file_002,
    seizures_002
)


# ============================================================
# SUB-004
# ============================================================

file_004 = "sub-004_ses-01_task-szMonitoring_run-01_eeg.edf"

seizures_004 = [
    (1359, 1401),
    (8300, 8381),
    (19956, 20062),
    (26559, 26644)
]


segments_004, labels_004 = process_eeg(
    file_004,
    seizures_004
)


# ============================================================
# CHECK CHANNEL / SHAPE COMPATIBILITY
# ============================================================

print("\nChecking compatibility...")

if segments_002.shape[1:] != segments_004.shape[1:]:

    print("ERROR: The two recordings have different shapes.")
    print("Sub-002:", segments_002.shape)
    print("Sub-004:", segments_004.shape)

    raise ValueError(
        "The recordings cannot be combined directly because "
        "their channel/sample dimensions are different."
    )


# ============================================================
# COMBINE BOTH DATASETS
# ============================================================

segments = np.concatenate(
    [segments_002, segments_004],
    axis=0
)

labels = np.concatenate(
    [labels_002, labels_004],
    axis=0
)


# ============================================================
# FINAL RESULTS
# ============================================================

print("\n====================================")
print("COMBINED DATASET")
print("====================================")

print("Segments shape:", segments.shape)
print("Labels shape:", labels.shape)

print("Normal segments:", np.sum(labels == 0))
print("Seizure segments:", np.sum(labels == 1))


# ============================================================
# SAVE
# ============================================================

np.save("segments.npy", segments)
np.save("labels.npy", labels)

print("\nSaved:")
print("segments.npy")
print("labels.npy")