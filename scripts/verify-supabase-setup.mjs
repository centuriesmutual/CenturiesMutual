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

const env = loadEnv(path.join(root, '.env.local'))
const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY

if (!url || !serviceKey || !anonKey) {
  console.error('Missing Supabase URL or keys')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data: profiles, error: pErr } = await admin
  .from('profiles')
  .select('id')
  .limit(1)
console.log('PROFILES_SELECT', pErr ? `ERR:${pErr.message}` : `OK count=${profiles?.length ?? 0}`)

const { data: apps, error: aErr } = await admin
  .from('insurance_applications')
  .select('id')
  .limit(1)
console.log('APPS_SELECT', aErr ? `ERR:${aErr.message}` : `OK count=${apps?.length ?? 0}`)

const { data: buckets, error: bErr } = await admin.storage.listBuckets()
const appBucket = buckets?.find((b) => b.id === 'applications')
console.log(
  'STORAGE_BUCKET',
  bErr
    ? `ERR:${bErr.message}`
    : appBucket
      ? `OK public=${appBucket.public}`
      : 'MISSING'
)

// Probe email signup path (then delete the user)
const probeEmail = `setup-probe-${Date.now()}@centuriesmutual.com`
const { data: signUpData, error: signUpErr } = await admin.auth.admin.createUser({
  email: probeEmail,
  password: 'ProbeSetup!23456',
  email_confirm: true,
  user_metadata: { first_name: 'Setup', last_name: 'Probe' },
})

if (signUpErr) {
  console.log('AUTH_CREATE_USER', `ERR:${signUpErr.message}`)
} else {
  const userId = signUpData.user.id
  console.log('AUTH_CREATE_USER', `OK id=${userId}`)

  // Wait briefly for profile trigger
  await new Promise((r) => setTimeout(r, 800))
  const { data: profile, error: profileErr } = await admin
    .from('profiles')
    .select('id,email,first_name,last_name')
    .eq('id', userId)
    .maybeSingle()
  console.log(
    'PROFILE_TRIGGER',
    profileErr
      ? `ERR:${profileErr.message}`
      : profile
        ? `OK email=${profile.email} first=${profile.first_name}`
        : 'MISSING_PROFILE'
  )

  const { error: delErr } = await admin.auth.admin.deleteUser(userId)
  console.log('AUTH_DELETE_USER', delErr ? `ERR:${delErr.message}` : 'OK')
}

console.log('PROJECT_URL', url)
