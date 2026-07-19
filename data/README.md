# Data

## Purpose

Tiered data storage for research: `raw` (immutable ingest), `processed` (cleaned), `reference` (small fixtures).

## Inputs

Ingestion pipelines and manual reference fixtures.

## Outputs

CSV/Parquet (or similar) consumed by the feature store.

## Dependencies

Filesystem paths from `config.Settings`.

## Assumptions

Large blobs are gitignored; only tiny reference fixtures may be committed.

## Limitations

Not a production data warehouse.

## Validation methodology

Schema checks in ingestion tests; fixture hashes where reproducibility requires it.
