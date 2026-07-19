# Centuries Mutual Labs — Quantitative Research Platform

Official research, quantitative analysis, AI, and market intelligence laboratory for **Centuries Mutual Labs**.

This repository is **not** a website, insurance CRM, or production application. Production applications live in GitLab. This lab discovers, prototypes, validates, backtests, and serves structured intelligence through stable APIs and events.

See [docs/MANDATE.md](docs/MANDATE.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Capabilities

- Market and economic regime detection
- Feature engineering (single feature store)
- Forecasting, risk, NLP / sentiment research
- Healthcare and insurance intelligence research
- Backtesting (Sharpe, Sortino, drawdown, classification metrics, OOS, walk-forward)
- Structured JSON API and event schemas for downstream consumers

## Layout

| Path | Role |
|------|------|
| `docs/` | Mandate, architecture, validation standards |
| `notebooks/` | Experimental only — not production |
| `research/` | Writeups and literature notes |
| `data/` | `raw` / `processed` / `reference` |
| `ingestion/` | Deterministic loaders |
| `features/` | Shared feature store |
| `models/` | Protocol-based models (`regime`, `signals`, `forecasting`, `risk`, `nlp`) |
| `backtests/` | Metrics and walk-forward harness |
| `strategies/` | Signal → position rules |
| `events/` | Intelligence event schemas + publisher |
| `api/` | FastAPI JSON endpoints |
| `sdk/` | Thin Python client |
| `scripts/` | Reproducible CLI jobs |
| `tests/` | Deterministic unit and API contract tests |
| `config/` | Non-secret settings |

## Setup

Python **3.11+** required.

```bash
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -U pip
pip install -e ".[dev]"
cp .env.example .env
```

## Tests

```bash
pytest
```

## API

```bash
uvicorn api.main:app --host 127.0.0.1 --port 8080
```

Example endpoints:

- `GET /api/regime/current`
- `GET /api/regime/history`
- `GET /api/signals`
- `GET /api/features`
- `GET /api/forecast`
- `GET /api/research`
- `GET /api/risk`
- `GET /api/healthcare`
- `GET /api/economy`
- `GET /api/insurance`

## Reference regime path

1. Features from `features.build_default_store()`
2. `models.regime.ThresholdRegimeModel`
3. Backtest via `scripts/run_regime_backtest.py` or `backtests.run_walk_forward_classification`
4. Served at `/api/regime/*` with `RegimeChanged` events

```bash
python scripts/run_regime_backtest.py
```

## Promotion path (notebook → production module)

1. Prototype in `notebooks/`
2. Move feature logic into `features/` (never duplicate)
3. Implement model under `models/<domain>/` behind a shared protocol
4. Add deterministic tests and a backtest report
5. Expose via `api/` and emit events
6. Record version metadata (training data, parameters, metrics, feature versions)

## Boundaries

Do **not** add authentication, user management, CRM pages, marketing sites, dashboards, customer portals, or business CRUD here. Those belong exclusively in GitLab.

## Security

Never commit secrets. Use environment variables (see `.env.example`).
