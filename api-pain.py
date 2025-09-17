# from flask import Flask, request, jsonify
from flask import Flask, request, jsonify
from flask_cors import CORS  # Add this import
import os
import numpy as np
import pandas as pd
from pathlib import Path
from scipy.stats import skew, kurtosis, entropy
from scipy.fft import fft, fftfreq
from tensorflow.keras.models import load_model
from sklearn.impute import SimpleImputer
import pickle
import tempfile

app = Flask(__name__)
CORS(app)

# Load model and scaler
dl_model = load_model('pain_model.h5')
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

# Config
sampling_rate = 250
baseline_temp = 32
window_secs = 10
sensor_names = ["Bvp", "Eda_E4", "Resp", "Ecg", "Eda_RB", "Emg"]
num_repetitions = 8

# Helper functions
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

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files["file"]

    # Save file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename[-4:]) as tmp:
        file.save(tmp.name)
        temp_path = tmp.name

    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(temp_path, sep=";", decimal=",")
        elif file.filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(temp_path)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        X, y_heater_cat, y_covas_cat = segment_pmhdb(df)
        X = np.nan_to_num(X)[..., np.newaxis]
        reshaped = X.reshape(X.shape[0], X.shape[1], -1)
        time_features = extract_time_domain_features(reshaped)
        freq_features = extract_frequency_domain_features(reshaped)
        combined = np.hstack((time_features, freq_features))

        imputer = SimpleImputer(strategy="mean")
        combined = imputer.fit_transform(combined)
        features_scaled = scaler.transform(combined)

        predictions = dl_model.predict(features_scaled)
        predicted_classes = np.argmax(predictions, axis=1)

        return jsonify({
            "predicted_classes": predicted_classes.tolist()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(temp_path)
pass        

if __name__ == "__main__":
    app.run(port=5001, debug=True)
