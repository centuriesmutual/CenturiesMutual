# Events

## Purpose

Publish structured intelligence events for downstream consumers.

## Inputs

Model and feature lifecycle facts (regime changes, signals, risk updates, etc.).

## Outputs

`IntelligenceEvent` records via an injected `EventPublisher`.

## Dependencies

Standard library only for schemas; transport is injected.

## Assumptions

Default publisher is in-memory; production transports are composed by API/scripts.

## Limitations

No durable queue is bundled in-repo; do not couple to UI notification systems here.

## Validation methodology

Unit tests assert event type names and payload shape.
