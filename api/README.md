# API

## Purpose

Expose structured JSON intelligence endpoints for downstream applications.

## Inputs

HTTP requests; models and feature store injected at app construction.

## Outputs

JSON responses for regime, signals, features, forecast, research, risk, and domain stubs.

## Dependencies

`fastapi`, `uvicorn`, `features`, `models`, `events`, `config`.

## Assumptions

No authentication or UI in this repository. Consumers authenticate at the production edge (GitLab apps).

## Limitations

Several domain routes are stubs until models are validated and promoted.

## Validation methodology

API contract tests via FastAPI `TestClient`; deterministic regime fixtures.
