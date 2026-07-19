# Notebooks

## Purpose

Experimental research only. Nothing in this directory is considered production.

## Inputs

Lab packages installed in the environment (`features`, `models`, `backtests`, …).

## Outputs

Exploratory figures, temporary metrics, and candidate ideas for promotion.

## Dependencies

Jupyter; Centuries Mutual Labs packages.

## Assumptions

Notebooks import production modules — they do not redefine feature math or model contracts.

## Limitations

Not tested in CI as production code; flaky exploratory cells are expected.

## Validation methodology

Promote validated cells into modules with deterministic tests before any API exposure.
