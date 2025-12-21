# app.py
# .\venv\Scripts\Activate.ps1

import numpy as np
import tensorflow as tf
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# --- 1. Configuration ---
app = Flask(__name__)
CORS(
    app,
    origins=["https://fm-new-3.onrender.com"],
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)


# The names of the files you have saved
MODEL_PATH = 'food_classifier_final_model.keras'
CLASS_INDICES_PATH = 'class_indices.json'
model = None
labels = None

# --- 2. Load Model and Labels (once at startup) ---
try:
    print(f"🧠 Loading model from: {MODEL_PATH}")
    # Load the entire model
    model = tf.keras.models.load_model(MODEL_PATH)
    
    print(f"🏷️ Loading class labels from: {CLASS_INDICES_PATH}")
    # Load the dictionary that maps class names to indices
    with open(CLASS_INDICES_PATH, 'r') as f:
        class_indices = json.load(f)
    
    # Invert the dictionary to map indices back to class names (e.g., {0: 'biriyani'})
    labels = {v: k for k, v in class_indices.items()}
    
    print("✅ Model and labels loaded successfully!")

except Exception as e:
    print(f"❌ Error loading files: {e}")
    print(f"Please ensure '{MODEL_PATH}' and '{CLASS_INDICES_PATH}' are in the same folder as app.py.")

#test 
@app.route('/', methods=['GET'])
def home():
    return jsonify({'status': 'ML API is running 🚀'})

# --- 3. Create the /predict Endpoint ---
@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    logger.info("📥 /predict endpoint hit")

    # Handle preflight request
    if request.method == 'OPTIONS':
        logger.info("🟡 OPTIONS preflight request received")
        return '', 204

    if model is None or labels is None:
        logger.error("❌ Model or labels not loaded")
        return jsonify({'error': 'Model or labels not loaded'}), 500

    try:
        data = request.get_json(silent=True)
        logger.info(f"📦 Request JSON keys: {list(data.keys()) if data else 'NO DATA'}")

        if not data or 'image' not in data:
            logger.warning("⚠️ No image found in request")
            return jsonify({'error': 'No image data found'}), 400

        image_array = np.array(data['image'])
        print("Image length:", len(image_array), flush=True)

        if image_array.size != 224*224*3:
            return jsonify({
                "error": "Invalid image size",
                "received": int(image_array.size)
            }), 400
        logger.info(f"🖼️ Image array shape (flat): {image_array.shape}")

        image_reshaped = image_array.reshape(224, 224, 3)
        logger.info("🔄 Image reshaped to 224x224x3")

        image_scaled = image_reshaped * 255.0
        img_batch = np.expand_dims(image_scaled, axis=0)

        img_preprocessed = tf.keras.applications.efficientnet_v2.preprocess_input(img_batch)
        logger.info("⚙️ Image preprocessing completed")

        prediction = model.predict(img_preprocessed)
        logger.info(f"📊 Raw prediction output: {prediction}")

        predicted_index = int(np.argmax(prediction[0]))
        predicted_class_name = labels[predicted_index]
        confidence = float(np.max(prediction[0]) * 100)

        logger.info(f"✅ Prediction success: {predicted_class_name} ({confidence:.2f}%)")

        return jsonify({
            'class': predicted_class_name,
            'confidence': round(confidence, 2)
        })

    except Exception as e:
        logger.exception("🔥 Prediction failed with exception")
        return jsonify({'error': 'Prediction failed'}), 500


# --- 6. Run the Flask Application ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)