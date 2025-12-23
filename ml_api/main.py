# import os
# import pickle
# import json
# import numpy as np
# import logging
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import tensorflow as tf

# # -----------------------------------
# # Logging
# # -----------------------------------
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # -----------------------------------
# # FastAPI app
# # -----------------------------------
# app = FastAPI()

# # 🔥 CORS — REPLACE WITH YOUR STATIC SITE URL
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://fm-new-3.onrender.com",
#         'http://localhost:5173'
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # -----------------------------------
# # Request schema
# # -----------------------------------
# class ImageInput(BaseModel):
#     input: list[float]

# # -----------------------------------
# # Load model & labels ONCE (GLOBAL)
# # -----------------------------------
# model = None
# labels = None

# @app.on_event("startup")
# def load_model():
#     """Load PKL model + class_indices.json"""
#     global model, labels

#     class_indices_path = "class_indices.json"
#     pickle_path = "model.pkl"

#     try:
#         # Load class labels
#         logger.info("🏷️ Loading class indices from %s", class_indices_path)
#         with open(class_indices_path, "r") as f:
#             class_indices = json.load(f)
#         labels = {int(v): k for k, v in class_indices.items()}
#         logger.info(f"✅ Loaded {len(labels)} class labels")

#         # Load PKL model data
#         if not os.path.exists(pickle_path):
#             raise RuntimeError(f"model.pkl not found in {os.getcwd()}")
        
#         logger.info("🧠 Loading model.pkl...")
#         with open(pickle_path, "rb") as f:
#             data = pickle.load(f)
        
#         # REBUILD Keras model from PKL
#         model = tf.keras.models.model_from_json(data['architecture'])
#         model.set_weights(data['weights'])
#         model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        
#         logger.info("✅ Keras model rebuilt and compiled from PKL")
#         logger.info(f"📏 Input shape: {model.input_shape}, Classes: {model.output_shape[-1]}")

#     except Exception as e:
#         logger.exception("❌ Failed to load model.pkl: %s", e)
#         raise RuntimeError(f"Failed to load model.pkl: {e}")

# # -----------------------------------
# # Health check
# # -----------------------------------
# @app.get("/")
# def home():
#     return {"status": "ML API running", "model_loaded": model is not None}

# # -----------------------------------
# # Predict endpoint
# # -----------------------------------
# @app.post("/predict")
# def predict(data: ImageInput):
#     if model is None or labels is None:
#         raise HTTPException(status_code=500, detail="Model not loaded")

#     try:
#         # Reshape input to (1, 224, 224, 3)
#         image_array = np.array(data.input, dtype=np.float32)
#         expected_size = 224 * 224 * 3  # 150528
        
#         if image_array.size != expected_size:
#             raise HTTPException(status_code=400, detail=f"Invalid input size: {image_array.size}, expected {expected_size}")

#         # Reshape to image format
#         img = image_array.reshape(1, 224, 224, 3)
        
#         # Predict
#         prediction = model.predict(img, verbose=0)
#         pred = prediction[0]
#         class_idx = np.argmax(pred)
#         confidence = float(pred[class_idx])
        
#         return {
#             "class_id": int(class_idx),
#             "class": labels[class_idx],
#             "confidence": round(confidence * 100, 2),
#             "top_3": [
#                 {"class": labels[i], "confidence": float(pred[i] * 100)}
#                 for i in np.argsort(pred)[-3:][::-1]
#             ]
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.exception("Prediction error: %s", e)
#         raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

import os
import pickle
import json
import numpy as np
import logging
import tensorflow as tf

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -----------------------------------
# Logging
# -----------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger(__name__)

# -----------------------------------
# FastAPI app
# -----------------------------------
app = FastAPI()

# -----------------------------------
# CORS
# -----------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fm-new-3.onrender.com",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------
# Log OPTIONS requests
# -----------------------------------
@app.middleware("http")
async def log_options_requests(request: Request, call_next):
    if request.method == "OPTIONS":
        logger.info(
            "✅ OPTIONS request received | Path=%s | Origin=%s",
            request.url.path,
            request.headers.get("origin")
        )
    response = await call_next(request)
    return response

# -----------------------------------
# Request schema
# -----------------------------------
class ImageInput(BaseModel):
    input: list[float]

# -----------------------------------
# Load model & labels ONCE
# -----------------------------------
model = None
labels = None

@app.on_event("startup")
def load_model():
    global model, labels

    class_indices_path = "class_indices.json"
    pickle_path = "model.pkl"

    try:
        logger.info("🏷️ Loading class indices...")
        with open(class_indices_path, "r") as f:
            class_indices = json.load(f)

        labels = {int(v): k for k, v in class_indices.items()}
        logger.info("✅ Loaded %d class labels", len(labels))

        if not os.path.exists(pickle_path):
            raise RuntimeError("model.pkl not found")

        logger.info("🧠 Loading model.pkl...")
        with open(pickle_path, "rb") as f:
            data = pickle.load(f)

        model = tf.keras.models.model_from_json(data["architecture"])
        model.set_weights(data["weights"])
        model.compile(
            optimizer="adam",
            loss="categorical_crossentropy",
            metrics=["accuracy"]
        )

        logger.info("✅ Keras model rebuilt and compiled")
        logger.info("📏 Input shape: %s | Classes: %d",
                    model.input_shape,
                    model.output_shape[-1])

    except Exception:
        logger.exception("❌ Startup model loading failed")
        raise

# -----------------------------------
# Health check
# -----------------------------------
@app.get("/")
def home():
    return {
        "status": "ML API running",
        "model_loaded": model is not None
    }

# -----------------------------------
# Predict endpoint
# -----------------------------------
@app.post("/predict")
def predict(data: ImageInput):

    if model is None or labels is None:
        logger.error("❌ Predict called but model not loaded")
        raise HTTPException(
            status_code=500,
            detail="Model not loaded on server"
        )

    try:
        image_array = np.array(data.input, dtype=np.float32)

        expected_size = 224 * 224 * 3
        if image_array.size != expected_size:
            logger.warning(
                "❌ Invalid image size: %d | Expected: %d",
                image_array.size,
                expected_size
            )
            raise HTTPException(
                status_code=400,
                detail=f"Invalid input size {image_array.size}, expected {expected_size}"
            )

        # -----------------------------------
        # 🔥 SAME PREPROCESSING AS OLD .KERAS CODE
        # -----------------------------------
        img = image_array.reshape(224, 224, 3)

        # old code: img = img * 255.0
        img = img * 255.0

        # add batch dimension
        img = np.expand_dims(img, axis=0)

        # old code: EfficientNet preprocessing
        img = tf.keras.applications.efficientnet_v2.preprocess_input(img)

        # -----------------------------------
        # Prediction
        # -----------------------------------
        prediction = model.predict(img, verbose=0)[0]

        class_idx = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        # -----------------------------------
        # SAME RESPONSE AS OLD API
        # -----------------------------------
        return {
            "class": labels[class_idx],
            "confidence": round(confidence * 100, 2)
        }

    except HTTPException:
        raise

    except Exception:
        logger.exception("🔥 Unexpected error during prediction")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during prediction"
        )

# -----------------------------------
# Run locally
# -----------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

