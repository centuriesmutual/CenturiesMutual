"""FastAPI intelligence API — structured JSON only, no UI coupling."""

from __future__ import annotations

from functools import lru_cache
from typing import Any

import pandas as pd
from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

from config import Settings, get_settings
from events import InMemoryEventPublisher, regime_changed
from features import build_default_store
from models.regime import ThresholdRegimeModel, synthetic_regime_panel


class RegimeCurrentResponse(BaseModel):
    regime: str
    confidence: float | None = None
    model_version: str
    as_of_index: int | str | None = None


class RegimeHistoryItem(BaseModel):
    index: int | str
    regime: str


class FeatureInfo(BaseModel):
    name: str
    version: str
    description: str


class ForecastResponse(BaseModel):
    status: str = "stub"
    horizon: int
    values: list[float] = Field(default_factory=list)
    message: str = "Forecast models not yet promoted; endpoint reserved."


class ResearchItem(BaseModel):
    title: str
    path: str
    status: str = "experimental"


class RiskResponse(BaseModel):
    status: str = "stub"
    metrics: dict[str, float] = Field(default_factory=dict)
    message: str = "Risk models not yet promoted; endpoint reserved."


class DomainIntelResponse(BaseModel):
    domain: str
    status: str = "stub"
    signals: list[dict[str, Any]] = Field(default_factory=list)
    message: str = "Domain intelligence endpoint reserved for validated models."


class SignalResponse(BaseModel):
    signals: list[dict[str, Any]]
    model_version: str | None = None


@lru_cache(maxsize=1)
def _fitted_regime_bundle() -> tuple[ThresholdRegimeModel, pd.DataFrame, pd.Series]:
    """Fit reference regime model once on synthetic panel for API demos."""
    store = build_default_store()
    raw, labels = synthetic_regime_panel(n=200, seed=42)
    features = store.compute_many(["treasury_spread", "vix", "cpi_yoy"], raw)
    model = ThresholdRegimeModel(
        feature_versions={k: store.get_spec(k).version for k in features.columns},
        training_data_id="synthetic_regime_panel_v1",
    )
    model.fit(features, labels)
    return model, features, labels


def create_app(
    settings: Settings | None = None,
    publisher: InMemoryEventPublisher | None = None,
) -> FastAPI:
    settings = settings or get_settings()
    publisher = publisher or InMemoryEventPublisher()

    app = FastAPI(
        title="Centuries Mutual Labs Intelligence API",
        version="0.1.0",
        description="Structured quantitative intelligence. No UI. No auth CRM.",
    )
    app.state.settings = settings
    app.state.publisher = publisher

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/api/regime/current", response_model=RegimeCurrentResponse)
    def regime_current() -> RegimeCurrentResponse:
        model, features, _ = _fitted_regime_bundle()
        last = features.iloc[[-1]]
        regime = str(model.predict(last).iloc[0])
        proba = model.predict_proba(last)
        confidence = float(proba.max(axis=1).iloc[0])
        publisher.publish(
            regime_changed(
                regime=regime,
                previous_regime=None,
                model_version=model.version.version,
                confidence=confidence,
            )
        )
        return RegimeCurrentResponse(
            regime=regime,
            confidence=confidence,
            model_version=model.version.version,
            as_of_index=int(last.index[0]) if hasattr(last.index[0], "__int__") else str(last.index[0]),
        )

    @app.get("/api/regime/history", response_model=list[RegimeHistoryItem])
    def regime_history(limit: int = Query(default=50, ge=1, le=500)) -> list[RegimeHistoryItem]:
        model, features, _ = _fitted_regime_bundle()
        preds = model.predict(features).tail(limit)
        return [RegimeHistoryItem(index=int(i) if str(i).isdigit() else i, regime=str(r)) for i, r in preds.items()]

    @app.get("/api/signals", response_model=SignalResponse)
    def signals() -> SignalResponse:
        model, features, _ = _fitted_regime_bundle()
        regime = str(model.predict(features.iloc[[-1]]).iloc[0])
        mapping = {"risk_off": -1.0, "neutral": 0.0, "risk_on": 1.0}
        return SignalResponse(
            signals=[{"name": "regime_position", "value": mapping.get(regime, 0.0), "regime": regime}],
            model_version=model.version.version,
        )

    @app.get("/api/features", response_model=list[FeatureInfo])
    def features_list() -> list[FeatureInfo]:
        store = build_default_store()
        return [FeatureInfo(**item) for item in store.list_features()]

    @app.get("/api/forecast", response_model=ForecastResponse)
    def forecast(horizon: int = Query(default=1, ge=1, le=252)) -> ForecastResponse:
        return ForecastResponse(horizon=horizon)

    @app.get("/api/research", response_model=list[ResearchItem])
    def research() -> list[ResearchItem]:
        return [
            ResearchItem(title="Project Mandate", path="docs/MANDATE.md", status="canonical"),
            ResearchItem(title="Architecture", path="docs/ARCHITECTURE.md", status="canonical"),
        ]

    @app.get("/api/risk", response_model=RiskResponse)
    def risk() -> RiskResponse:
        return RiskResponse()

    @app.get("/api/healthcare", response_model=DomainIntelResponse)
    def healthcare() -> DomainIntelResponse:
        return DomainIntelResponse(domain="healthcare")

    @app.get("/api/economy", response_model=DomainIntelResponse)
    def economy() -> DomainIntelResponse:
        return DomainIntelResponse(domain="economy")

    @app.get("/api/insurance", response_model=DomainIntelResponse)
    def insurance() -> DomainIntelResponse:
        return DomainIntelResponse(domain="insurance")

    return app


app = create_app()


def run() -> None:
    import uvicorn

    settings = get_settings()
    uvicorn.run(
        "api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=False,
    )


if __name__ == "__main__":
    run()
