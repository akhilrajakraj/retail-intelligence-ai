
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[2]
SEGMENTS_PATH = (
    PROJECT_ROOT / "data" / "processed" / "customer_segments.parquet"
)

segments_df = pd.read_parquet(SEGMENTS_PATH)

SEGMENT_NAMES = {
    0: "Regular Mid-Value Customers",
    1: "Less-Recent Low-Frequency Customers",
    2: "Recent Occasional Customers",
    3: "Recent High-Value Loyalists",
}


def get_segment_summary() -> dict:
    """Summarize customers by their saved RFM cluster assignment."""
    required_columns = {
        "Customer ID",
        "cluster",
        "recency_days",
        "frequency",
        "monetary",
    }

    missing = required_columns - set(segments_df.columns)
    if missing:
        raise ValueError(
            f"Customer segment dataset is missing columns: {sorted(missing)}"
        )

    total_customers = int(len(segments_df))
    grouped = segments_df.groupby("cluster", sort=True)

    segment_results = []

    for cluster_id, group in grouped:
        customer_count = len(group)

        segment_results.append({
            "cluster_id": int(cluster_id),
            "segment_name": SEGMENT_NAMES.get(
                int(cluster_id), f"Cluster {int(cluster_id)}"
            ),
            "customer_count": int(customer_count),
            "customer_percentage": round(
                customer_count / total_customers * 100, 2
            ) if total_customers else 0.0,
            "median_recency_days": round(
                float(group["recency_days"].median()), 2
            ),
            "median_frequency": round(
                float(group["frequency"].median()), 2
            ),
            "median_monetary": round(
                float(group["monetary"].median()), 2
            ),
        })

    return {
        "total_customers": total_customers,
        "number_of_segments": len(segment_results),
        "segments": segment_results,
    }
