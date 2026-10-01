import pandas as pd

events_file = "sub-002_ses-01_task-szMonitoring_run-01_events.tsv"

events = pd.read_csv(events_file, sep="\t")

print("EVENT DATA:")
print(events)

print("\nCOLUMNS:")
print(events.columns.tolist())
