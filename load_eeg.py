import mne

file_path = "sub-002_ses-01_task-szMonitoring_run-01_eeg.edf"

raw = mne.io.read_raw_edf(file_path, preload=True)

print(raw)
print("Channels:", len(raw.ch_names))
print("Sampling frequency:", raw.info["sfreq"])
print("Channels:", raw.ch_names)
print("Sampling frequency:", raw.info["sfreq"])
print("Duration:", raw.times[-1], "seconds")

print("\nEEG information:")
print(raw.info)
import matplotlib.pyplot as plt

# Plot first 10 seconds of EEG
raw.plot(
    duration=10,
    n_channels=2,
    scalings="auto"
)

plt.show()