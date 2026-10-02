import numpy as np
from scipy.signal import welch


class FeatureAgent:

    def extract_features(self, segment):
        """
        Convert one EEG segment of shape (2, 2560)
        into the 24 features expected by the trained model.
        """

        segment = np.asarray(segment)

        if segment.shape != (2, 2560):
            raise ValueError(
                f"Expected EEG segment shape (2, 2560), "
                f"but received {segment.shape}"
            )

        features = []

        for channel in segment:

            mean = np.mean(channel)
            std = np.std(channel)
            variance = np.var(channel)
            minimum = np.min(channel)
            maximum = np.max(channel)
            rms = np.sqrt(np.mean(channel ** 2))
            energy = np.sum(channel ** 2)

            frequencies, power = welch(
                channel,
                fs=256,
                nperseg=256
            )

            delta = np.sum(
                power[(frequencies >= 0.5) & (frequencies < 4)]
            )

            theta = np.sum(
                power[(frequencies >= 4) & (frequencies < 8)]
            )

            alpha = np.sum(
                power[(frequencies >= 8) & (frequencies < 13)]
            )

            beta = np.sum(
                power[(frequencies >= 13) & (frequencies < 30)]
            )

            gamma = np.sum(
                power[(frequencies >= 30) & (frequencies <= 40)]
            )

            features.extend([
                mean,
                std,
                variance,
                minimum,
                maximum,
                rms,
                energy,
                delta,
                theta,
                alpha,
                beta,
                gamma
            ])

        return np.array(features)


if __name__ == "__main__":

    agent = FeatureAgent()

    test_segment = np.zeros((2, 2560))

    features = agent.extract_features(test_segment)

    print("\n===== FEATURE AGENT =====")
    print("Input shape:", test_segment.shape)
    print("Output shape:", features.shape)
    print("Number of features:", len(features))
    print("Features:", features)