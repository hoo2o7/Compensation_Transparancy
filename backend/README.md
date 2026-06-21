# Compensation Transparency — ML Backend (FastAPI)

Serves `model_A` (transparency) and `model_B` (readability) GradientBoosting models
trained with scikit-learn 1.7.2.

## Setup

The pickles were trained with **scikit-learn 1.7.2 / Python 3.10**, which already
matches the conda env `superres`. Just add the web deps:

```bash
conda activate superres
pip install fastapi "uvicorn[standard]" pydantic
```

(`requirements.txt` lists the full pinned set if you ever rebuild the env from scratch.)

## Run

```bash
conda activate superres
cd backend
uvicorn main:app --reload --port 8000
```

- Swagger UI: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## Predict

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "salary_bt": 5,
    "orbis_turn": 21.3,
    "orbis_roa": 3.7,
    "orbis_gear": 120,
    "orbis_grma": 25,
    "cp_female_ratio": 20,
    "cp_foreign_ratio": 29
  }'
```

Response:

```json
{ "transparency": 34.46, "readability": 31.18, "transparency_raw": 0.3446, "readability_raw": 31.18 }
```

## Notes
- Feature order is fixed (see `FEATURES` in `main.py`); the scaler is a
  `Pipeline(SimpleImputer(median) -> StandardScaler)` applied before `model.predict`.
- The two models live on **different output scales** (verified empirically):
  - `model_A` (transparency) outputs ~0..1  -> API multiplies by 100.
  - `model_B` (readability) already outputs ~0..100 -> API passes it through.
  - Both are clamped to 0..100 for the chart.
