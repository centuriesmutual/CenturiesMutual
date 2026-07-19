# SDK

## Purpose

Thin Python client for the intelligence API.

## Inputs

Base URL and optional timeout; no secrets required for local stub API.

## Outputs

Parsed JSON dictionaries/lists from API endpoints.

## Dependencies

`httpx`.

## Assumptions

API is reachable at `base_url`; production auth (if any) is added by consumers outside this lab.

## Limitations

Does not embed models or feature logic — call the API or import lab packages directly for research.

## Validation methodology

Contract tests against `TestClient` or a running local server.
