import pickle
import json
import numpy as np
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -----------------------------------
# Logging
# -----------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -----------------------------------
# FastAPI app
# -----------------------------------
app = FastAPI()

# 🔥 CORS — REPLACE WITH YOUR STATIC SITE URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fm-new-3.onrender.com",
        " http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    try:
        logger.info("🧠 Loading model.pkl")
        with open("model.pkl", "rb") as f:
            model = pickle.load(f)

        logger.info("🏷️ Loading class indices")
        with open("class_indices.json", "r") as f:
            class_indices = json.load(f)

        labels = {v: k for k, v in class_indices.items()}
        logger.info("✅ Model ready")

    except Exception as e:
        logger.exception("❌ Failed to load model")
        raise RuntimeError(e)

# -----------------------------------
# Health check
# -----------------------------------
@app.get("/")
def home():
    return {"status": "ML API running"}

# -----------------------------------
# Predict
# -----------------------------------
@app.post("/predict")
def predict(data: ImageInput):
    if model is None or labels is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    image_array = np.array(data.input)

    if image_array.size != 224 * 224 * 3:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image size: {image_array.size}"
        )

    try:
        img = image_array.reshape(224, 224, 3)
        img = np.expand_dims(img, axis=0)

        # ⚠️ adjust preprocessing ONLY if needed
        prediction = model.predict(img)[0]
        idx = int(np.argmax(prediction))

        return {
            "class": labels[idx],
            "confidence": round(float(prediction[idx] * 100), 2)
        }

    except Exception as e:
        logger.exception("🔥 Prediction failed")
        raise HTTPException(status_code=500, detail=str(e))
