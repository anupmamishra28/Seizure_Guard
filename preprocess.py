import numpy as np
from scipy.signal import butter, filtfilt

# ==========================================
# LOAD NEW OVERLAPPING SEGMENTS
# ==========================================

segments = np.load("subject_segments.npy")
labels = np.load("subject_labels.npy")
subjects = np.load("subject_ids.npy")

print("Original shape:", segments.shape)
print("Labels shape:", labels.shape)
print("Subjects shape:", subjects.shape)


# ==========================================
# EEG SAMPLING FREQUENCY
# ==========================================

sfreq = 256


# ==========================================
# BAND-PASS FILTER: 0.5–40 Hz
# ==========================================

lowcut = 0.5
highcut = 40.0


def bandpass_filter(signal, lowcut, highcut, fs, order=4):

    nyquist = 0.5 * fs

    low = lowcut / nyquist
    high = highcut / nyquist

    b, a = butter(
        order,
        [low, high],
        btype="band"
    )

    return filtfilt(
        b,
        a,
        signal
    )


# ==========================================
# CREATE FILTERED ARRAY
# ==========================================

filtered_segments = np.zeros_like(segments)


print("\nFiltering EEG segments...")


# Filter every segment and every channel
for i in range(segments.shape[0]):

    for ch in range(segments.shape[1]):

        filtered_segments[i, ch, :] = bandpass_filter(
            segments[i, ch, :],
            lowcut,
            highcut,
            sfreq
        )


# ==========================================
# RESULTS
# ==========================================

print("\nOriginal shape:", segments.shape)
print("Filtered shape:", filtered_segments.shape)


# ==========================================
# SAVE FILTERED DATA
# ==========================================

np.save(
    "filtered_segments.npy",
    filtered_segments
)

# Keep labels and subjects available
np.save(
    "filtered_labels.npy",
    labels
)

np.save(
    "filtered_subjects.npy",
    subjects
)


print("\nSaved:")
print("filtered_segments.npy")
print("filtered_labels.npy")
print("filtered_subjects.npy")