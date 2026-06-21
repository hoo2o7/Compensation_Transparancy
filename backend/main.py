"""FastAPI service that serves the transparency & readability ML models.

Inference flow per model:  X -> scaler.transform(X) -> model.predict(X_scaled)
model_A (transparency) outputs ~0..1 -> *100;  model_B (readability) is already ~0..100.
"""

from pathlib import Path
from typing import Dict, List

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Feature order MUST match the order the scalers/models were trained on.
FEATURES = [
    "salary_bt",
    "orbis_turn",
    "orbis_roa",
    "orbis_gear",
    "orbis_grma",
    "cp_female_ratio",
    "cp_foreign_ratio",
]

MODEL_DIR = Path(__file__).resolve().parent.parent / "model"

model_A = joblib.load(MODEL_DIR / "model_A_transparency_score.pkl")
model_B = joblib.load(MODEL_DIR / "model_B_readability_score.pkl")
scaler_A = joblib.load(MODEL_DIR / "scaler_A.pkl")
scaler_B = joblib.load(MODEL_DIR / "scaler_B.pkl")

app = FastAPI(title="Compensation Transparency API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    salary_bt: float
    orbis_turn: float
    orbis_roa: float
    orbis_gear: float
    orbis_grma: float
    cp_female_ratio: float
    cp_foreign_ratio: float


class PredictResponse(BaseModel):
    transparency: float  # 0..100
    readability: float  # 0..100
    transparency_raw: float  # raw model_A output (~0..1)
    readability_raw: float  # raw model_B output (already ~0..100)


def _clamp(v: float) -> float:
    return max(0.0, min(100.0, v))


# Empirically the two models live on different scales:
#   model_A (transparency) outputs a 0..1 probability-like score -> *100
#   model_B (readability)   already outputs a ~0..100 score       -> as-is
def _transparency_score(raw_a: float) -> float:
    return _clamp(raw_a * 100.0)


def _readability_score(raw_b: float) -> float:
    return _clamp(raw_b)


def _raw_predict(values: Dict[str, float]) -> tuple[float, float]:
    """Return (raw_transparency, raw_readability) for a feature dict."""
    X = pd.DataFrame([[values[f] for f in FEATURES]], columns=FEATURES)
    raw_a = float(model_A.predict(scaler_A.transform(X))[0])
    raw_b = float(model_B.predict(scaler_B.transform(X))[0])
    return raw_a, raw_b


class Contribution(BaseModel):
    key: str
    transparency: float  # effect on transparency score (points)
    readability: float  # effect on readability score (points)


class ExplainRequest(BaseModel):
    features: Dict[str, float]
    baseline: Dict[str, float]


class ExplainResponse(BaseModel):
    transparency: float
    readability: float
    transparency_raw: float
    readability_raw: float
    contributions: List[Contribution]


@app.get("/health")
def health():
    return {"status": "ok", "features": FEATURES}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    raw_a, raw_b = _raw_predict(req.model_dump())
    return PredictResponse(
        transparency=_transparency_score(raw_a),
        readability=_readability_score(raw_b),
        transparency_raw=raw_a,
        readability_raw=raw_b,
    )


@app.post("/explain", response_model=ExplainResponse)
def explain(req: ExplainRequest):
    """Per-feature attribution: how much each feature's deviation from the
    baseline shifts each score. contribution_i = score(current)
    - score(current with feature_i reset to baseline_i).
    """
    current = {f: float(req.features.get(f, req.baseline.get(f, 0.0))) for f in FEATURES}
    baseline = {f: float(req.baseline.get(f, current[f])) for f in FEATURES}

    raw_a, raw_b = _raw_predict(current)
    t_score = _transparency_score(raw_a)
    r_score = _readability_score(raw_b)

    contributions: List[Contribution] = []
    for f in FEATURES:
        probe = dict(current)
        probe[f] = baseline[f]
        p_a, p_b = _raw_predict(probe)
        contributions.append(
            Contribution(
                key=f,
                transparency=t_score - _transparency_score(p_a),
                readability=r_score - _readability_score(p_b),
            )
        )

    return ExplainResponse(
        transparency=t_score,
        readability=r_score,
        transparency_raw=raw_a,
        readability_raw=raw_b,
        contributions=contributions,
    )
