import pandas as pd

# Load seizure event information
events_file = "sub-002_ses-01_task-szMonitoring_run-01_events.tsv"
events = pd.read_csv(events_file, sep="\t")

# Recording duration
recording_duration = 11379.996

# Seizure intervals
seizures = []

for _, row in events.iterrows():
    start = row["onset"]
    end = start + row["duration"]
    seizures.append((start, end))

print("Seizure intervals:")
for start, end in seizures:
    print(f"{start} -> {end} seconds")

print("\nTotal recording duration:", recording_duration, "seconds")