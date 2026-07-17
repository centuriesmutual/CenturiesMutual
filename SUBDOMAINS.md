# Subdomain apps (single Vercel project)

All four sub-sites run inside **this one Next.js app / one Vercel project**. A
hostname rewrite in `middleware.ts` maps each subdomain to a route tree:

| Subdomain                       | Serves route tree | Source in repo        |
| ------------------------------- | ----------------- | --------------------- |
| `office.centuriesmutual.com`    | `/office/**`      | `app/office/**`, `components/office/**` |
| `editor.centuriesmutual.com`    | `/editor/**`      | `app/editor/**`, `lib/editor/**`        |
| `campaign.centuriesmutual.com`  | `/campaign/**`    | `app/campaign/**`     |
| `newspaper.centuriesmutual.com` | `/newspaper`      | `app/newspaper` (already part of the main site) |

`office.host/foo` is internally rewritten to `/office/foo`, so each app's own
`/...` links, `fetch('/api/...')`, and `router.push('/...')` keep working
unchanged. Static files (anything with a file extension) and `/_next/*` are
served from the shared root and are not rewritten.

## Vercel setup

There is **nothing to create as a separate project**. In the single
`centuriesmutual` Vercel project, add each subdomain under
**Settings → Domains** (all pointing at this same project/deployment). The
middleware does the routing.

## Environment variables (set in the one Vercel project)

- **office** (Google Workspace + NextAuth): `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `NEXTAUTH_URL`
  (`https://office.centuriesmutual.com`), `NEXTAUTH_SECRET`.
- **editor** (Box CMS + JWT auth): `BOX_CLIENT_ID`, `BOX_CLIENT_SECRET`,
  `BOX_ENTERPRISE_ID`, `BOX_PUBLIC_KEY_ID`, `BOX_PRIVATE_KEY`, `BOX_PASSPHRASE`,
  `JWT_SECRET`, `API_BASE_URL`, `NEWSPAPER_DOMAIN`.
- **newspaper** (Box news): `BOX_CLIENT_ID`, `BOX_CLIENT_SECRET`,
  `BOX_PUBLIC_KEY_ID`, `BOX_PRIVATE_KEY`, `BOX_PASSPHRASE`, `BOX_ENTERPRISE_ID`,
  `BOX_FOLDER_ID`.
- **campaign** (Circle/Rails API): `RAILS_API_URL` /
  `NEXT_PUBLIC_RAILS_API_URL`.

## Known limitation

`campaign`'s `/api/events` route writes to a JSON file on disk
(`app/campaign/_data/events.json`). Reads work everywhere, but **writes will not
persist on Vercel's read-only serverless filesystem** — move that to a database
or KV store before relying on event creation in production.
