import numpy as np
import mne
import os

# ==============================
# SETTINGS
# ==============================

PROJECT = r"C:\Users\Eshu\Downloads\EEG_Seizure_Project"

WINDOW_SEC = 10
STEP_SEC = 2
SFREQ = 256

WINDOW_SAMPLES = WINDOW_SEC * SFREQ
STEP_SAMPLES = STEP_SEC * SFREQ


# ==============================
# SUBJECT INFORMATION
# ==============================

subjects_info = [
    {
        "subject": "sub-002",
        "edf": "sub-002_ses-01_task-szMonitoring_run-01_eeg.edf",
        "events": "sub-002_ses-01_task-szMonitoring_run-01_events.tsv"
    },
    {
        "subject": "sub-004",
        "edf": "sub-004_ses-01_task-szMonitoring_run-01_eeg.edf",
        "events": "sub-004_ses-01_task-szMonitoring_run-01_events.tsv"
    }
]


all_segments = []
all_labels = []
all_subjects = []


# ==============================
# PROCESS EACH SUBJECT
# ==============================

for info in subjects_info:

    subject = info["subject"]

    edf_path = os.path.join(PROJECT, info["edf"])
    events_path = os.path.join(PROJECT, info["events"])

    print("\n====================================")
    print("Processing:", subject)
    print("====================================")

    # Load EEG
    raw = mne.io.read_raw_edf(
        edf_path,
        preload=True,
        verbose=False
    )

    data = raw.get_data()

    print("EEG shape:", data.shape)

    # Load seizure events
    events = []

    with open(events_path, "r") as f:

        lines = f.readlines()

        for line in lines[1:]:

            parts = line.strip().split("\t")

            if len(parts) < 2:
                continue

            try:
                onset = float(parts[0])
                duration = float(parts[1])

                events.append(
                    (onset, onset + duration)
                )

            except ValueError:
                continue

    print("Seizure events:", events)


    # ==============================
    # CREATE OVERLAPPING WINDOWS
    # ==============================

    subject_segments = []
    subject_labels = []

    total_samples = data.shape[1]

    for start in range(
        0,
        total_samples - WINDOW_SAMPLES + 1,
        STEP_SAMPLES
    ):

        end = start + WINDOW_SAMPLES

        segment = data[:, start:end]

        start_sec = start / SFREQ
        end_sec = end / SFREQ

        label = 0

        # Check whether window overlaps seizure
        for seizure_start, seizure_end in events:

            if (
                start_sec < seizure_end
                and
                end_sec > seizure_start
            ):
                label = 1
                break

        subject_segments.append(segment)
        subject_labels.append(label)


    subject_segments = np.array(subject_segments)
    subject_labels = np.array(subject_labels)

    print("Segments:", subject_segments.shape)
    print("Normal:", np.sum(subject_labels == 0))
    print("Seizure:", np.sum(subject_labels == 1))


    all_segments.extend(subject_segments)
    all_labels.extend(subject_labels)
    all_subjects.extend(
        [subject] * len(subject_labels)
    )


# ==============================
# SAVE EVERYTHING
# ==============================

all_segments = np.array(all_segments)
all_labels = np.array(all_labels)
all_subjects = np.array(all_subjects)


print("\n====================================")
print("FINAL DATASET")
print("====================================")

print("Total segments:", all_segments.shape)
print("Normal:", np.sum(all_labels == 0))
print("Seizure:", np.sum(all_labels == 1))

print("\nSubjects:")

for subject in np.unique(all_subjects):

    mask = all_subjects == subject

    print(
        subject,
        "→",
        np.sum(mask),
        "segments,",
        np.sum(all_labels[mask] == 1),
        "seizure"
    )


np.save("subject_segments.npy", all_segments)
np.save("subject_labels.npy", all_labels)
np.save("subject_ids.npy", all_subjects)

print("\nSaved:")
print("subject_segments.npy")
print("subject_labels.npy")
print("subject_ids.npy")