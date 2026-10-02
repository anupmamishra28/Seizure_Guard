import numpy as np

from Agents.agent_workflow import SeizureGuardWorkflow


# Load actual EEG segments
segments = np.load("Data/segments.npy")

print("===================================")
print("      REAL EEG TEST")
print("===================================")

print("Dataset shape:", segments.shape)

# Take one real EEG segment
test_segment = segments[0]

print("Test segment shape:", test_segment.shape)

# Run complete workflow
workflow = SeizureGuardWorkflow()

result = workflow.run(test_segment)

print("\n===================================")
print("          RESULTS")
print("===================================")

print("\nPrediction:")
print(result["prediction"])

print("\nRisk:")
print(result["risk"])

print("\nAlert:")
print(result["alert"])

print("\n===================================")