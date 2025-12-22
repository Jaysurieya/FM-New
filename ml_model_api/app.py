# app.py

import numpy as np
import tensorflow as tf
import json
import logging
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

# --------------------------------------------------
# 1. Flask App & CORS
# --------------------------------------------------
app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
)

# --------------------------------------------------
# 2. Logging Configuration (RENDER + GUNICORN SAFE)
# --------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(__name__)
logger.info("🚀 Flask app starting up")

# --------------------------------------------------
# 3. Model Configuration
# --------------------------------------------------
MODEL_PATH = "food_classifier_final_model.keras"
CLASS_INDICES_PATH = "class_indices.json"

model = None
labels = None

# --------------------------------------------------
# 4. Load Model & Labels ONCE
# --------------------------------------------------
try:
    logger.info(f"🧠 Loading model from {MODEL_PATH}")
    model = tf.keras.models.load_model(MODEL_PATH)

    logger.info(f"🏷️ Loading class indices from {CLASS_INDICES_PATH}")
    with open(CLASS_INDICES_PATH, "r") as f:
        class_indices = json.load(f)

    labels = {v: k for k, v in class_indices.items()}
    logger.info("✅ Model and labels loaded successfully")

except Exception as e:
    logger.exception("❌ Failed to load model or labels")

# --------------------------------------------------
# 5. Health Check Route
# --------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    logger.info("🏠 Health check hit")
    return jsonify({"status": "ML API is running 🚀"})

# --------------------------------------------------
# 6. Predict Route
# --------------------------------------------------
@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    logger.info("📥 /predict endpoint hit")

    # Handle CORS preflight
    if request.method == "OPTIONS":
        logger.info("🟡 OPTIONS preflight request")
        resp = make_response(("", 204))
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
        return resp

    if model is None or labels is None:
        logger.error("❌ Model or labels not loaded")
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json(silent=True)
        logger.info(
            f"📦 Request JSON keys: {list(data.keys()) if data else 'NO DATA'}"
        )

        if not data or "image" not in data:
            logger.warning("⚠️ No image found in request")
            return jsonify({"error": "No image data found"}), 400

        image_array = np.array(data["image"])
        logger.info(f"🖼️ Image array length: {image_array.size}")

        expected_size = 224 * 224 * 3
        if image_array.size != expected_size:
            logger.warning(
                f"⚠️ Invalid image size: received {image_array.size}, expected {expected_size}"
            )
            return jsonify(
                {
                    "error": "Invalid image size",
                    "received": int(image_array.size),
                    "expected": expected_size,
                }
            ), 400

        # Preprocessing
        image_reshaped = image_array.reshape(224, 224, 3)
        image_scaled = image_reshaped * 255.0
        img_batch = np.expand_dims(image_scaled, axis=0)

        img_preprocessed = tf.keras.applications.efficientnet_v2.preprocess_input(
            img_batch
        )

        logger.info("⚙️ Image preprocessing completed")

        # Prediction
        prediction = model.predict(img_preprocessed)
        predicted_index = int(np.argmax(prediction[0]))
        predicted_class = labels[predicted_index]
        confidence = float(np.max(prediction[0]) * 100)

        logger.info(
            f"✅ Prediction success → {predicted_class} ({confidence:.2f}%)"
        )

        return jsonify(
            {
                "class": predicted_class,
                "confidence": round(confidence, 2),
            }
        )

    except Exception:
        logger.exception("🔥 Prediction failed due to exception")
        return jsonify({"error": "Prediction failed"}), 500


# Ensure CORS headers are always present (covers any handler including preflight)
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


# --------------------------------------------------
# 7. Local Development Entry Point
# --------------------------------------------------
if __name__ == "__main__":
    logger.info("🧪 Running Flask in debug mode (local only)")
    app.run(host="0.0.0.0", port=5001, debug=True)
