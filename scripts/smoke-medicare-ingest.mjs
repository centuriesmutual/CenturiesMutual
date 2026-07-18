/**
 * Smoke-test medicare.reviews ingest against a running local (or remote) app.
 * Usage:
 *   node scripts/smoke-medicare-ingest.mjs
 *   node scripts/smoke-medicare-ingest.mjs https://www.centuriesmutual.com
 */
import fs from 'fs'
import path from 'path'
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
const base = (process.argv[2] || 'http://localhost:3030').replace(/\/$/, '')
const key = env.MEDICARE_REVIEWS_INGEST_KEY
if (!key) {
  console.error('Missing MEDICARE_REVIEWS_INGEST_KEY in .env.local')
  process.exit(1)
}

const payload = {
  first_name: 'Test',
  last_name: 'MedicareLead',
  email: `medicare.test.${Date.now()}@example.com`,
  phone: '5125550199',
  date_of_birth: '1955-06-15',
  address: '100 Congress Ave',
  city: 'Austin',
  state: 'TX',
  zip: '78701',
  plan_type: 'Medicare Advantage',
  county: 'Travis',
  lead_id: 'smoke-test',
  meta: { campaign: 'smoke' },
}

const res = await fetch(`${base}/api/enrollment/medicare`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-medicare-reviews-key': key,
  },
  body: JSON.stringify(payload),
})
const data = await res.json().catch(() => ({}))
console.log('STATUS', res.status)
console.log(JSON.stringify(data, null, 2))
if (!res.ok || !data?.ok) process.exit(1)
