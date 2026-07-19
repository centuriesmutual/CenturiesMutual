# Validation Standards

## Determinism

Given fixed inputs, seeds, and feature versions, models and backtests must produce identical outputs.

## Required backtest metrics

Every predictive model report should include:

| Category | Metrics |
|----------|---------|
| Returns | Sharpe, Sortino, win rate, max drawdown |
| Classification | Precision, recall, accuracy, F1, ROC AUC, confusion matrix |
| Robustness | Out-of-sample holdout, walk-forward folds |

## Walk-forward

Use expanding or rolling windows with a documented train/test split policy. Record fold boundaries and metrics per fold plus aggregate.

## Out-of-sample

Reserve a final holdout never used for parameter selection. Report holdout metrics separately from in-sample and walk-forward averages.

## Model versioning checklist

Before promoting a model version:

- [ ] Training data identifier / hash
- [ ] Feature version set
- [ ] Hyperparameters
- [ ] Evaluation metrics
- [ ] Backtest artifact path
- [ ] Known limitations documented in module README
