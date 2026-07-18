import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

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
const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY
const s = createClient(url, key, { auth: { persistSession: false } })

const { data, error } = await s
  .from('insurance_applications')
  .select(
    'id,first_name,last_name,email,source,plan_type,application_status,created_at',
  )
  .order('created_at', { ascending: false })
  .limit(30)

if (error) {
  console.error('ERR', error.message)
  process.exit(1)
}

console.log('RECENT', data.length)
for (const r of data) {
  console.log(
    JSON.stringify({
      name: `${r.first_name} ${r.last_name}`,
      email: r.email,
      source: r.source,
      plan_type: r.plan_type,
      status: r.application_status,
      created: r.created_at,
    }),
  )
}

const tables = [
  'insurance_applications',
  'career_applications',
  'aca_enrollment_rate_limits',
]
for (const t of tables) {
  const { count, error } = await s.from(t).select('*', { count: 'exact', head: true })
  console.log('TABLE', t, error ? error.message : count)
}
console.log('SUPABASE_HOST', new URL(url).host)
