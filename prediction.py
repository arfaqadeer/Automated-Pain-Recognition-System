# pain_prediction_pipeline.py

import os
import numpy as np
import pandas as pd
from pathlib import Path
from scipy.stats import skew, kurtosis, entropy
from scipy.fft import fft, fftfreq
from tensorflow.keras.models import load_model
from sklearn.impute import SimpleImputer
import pickle

# === Configuration Variables ===
sampling_rate = 250
baseline_temp = 32
window_secs = 10
sensor_names = ["Bvp", "Eda_E4", "Resp", "Ecg", "Eda_RB", "Emg"]
num_repetitions = 8

# === Input and Output Paths ===
data_file = Path("./dataset/PMED/PMHDB/raw-data/S_03-synchronised-data.csv")  # Change to .xlsx if needed
np_dir = Path("dataset", "npy-dataset")

# === Helper Functions ===

def crossings_nonzero_neg2pos(data):
    npos = data < 0
    return (npos[:-1] & ~npos[1:]).nonzero()[0]

def to_categorical(y, num_classes=None, dtype="float32"):
    y = np.array(y, dtype="int")
    if not num_classes:
        num_classes = np.max(y) + 1
    n = y.shape[0]
    categorical = np.zeros((n, num_classes), dtype=dtype)
    categorical[np.arange(n), y] = 1
    return categorical

# === Segmentation Function ===

def segment_pmhdb(df, baseline_shift=5):
    X, y_heater, y_covas = [], [], []
    stim = (df["Heater_cleaned"] != baseline_temp).astype("int")
    stim[stim == False] = -1
    stim_starts = crossings_nonzero_neg2pos(stim.values)

    window = int(window_secs * sampling_rate)
    num_baseline_windows = 0

    for start in stim_starts:
        baseline_start = start - (baseline_shift * sampling_rate)
        if (num_baseline_windows < num_repetitions
            and baseline_start > window
            and (df["Heater_cleaned"].values[baseline_start - window: baseline_start] == baseline_temp).all()):
            X.append(df[sensor_names].values[baseline_start - window: baseline_start])
            y_covas.append(0)
            y_heater.append(0)
            num_baseline_windows += 1

        start += 1
        temp = df["Heater_cleaned"].values[start]
        end = int(start + window)
        if (df["Heater_cleaned"].values[start: end] == temp).all():
            X.append(df[sensor_names].values[start: end])
            y_covas.append(sum(df["COVAS"].values[start: end]))
            y_heater.append(temp)

    temps = np.unique(y_heater)
    conversion = {x: i for i, x in enumerate(temps)}
    y_heater = np.vectorize(conversion.get)(y_heater)

    y_covas = np.array(y_covas)
    y_covas = y_covas / y_covas.max() * 100
    y_covas = np.array([int(x // 25) + 1 if x > 0 else 0 for x in y_covas])
    y_covas[y_covas == 5] = 4

    return np.array(X), y_heater, y_covas

# === Main Processing Function ===

def process_single_file():
    if not data_file.exists():
        print(f"File '{data_file}' does not exist.")
        return

    if not np_dir.exists():
        os.makedirs(np_dir)

    if data_file.suffix == ".csv":
        df = pd.read_csv(data_file, sep=";", decimal=",")
    elif data_file.suffix in [".xlsx", ".xls"]:
        df = pd.read_excel(data_file)
    else:
        print("Unsupported file format. Only .csv and .xlsx are supported.")
        return

    X, y_heater, y_covas = segment_pmhdb(df)
    X = np.nan_to_num(X)
    X = X[..., np.newaxis]

    y_heater_cat = to_categorical(y_heater)
    y_covas_cat = to_categorical(y_covas)
    subjects = np.array([0] * X.shape[0])

    base_filename = data_file.stem

    np.save(np_dir / f"{base_filename}_X.npy", X)
    np.save(np_dir / f"{base_filename}_y_heater.npy", y_heater_cat)
    np.save(np_dir / f"{base_filename}_y_covas.npy", y_covas_cat)
    np.save(np_dir / f"{base_filename}_subjects.npy", subjects)

    print(f"✅ Saved processed .npy files for: {base_filename}")
    return X, y_heater_cat, y_covas_cat, subjects

# === Feature Extraction Functions ===

def extract_time_domain_features(data):
    feature_vector = []
    for sample in data:
        sample_features = []
        for channel in sample.T:
            sample_features.extend([
                np.mean(channel), np.std(channel), np.var(channel), np.min(channel), np.max(channel),
                np.ptp(channel), np.percentile(channel, 25), np.percentile(channel, 50), np.percentile(channel, 75),
                skew(channel, nan_policy="omit"), kurtosis(channel, nan_policy="omit"),
                entropy(np.histogram(channel, bins=10)[0] + 1),
                np.sum(channel), np.sqrt(np.mean(channel ** 2)), np.mean(np.abs(channel)),
                np.mean(np.diff(channel)), np.std(np.diff(channel)), np.min(np.diff(channel)),
                np.max(np.diff(channel)), np.mean(np.abs(np.diff(channel)))
            ])
        feature_vector.append(sample_features)
    return np.array(feature_vector)

def extract_frequency_domain_features(data, sample_rate=1.0):
    feature_vector = []
    for sample in data:
        sample_features = []
        for channel in sample.T:
            N = len(channel)
            freqs = fftfreq(N, 1 / sample_rate)
            fft_values = np.abs(fft(channel))
            sample_features.extend([
                np.sum(fft_values), np.mean(fft_values), np.std(fft_values),
                np.max(fft_values), freqs[np.argmax(fft_values)],
                np.sum(freqs * fft_values) / np.sum(fft_values),
                np.sum((freqs ** 2) * fft_values) / np.sum(fft_values)
            ])
        feature_vector.append(sample_features)
    return np.array(feature_vector)

# === Run Full Pipeline ===

def main():
    np.set_printoptions(precision=4, suppress=True, linewidth=150)

    # Load pre-trained model
    dl_model = load_model('pain_model.h5')
    print("[1] Deep learning model loaded.")

    # Load and process data
    X, y_heater_cat, y_covas_cat, subjects = process_single_file()
    loaded_data = X
    print(f"\n[3] Loaded data shape: {loaded_data.shape}")

    # Reshape and extract features
    X_features_reshaped = loaded_data.reshape(loaded_data.shape[0], loaded_data.shape[1], -1)
    print("Reshaped data:", X_features_reshaped.shape)
    time_features = extract_time_domain_features(X_features_reshaped)
    frequency_features = extract_frequency_domain_features(X_features_reshaped)
    combined_features = np.hstack((time_features, frequency_features))
    print("Combined feature shape:", combined_features.shape)

    # Impute missing values
    imputer = SimpleImputer(strategy="mean")
    combined_features = imputer.fit_transform(combined_features)

    # Load scaler and apply
    with open("scaler.pkl", "rb") as f:
        scaler = pickle.load(f)
    print("[5] Scaler loaded.")
    selected_features = scaler.transform(combined_features)

    # Predict pain levels
    predictions = dl_model.predict(selected_features)
    print("\n[6] Raw model predictions:\n", predictions)
    predicted_classes = np.argmax(predictions, axis=1)
    print("\n[6] Predicted class labels:\n", predicted_classes)

    # Final output
    print("\n[7] Predicted pain levels:", predicted_classes)

if __name__ == "__main__":
    main()
