import fs from 'fs'
import path from 'path'
import pg from 'pg'
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
const sqlPath = path.join(
  root,
  'supabase/migrations/20260715000000_centuries_mutual_foundation.sql'
)
const sql = fs.readFileSync(sqlPath, 'utf8')
const rawConnectionString =
  env.SUPABASE_POSTGRES_URL_NON_POOLING || env.SUPABASE_POSTGRES_URL

if (!rawConnectionString) {
  console.error('Missing SUPABASE_POSTGRES_URL_NON_POOLING / SUPABASE_POSTGRES_URL')
  process.exit(1)
}

// Strip sslmode so our explicit ssl config wins (Vercel URLs use require/verify).
const connectionString = rawConnectionString
  .replace(/([?&])sslmode=[^&]*/gi, '$1')
  .replace(/[?&]$/, '')
  .replace(/\?&/, '?')

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  console.log('CONNECTED')
  await client.query(sql)
  console.log('MIGRATION_OK')

  const checks = await client.query(`
    select
      (select count(*)::int from information_schema.tables
        where table_schema='public' and table_name='profiles') as profiles,
      (select count(*)::int from information_schema.tables
        where table_schema='public' and table_name='insurance_applications') as apps,
      (select count(*)::int from information_schema.tables
        where table_schema='public' and table_name='application_documents') as docs,
      (select count(*)::int from pg_policies
        where schemaname='public'
          and tablename in ('profiles','insurance_applications','application_documents')) as rls_policies,
      (select count(*)::int from storage.buckets where id='applications') as bucket,
      (select count(*)::int from pg_trigger
        where tgname='on_auth_user_created') as signup_trigger
  `)
  console.log('VERIFY', JSON.stringify(checks.rows[0]))
} catch (e) {
  console.error('MIGRATION_FAIL', e.message)
  process.exitCode = 1
} finally {
  await client.end().catch(() => {})
}
