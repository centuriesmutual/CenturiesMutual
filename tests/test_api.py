"""API contract tests — structured JSON, no UI."""

from __future__ import annotations

from fastapi.testclient import TestClient

from api.main import create_app
from events import InMemoryEventPublisher


def test_health_and_core_endpoints() -> None:
    publisher = InMemoryEventPublisher()
    client = TestClient(create_app(publisher=publisher))

    assert client.get("/health").json()["status"] == "ok"

    current = client.get("/api/regime/current").json()
    assert current["regime"] in {"risk_off", "neutral", "risk_on"}
    assert "model_version" in current
    assert publisher.events
    assert publisher.events[-1].event_type == "RegimeChanged"

    history = client.get("/api/regime/history", params={"limit": 10}).json()
    assert len(history) == 10
    assert "regime" in history[0]

    signals = client.get("/api/signals").json()
    assert "signals" in signals

    features = client.get("/api/features").json()
    names = {f["name"] for f in features}
    assert "treasury_spread" in names
    assert "vix" in names

    assert client.get("/api/forecast").json()["status"] == "stub"
    assert isinstance(client.get("/api/research").json(), list)
    assert client.get("/api/risk").json()["status"] == "stub"
    assert client.get("/api/healthcare").json()["domain"] == "healthcare"
    assert client.get("/api/economy").json()["domain"] == "economy"
    assert client.get("/api/insurance").json()["domain"] == "insurance"
