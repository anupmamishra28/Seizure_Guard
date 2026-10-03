import numpy as np
import pytest

from feature_agent import FeatureAgent


def test_feature_extraction():
    agent = FeatureAgent()

    # Sample EEG data: 2 channels × 2560 samples
    segment = np.zeros((2, 2560))

    features = agent.extract_features(segment)

    # The model expects 24 features
    assert features.shape == (24,)


def test_feature_extraction_with_real_values():
    agent = FeatureAgent()

    # Create sample EEG data
    segment = np.ones((2, 2560))

    features = agent.extract_features(segment)

    # Features should be generated
    assert len(features) == 24

    # All returned values should be numeric
    assert np.all(np.isfinite(features))


def test_invalid_eeg_shape():
    agent = FeatureAgent()

    # Wrong shape
    segment = np.zeros((2560,))

    # The program should reject incorrect input
    with pytest.raises(ValueError):
        agent.extract_features(segment)