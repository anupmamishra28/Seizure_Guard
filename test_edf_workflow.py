import mne
from agent_workflow import SeizureGuardWorkflow

# Load the EDF file
edf_path = "sub-002_ses-01_task-szMonitoring_run-01_eeg.edf"

raw = mne.io.read_raw_edf(
    edf_path,
    preload=False,
    verbose=False
)

# Take the first 10 seconds = 2560 samples at 256 Hz
eeg_segment = raw.get_data(
    picks="eeg",
    start=0,
    stop=2560
)

print("EEG shape:", eeg_segment.shape)

# Run the actual AgentWorkflow
workflow = SeizureGuardWorkflow()

result = workflow.run(eeg_segment)

print("\nPrediction:", result["prediction"])
print("Risk:", result["risk"])
print("Alert:", result["alert"])