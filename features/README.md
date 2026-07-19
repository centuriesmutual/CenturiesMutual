# Features

## Purpose

Single reusable feature store for all engineered features. Never duplicate feature calculations outside this module.

## Inputs

Aligned market / economic / healthcare DataFrames with documented column names.

## Outputs

Named, versioned feature series and multi-column feature matrices.

## Dependencies

`pandas`, `numpy`.

## Assumptions

Input columns use canonical names (see feature `dependencies`); missing columns raise clearly.

## Limitations

Does not fetch remote data; ingestion must supply frames.

## Validation methodology

Deterministic unit tests against fixtures; version bumps require explicit registry updates.
