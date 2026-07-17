# Centuries Mutual — Subdomain Apps

Each folder here is a **standalone Next.js application** deployed to its own
subdomain. They are intentionally kept separate from the root site
(`www.centuriesmutual.com`) because they use different Next.js / React major
versions and their own dependencies. They are **not** part of the root app's
build (the root `tsconfig.json` excludes `apps/`).

## Subdomain map

| Subdomain                       | Folder            | App (package)          | Stack                          |
| ------------------------------- | ----------------- | ---------------------- | ------------------------------ |
| `newspaper.centuriesmutual.com` | `apps/newspaper`  | `centuriesmutualfinal` | Next 14, React 18, Box SDK     |
| `editor.centuriesmutual.com`    | `apps/editor`     | `newspaper-editor-cms` | Next 14, React 18, Tailwind    |
| `office.centuriesmutual.com`    | `apps/office`     | `office-dashboard`     | Next 15, React 19, NextAuth    |
| `campaign.centuriesmutual.com`  | `apps/campaign`   | `marketing`            | Next 14, React 18, Tailwind    |

## Deploying (Vercel)

These share one Git repo but deploy as **separate Vercel projects**. For each
app, create a Vercel project pointing at the same repo and set:

1. **Root Directory** → the app's folder (e.g. `apps/office`).
2. **Framework Preset** → Next.js (auto-detected).
3. **Domains** → add the matching subdomain from the table above.
4. **Environment Variables** → copy the keys from that app's `.env.example`
   (where present) and fill in real values in the Vercel dashboard.

The root project (`www` / apex) keeps its existing Root Directory of `.`.

## Local development

Each app is self-contained:

```bash
cd apps/<name>
npm install
cp .env.example .env.local   # where present; fill in values
npm run dev
```

## Secrets

No real secrets are committed. Any `.env`, `.env.local`, and private keys from
the original archives were intentionally excluded. Configure real values only in
each app's Vercel project (or a local, untracked `.env.local`).
