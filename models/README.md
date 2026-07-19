# Models

## Purpose

Interchangeable predictive and analytical models behind shared protocols.

## Inputs

Feature matrices from the feature store; optional labels/targets for fitting.

## Outputs

Predictions, probabilities, forecasts, risk estimates, allocations — plus `ModelVersion` metadata.

## Dependencies

`features`, `numpy`, `pandas`, `scikit-learn` (per concrete model).

## Assumptions

Callers inject feature frames already aligned on a common index; no hidden global state.

## Limitations

Concrete models must not reimplement feature math that belongs in the feature store.

## Validation methodology

Protocol compliance tests, deterministic unit tests, and mandatory backtests before promotion.
