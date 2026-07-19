# Regime Models

## Purpose

Detect market and economic regimes for downstream signal and risk systems.

## Inputs

Feature matrices from the feature store (e.g. treasury spread, VIX, CPI YoY).

## Outputs

Regime labels (`risk_off`, `neutral`, `risk_on`) and class probabilities.

## Dependencies

`features`, `models.base`, `scikit-learn`.

## Assumptions

Training labels are discrete and contemporaneous with features (no look-ahead in the reference demo beyond synthetic construction).

## Limitations

`ThresholdRegimeModel` is a reference baseline, not a production alpha model.

## Validation methodology

Deterministic synthetic-panel tests; walk-forward backtests via `backtests`.
