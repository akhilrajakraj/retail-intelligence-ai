# Retail Intelligence AI

A retail analytics application built around historical transaction data. It combines customer segmentation, a time-bounded inactivity model, a React dashboard, and a FastAPI service so the analysis can be explored through a browser and an API.

**Repository:** [akhilrajakraj/retail-intelligence-ai](https://github.com/akhilrajakraj/retail-intelligence-ai)  
**Dataset:** [UCI Online Retail II](https://doi.org/10.24432/C5CG6D)

## What the application does

The dashboard has three views:

- **Overview** — customer and segment summary metrics, the segment distribution chart, and inactivity-model evaluation metrics.
- **Customer segments** — a breakdown of the four K-Means groups and their historical purchasing profiles.
- **Inactivity model** — a form that submits customer-level metrics to the API and displays the model's estimated inactivity probability and classification.

The API loads saved model artifacts and processed segment data from the repository. The frontend and backend run as separate local development servers.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Recharts, Lucide |
| API | Python, FastAPI, Pydantic, Uvicorn |
| Machine learning | scikit-learn, pandas, NumPy, joblib |
| Data storage | Parquet |
| Quality checks | pytest, Oxlint, GitHub Actions |

## Models and evaluation

### Customer inactivity

The inactivity classifier is a Logistic Regression model trained to estimate whether a customer will make no qualifying purchase during a defined future period.

| Setting or metric | Value |
| --- | ---: |
| Observation window | 180 days |
| Prediction horizon | 90 days |
| Decision threshold | Approximately 0.413 |
| Validation ROC-AUC | 0.7430 |
| Test ROC-AUC | 0.7335 |
| Test average precision | 0.5999 |
| Test precision | 0.4862 |
| Test recall | 0.9229 |
| Test F1-score | 0.6369 |

The model accepts eight features: `frequency`, `purchase_lines`, `monetary`, `average_line_value`, `unique_products`, `average_quantity`, `recency_days`, and `average_order_value`.

These figures describe evaluation on the project's historical test split; they are not a guarantee of performance on current retail data. The decision threshold was selected using validation data. Predicted probabilities have not been calibrated. Because test precision is 0.4862, a substantial share of customers flagged by the model may still make a purchase.

### Customer segmentation

K-Means groups customers using recency, frequency, and monetary features. The pipeline applies a `log1p` transformation and standard scaling before assigning four clusters. The current segment labels describe historical purchasing patterns; they should not be interpreted as permanent customer identities.

The project retained four clusters to provide more differentiated profiles, although a two-cluster solution had a higher silhouette score. This is a trade-off between a compact clustering structure and a more detailed segmentation that is easier to explore in the dashboard.

More detail on intended use, evaluation, and limitations is available in [the model card](reports/model_card.md).

## Data

The project uses the UCI Online Retail II dataset, containing historical retail transactions from 2009–2011.

- Dataset record and DOI: https://doi.org/10.24432/C5CG6D
- The original raw transaction files are not included in this repository.
- The processed customer-segment data used by the API is stored at `data/processed/customer_segments.parquet`.
- Model artifacts and metadata are stored under `artifacts/`.

The source data is historical and UK-specific. Results should be validated against recent, representative data before any business use.

## Repository layout

```text
retail-intelligence-ai/
├── artifacts/                 # Saved models, preprocessing objects, and metadata
├── backend/app/               # FastAPI routes, schemas, analytics, and inference
├── data/processed/             # Processed customer segment data
├── frontend/
│   ├── src/
│   │   ├── app/                # App composition and view navigation
│   │   ├── components/         # Shared layout and UI components
│   │   ├── features/           # Overview, segments, and inactivity features
│   │   ├── services/api/       # Frontend API client and endpoint functions
│   │   └── utils/              # Shared formatting helpers
│   └── ARCHITECTURE.md         # Frontend structure and design notes
├── ml/data/                    # Data audit utilities
├── reports/                    # Model card and segment profiles
├── tests/                      # Backend API tests
├── .github/workflows/ci.yml    # Automated checks
└── requirements.txt            # Python dependencies
```

## Run locally

Run the backend and frontend in separate terminals. The instructions below are for Windows PowerShell; the commands can be adapted for macOS or Linux.

### Requirements

- Python 3.10 or a compatible version supported by the dependencies
- Node.js and npm
- Git

### 1. Clone the repository

```powershell
git clone https://github.com/akhilrajakraj/retail-intelligence-ai.git
cd retail-intelligence-ai
```

### 2. Install and start the API

From the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn backend.app.main:app --reload
```

The API should now be available at:

- Dashboard API base: http://127.0.0.1:8000
- Interactive Swagger documentation: http://127.0.0.1:8000/docs
- ReDoc documentation: http://127.0.0.1:8000/redoc

Keep this terminal running.

### 3. Install and start the dashboard

Open a second terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173 in your browser.

The frontend uses `http://127.0.0.1:8000` as the default API base URL. To use a different API address, create `frontend/.env.local` with:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart the Vite server after changing the environment file.

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | API welcome/status response |
| `GET` | `/health` | API health check |
| `GET` | `/api/v1/health/models` | Model-loading health status |
| `GET` | `/api/v1/segments` | Customer segment summary |
| `GET` | `/api/v1/models/inactivity` | Inactivity model metadata and evaluation metrics |
| `POST` | `/api/v1/predict/inactivity` | Estimate inactivity from customer metrics |

### Example prediction request

Send the following JSON to `POST /api/v1/predict/inactivity`:

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

All eight values must be non-negative numbers. The live response schema is available in Swagger UI at http://127.0.0.1:8000/docs.

## Run checks

From the repository root, with the Python virtual environment activated:

```powershell
python -m pytest -q
python -m compileall -q backend
```

From the frontend directory:

```powershell
npm run lint
npm run build
```

GitHub Actions runs the frontend lint/build and backend test/syntax checks for pushes and pull requests covered by the workflow.

## Known limitations

- The source transactions date from 2009–2011 and may not represent current customer behaviour.
- The inactivity label describes a 90-day period; it does not mean a customer has permanently churned.
- Test precision is modest, so model output should be used as a signal for review rather than a definitive decision.
- Probability calibration has not been evaluated.
- Segment labels are descriptive summaries of cluster-level behaviour, not verified customer personas.
- The app is a local development and portfolio project. Production use would require current-data validation, monitoring, deployment configuration, and additional operational safeguards.

Do not use model predictions as the sole basis for denying customers offers, services, or other opportunities.

## Further work

Potential improvements include reproducible model-training scripts, expanded data/model versioning, richer segment-level explanations, broader automated test coverage, and deployment configuration for a hosted environment.

## License

No license has been added to this repository. Until one is specified, the code remains subject to standard copyright; public availability does not automatically grant permission to reuse or redistribute it.
