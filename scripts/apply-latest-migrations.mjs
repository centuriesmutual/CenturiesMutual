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

// Apply in order; all statements are idempotent (IF [NOT] EXISTS / DROP NOT NULL).
const migrations = [
  '20260716000000_admin_and_careers.sql',
  '20260717000000_public_aca_enrollment.sql',
  '20260718000000_career_listings.sql',
]

const rawConnectionString =
  env.SUPABASE_POSTGRES_URL_NON_POOLING || env.SUPABASE_POSTGRES_URL

if (!rawConnectionString) {
  console.error('Missing SUPABASE_POSTGRES_URL_NON_POOLING / SUPABASE_POSTGRES_URL')
  process.exit(1)
}

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
  for (const file of migrations) {
    const sql = fs.readFileSync(path.join(root, 'supabase/migrations', file), 'utf8')
    await client.query(sql)
    console.log('APPLIED', file)
  }

  const checks = await client.query(`
    select
      (select count(*)::int from information_schema.tables
        where table_schema='public' and table_name='career_applications') as career_applications,
      (select count(*)::int from information_schema.columns
        where table_schema='public' and table_name='insurance_applications' and column_name='plan_type') as plan_type_col,
      (select count(*)::int from information_schema.columns
        where table_schema='public' and table_name='insurance_applications' and column_name='source') as source_col,
      (select is_nullable from information_schema.columns
        where table_schema='public' and table_name='insurance_applications' and column_name='user_id') as user_id_nullable
  `)
  console.log('VERIFY', JSON.stringify(checks.rows[0]))
} catch (e) {
  console.error('MIGRATION_FAIL', e.message)
  process.exitCode = 1
} finally {
  await client.end().catch(() => {})
}
