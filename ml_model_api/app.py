# app.py

import numpy as np
import tensorflow as tf
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

# --------------------------------------------------
# 1. App setup
# --------------------------------------------------
app = Flask(__name__)

# ✅ ONE AND ONLY CORS CONFIG (DO NOT ADD ANYTHING ELSE)
CORS(app, resources={r"/*": {"origins": "*"}})

# --------------------------------------------------
# 2. Logging
# --------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger(__name__)
logger.info("🚀 App starting")

# --------------------------------------------------
# 3. Model config
# --------------------------------------------------
MODEL_PATH = "food_classifier_final_model.keras"
CLASS_INDICES_PATH = "class_indices.json"

model = None
labels = None

# --------------------------------------------------
# 4. Load model ONCE
# --------------------------------------------------
try:
    logger.info("🧠 Loading model")
    model = tf.keras.models.load_model(MODEL_PATH)

    logger.info("🏷️ Loading class indices")
    with open(CLASS_INDICES_PATH, "r") as f:
        class_indices = json.load(f)

    labels = {v: k for k, v in class_indices.items()}
    logger.info("✅ Model ready")

except Exception:
    logger.exception("❌ Model load failed")

# --------------------------------------------------
# 5. Health check
# --------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "ML API running"})

# --------------------------------------------------
# 6. Predict (NO OPTIONS, NO MANUAL HEADERS)
# --------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    logger.info("📥 /predict hit")

    if model is None or labels is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.get_json(silent=True)
    if not data or "image" not in data:
        return jsonify({"error": "No image data"}), 400

    image_array = np.array(data["image"])

    if image_array.size != 224 * 224 * 3:
        return jsonify({
            "error": "Invalid image size",
            "received": int(image_array.size)
        }), 400

    try:
        img = image_array.reshape(224, 224, 3)
        img = img * 255.0
        img = np.expand_dims(img, axis=0)
        img = tf.keras.applications.efficientnet_v2.preprocess_input(img)

        prediction = model.predict(img)
        idx = int(np.argmax(prediction[0]))

        return jsonify({
            "class": labels[idx],
            "confidence": round(float(np.max(prediction[0]) * 100), 2)
        })

    except Exception:
        logger.exception("🔥 Prediction failed")
        return jsonify({"error": "Prediction failed"}), 500

# --------------------------------------------------
# 7. Local run only
# --------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
