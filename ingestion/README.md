# Ingestion

## Purpose

Deterministic loaders that bring external and reference data into `data/raw` and `data/processed`.

## Inputs

File paths, optional API clients injected by callers (credentials via env).

## Outputs

Normalized tabular datasets (typically pandas DataFrames) written under `data/`.

## Dependencies

`pandas`; optional HTTP clients for vendor APIs.

## Assumptions

Source schemas are documented per loader; timestamps are UTC unless noted.

## Limitations

Does not engineer model features — that belongs in `features/`.

## Validation methodology

Golden-file or schema tests on sample fixtures under `data/reference/`.
