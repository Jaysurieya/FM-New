import tensorflow as tf
import pickle
import numpy as np

# Load your trained model
model = tf.keras.models.load_model('food_classifier_final_model.keras')

# Extract architecture (JSON) and weights
model_json = model.to_json()
weights = model.get_weights()

# Save to pickle file
with open('model.pkl', 'wb') as f:
    pickle.dump({
        'architecture': model_json,
        'weights': weights,
        'input_shape': model.input_shape,
        'output_shape': model.output_shape
    }, f)
