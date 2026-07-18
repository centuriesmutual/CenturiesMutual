import { NextResponse } from 'next/server'
import { getAcaEnrollmentAvailability } from '@/lib/aca/enrollment-flags'
import { listAvailableAcaStates, listAcaStateFlags } from '@/lib/aca/state-flags'
import { jsonError } from '@/lib/supabase/auth-helpers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET — public ACA enroll configuration for the Enroll page.
 * Frontend must not invent eligibility; it only reflects this payload.
 */
export async function GET() {
  try {
    const [availability, availableStates, allStates] = await Promise.all([
      getAcaEnrollmentAvailability(),
      listAvailableAcaStates(),
      listAcaStateFlags(),
    ])

    return NextResponse.json({
      ok: true,
      openEnrollmentActive: availability.openEnrollmentActive,
      specialEnrollmentEnabled: availability.specialEnrollmentEnabled,
      oep: availability.oep
        ? {
            enabled: availability.oep.enabled,
            startDate: availability.oep.start_date,
            endDate: availability.oep.end_date,
            active: availability.openEnrollmentActive,
          }
        : null,
      sep: availability.sep
        ? {
            enabled: availability.sep.enabled,
            active: availability.specialEnrollmentEnabled,
          }
        : null,
      availableStates: availableStates.map((s) => ({
        code: s.state_code,
        name: s.state_name,
      })),
      // Full list for messaging / disabled options (codes only + availability).
      states: allStates.map((s) => ({
        code: s.state_code,
        name: s.state_name,
        available: s.licensed && s.enabled,
        licensed: s.licensed,
        enabled: s.enabled,
      })),
      anyEnrollmentPathOpen:
        availability.openEnrollmentActive || availability.specialEnrollmentEnabled,
    })
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Could not load ACA flags.', 500)
  }
}
