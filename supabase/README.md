# Supabase for Centuries Mutual

## Apply the database

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run:
   - `supabase/migrations/20260715000000_centuries_mutual_foundation.sql`
3. Auth settings → enable **Email** provider.
4. Enable **Confirm email** for production.
5. Auth → URL configuration:
   - Site URL: `https://centuriesmutual.com` (or your Vercel URL)
   - Redirect URLs:
     - `https://centuriesmutual.com/auth/callback`
     - `https://centuriesmutual.com/auth/update-password`
     - `http://localhost:3030/auth/callback`
     - `http://localhost:3030/auth/update-password`

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
