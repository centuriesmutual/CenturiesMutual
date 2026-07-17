import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/access'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Reports whether the current session is signed in and admin-authorized. */
export async function GET() {
  const session = await getAdminSession()
  return NextResponse.json({ ok: true, ...session })
}
