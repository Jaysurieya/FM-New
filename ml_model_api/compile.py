import tensorflow as tf
import pickle
import numpy as np

# Load the pickled model data
with open('model.pkl', 'rb') as f:
    data = pickle.load(f)

# Reconstruct the model from JSON architecture
model = tf.keras.models.model_from_json(data['architecture'])

# Set the trained weights
model.set_weights(data['weights'])

# Recompile the model (essential for predictions)
model.compile(
    optimizer='adam', 
    loss='categorical_crossentropy',  # Match your original loss
    metrics=['accuracy']
)
