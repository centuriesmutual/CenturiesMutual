# Supabase for Centuries Mutual

Project: `fvgollhjkvkxmibqksgv` (`https://fvgollhjkvkxmibqksgv.supabase.co`)

## Already applied

- Foundation migration (`profiles`, `insurance_applications`, `application_documents`, RLS, signup trigger)
- Private storage bucket `applications`
- Email auth enabled with confirm-email (`mailer_autoconfirm=false`)
- Vercel env vars for URL / anon / service role (+ `NEXT_PUBLIC_APP_URL`)

## Auth URL configuration

Configured for production Site URL `https://www.centuriesmutual.com` with redirect allowlist covering production, apex domain, Vercel preview host, and `localhost:3030`.

Email provider is enabled with confirm-email required before sign-in.

## Vercel environment variables

Set for Production, Preview, and Development:

| Name | Notes |
|------|--------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SUPABASE_URL` | Same as `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as `SUPABASE_ANON_KEY` |
| `NEXT_PUBLIC_APP_URL` | Canonical site origin |

## Member flow

Create Account → verify email → Login → Wallet → Account → Insurance application

## Future portals

`admin.centuriesmutual.com` / `office.centuriesmutual.com` should use
`createServiceClient()` (service role) on the server to manage applications
without weakening member RLS.
