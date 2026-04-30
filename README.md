# Centuries Mutual — Corporate Web Platform

**Repository:** Private — Authorized personnel only

Centuries Mutual is a **Next.js 14 (App Router)** web application written in **TypeScript** that supports the firm's digital presence: community brokerage positioning, structured product education, trust-centric experiences, document workflows, and client-facing tooling.

This README is maintained for **technical due diligence**, **vendor onboarding**, and **internal governance** ("bank-ready": accurate, sober, audit-friendly—not marketing copy).

---

## 1. Executive summary

| Item | Detail |
|------|--------|
| **Purpose** | Public and authenticated web experiences for Centuries Mutual; marketing, disclosures, integrations, and operational UI |
| **Language** | TypeScript (strict, with relaxed `noImplicitAny` for incremental migration) |
| **Runtime** | Node.js (LTS recommended), React 18, Next.js 14 App Router |
| **Primary hosting model** | Static + server-rendered routes, deployed on **[Vercel](https://vercel.com)** with environment-based configuration |

---

## 2. Capability overview (high level)

- **Marketing & informational pages:** Services, landlord/tenant/host/trust narratives, downloads, equity and learning content
- **Identity & sessions:** Authentication via **Auth0** (`@auth0/nextjs-auth0`); the `/login` and `/signup` pages hand off to Auth0 Universal Login through the `/api/auth/[...auth0]` route handler
- **Operational UI:** Claims, disputes, enrollment, security narratives, audits, utilities, messaging, AI/technology exposition
- **Documents & signatures:** Digital document flows with PDF generation tooling (`jspdf`, `pdfkit`) and signing components (`signature_pad`, `react-signature-canvas`)
- **Search:** Meilisearch client available where search-backed features are deployed
- **Asset storage / content:** Box SDK (`box-node-sdk`) supports enterprise content workflows for application and enrollment uploads

> **Disclaimer:** Capability descriptions describe **technical affordances** in this codebase. Regulatory status, licensing, and product approvals are governed by Centuries Mutual policies and applicable law—not by this README.

---

## 3. Technology stack

| Layer | Technology |
|-------|-------------|
| **Language** | TypeScript 5 |
| **Framework** | Next.js 14, React 18 |
| **Styling / UI** | Bootstrap 5, Bootstrap Icons, Tailwind CSS (`tailwind.config.ts`), Framer Motion |
| **Auth** | Auth0 (`@auth0/nextjs-auth0`) |
| **Analytics** | Vercel Analytics (`@vercel/analytics`) |
| **3D / visualization** | Three.js, React Three Fiber, Drei (select experiences) |

---

## 4. Prerequisites

- **Node.js** 18.x or 20.x (LTS)
- **npm** (bundled with Node)

Optional integrations require separate accounts and secrets (Auth0 tenant, Box, Meilisearch, etc.) provisioned according to enterprise policy.

---

## 5. Local development

Clone the repository (authorized credentials only):

```bash
git clone https://github.com/centuriesmutual/CenturiesMutual.git
cd CenturiesMutual
npm install
```

### Environment variables

Secrets **must never** be committed. Create `.env.local` (ignored by Git) for local development:

| Variable | Role |
|---------|------|
| `AUTH0_SECRET` | Long random string used to encrypt the session cookie |
| `AUTH0_BASE_URL` | Application base URL (e.g. `http://localhost:3030` locally, `https://centuriesmutual.com` in prod) |
| `AUTH0_ISSUER_BASE_URL` | Auth0 tenant URL (e.g. `https://your-tenant.us.auth0.com`) |
| `AUTH0_CLIENT_ID` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |

Additional variables apply per feature (Box, Meilisearch, etc.); coordinate with engineering for the authoritative checklist for your deployment environment.

### Commands

```bash
npm run dev        # Development server — port 3030 (per package.json)
npm run build      # Production build verification
npm run start      # Production server (port 3000 after build)
npm run lint       # ESLint — Next.js
npm run typecheck  # TypeScript strict typecheck
```

Resolve `npm run build` and `npm run typecheck` warnings before tagging releases promoted to staging or production.

---

## 6. Repository layout (abbreviated)

```
app/              # Routes (App Router), layouts, metadata, API routes — TypeScript
components/       # React components (TSX) — UI sections, dashboards, Navbar, Footer, etc.
hooks/            # Reusable React hooks (TS)
lib/              # Shared utilities (e.g. Auth0 handler) — TS
utils/            # Animation primitives and other utilities — TS
public/           # Static assets (images, favicon)
```

---

## 7. Security & compliance posture (documentation)

This section documents **engineering expectations** consistent with regulated environments:

| Topic | Guidance |
|--------|----------|
| **Secrets** | Store only in environment variables or approved secret managers |
| **Transport** | Enforce HTTPS in production; TLS termination at hosting edge |
| **Dependencies** | Run `npm audit` and remediation on a recurring cadence; pin critical upgrades outside patch releases |
| **PII / payments** | No cardholder data (PCI) belongs in frontend env vars or this repo |
| **Access** | Principle of least privilege for Git ownership, CI keys, Auth0 tenant administration |

---

## 8. Operational ownership

| Role | Responsibility |
|------|----------------|
| **Product / business** | Content accuracy of public disclosures |
| **Engineering** | Releases, branching, CVE response, infra alignment |
| **Security / Risk** | Sign-off for third-party integrations and data classification |

Support and escalation contacts are internal to Centuries Mutual and are **not** published in this README.

---

## 9. License & confidentiality

Unless a separate **`LICENSE`** file states otherwise:
**© Centuries Mutual. All rights reserved.**

Unlicensed redistribution, cloning for external publication, or use outside authorized employment or contractor engagements is prohibited.

---

## 10. Document control

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-04 | Initial institutional README |
| 1.1 | 2026-04 | Migrated to TypeScript; Auth0 used as the sole identity provider |

*Maintained by Centuries Mutual engineering.*
