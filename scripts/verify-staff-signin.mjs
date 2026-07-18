/**
 * Verify staff email/password sign-in against Supabase (does not print password).
 * Usage: $env:STAFF_PASSWORD="..."; node scripts/verify-staff-signin.mjs
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function loadEnv(filePath) {
  const env = {}
  if (!fs.existsSync(filePath)) return env
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue
    const i = line.indexOf('=')
    if (i < 0) continue
    let v = line.slice(i + 1).trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    env[line.slice(0, i)] = v
  }
  return env
}

const fileEnv = loadEnv(path.join(root, '.env.local'))
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  fileEnv.NEXT_PUBLIC_SUPABASE_URL ||
  fileEnv.SUPABASE_URL
const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  fileEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  fileEnv.SUPABASE_ANON_KEY
const email = (process.env.STAFF_EMAIL || 'centuriesmutual@gmail.com').trim().toLowerCase()
const password = process.env.STAFF_PASSWORD || ''
const allow = (fileEnv.ADMIN_EMAILS || process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

if (!url || !anon) {
  console.error('Missing Supabase URL/anon key')
  process.exit(1)
}
if (!password) {
  console.error('Set STAFF_PASSWORD')
  process.exit(1)
}

const client = createClient(url, anon, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await client.auth.signInWithPassword({ email, password })
if (error) {
  console.error('SIGNIN_FAIL', error.message)
  process.exit(1)
}
console.log('SIGNIN_OK', data.user?.id, data.user?.email)
console.log('EMAIL_CONFIRMED', Boolean(data.user?.email_confirmed_at))
console.log('ALLOWLIST_HAS', allow.includes(email))
console.log('ALLOWLIST_COUNT', allow.length)
