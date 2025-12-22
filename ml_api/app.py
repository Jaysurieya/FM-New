import pickle
import json
import numpy as np
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

# -----------------------------------
# 1. App setup
# -----------------------------------
app = Flask(__name__)

# ✅ ONLY ALLOW YOUR STATIC SITE    
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "https://fm-new.onrender.com"
            ]
        }
    }
)

# -----------------------------------
# 2. Logging
# -----------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("🚀 ML API starting")

# -----------------------------------
# 3. Load model + class indices ONCE
# -----------------------------------
model = None
labels = None

try:
    # Load model
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    logger.info("✅ model.pkl loaded")

    # Load class indices
    with open("class_indices.json", "r") as f:
        class_indices = json.load(f)

    # Reverse mapping: index → label
    labels = {v: k for k, v in class_indices.items()}
    logger.info("✅ class indices loaded")

except Exception:
    logger.exception("❌ Failed to load model or class indices")

# -----------------------------------
# 4. Health check
# -----------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "ML API running"})

# -----------------------------------
# 5. Predict route
# -----------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    if model is None or labels is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.get_json(silent=True)
    if not data or "input" not in data:
        return jsonify({"error": "Missing input"}), 400

    try:
        features = np.array(data["input"]).reshape(1, -1)

        probs = model.predict(features)[0]
        idx = int(np.argmax(probs))

        return jsonify({
            "class": labels[idx],                       # 🔥 STRING LABEL
            "confidence": round(float(probs[idx] * 100), 2)
        })

    except Exception:
        logger.exception("🔥 Prediction failed")
        return jsonify({"error": "Prediction failed"}), 500
