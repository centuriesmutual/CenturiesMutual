# Strategies

## Purpose

Map model outputs (regimes, signals) into position or operational rules.

## Inputs

Model prediction series; optional asset return series.

## Outputs

Positions and strategy returns for backtests.

## Dependencies

`pandas`; consumes model outputs without owning feature math.

## Assumptions

Positions are applied with a one-period lag unless a strategy documents otherwise.

## Limitations

No transaction cost or borrow model in the baseline helpers.

## Validation methodology

Unit tests on known regime→position maps and lag behavior.
