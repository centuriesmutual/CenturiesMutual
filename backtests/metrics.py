"""Backtest metrics and report schema."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


@dataclass(frozen=True)
class ClassificationMetrics:
    precision: float
    recall: float
    accuracy: float
    f1: float
    roc_auc: float | None
    confusion_matrix: list[list[int]]


@dataclass(frozen=True)
class ReturnMetrics:
    sharpe_ratio: float
    sortino_ratio: float
    win_rate: float
    max_drawdown: float


@dataclass(frozen=True)
class BacktestReport:
    model_name: str
    model_version: str
    returns: ReturnMetrics
    classification: ClassificationMetrics | None
    out_of_sample: dict[str, float] = field(default_factory=dict)
    walk_forward: list[dict[str, Any]] = field(default_factory=list)
    notes: str = ""

    def to_dict(self) -> dict[str, Any]:
        payload = asdict(self)
        return payload


def _to_array(values: pd.Series | np.ndarray) -> np.ndarray:
    return np.asarray(values, dtype=float).reshape(-1)


def sharpe_ratio(returns: pd.Series | np.ndarray, periods_per_year: float = 252.0) -> float:
    r = _to_array(returns)
    if r.size == 0:
        return 0.0
    mu = float(np.mean(r))
    sigma = float(np.std(r, ddof=0))
    if sigma == 0.0:
        return 0.0
    return float(np.sqrt(periods_per_year) * mu / sigma)


def sortino_ratio(returns: pd.Series | np.ndarray, periods_per_year: float = 252.0) -> float:
    r = _to_array(returns)
    if r.size == 0:
        return 0.0
    mu = float(np.mean(r))
    downside = r[r < 0.0]
    if downside.size == 0:
        return float("inf") if mu > 0 else 0.0
    downside_std = float(np.std(downside, ddof=0))
    if downside_std == 0.0:
        return 0.0
    return float(np.sqrt(periods_per_year) * mu / downside_std)


def win_rate(returns: pd.Series | np.ndarray) -> float:
    r = _to_array(returns)
    if r.size == 0:
        return 0.0
    return float(np.mean(r > 0.0))


def max_drawdown(returns: pd.Series | np.ndarray) -> float:
    r = _to_array(returns)
    if r.size == 0:
        return 0.0
    equity = np.cumprod(1.0 + r)
    peak = np.maximum.accumulate(equity)
    dd = equity / peak - 1.0
    return float(np.min(dd))


def compute_return_metrics(returns: pd.Series | np.ndarray) -> ReturnMetrics:
    return ReturnMetrics(
        sharpe_ratio=sharpe_ratio(returns),
        sortino_ratio=sortino_ratio(returns),
        win_rate=win_rate(returns),
        max_drawdown=max_drawdown(returns),
    )


def compute_classification_metrics(
    y_true: pd.Series | np.ndarray,
    y_pred: pd.Series | np.ndarray,
    y_proba: pd.Series | np.ndarray | None = None,
    average: str = "weighted",
) -> ClassificationMetrics:
    yt = np.asarray(y_true)
    yp = np.asarray(y_pred)
    labels = sorted(set(yt.tolist()) | set(yp.tolist()))
    cm = confusion_matrix(yt, yp, labels=labels).tolist()
    roc: float | None = None
    if y_proba is not None:
        proba = _to_array(y_proba)
        # Binary ROC when two classes; otherwise skip.
        unique = np.unique(yt)
        if unique.size == 2:
            pos_label = unique.max()
            yt_bin = (yt == pos_label).astype(int)
            try:
                roc = float(roc_auc_score(yt_bin, proba))
            except ValueError:
                roc = None
    return ClassificationMetrics(
        precision=float(precision_score(yt, yp, average=average, zero_division=0)),
        recall=float(recall_score(yt, yp, average=average, zero_division=0)),
        accuracy=float(accuracy_score(yt, yp)),
        f1=float(f1_score(yt, yp, average=average, zero_division=0)),
        roc_auc=roc,
        confusion_matrix=cm,
    )
