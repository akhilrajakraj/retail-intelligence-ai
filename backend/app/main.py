
from fastapi import FastAPI

from backend.app.analytics import get_segment_summary
from backend.app.models import get_model_status
from backend.app.predictions import predict_inactivity
from backend.app.schemas import InactivityPredictionRequest
from backend.app.models import inactivity_metadata

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Retail Intelligence AI API",
    description="API for customer inactivity prediction and RFM segmentation.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to Retail Intelligence AI API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "retail-intelligence-ai-api",
    }


@app.get("/api/v1/health/models")
def model_health_check():
    return get_model_status()


@app.get("/api/v1/segments")
def segment_analytics():
    return get_segment_summary()


@app.post("/api/v1/predict/inactivity")
def inactivity_prediction(request: InactivityPredictionRequest):
    return predict_inactivity(request)

@app.get("/api/v1/models/inactivity")
def inactivity_model_info():
    return {
        "model_name": inactivity_metadata["model_name"],
        "model_version": inactivity_metadata["model_version"],
        "target": inactivity_metadata["target"],
        "target_definition": inactivity_metadata["target_definition"],
        "observation_window_days": inactivity_metadata["observation_window_days"],
        "prediction_window_days": inactivity_metadata["prediction_window_days"],
        "decision_threshold": inactivity_metadata["decision_threshold"],
        "validation_metrics": inactivity_metadata["validation_metrics"],
        "test_metrics": inactivity_metadata["test_metrics"],
        "limitations": inactivity_metadata["limitations"],
    }