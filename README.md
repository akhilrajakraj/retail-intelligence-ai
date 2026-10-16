# Retail Intelligence AI

An end-to-end machine learning portfolio project for exploring customer behavior, identifying customer segments, and estimating near-term customer inactivity from historical retail transactions.

The project combines a **FastAPI** backend, a **React + Vite** dashboard, and trained scikit-learn models. The dashboard includes working Overview, Customer segments, and Inactivity model views with responsive navigation and a live prediction form. It is intended for learning, analytics demonstrations, and exploratory retention prioritization—not as an automated decision system.

## Highlights

- **Customer segmentation:** K-Means clustering over recency, frequency, and monetary (RFM) features.
- **Inactivity prediction:** Logistic Regression estimates whether a customer will make no qualifying purchase during the 90 days after a snapshot cutoff.
- **Interactive dashboard:** View segment summaries, model information and health, and submit customer metrics for a prediction.
- **API:** FastAPI endpoints with request validation and interactive API documentation.
- **Saved artifacts:** Persisted models, preprocessing objects, metadata, and processed segment assignments.
- **Model documentation:** Evaluation results, intended uses, and limitations are documented in [the model card](reports/model_card.md).

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Recharts, Lucide |
| Backend | Python, FastAPI, Pydantic, Uvicorn |
| Machine learning | scikit-learn, pandas, NumPy, joblib |
| Data format | Parquet |

## Machine learning overview

### 1. Customer inactivity prediction

- **Algorithm:** Logistic Regression
- **Observation window:** 180 days
- **Prediction horizon:** 90 days
- **Decision threshold:** approximately 0.413, selected on validation data
- **Validation ROC-AUC:** 0.7430
- **Test ROC-AUC:** 0.7335
- **Test average precision:** 0.5999
- **Test precision / recall:** 0.4862 / 0.9229

The model uses eight customer-level features: `frequency`, `purchase_lines`, `monetary`, `average_line_value`, `unique_products`, `average_quantity`, `recency_days`, and `average_order_value`.

**Interpretation:** The target is inactivity within a defined 90-day period; it is not proof of permanent churn. Test precision is relatively low, so some customers flagged by the model may still purchase. Predicted probabilities have not been evaluated for calibration. Review the full [model card](reports/model_card.md) before interpreting results.

### 2. Customer segmentation

- **Algorithm:** K-Means
- **Clusters:** 4
- **Features:** recency, frequency, and monetary value
- **Preprocessing:** `log1p` transformation followed by `StandardScaler`
- **Reference date:** 2011-12-01
- **Observation window:** 180 days

Current descriptive cluster names:

1. Regular Mid-Value Customers
2. Less-Recent Low-Frequency Customers
3. Recent Occasional Customers
4. Recent High-Value Loyalists

These labels summarize historical RFM patterns; they are not permanent customer attributes. Four clusters were retained to provide differentiated business segments, although the two-cluster solution had a higher silhouette score.

## Dataset

The project is based on the **UCI Online Retail II** dataset (transactions from 2009–2011).

- Dataset page / DOI: https://doi.org/10.24432/C5CG6D
- The original raw transaction dataset is not included in this repository.
- A processed customer-segmentation file is included at `data/processed/customer_segments.parquet`.

Because the source data is historical and UK-specific, performance and customer patterns may not generalize to current retail settings without further validation.

## Repository structure

```text
retail-intelligence-ai/
├── artifacts/
│   ├── customer_segmentation_kmeans.joblib
│   ├── inactivity_logistic_regression.joblib
│   ├── inactivity_model_metadata.json
│   ├── rfm_standard_scaler.joblib
│   └── segmentation_metadata.json
├── backend/
│   └── app/
│       ├── analytics.py
│       ├── main.py
│       ├── models.py
│       ├── predictions.py
│       └── schemas.py
├── data/
│   └── processed/
│       └── customer_segments.parquet
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── services/api/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── ARCHITECTURE.md
│   ├── package.json
│   └── vite.config.js
├── tests/
│   └── test_api.py
├── .github/workflows/ci.yml
├── requirements.txt
├── ml/
│   └── data/
│       └── audit.py
└── reports/
    ├── customer_segment_profiles.csv
    └── model_card.md
```

## Getting started

### Prerequisites

- Python 3.10 or a compatible Python version supported by the installed ML dependencies
- Node.js and npm
- Git

Run the backend and frontend in separate terminals.

### 1. Clone the repository

```bash
git clone https://github.com/akhilrajakraj/retail-intelligence-ai.git
cd retail-intelligence-ai
```

### 2. Set up the Python backend

From the repository root:

**Windows PowerShell**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If PowerShell blocks virtual-environment activation, use Command Prompt instead:

```bat
.venv\Scripts\activate.bat
```

Start the API from the **repository root**:

```bash
python -m uvicorn backend.app.main:app --reload
```

The API should be available at:

- Base URL: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Vite normally serves the dashboard at http://localhost:5173.

The frontend defaults to the local API at `http://127.0.0.1:8000`. To override it, create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart the Vite development server after changing environment variables.

### 4. Verify the application

From `frontend/`, run `npm run lint` and `npm run build`. From the repository root, run `python -m pytest -q` and `python -m compileall -q backend`. The API tests require the Python dependencies in `requirements.txt` and the committed model/data artifacts.

For the frontend folder responsibilities and Hook/component design, see [Frontend Architecture Guide](frontend/ARCHITECTURE.md).

## API reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | API welcome message and status |
| `GET` | `/health` | API health check |
| `GET` | `/api/v1/health/models` | Loaded model health/status |
| `GET` | `/api/v1/segments` | Customer segment summary |
| `GET` | `/api/v1/models/inactivity` | Inactivity model metadata and evaluation metrics |
| `POST` | `/api/v1/predict/inactivity` | Predict inactivity from customer metrics |

### Example prediction request

Send a JSON body to `POST /api/v1/predict/inactivity`:

```json
{
  "frequency": 5,
  "purchase_lines": 12,
  "monetary": 450.0,
  "average_line_value": 37.5,
  "unique_products": 8,
  "average_quantity": 2.0,
  "recency_days": 45,
  "average_order_value": 90.0
}
```

All eight input fields must be non-negative numbers. The response schema is defined by the running API; use Swagger UI to inspect the live request and response models.

## Troubleshooting

- **Blank frontend page:** Check the browser developer console and the Vite terminal for import/build errors. Confirm `frontend/src/api.js` exports `getSegments`, `getModelInfo`, `getModelHealth`, and `predictInactivity`.
- **API connection error:** Start FastAPI from the repository root and verify http://127.0.0.1:8000/health.
- **CORS error:** The current backend configuration allows `http://localhost:5173`. If using a different frontend origin, update `allow_origins` in `backend/app/main.py`.
- **Model loading errors:** Ensure the files under `artifacts/` are present and that the installed scikit-learn version is compatible with the version used to serialize the models.
- **Parquet read errors:** Ensure `pyarrow` is installed in the active Python environment.

## Limitations and responsible use

- The dataset contains historical transactions from 2009–2011.
- Inactivity is a time-bounded target and should not be described as certain or permanent churn.
- Test precision is modest; review model errors before using predictions to prioritize outreach.
- Probability calibration has not been evaluated.
- Segment names are descriptive summaries, not verified customer personas.
- Validate against recent, representative data and monitor performance before any operational use.
- Do not use predictions as the sole basis for denying customers offers, services, or other opportunities.

## Roadmap

Potential next steps:

- Add automated tests for API routes, data validation, and model loading.
- Add reproducible training and evaluation scripts.
- Improve experiment tracking and data/model versioning.
- Add segment-level recommendations and transparent prediction explanations.
- Package the application for deployment with environment-specific configuration.

## License

No license has been specified yet. Unless a license is added, standard copyright applies and reuse is not automatically granted.
