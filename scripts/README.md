# Scripts

## Purpose

Reproducible CLI entrypoints for training, backtests, and batch intelligence jobs.

## Inputs

CLI args and environment configuration.

## Outputs

Printed JSON reports and/or artifacts under `data/processed`.

## Dependencies

Lab packages (`features`, `models`, `backtests`, etc.).

## Assumptions

Run from repository root with the package import path available (`pip install -e .`).

## Limitations

Scripts are not a substitute for the API event bus in production orchestration.

## Validation methodology

Smoke-run in CI after unit tests; assert exit code 0 and JSON parseability.
