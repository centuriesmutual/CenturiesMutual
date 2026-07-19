"""Walk-forward and out-of-sample validation helpers."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Any

import pandas as pd

from backtests.metrics import (
    BacktestReport,
    compute_classification_metrics,
    compute_return_metrics,
)


@dataclass(frozen=True)
class WalkForwardSplit:
    fold: int
    train_start: int
    train_end: int
    test_start: int
    test_end: int


def walk_forward_splits(
    n_rows: int,
    n_splits: int = 5,
    min_train_size: int | None = None,
    test_size: int | None = None,
) -> list[WalkForwardSplit]:
    """Expanding-window walk-forward splits over a contiguous index of length n_rows."""
    if n_rows < 10:
        raise ValueError("Need at least 10 rows for walk-forward splits")
    if n_splits < 2:
        raise ValueError("n_splits must be >= 2")

    test = test_size or max(1, n_rows // (n_splits + 1))
    min_train = min_train_size or max(test, n_rows // (n_splits + 1))
    splits: list[WalkForwardSplit] = []
    fold = 0
    train_end = min_train
    while train_end + test <= n_rows and fold < n_splits:
        test_start = train_end
        test_end = train_end + test
        splits.append(
            WalkForwardSplit(
                fold=fold,
                train_start=0,
                train_end=train_end,
                test_start=test_start,
                test_end=test_end,
            )
        )
        fold += 1
        train_end = test_end
    if not splits:
        raise ValueError("Unable to construct walk-forward splits with given sizes")
    return splits


FitPredictFn = Callable[[pd.DataFrame, pd.Series, pd.DataFrame], pd.Series]
ReturnsFn = Callable[[pd.Series, pd.Series], pd.Series]


def run_walk_forward_classification(
    features: pd.DataFrame,
    labels: pd.Series,
    fit_predict: FitPredictFn,
    *,
    returns_from_preds: ReturnsFn | None = None,
    n_splits: int = 5,
    model_name: str = "model",
    model_version: str = "0.0.0",
) -> BacktestReport:
    """
    Walk-forward validation for classification models.

    `fit_predict(train_X, train_y, test_X) -> test predictions`
    Optional `returns_from_preds(y_true_test, y_pred_test) -> period returns`
    """
    labels = labels.loc[features.index]
    splits = walk_forward_splits(len(features), n_splits=n_splits)
    fold_reports: list[dict[str, Any]] = []
    all_pred: list[pd.Series] = []
    all_true: list[pd.Series] = []
    all_returns: list[pd.Series] = []

    for split in splits:
        train_X = features.iloc[split.train_start : split.train_end]
        train_y = labels.iloc[split.train_start : split.train_end]
        test_X = features.iloc[split.test_start : split.test_end]
        test_y = labels.iloc[split.test_start : split.test_end]
        preds = fit_predict(train_X, train_y, test_X)
        preds = pd.Series(preds, index=test_X.index)
        clf = compute_classification_metrics(test_y, preds)
        fold_ret = (
            returns_from_preds(test_y, preds)
            if returns_from_preds
            else pd.Series(0.0, index=test_X.index)
        )
        ret_m = compute_return_metrics(fold_ret)
        fold_reports.append(
            {
                "fold": split.fold,
                "train_end": split.train_end,
                "test_start": split.test_start,
                "test_end": split.test_end,
                "accuracy": clf.accuracy,
                "f1": clf.f1,
                "sharpe_ratio": ret_m.sharpe_ratio,
                "max_drawdown": ret_m.max_drawdown,
            }
        )
        all_pred.append(preds)
        all_true.append(test_y)
        all_returns.append(fold_ret)

    y_pred = pd.concat(all_pred)
    y_true = pd.concat(all_true)
    rets = pd.concat(all_returns)
    classification = compute_classification_metrics(y_true, y_pred)
    returns = compute_return_metrics(rets)

    # Final holdout: last 20% never used in last fold train — approximate OOS as last fold.
    oos = fold_reports[-1] if fold_reports else {}
    return BacktestReport(
        model_name=model_name,
        model_version=model_version,
        returns=returns,
        classification=classification,
        out_of_sample={
            "accuracy": float(oos.get("accuracy", 0.0)),
            "f1": float(oos.get("f1", 0.0)),
            "sharpe_ratio": float(oos.get("sharpe_ratio", 0.0)),
            "max_drawdown": float(oos.get("max_drawdown", 0.0)),
        },
        walk_forward=fold_reports,
    )
