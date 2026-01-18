import os
import numpy as np
import joblib
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image

# =====================================
# INITIALIZE FLASK APP
# =====================================
app = Flask(__name__)
CORS(app)

# =====================================
# LOAD MODELS
# =====================================
MODEL_DIR = "models"

print("[INFO] Loading models...")

feature_extractor = load_model(
    os.path.join(MODEL_DIR, "efficientnet_feature_extractor.h5"),
    compile=False
)

svm_model = joblib.load(
    os.path.join(MODEL_DIR, "svm_model.pkl")
)

label_encoder = joblib.load(
    os.path.join(MODEL_DIR, "label_encoder.pkl")
)

print("[INFO] Models loaded successfully!")

IMAGE_SIZE = 224

# =====================================
# HELPER FUNCTION
# =====================================
def prepare_image(image):
    image = image.convert("RGB")
    image = image.resize((IMAGE_SIZE, IMAGE_SIZE))
    image = np.array(image)
    image = preprocess_input(image)
    image = np.expand_dims(image, axis=0)
    return image

# =====================================
# ROUTES
# =====================================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/")
def home():
    return jsonify({
        "status": "Apple Disease Prediction API is running"
    })

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        image = Image.open(file)
        processed_image = prepare_image(image)

        # Extract features
        features = feature_extractor.predict(processed_image)
        features = features.reshape(1, -1)

        # Predict
        probabilities = svm_model.predict_proba(features)[0]
        predicted_index = np.argmax(probabilities)
        confidence = float(probabilities[predicted_index])

        disease_name = label_encoder.inverse_transform(
            [predicted_index]
        )[0]

        return jsonify({
            "disease": disease_name,
            "confidence": round(confidence * 100, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =====================================
# RUN SERVER
# =====================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
