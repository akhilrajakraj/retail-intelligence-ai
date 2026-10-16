# Frontend Architecture Guide

This frontend uses a feature-oriented React structure. The goal is to separate UI, stateful behaviour, API communication, and formatting logic without introducing unnecessary libraries.

## Request and render flow

1. `main.jsx` mounts the application.
2. `src/app/App.jsx` composes the dashboard page.
3. `useDashboardData` loads segment summaries, model metadata, and model health.
4. Feature components render overview metrics, the segment chart, segment insights, and the inactivity form.
5. `useInactivityPrediction` owns form state and submits input to the API service.
6. API service modules call the shared `fetchJSON` client.

## Folder responsibilities

- `app/`: application composition and setup.
- `components/layout/`: shared page layout, navigation, and page header.
- `components/ui/`: small presentational components such as KPI cards and loading/error states.
- `features/overview/`: dashboard data and model performance presentation.
- `features/segments/`: chart and customer segment presentation.
- `features/inactivity/`: customer input form, prediction result, and prediction state.
- `services/api/`: HTTP requests and endpoint-specific functions.
- `utils/`: pure helpers such as currency formatting.

## Why use custom Hooks?

A component should primarily describe UI. A custom Hook extracts reusable stateful behaviour. For example, `useDashboardData` owns the loading, error, and refresh lifecycle so the page does not need to know how each request is performed.

Hooks must be called at the top level of a React component or another custom Hook. Do not call Hooks inside loops, conditions, or event handlers.

## Component guidelines

- Keep props explicit and small.
- Keep API calls out of presentational components.
- Use feature folders when components serve a specific business capability.
- Put truly shared visual components in `components/ui/`.
- Add a new abstraction when it removes meaningful duplication or clarifies a responsibility; avoid making a component for every single JSX element.
- Keep server response contracts consistent with the FastAPI API.

## Local checks

From the frontend directory, run `npm ci`, `npm run build`, `npm run lint`, and `npm run dev`.

The backend must run separately for live dashboard data and predictions. The default API base URL is `http://127.0.0.1:8000`; override it with `VITE_API_BASE_URL` when needed.
