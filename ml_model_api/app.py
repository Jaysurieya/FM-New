# app.py

import numpy as np
import tensorflow as tf
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. Configuration ---
app = Flask(__name__)
CORS(app) 

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

# --- 3. Create the /predict Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    # Check if the model and labels loaded correctly
    if model is None or labels is None:
        return jsonify({'error': 'Model or labels not loaded, check server logs.'}), 500

    # Get the image data from the request
    data = request.get_json()
    if 'image' not in data:
        return jsonify({'error': 'No image data found in request'}), 400

    try:
        # The frontend sends a flat array of normalized pixel values (0 to 1)
        image_array = np.array(data['image'])
        
        # --- 4. Preprocess the Image EXACTLY as in your notebook ---
        
        # a. Reshape the flat array back into an image format (height, width, channels)
        image_reshaped = image_array.reshape(224, 224, 3)
        
        # b. Scale pixel values from [0, 1] to [0, 255] because the preprocess_input function expects this range
        image_scaled = image_reshaped * 255.0
        
        # c. Add a batch dimension to make the shape (1, 224, 224, 3)
        img_batch = np.expand_dims(image_scaled, axis=0)
        
        # d. Apply the specific preprocessing for EfficientNetV2
        img_preprocessed = tf.keras.applications.efficientnet_v2.preprocess_input(img_batch)

        # --- 5. Make a Prediction ---
        prediction = model.predict(img_preprocessed)
        
        predicted_index = int(np.argmax(prediction[0])) # Convert to standard Python int
        predicted_class_name = labels[predicted_index]
        confidence = float(np.max(prediction[0]) * 100) # Convert to standard Python float

        # Create the response
        response = {
            'class': predicted_class_name,
            'confidence': round(confidence, 2)
        }
        return jsonify(response)

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': 'Could not process the image for prediction.'}), 500

# --- 6. Run the Flask Application ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)