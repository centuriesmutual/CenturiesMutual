"""Deterministic tests for feature store and regime path."""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from backtests import compute_return_metrics, run_walk_forward_classification, walk_forward_splits
from events import InMemoryEventPublisher, regime_changed
from features import build_default_store
from models.base import RegimeModel
from models.regime import ThresholdRegimeModel, synthetic_regime_panel
from strategies import positions_to_returns, regime_to_position


def test_feature_store_treasury_spread_deterministic() -> None:
    store = build_default_store()
    frame = pd.DataFrame({"us_10y": [4.0, 5.0], "us_2y": [3.0, 3.5], "vix": [12.0, 20.0], "cpi_yoy": [2.0, 3.0]})
    a = store.compute("treasury_spread", frame)
    b = store.compute("treasury_spread", frame)
    pd.testing.assert_series_equal(a, b)
    assert list(a.values) == pytest.approx([1.0, 1.5])


def test_threshold_regime_is_regime_model_protocol() -> None:
    model = ThresholdRegimeModel()
    assert isinstance(model, RegimeModel)


def test_regime_model_deterministic_predictions() -> None:
    store = build_default_store()
    raw, labels = synthetic_regime_panel(n=180, seed=42)
    features = store.compute_many(["treasury_spread", "vix", "cpi_yoy"], raw)

    m1 = ThresholdRegimeModel(training_data_id="synthetic_regime_panel_v1")
    m2 = ThresholdRegimeModel(training_data_id="synthetic_regime_panel_v1")
    m1.fit(features, labels)
    m2.fit(features, labels)

    p1 = m1.predict(features)
    p2 = m2.predict(features)
    pd.testing.assert_series_equal(p1, p2)

    c1 = m1.predict_codes(features)
    c2 = m2.predict_codes(features)
    pd.testing.assert_series_equal(c1, c2)


def test_backtest_metrics_known_series() -> None:
    returns = pd.Series([0.01, -0.01, 0.02, 0.0, 0.01])
    metrics = compute_return_metrics(returns)
    assert metrics.win_rate == pytest.approx(0.6)
    assert metrics.max_drawdown <= 0.0
    assert np.isfinite(metrics.sharpe_ratio)


def test_walk_forward_splits_expanding() -> None:
    splits = walk_forward_splits(100, n_splits=4)
    assert len(splits) >= 2
    assert splits[0].train_start == 0
    assert splits[0].test_end > splits[0].test_start


def test_walk_forward_regime_backtest_runs() -> None:
    store = build_default_store()
    raw, labels = synthetic_regime_panel(n=200, seed=7)
    features = store.compute_many(["treasury_spread", "vix", "cpi_yoy"], raw)
    asset_returns = raw["healthcare_etf"].pct_change().fillna(0.0)

    def fit_predict(train_X, train_y, test_X):
        model = ThresholdRegimeModel()
        model.fit(train_X, train_y)
        return model.predict_codes(test_X)

    def returns_from_preds(y_true, y_pred):
        label_map = {0: "risk_off", 1: "neutral", 2: "risk_on"}
        pos = regime_to_position(y_pred.map(label_map))
        return positions_to_returns(pos, asset_returns.loc[pos.index])

    report = run_walk_forward_classification(
        features,
        labels,
        fit_predict,
        returns_from_preds=returns_from_preds,
        n_splits=3,
        model_name="threshold_regime",
        model_version="1.0.0",
    )
    assert report.classification is not None
    assert 0.0 <= report.classification.accuracy <= 1.0
    assert report.walk_forward
    assert "accuracy" in report.out_of_sample


def test_strategy_lag_no_lookahead() -> None:
    regimes = pd.Series(["risk_on", "risk_on", "risk_off"])
    pos = regime_to_position(regimes)
    rets = pd.Series([0.1, 0.1, -0.1])
    strat = positions_to_returns(pos, rets)
    assert strat.iloc[0] == 0.0
    assert strat.iloc[1] == pytest.approx(0.1)


def test_event_publisher() -> None:
    pub = InMemoryEventPublisher()
    pub.publish(regime_changed(regime="risk_on", previous_regime="neutral", model_version="1.0.0"))
    assert len(pub.events) == 1
    assert pub.events[0].event_type == "RegimeChanged"
