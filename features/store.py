"""Feature store — single registry for engineered features."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Mapping

import numpy as np
import pandas as pd


FeatureFn = Callable[[pd.DataFrame], pd.Series]


@dataclass(frozen=True)
class FeatureSpec:
    name: str
    version: str
    description: str
    compute: FeatureFn
    dependencies: tuple[str, ...] = ()


class FeatureStore:
    """Named, versioned feature registry. Never duplicate calculations outside this store."""

    def __init__(self) -> None:
        self._specs: dict[str, FeatureSpec] = {}

    def register(self, spec: FeatureSpec) -> None:
        key = spec.name
        if key in self._specs and self._specs[key].version != spec.version:
            # Allow replace when intentionally versioning; last register wins.
            pass
        self._specs[key] = spec

    def get_spec(self, name: str) -> FeatureSpec:
        if name not in self._specs:
            raise KeyError(f"Unknown feature: {name}")
        return self._specs[name]

    def list_features(self) -> list[dict[str, str]]:
        return [
            {
                "name": s.name,
                "version": s.version,
                "description": s.description,
            }
            for s in sorted(self._specs.values(), key=lambda x: x.name)
        ]

    def versions(self) -> Mapping[str, str]:
        return {name: spec.version for name, spec in self._specs.items()}

    def compute(self, name: str, frame: pd.DataFrame) -> pd.Series:
        spec = self.get_spec(name)
        series = spec.compute(frame)
        if not isinstance(series, pd.Series):
            series = pd.Series(series, index=frame.index)
        series.name = name
        return series

    def compute_many(self, names: list[str], frame: pd.DataFrame) -> pd.DataFrame:
        cols = {name: self.compute(name, frame) for name in names}
        return pd.DataFrame(cols, index=frame.index)


def _col(frame: pd.DataFrame, *candidates: str) -> pd.Series:
    for c in candidates:
        if c in frame.columns:
            return frame[c].astype(float)
    raise KeyError(f"None of {candidates} found in columns {list(frame.columns)}")


def treasury_spread(frame: pd.DataFrame) -> pd.Series:
    """10Y minus 2Y treasury spread."""
    long_rate = _col(frame, "us_10y", "yield_10y", "DGS10")
    short_rate = _col(frame, "us_2y", "yield_2y", "DGS2")
    return long_rate - short_rate


def vix_level(frame: pd.DataFrame) -> pd.Series:
    return _col(frame, "vix", "VIX")


def cpi_yoy(frame: pd.DataFrame) -> pd.Series:
    return _col(frame, "cpi_yoy", "CPIAUCSL_YOY")


def healthcare_etf_momentum(frame: pd.DataFrame, window: int = 21) -> pd.Series:
    px = _col(frame, "healthcare_etf", "XLV", "xlv_close")
    return px.pct_change(window)


def build_default_store() -> FeatureStore:
    """Register core macro / healthcare features used across models."""
    store = FeatureStore()
    store.register(
        FeatureSpec(
            name="treasury_spread",
            version="1.0.0",
            description="10Y–2Y Treasury yield spread",
            compute=treasury_spread,
            dependencies=("us_10y", "us_2y"),
        )
    )
    store.register(
        FeatureSpec(
            name="vix",
            version="1.0.0",
            description="VIX level",
            compute=vix_level,
            dependencies=("vix",),
        )
    )
    store.register(
        FeatureSpec(
            name="cpi_yoy",
            version="1.0.0",
            description="CPI year-over-year",
            compute=cpi_yoy,
            dependencies=("cpi_yoy",),
        )
    )
    store.register(
        FeatureSpec(
            name="healthcare_etf_momentum",
            version="1.0.0",
            description="Healthcare ETF trailing return momentum",
            compute=lambda f: healthcare_etf_momentum(f, window=21),
            dependencies=("healthcare_etf",),
        )
    )
    return store


def zscore(series: pd.Series) -> pd.Series:
    mu = float(series.mean())
    sigma = float(series.std(ddof=0))
    if sigma == 0.0 or np.isnan(sigma):
        return pd.Series(np.zeros(len(series)), index=series.index, name=series.name)
    return (series - mu) / sigma
