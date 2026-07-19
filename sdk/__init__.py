"""Thin Python SDK for the Centuries Mutual Labs intelligence API."""

from __future__ import annotations

from typing import Any

import httpx


class CenturiesMutualLabsClient:
    """HTTP client for intelligence endpoints. No UI concerns."""

    def __init__(self, base_url: str = "http://127.0.0.1:8080", timeout: float = 30.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _get(self, path: str, **params: Any) -> Any:
        with httpx.Client(base_url=self.base_url, timeout=self.timeout) as client:
            response = client.get(path, params=params or None)
            response.raise_for_status()
            return response.json()

    def health(self) -> dict[str, Any]:
        return self._get("/health")

    def regime_current(self) -> dict[str, Any]:
        return self._get("/api/regime/current")

    def regime_history(self, limit: int = 50) -> list[dict[str, Any]]:
        return self._get("/api/regime/history", limit=limit)

    def signals(self) -> dict[str, Any]:
        return self._get("/api/signals")

    def features(self) -> list[dict[str, Any]]:
        return self._get("/api/features")

    def forecast(self, horizon: int = 1) -> dict[str, Any]:
        return self._get("/api/forecast", horizon=horizon)

    def research(self) -> list[dict[str, Any]]:
        return self._get("/api/research")

    def risk(self) -> dict[str, Any]:
        return self._get("/api/risk")

    def healthcare(self) -> dict[str, Any]:
        return self._get("/api/healthcare")

    def economy(self) -> dict[str, Any]:
        return self._get("/api/economy")

    def insurance(self) -> dict[str, Any]:
        return self._get("/api/insurance")
