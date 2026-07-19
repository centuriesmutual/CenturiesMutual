# Tests

## Purpose

Deterministic unit and API contract tests for critical lab logic.

## Inputs

Synthetic fixtures and in-process FastAPI `TestClient` (no external network).

## Outputs

Pass/fail via `pytest`.

## Dependencies

`pytest`, lab packages.

## Assumptions

Tests must be reproducible given fixed seeds; prefer unit tests over brittle integration tests.

## Limitations

Does not cover unpromoted notebook experiments.

## Validation methodology

Run `pytest` from repo root after `pip install -e ".[dev]"`.
