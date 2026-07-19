# Backtests

## Purpose

Mandatory evaluation harness for predictive models: return metrics, classification metrics, OOS, and walk-forward validation.

## Inputs

Predictions, labels, optional strategy returns; feature/label panels for walk-forward.

## Outputs

`BacktestReport` JSON-serializable structures.

## Dependencies

`numpy`, `pandas`, `scikit-learn`.

## Assumptions

Returns are simple period returns; classification labels are discrete and aligned to predictions.

## Limitations

Does not simulate market microstructure or transaction costs unless a strategy injects them into returns.

## Validation methodology

Deterministic unit tests on synthetic series with known analytic metrics.
