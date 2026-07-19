# PROJECT MANDATE

This repository is no longer a production web application.

This repository is the official research, quantitative analysis, artificial intelligence, and market intelligence laboratory for Centuries Mutual Labs.

Its purpose is to discover, research, prototype, validate, backtest, and deploy quantitative models that generate structured intelligence for downstream applications.

This repository is NOT a website.

This repository is NOT an insurance CRM.

This repository is NOT the production application.

The production applications exist entirely within GitLab.

This repository exists only for research, modeling, experimentation, machine learning, forecasting, optimization, and intelligence generation.

---

## PRIMARY OBJECTIVES

Build a world-class quantitative research platform capable of:

- Market regime detection
- Economic regime detection
- Financial forecasting
- Healthcare intelligence
- Insurance intelligence
- AI research
- Portfolio analytics
- Feature engineering
- Statistical modeling
- Risk modeling
- Event processing
- Signal generation
- Backtesting
- Machine learning
- Reinforcement learning experimentation
- NLP research
- Sentiment analysis
- Alternative data research

---

## ARCHITECTURE

Organize the repository into logical modules.

Example:

```text
/docs
/notebooks
/research
/data
/data/raw
/data/processed
/data/reference
/ingestion
/features
/models
/models/regime
/models/signals
/models/forecasting
/models/risk
/models/nlp
/backtests
/strategies
/api
/sdk
/scripts
/tests
/config
/events
```

Each module must remain independent.

Avoid tight coupling.

Prefer dependency injection and composition.

---

## ENGINEERING PRINCIPLES

Write production-quality code.

Prefer:

- readability
- correctness
- determinism
- reproducibility
- modularity
- testability
- documentation

Avoid:

- duplicated logic
- hidden state
- unnecessary abstractions
- premature optimization

---

## MODELS

Models should be interchangeable.

Each model should expose a common interface.

Examples:

- RegimeModel
- SignalModel
- ForecastModel
- SentimentModel
- RiskModel
- PortfolioModel

---

## FEATURE STORE

Every engineered feature belongs in one reusable feature store.

Never duplicate feature calculations.

Examples:

- Yield Curve
- VIX
- Treasury Spread
- CPI
- PPI
- Interest Rates
- Dollar Index
- Breadth
- Healthcare ETF Momentum
- Hospital Earnings
- CMS Policy Events
- Drug Pricing
- Insurance Enrollment Growth
- Carrier Approval Rates
- Producer Productivity

---

## BACKTESTING

Every predictive model must be backtested before deployment.

Backtests should report:

- Sharpe Ratio
- Sortino Ratio
- Win Rate
- Max Drawdown
- Precision
- Recall
- Accuracy
- F1
- ROC
- Confusion Matrix
- Out-of-sample validation
- Walk-forward validation

---

## RESEARCH

Research notebooks are experimental.

Nothing inside notebooks is considered production.

Only validated work may be promoted into production modules.

---

## API

The repository should expose structured APIs.

Example endpoints:

- `/api/regime/current`
- `/api/regime/history`
- `/api/signals`
- `/api/features`
- `/api/forecast`
- `/api/research`
- `/api/risk`
- `/api/healthcare`
- `/api/economy`
- `/api/insurance`

Return structured JSON.

Never couple APIs directly to UI code.

---

## EVENT BUS

All generated intelligence should be published as structured events.

Examples:

- RegimeChanged
- SignalGenerated
- RiskChanged
- FeatureUpdated
- ForecastCompleted
- ResearchPublished

---

## TESTING

Every module must include tests.

Target high coverage on critical model logic.

Prefer deterministic tests over brittle integration tests.

---

## DOCUMENTATION

Every module should include:

- Purpose
- Inputs
- Outputs
- Dependencies
- Assumptions
- Limitations
- Validation methodology

---

## SECURITY

Do not store secrets in the repository.

Use environment variables.

Never commit credentials.

Never commit API keys.

Never commit tokens.

---

## VERSIONING

Research is iterative.

Models should be versioned independently.

Record:

- training data
- parameters
- evaluation metrics
- backtest results
- feature versions

---

## BOUNDARIES

This repository must never become a clone of the GitLab production applications.

Do not build:

- authentication
- user management
- insurance CRM pages
- marketing pages
- website layouts
- frontend dashboards
- customer portals
- business CRUD interfaces

Those belong exclusively in GitLab.

This repository only generates intelligence.
