# Frontend Architecture Guide

This frontend uses a feature-oriented React structure. UI components, stateful behaviour, API communication, and formatting helpers have separate responsibilities.

## Application navigation

The sidebar and mobile navigation switch between three working views:
- **Overview**: customer KPIs, segment distribution chart, and model evaluation metrics.
- **Customer segments**: customer/segment summary, distribution chart, and segment profile cards.
- **Inactivity model**: model observation and prediction windows, live prediction form, prediction output, and interpretation guidance.

Navigation is controlled by React state in `src/app/App.jsx`; it is not a collection of decorative links. The same navigation component is used on desktop and mobile.

## Data flow

1. `main.jsx` mounts the application.
2. `app/App.jsx` composes the current view and shared page state.
3. `useDashboardData` loads segment summaries, model metadata, and model health.
4. Feature components render analytics and prediction UI.
5. `useInactivityPrediction` owns the form state and submits inputs to the API service.
6. API service modules call the shared `fetchJSON` client.

## Folder responsibilities

- `app/`: application composition and view selection.
- `components/layout/`: shared layout, navigation, and page header.
- `components/ui/`: presentational components such as KPI cards and loading/error states.
- `features/overview/`: dashboard loading Hook, KPI cards, and model performance.
- `features/segments/`: chart and customer segment presentation.
- `features/inactivity/`: prediction form, result, and prediction state.
- `services/api/`: HTTP requests and endpoint-specific functions.
- `utils/`: pure helpers such as currency formatting.

## Custom Hooks

A component should primarily describe UI. A custom Hook extracts stateful behaviour. For example, `useDashboardData` owns loading, error, and refresh logic so the page does not need to know how requests are performed.

Hooks must be called at the top level of a React component or another custom Hook. Do not call Hooks inside loops, conditions, or event handlers.

## Local checks

From `frontend/`, run `npm ci`, `npm run lint`, and `npm run build`. From the repository root, run `python -m pytest -q` and `python -m compileall -q backend`.

The backend must run separately for live data and predictions. The default API base URL is `http://127.0.0.1:8000`; override it with `VITE_API_BASE_URL` when needed.
