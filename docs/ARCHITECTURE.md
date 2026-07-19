# Architecture

## Purpose

Centuries Mutual Labs produces structured market, economic, healthcare, and insurance intelligence for downstream systems hosted elsewhere (GitLab). This repository is the research and model laboratory only.

## Data flow

```text
ingestion → data/{raw,processed,reference}
         → features (single feature store)
         → models (protocol-based, versioned)
         → backtests / strategies
         → api + events → sdk / external consumers
```

## Module boundaries

| Module | Responsibility | Must not |
|--------|----------------|----------|
| `ingestion` | Load and normalize external/raw sources | Engineer model-specific features |
| `features` | Versioned, reusable feature definitions | Call models or APIs |
| `models` | Fit/predict behind shared protocols | Duplicate feature math |
| `backtests` | Metrics, OOS, walk-forward | Own production serving |
| `strategies` | Map signals to positions/rules | Reimplement metrics |
| `events` | Structured intelligence events | Persist UI state |
| `api` | JSON intelligence endpoints | Auth, CRM, or HTML UI |
| `sdk` | Thin client for consumers | Business CRUD |
| `notebooks` | Experiments | Define production contracts |
| `research` | Writeups and literature | Ship executable production code |

## Model interchangeability

All models implement protocols in `centuries_mutual_labs.models.base` (or package-equivalent):

- `RegimeModel`
- `SignalModel`
- `ForecastModel`
- `SentimentModel`
- `RiskModel`
- `PortfolioModel`

Consumers depend on protocols, not concrete classes. Inject feature stores and publishers.

## Feature store

One registry. Features are named, versioned, and deterministic given the same inputs and parameters. Examples: yield curve, VIX, treasury spread, CPI, healthcare ETF momentum, CMS policy events.

## Backtesting gate

No predictive model is deployment-ready without a backtest report covering return and classification metrics plus out-of-sample and walk-forward validation.

## Events

Intelligence changes emit typed events (`RegimeChanged`, `SignalGenerated`, etc.) for asynchronous consumers. The in-repo publisher starts as an in-memory / log sink; transport is injected.

## API

FastAPI serves `/api/...` JSON only. No session auth, user management, or frontend coupling in this repository.

## Promotion path

1. Prototype in `notebooks/`
2. Extract features into `features/`
3. Implement model under `models/<domain>/`
4. Add deterministic tests and backtests
5. Expose via `api/` and emit events
6. Document version metadata (data, params, metrics, feature versions)
