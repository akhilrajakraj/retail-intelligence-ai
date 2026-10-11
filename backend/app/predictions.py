
import pandas as pd

from backend.app.models import (
    inactivity_metadata,
    inactivity_model,
)
from backend.app.schemas import InactivityPredictionRequest


FEATURES = inactivity_metadata["features"]
THRESHOLD = float(inactivity_metadata["decision_threshold"])


def predict_inactivity(
    request: InactivityPredictionRequest,
) -> dict:
    input_data = request.model_dump()

    # Preserve the exact feature order used during training.
    features_df = pd.DataFrame(
        [[input_data[name] for name in FEATURES]],
        columns=FEATURES,
    )

    probability = float(
        inactivity_model.predict_proba(features_df)[0][1]
    )

    is_inactive = probability >= THRESHOLD

    return {
        "prediction": {
            "inactive_90d": int(is_inactive),
            "risk_label": (
                "High inactivity risk"
                if is_inactive
                else "Lower inactivity risk"
            ),
            "inactivity_probability": round(probability, 4),
            "decision_threshold": THRESHOLD,
            "prediction_horizon_days": int(
                inactivity_metadata["prediction_window_days"]
            ),
        },
        "model": {
            "name": inactivity_metadata["model_name"],
            "version": inactivity_metadata["model_version"],
        },
        "interpretation": (
            "This estimates the likelihood of no qualifying purchase "
            "during the next 90 days. It does not establish permanent churn."
        ),
    }
