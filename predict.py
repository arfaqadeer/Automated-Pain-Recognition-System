import numpy as np
import pandas as pd
from scipy.stats import skew, kurtosis, entropy
from scipy.fft import fft, fftfreq
import joblib
from tensorflow.keras.models import load_model

# ========== Step 1: Load and preprocess CSV ==========
sensor_names = ["Bvp", "Eda_E4", "Resp", "Eda_RB", "Ecg", "Emg"]

def load_sensor_csv(path):
    df = pd.read_csv(path, sep=";", decimal=",")
    
    # Keep only sensor columns, fill missing with zeros
    for sensor in sensor_names:
        if sensor not in df.columns:
            df[sensor] = 0.0
    df = df[sensor_names]  # Ensure order
    
    return df.to_numpy().T[np.newaxis, ...]  # shape: (1, 6, timepoints)

# ========== Step 2: Feature Extraction ==========
def extract_time_features(sample):
    features = []
    for channel in sample.T:
        features.extend([
            np.mean(channel), np.std(channel), np.var(channel),
            np.min(channel), np.max(channel), np.ptp(channel),
            np.percentile(channel, 25), np.percentile(channel, 50), np.percentile(channel, 75),
            skew(channel, nan_policy="omit"), kurtosis(channel, nan_policy="omit"),
            entropy(np.histogram(channel, bins=10)[0] + 1),
            np.sum(channel), np.sqrt(np.mean(channel ** 2)),
            np.mean(np.abs(channel)), np.mean(np.diff(channel)),
            np.std(np.diff(channel)), np.min(np.diff(channel)),
            np.max(np.diff(channel)), np.mean(np.abs(np.diff(channel)))
        ])
    return np.array(features)

def extract_freq_features(sample, sample_rate=1.0):
    features = []
    for channel in sample.T:
        N = len(channel)
        freqs = fftfreq(N, 1 / sample_rate)
        fft_vals = np.abs(fft(channel))
        features.extend([
            np.sum(fft_vals), np.mean(fft_vals), np.std(fft_vals),
            np.max(fft_vals), freqs[np.argmax(fft_vals)],
            np.sum(freqs * fft_vals) / np.sum(fft_vals),
            np.sum((freqs ** 2) * fft_vals) / np.sum(fft_vals),
        ])
    return np.array(features)

# ========== Step 3: Load, Extract, Select, Normalize ==========
def prepare_features(csv_path):
    data = load_sensor_csv(csv_path)
    
    time_feat = extract_time_features(data[0])  # shape: (120,)
    freq_feat = extract_freq_features(data[0])  # shape: (42,)
    combined_feat = np.hstack((time_feat, freq_feat)).reshape(1, -1)  # shape: (1, 162)

    # Load selectors and scalers
    selector = joblib.load("feature_selector.pkl")
    scaler = joblib.load("scaler.pkl")
    
    selected_feat = selector.transform(combined_feat)
    normalized_feat = scaler.transform(selected_feat)
    
    return normalized_feat  # shape: (1, 100) or whatever K you selected

# ========== Step 4: Load Model & Predict ==========
def predict_pain_level(csv_path, model_path="pain_model.h5"):
    features = prepare_features(csv_path)
    model = joblib.load(model_path)
    prediction = model.predict(features)
    print(f"Predicted Pain Level: {int(prediction[0])}")

# ========== Run Example ==========
if __name__ == "__main__":
    predict_pain_level("dataset/PMCD/PMPDB/raw-data/P01_1/P01_1.csv")  # replace with your file name
