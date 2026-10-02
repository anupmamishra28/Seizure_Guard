import numpy as np
from pexpect import EOF

from Agents.agent_workflow import SeizureGuardWorkflow

segments = np.load("Data/segments.npy")
labels = np.load("Data/labels.npy")

index = 404

print("===================================")
print("      KNOWN SEIZURE TEST")
print("===================================")

print("Dataset shape:", segments.shape)
print("Selected segment:", index)
print("Actual label:", labels[index])

test_segment = segments[index]

print("Test segment shape:", test_segment.shape)

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
EOF