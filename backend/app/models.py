
import json
from pathlib import Path

import joblib


# Project root: retail-intelligence-ai/
PROJECT_ROOT = Path(__file__).resolve().parents[2]
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"

inactivity_model = joblib.load(
    ARTIFACTS_DIR / "inactivity_logistic_regression.joblib"
)

segmentation_model = joblib.load(
    ARTIFACTS_DIR / "customer_segmentation_kmeans.joblib"
)

rfm_scaler = joblib.load(
    ARTIFACTS_DIR / "rfm_standard_scaler.joblib"
)

with open(
    ARTIFACTS_DIR / "inactivity_model_metadata.json",
    "r",
    encoding="utf-8",
) as file:
    inactivity_metadata = json.load(file)

with open(
    ARTIFACTS_DIR / "segmentation_metadata.json",
    "r",
    encoding="utf-8",
) as file:
    segmentation_metadata = json.load(file)


def get_model_status() -> dict:
    """Return basic information about the loaded models."""
    return {
        "inactivity_model_loaded": inactivity_model is not None,
        "segmentation_model_loaded": segmentation_model is not None,
        "rfm_scaler_loaded": rfm_scaler is not None,
    }
