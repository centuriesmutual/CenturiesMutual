/**
 * Configure hosted Supabase Auth Site URL + redirect allowlist.
 * Requires SUPABASE_ACCESS_TOKEN from https://supabase.com/dashboard/account/tokens
 *
 * Usage (PowerShell):
 *   $env:SUPABASE_ACCESS_TOKEN='sbp_...'; node scripts/configure-supabase-auth.mjs
 */
const PROJECT_REF = 'fvgollhjkvkxmibqksgv'
const SITE_URL = 'https://www.centuriesmutual.com'
const REDIRECT_URLS = [
  'https://www.centuriesmutual.com/auth/callback',
  'https://www.centuriesmutual.com/auth/update-password',
  'https://www.centuriesmutual.com/**',
  'https://centuriesmutual.com/auth/callback',
  'https://centuriesmutual.com/auth/update-password',
  'https://centuriesmutual.com/**',
  'https://home-beta-pied.vercel.app/auth/callback',
  'https://home-beta-pied.vercel.app/auth/update-password',
  'http://localhost:3030/auth/callback',
  'http://localhost:3030/auth/update-password',
  'http://localhost:3030/**',
]

const token = process.env.SUPABASE_ACCESS_TOKEN?.trim()
if (!token) {
  console.error('Set SUPABASE_ACCESS_TOKEN first (Dashboard → Account → Access Tokens).')
  process.exit(1)
}

const res = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
  {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      site_url: SITE_URL,
      uri_allow_list: REDIRECT_URLS.join(','),
      external_email_enabled: true,
      disable_signup: false,
      mailer_autoconfirm: false,
    }),
  }
)

const text = await res.text()
if (!res.ok) {
  console.error('AUTH_CONFIG_FAIL', res.status, text)
  process.exit(1)
}

console.log('AUTH_CONFIG_OK')
try {
  const json = JSON.parse(text)
  console.log(
    JSON.stringify(
      {
        site_url: json.site_url,
        uri_allow_list: json.uri_allow_list,
        external_email_enabled: json.external_email_enabled,
        mailer_autoconfirm: json.mailer_autoconfirm,
      },
      null,
      2
    )
  )
} catch {
  console.log(text.slice(0, 500))
}
