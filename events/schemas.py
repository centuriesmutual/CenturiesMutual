"""Structured intelligence events and publisher interface."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any, Protocol, runtime_checkable
from uuid import uuid4


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


@dataclass(frozen=True)
class IntelligenceEvent:
    event_type: str
    payload: dict[str, Any]
    event_id: str = field(default_factory=lambda: str(uuid4()))
    occurred_at: datetime = field(default_factory=_utcnow)

    def to_dict(self) -> dict[str, Any]:
        data = asdict(self)
        data["occurred_at"] = self.occurred_at.isoformat()
        return data


def regime_changed(
    *,
    regime: str,
    previous_regime: str | None,
    model_version: str,
    confidence: float | None = None,
) -> IntelligenceEvent:
    return IntelligenceEvent(
        event_type="RegimeChanged",
        payload={
            "regime": regime,
            "previous_regime": previous_regime,
            "model_version": model_version,
            "confidence": confidence,
        },
    )


def signal_generated(
    *,
    signal: str | float,
    instrument: str | None,
    model_version: str,
) -> IntelligenceEvent:
    return IntelligenceEvent(
        event_type="SignalGenerated",
        payload={
            "signal": signal,
            "instrument": instrument,
            "model_version": model_version,
        },
    )


def risk_changed(*, metrics: dict[str, float], model_version: str) -> IntelligenceEvent:
    return IntelligenceEvent(
        event_type="RiskChanged",
        payload={"metrics": metrics, "model_version": model_version},
    )


def feature_updated(*, feature_name: str, feature_version: str) -> IntelligenceEvent:
    return IntelligenceEvent(
        event_type="FeatureUpdated",
        payload={"feature_name": feature_name, "feature_version": feature_version},
    )


def forecast_completed(
    *,
    horizon: int,
    model_version: str,
    summary: dict[str, Any],
) -> IntelligenceEvent:
    return IntelligenceEvent(
        event_type="ForecastCompleted",
        payload={"horizon": horizon, "model_version": model_version, "summary": summary},
    )


def research_published(*, title: str, path: str, tags: list[str] | None = None) -> IntelligenceEvent:
    return IntelligenceEvent(
        event_type="ResearchPublished",
        payload={"title": title, "path": path, "tags": tags or []},
    )


@runtime_checkable
class EventPublisher(Protocol):
    def publish(self, event: IntelligenceEvent) -> None: ...


class InMemoryEventPublisher:
    """Injectable sink for tests and local runs."""

    def __init__(self) -> None:
        self.events: list[IntelligenceEvent] = []

    def publish(self, event: IntelligenceEvent) -> None:
        self.events.append(event)

    def clear(self) -> None:
        self.events.clear()
