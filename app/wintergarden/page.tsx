import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Wintergarden',
  description:
    'Wintergarden is Centuries Mutual’s gamified music performance and learning software — rehearsal, scoring, technique, and repertoire inside your membership.',
}

export default function WintergardenPage() {
  return (
    <ImmersivePage
      eyebrow="— Wintergarden"
      title="Music Performance Software"
      lead="Wintergarden is Centuries Mutual’s gamified studio for music performance and learning. Rehearse with live scoring, build technique through progressive challenges, and keep every session tied to your member profile — so practice feels like play without losing concert-hall discipline."
      ctaLabel="Member login"
      ctaHref="/login"
      secondaryLabel="Back home"
      secondaryHref="/"
      sections={[
        {
          eyebrow: '01 Studio',
          title: 'A performance room inside your membership',
          body: 'Wintergarden is not a playlist app and not a toy keyboard. It is structured performance software: you enter a session, play through guided repertoire, and receive scored feedback on timing, phrasing, dynamics, and stage readiness. Progress compounds on the same identity that holds your coverage and rewards.',
          points: [
            'Session-based rehearsal with live performance scoring',
            'Guided repertoire paths from first pieces to advanced sets',
            'Stage-readiness metrics beside technical accuracy',
            'All progress linked to your Centuries Mutual profile',
          ],
        },
        {
          eyebrow: '02 Game layer',
          title: 'Practice that levels like a game',
          body: 'Gamification here means clear objectives, streaks, unlocks, and difficulty ramps — not distraction. Complete drills to unlock harder pieces. Maintain streaks for consistency bonuses. Earn performance badges that mark real skill milestones, not vanity points.',
          points: [
            'Daily and weekly practice objectives with streak tracking',
            'Unlockable repertoire as accuracy and stamina improve',
            'Challenge modes for timing, dynamics, and endurance',
            'Badges and level marks that reflect measurable skill',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Technique',
          title: 'Drills that train the hands and the ear',
          body: 'Wintergarden isolates the building blocks of performance: metronome-locked timing, dynamic contrast, phrasing shapes, and hand independence. Short technique circuits sit between full pieces so weak spots get deliberate work instead of being buried in repertoire.',
          points: [
            'Timing labs with adjustable tempo and tolerance windows',
            'Dynamics and phrasing drills with visual and audio cues',
            'Independence exercises for multi-voice and multi-hand work',
            'Weak-spot recommendations after each scored session',
          ],
        },
        {
          eyebrow: '04 Repertoire',
          title: 'Build a book you can actually perform',
          body: 'Pieces are organized into performance books — starter, intermediate, and concert tracks. Each piece has rehearsal modes (section loop, slow-motion, hands separate) and a full-run mode that scores the complete performance. Your book becomes a living catalog of what you can play under pressure.',
          points: [
            'Curated books by level and performance goal',
            'Section looping and slow practice without leaving the piece',
            'Full-run scoring for concert-ready evaluation',
            'Personal repertoire history you can return to anytime',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Feedback',
          title: 'Scores that teach, not just grade',
          body: 'After every session, Wintergarden breaks down where you gained or lost points: early attacks, rushed phrases, uneven dynamics, or dropped continuity. Feedback is actionable — tap a flagged measure and jump straight back into a focused drill.',
          points: [
            'Measure-level and phrase-level score breakdowns',
            'Instant jump-back into flagged sections',
            'Trend charts across weeks of practice',
            'Coach notes that explain what to fix next',
          ],
        },
        {
          eyebrow: '06 Membership',
          title: 'Tied to Centuries Mutual stewardship',
          body: 'Wintergarden is a supplemental member initiative. Eligible activity can surface beside your rewards ledger where program rules allow. It is enrichment and skill development — not clinical care, and not a substitute for professional music instruction when you need a human teacher.',
          points: [
            'Single sign-on with your Centuries Mutual membership',
            'Eligible practice may connect to rewards where offered',
            'Clear separation from insurance and clinical benefits',
            'Help Desk support for access and sync questions',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Devices',
          title: 'Practice where you already sit',
          body: 'Sessions are designed for desktop and tablet first, with responsive controls for phone check-ins on scores and streaks. MIDI-friendly workflows and on-screen input both work so you can rehearse with a keyboard controller or practice theory and rhythm away from the instrument.',
          points: [
            'Desktop and tablet performance sessions',
            'Mobile views for scores, streaks, and book browsing',
            'MIDI-friendly input where supported',
            'On-screen practice modes when you are away from a keyboard',
          ],
        },
        {
          eyebrow: '08 Roadmap',
          title: 'Built to deepen with the member',
          body: 'Wintergarden grows with repertoire packs, ensemble challenge modes, and teacher-share links so instructors can review a student’s scored runs. The product stays focused on performance and learning — not social noise.',
          points: [
            'Expanding repertoire and style packs over time',
            'Ensemble and duet challenge modes on the roadmap',
            'Shareable scored runs for instructors and mentors',
            'Privacy controls on what leaves your member profile',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
