"""Shared model protocols and versioning metadata."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Mapping, Protocol, runtime_checkable

import numpy as np
import pandas as pd


@dataclass(frozen=True)
class ModelVersion:
    """Independent model version record."""

    name: str
    version: str
    training_data_id: str
    feature_versions: Mapping[str, str]
    parameters: Mapping[str, Any] = field(default_factory=dict)
    evaluation_metrics: Mapping[str, float] = field(default_factory=dict)
    backtest_results_id: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@runtime_checkable
class RegimeModel(Protocol):
    """Market / economic regime classifier."""

    @property
    def version(self) -> ModelVersion: ...

    def fit(self, features: pd.DataFrame, labels: pd.Series) -> None: ...

    def predict(self, features: pd.DataFrame) -> pd.Series: ...

    def predict_proba(self, features: pd.DataFrame) -> pd.DataFrame: ...


@runtime_checkable
class SignalModel(Protocol):
    """Generates trading or operational signals."""

    @property
    def version(self) -> ModelVersion: ...

    def fit(self, features: pd.DataFrame, target: pd.Series) -> None: ...

    def generate(self, features: pd.DataFrame) -> pd.Series: ...


@runtime_checkable
class ForecastModel(Protocol):
    """Point or distributional forecasts."""

    @property
    def version(self) -> ModelVersion: ...

    def fit(self, features: pd.DataFrame, target: pd.Series) -> None: ...

    def forecast(self, features: pd.DataFrame, horizon: int = 1) -> pd.DataFrame: ...


@runtime_checkable
class SentimentModel(Protocol):
    """NLP / sentiment scoring."""

    @property
    def version(self) -> ModelVersion: ...

    def fit(self, texts: list[str], labels: list[str] | None = None) -> None: ...

    def score(self, texts: list[str]) -> pd.DataFrame: ...


@runtime_checkable
class RiskModel(Protocol):
    """Risk measures (vol, VaR, drawdown forecasts, etc.)."""

    @property
    def version(self) -> ModelVersion: ...

    def fit(self, returns: pd.Series, features: pd.DataFrame | None = None) -> None: ...

    def estimate(self, features: pd.DataFrame | None = None) -> Mapping[str, float]: ...


@runtime_checkable
class PortfolioModel(Protocol):
    """Portfolio construction / allocation."""

    @property
    def version(self) -> ModelVersion: ...

    def fit(self, returns: pd.DataFrame, features: pd.DataFrame | None = None) -> None: ...

    def allocate(self, features: pd.DataFrame | None = None) -> pd.Series: ...


def ensure_1d(values: pd.Series | np.ndarray | list[float]) -> np.ndarray:
    return np.asarray(values, dtype=float).reshape(-1)
