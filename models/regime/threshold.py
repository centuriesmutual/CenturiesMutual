"""Deterministic threshold-based regime model (reference implementation)."""

from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

from models.base import ModelVersion


REGIME_LABELS = {
    0: "risk_off",
    1: "neutral",
    2: "risk_on",
}


class ThresholdRegimeModel:
    """
    Reference RegimeModel.

    Uses logistic regression on z-scored macro features with a fixed random_state
    for determinism. Labels are expected as integers {0,1,2} or strings mapped
    via REGIME_LABELS.
    """

    def __init__(
        self,
        *,
        feature_names: list[str] | None = None,
        feature_versions: dict[str, str] | None = None,
        C: float = 1.0,
        training_data_id: str = "unspecified",
    ) -> None:
        self.feature_names = feature_names or ["treasury_spread", "vix", "cpi_yoy"]
        self._feature_versions = feature_versions or {n: "1.0.0" for n in self.feature_names}
        self._C = C
        self._training_data_id = training_data_id
        self._clf = LogisticRegression(
            C=C,
            max_iter=500,
            random_state=42,
            solver="lbfgs",
        )
        self._fitted = False
        self._evaluation_metrics: dict[str, float] = {}

    @property
    def version(self) -> ModelVersion:
        return ModelVersion(
            name="threshold_regime",
            version="1.0.0",
            training_data_id=self._training_data_id,
            feature_versions=self._feature_versions,
            parameters={"C": self._C, "feature_names": self.feature_names},
            evaluation_metrics=self._evaluation_metrics,
        )

    def _encode_labels(self, labels: pd.Series) -> np.ndarray:
        if labels.dtype == object or labels.dtype.name == "string":
            inverse = {v: k for k, v in REGIME_LABELS.items()}
            return labels.map(inverse).astype(int).to_numpy()
        return labels.astype(int).to_numpy()

    def _matrix(self, features: pd.DataFrame) -> np.ndarray:
        missing = [c for c in self.feature_names if c not in features.columns]
        if missing:
            raise KeyError(f"Missing features: {missing}")
        return features[self.feature_names].astype(float).to_numpy()

    def fit(self, features: pd.DataFrame, labels: pd.Series) -> None:
        X = self._matrix(features)
        y = self._encode_labels(labels.loc[features.index])
        self._clf.fit(X, y)
        self._fitted = True
        train_pred = self._clf.predict(X)
        self._evaluation_metrics = {
            "train_accuracy": float(np.mean(train_pred == y)),
        }

    def predict(self, features: pd.DataFrame) -> pd.Series:
        if not self._fitted:
            raise RuntimeError("Model is not fitted")
        X = self._matrix(features)
        pred = self._clf.predict(X)
        named = pd.Series([REGIME_LABELS[int(p)] for p in pred], index=features.index, name="regime")
        return named

    def predict_proba(self, features: pd.DataFrame) -> pd.DataFrame:
        if not self._fitted:
            raise RuntimeError("Model is not fitted")
        X = self._matrix(features)
        proba = self._clf.predict_proba(X)
        cols = [REGIME_LABELS[int(c)] for c in self._clf.classes_]
        return pd.DataFrame(proba, index=features.index, columns=cols)

    def predict_codes(self, features: pd.DataFrame) -> pd.Series:
        if not self._fitted:
            raise RuntimeError("Model is not fitted")
        X = self._matrix(features)
        return pd.Series(self._clf.predict(X), index=features.index, name="regime_code")


def synthetic_regime_panel(n: int = 200, seed: int = 42) -> tuple[pd.DataFrame, pd.Series]:
    """Deterministic synthetic panel for tests and demos."""
    rng = np.random.default_rng(seed)
    idx = pd.RangeIndex(n)
    spread = rng.normal(0.5, 1.0, size=n)
    vix = rng.normal(18.0, 5.0, size=n)
    cpi = rng.normal(2.5, 1.0, size=n)
    # Latent score → regime
    score = 0.8 * spread - 0.15 * (vix - 18.0) - 0.3 * (cpi - 2.5) + rng.normal(0, 0.4, size=n)
    labels = np.where(score > 0.5, 2, np.where(score < -0.5, 0, 1))
    raw = pd.DataFrame(
        {
            "us_10y": 3.0 + spread * 0.1,
            "us_2y": 3.0 + spread * 0.1 - spread,
            "vix": vix,
            "cpi_yoy": cpi,
            "healthcare_etf": 100 * np.cumprod(1 + rng.normal(0.0005, 0.01, size=n)),
        },
        index=idx,
    )
    return raw, pd.Series(labels, index=idx, name="regime")
