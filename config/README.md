# Configuration

## Purpose

Non-secret runtime settings for the research platform (paths, API bind address, log level).

## Inputs

Environment variables prefixed with `CENTURIES_MUTUAL_LABS_` (see `.env.example`).

## Outputs

`Settings` objects consumed by API, ingestion, and scripts.

## Dependencies

`pydantic-settings`, `python-dotenv`.

## Assumptions

Secrets for external vendors are supplied only via environment variables and never committed.

## Limitations

Does not manage authentication or multi-tenant application config (those belong in GitLab production apps).

## Validation methodology

Unit tests assert defaults and env overrides; no network calls.
