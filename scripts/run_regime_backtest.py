"""CLI helpers for reproducible research jobs."""

from __future__ import annotations

import json

from backtests import run_walk_forward_classification
from features import build_default_store
from models.regime import ThresholdRegimeModel, synthetic_regime_panel
from strategies import positions_to_returns, regime_to_position


def run_regime_backtest() -> dict:
    store = build_default_store()
    raw, labels = synthetic_regime_panel(n=240, seed=42)
    features = store.compute_many(["treasury_spread", "vix", "cpi_yoy"], raw)
    # Synthetic asset returns correlated with latent risk-on
    asset_returns = raw["healthcare_etf"].pct_change().fillna(0.0)

    def fit_predict(train_X, train_y, test_X):
        model = ThresholdRegimeModel(training_data_id="synthetic_regime_panel_v1")
        model.fit(train_X, train_y)
        return model.predict_codes(test_X)

    def returns_from_preds(y_true, y_pred):
        # Map predicted codes to positions using string labels via model mapping
        label_map = {0: "risk_off", 1: "neutral", 2: "risk_on"}
        regimes = y_pred.map(label_map)
        pos = regime_to_position(regimes)
        return positions_to_returns(pos, asset_returns.loc[pos.index])

    report = run_walk_forward_classification(
        features,
        labels,
        fit_predict,
        returns_from_preds=returns_from_preds,
        n_splits=4,
        model_name="threshold_regime",
        model_version="1.0.0",
    )
    return report.to_dict()


if __name__ == "__main__":
    print(json.dumps(run_regime_backtest(), indent=2, default=str))
