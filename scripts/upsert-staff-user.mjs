/**
 * One-shot staff user upsert for admin / office / campaign / editor.
 * Usage (PowerShell):
 *   $env:STAFF_EMAIL="..."; $env:STAFF_PASSWORD="..."; node scripts/upsert-staff-user.mjs
 *
 * Does not print the password. Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
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
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY

const email = (process.env.STAFF_EMAIL || '').trim().toLowerCase()
const password = process.env.STAFF_PASSWORD || ''

if (!url || !serviceKey) {
  console.error('Missing Supabase URL or service role key.')
  process.exit(1)
}
if (!email || !password) {
  console.error('Set STAFF_EMAIL and STAFF_PASSWORD env vars.')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data: listed, error: listError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 200,
})
if (listError) {
  console.error('LIST_FAIL', listError.message)
  process.exit(1)
}

const existing = listed.users.find((u) => u.email?.toLowerCase() === email)

const staffMeta = {
  role: 'admin',
  portals: ['admin', 'office', 'campaign', 'editor'],
}

if (existing) {
  const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
    app_metadata: {
      ...(existing.app_metadata || {}),
      ...staffMeta,
    },
  })
  if (error) {
    console.error('UPDATE_FAIL', error.message)
    process.exit(1)
  }
  console.log('UPDATED', data.user?.id, email, 'role=', data.user?.app_metadata?.role)
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: staffMeta,
  })
  if (error) {
    console.error('CREATE_FAIL', error.message)
    process.exit(1)
  }
  console.log('CREATED', data.user?.id, email, 'role=', data.user?.app_metadata?.role)
}
