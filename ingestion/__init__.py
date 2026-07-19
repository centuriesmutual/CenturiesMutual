"""Data ingestion loaders — normalize external sources into raw/processed tables."""

from __future__ import annotations

from pathlib import Path

import pandas as pd


def load_csv(path: Path | str, **kwargs) -> pd.DataFrame:
    """Load a deterministic CSV into a DataFrame."""
    return pd.read_csv(path, **kwargs)


def save_processed(frame: pd.DataFrame, path: Path | str) -> Path:
    """Persist a processed frame; returns the resolved path."""
    out = Path(path)
    out.parent.mkdir(parents=True, exist_ok=True)
    frame.to_csv(out, index=False)
    return out.resolve()
