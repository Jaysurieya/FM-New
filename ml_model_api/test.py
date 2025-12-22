# import tkinter as tk
# from tkinter import filedialog, messagebox
# import tensorflow as tf
# import pickle
# import numpy as np
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# from tensorflow.keras.applications.efficientnet import preprocess_input
# import matplotlib.pyplot as plt
# from PIL import Image, ImageTk

# # Load your pickled model (run this once)
# with open('model.pkl', 'rb') as f:
#     data = pickle.load(f)
# model = tf.keras.models.model_from_json(data['architecture'])
# model.set_weights(data['weights'])
# model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# def predict_image():
#     # Open file dialog to select image
#     file_path = filedialog.askopenfilename(
#         title="Select Food Image",
#         filetypes=[("Image files", "*.jpg *.jpeg *.png *.bmp *.tiff")]
#     )
    
#     if not file_path:
#         return  # User cancelled
    
#     try:
#         # Load and preprocess image
#         img = load_img(file_path, target_size=(224, 224))
#         img_array = img_to_array(img)
#         img_array = np.expand_dims(img_array, axis=0)
#         img_array = preprocess_input(img_array)
        
#         # Predict
#         prediction = model.predict(img_array, verbose=0)
#         class_id = np.argmax(prediction[0])
#         confidence = np.max(prediction[0])
        
#         # Display results
#         result = f"Predicted Class: {class_id}\nConfidence: {confidence:.2%}"
#         messagebox.showinfo("Prediction Result", result)
        
#         # Optional: Show image with prediction overlay
#         show_image_with_prediction(file_path, class_id, confidence)
        
#     except Exception as e:
#         messagebox.showerror("Error", f"Failed to process image: {str(e)}")

# def show_image_with_prediction(img_path, class_id, confidence):
#     # Display image with prediction
#     img = Image.open(img_path)
#     plt.figure(figsize=(8, 6))
#     plt.imshow(img)
#     plt.title(f"Predicted: Class {class_id} ({confidence:.2%})", fontsize=16, pad=20)
#     plt.axis('off')
#     plt.tight_layout()
#     plt.show()

# # Create simple GUI
# root = tk.Tk()
# root.title("Food Recognition Model")
# root.geometry("300x150")

# btn = tk.Button(root, text="📁 Choose Image & Predict", 
#                 command=predict_image, font=("Arial", 14), 
#                 bg="#4CAF50", fg="white", pady=20)
# btn.pack(expand=True, fill='both', padx=20, pady=20)

# root.mainloop()


# import tkinter as tk
# from tkinter import filedialog, messagebox
# import tensorflow as tf
# import numpy as np
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# from tensorflow.keras.applications.efficientnet import preprocess_input
# import matplotlib.pyplot as plt
# from PIL import Image

# # Load your ORIGINAL .keras model directly
# model = tf.keras.models.load_model('food_classifier_final_model.keras')  # Your original file

# # YOUR CLASS NAMES (replace with actual food names)
# CLASS_NAMES = [
#     'apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare',
#     # Add ALL your classes here - exact training order
# ]

# def predict_image():
#     file_path = filedialog.askopenfilename(
#         title="Select Food Image",
#         filetypes=[("Image files", "*.jpg *.jpeg *.png *.bmp *.tiff")]
#     )
    
#     if not file_path:
#         return
    
#     try:
#         # Load and preprocess image
#         img = load_img(file_path, target_size=(224, 224))
#         img_array = img_to_array(img)
#         img_array = np.expand_dims(img_array, axis=0)
#         img_array = preprocess_input(img_array)
        
#         # Predict
#         prediction = model.predict(img_array, verbose=0)
#         class_id = np.argmax(prediction[0])
#         confidence = np.max(prediction[0])
#         class_name = CLASS_NAMES[class_id]
        
#         # Top 3 predictions
#         top_3_indices = np.argsort(prediction[0])[-3:][::-1]
#         top_3 = [(CLASS_NAMES[i], prediction[0][i]) for i in top_3_indices]
        
#         result = f"🍕 Predicted: **{class_name}**\n✅ Confidence: {confidence:.2%}\n\nTop 3 Predictions:\n"
#         for name, conf in top_3:
#             result += f"• {name}: {conf:.2%}\n"
            
#         messagebox.showinfo("Food Recognition Result", result)
#         show_image_with_prediction(file_path, class_name, confidence)
        
#     except Exception as e:
#         messagebox.showerror("Error", f"Failed to process: {str(e)}")

# def show_image_with_prediction(img_path, class_name, confidence):
#     img = Image.open(img_path)
#     plt.figure(figsize=(10, 8))
#     plt.imshow(img)
#     plt.title(f"🍲 {class_name}\nConfidence: {confidence:.1%}", 
#               fontsize=16, fontweight='bold', pad=20)
#     plt.axis('off')
#     plt.tight_layout()
#     plt.show()

# # GUI
# root = tk.Tk()
# root.title("🍕 Food Recognition - Keras Model")
# root.geometry("400x200")
# root.configure(bg='#f0f8ff')

# tk.Label(root, text="Upload Food Image", font=("Arial", 14, "bold"), bg='#f0f8ff').pack(pady=10)
# tk.Label(root, text="Using your .keras model directly", font=("Arial", 10), bg='#f0f8ff').pack()

# btn = tk.Button(root, text="📁 Choose Image & Predict", 
#                 command=predict_image, font=("Arial", 14, "bold"), 
#                 bg="#FF6B35", fg="white", pady=15, relief='flat')
# btn.pack(expand=True, fill='both', padx=30, pady=20)

# root.mainloop()

import tkinter as tk
from tkinter import filedialog, messagebox
import tensorflow as tf
import pickle
import numpy as np
import json
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.efficientnet import preprocess_input
import matplotlib.pyplot as plt
from PIL import Image, ImageTk

# Load your pickled model
with open('model.pkl', 'rb') as f:
    data = pickle.load(f)
model = tf.keras.models.model_from_json(data['architecture'])
model.set_weights(data['weights'])
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Load class names from YOUR JSON file
with open('class_indices.json', 'r') as f:
    class_indices = json.load(f)
CLASS_NAMES = {v: k for k, v in class_indices.items()}  # {0: 'biriyani', 1: 'dosa'}

def predict_image():
    file_path = filedialog.askopenfilename(
        title="Select Food Image",
        filetypes=[("Image files", "*.jpg *.jpeg *.png *.bmp *.tiff")]
    )
    
    if not file_path:
        return
    
    try:
        img = load_img(file_path, target_size=(224, 224))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        prediction = model.predict(img_array, verbose=0)
        class_id = np.argmax(prediction[0])
        confidence = np.max(prediction[0])
        class_name = CLASS_NAMES[class_id]  # REAL NAME INSTEAD OF NUMBER
        
        result = f"Predicted: {class_name}\nConfidence: {confidence:.2%}"
        messagebox.showinfo("Prediction Result", result)
        
        show_image_with_prediction(file_path, class_name, confidence)
        
    except Exception as e:
        messagebox.showerror("Error", f"Failed to process image: {str(e)}")

def show_image_with_prediction(img_path, class_name, confidence):
    img = Image.open(img_path)
    plt.figure(figsize=(8, 6))
    plt.imshow(img)
    plt.title(f"Predicted: {class_name} ({confidence:.2%})", fontsize=16, pad=20)
    plt.axis('off')
    plt.tight_layout()
    plt.show()

# GUI
root = tk.Tk()
root.title("Food Recognition Model")
root.geometry("300x150")

btn = tk.Button(root, text="📁 Choose Image & Predict", 
                command=predict_image, font=("Arial", 14), 
                bg="#4CAF50", fg="white", pady=20)
btn.pack(expand=True, fill='both', padx=20, pady=20)

root.mainloop()
