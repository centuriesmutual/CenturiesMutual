"""Strategy helpers mapping regime/signals to simple position rules."""

from __future__ import annotations

import pandas as pd


def regime_to_position(regime: pd.Series) -> pd.Series:
    """Map regime labels to a simple gross exposure in [-1, 1]."""
    mapping = {"risk_off": -1.0, "neutral": 0.0, "risk_on": 1.0}
    return regime.map(mapping).astype(float).fillna(0.0).rename("position")


def positions_to_returns(position: pd.Series, asset_returns: pd.Series) -> pd.Series:
    """Apply lag-1 positions to asset returns (no look-ahead)."""
    aligned = asset_returns.loc[position.index]
    return (position.shift(1).fillna(0.0) * aligned).rename("strategy_return")
