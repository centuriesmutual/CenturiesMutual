import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'My Brothers Keeper',
  description:
    'My Brothers Keeper is Centuries Mutual’s training and wellness app — workouts, coaching, activity tracking, and member rewards in one place.',
}

export default function MyBrothersKeeperPage() {
  return (
    <ImmersivePage
      eyebrow="— Wellness"
      title="My Brothers Keeper"
      lead="My Brothers Keeper is the training companion built for Centuries Mutual members: personalized workout plans, live activity tracking, coaching cues, recovery tools, and progress that can connect to your healthcare rewards — so movement becomes a daily system, not a guess."
      ctaLabel="Open the app"
      ctaHref="https://mybrotherskeeper.cc"
      secondaryLabel="Member login"
      secondaryHref="/login"
      sections={[
        {
          eyebrow: '01 Training OS',
          title: 'Your daily training system',
          body: 'Open the app and know exactly what to do today. My Brothers Keeper builds adaptive plans around your goals — strength, endurance, mobility, or general fitness — then adjusts load and volume from how you actually perform. Every session has a clear structure: warm-up, primary work, accessories, and cool-down.',
          points: [
            'Personalized plans that adapt to your logged performance',
            'Daily session cards with sets, reps, rest, and intent',
            'Goal tracks for strength, cardio, mobility, and hybrid training',
            'Progression rules that raise demand as you get stronger',
          ],
        },
        {
          eyebrow: '02 Activity',
          title: 'Track every mile and every set',
          body: 'Log gym sessions, outdoor runs, walks, cycles, and recovery days in one feed. GPS and device sync capture distance, pace, and heart-rate bands where available. Manual logging stays first-class so a hotel gym or home floor workout still counts.',
          points: [
            'GPS and wearable-friendly activity capture',
            'Strength logging with history per exercise',
            'Manual entry when sensors are not available',
            'Unified activity feed across indoor and outdoor work',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Coaching',
          title: 'Guidance that stays with you mid-set',
          body: 'In-session cues explain form intent, pacing, and when to push or pull back. Video and animation references sit one tap away. After you finish, the app summarizes what went well and what to emphasize next time — short enough to read before your next meal.',
          points: [
            'Form and pacing cues during live sessions',
            'Exercise demos and movement references',
            'Post-session summaries with next-focus tips',
            'Difficulty modifiers when energy or equipment changes',
          ],
        },
        {
          eyebrow: '04 Motivation',
          title: 'Streaks, challenges, and milestones that matter',
          body: 'Consistency is the product. Streaks reward showing up. Weekly challenges create shared pressure without turning training into noise. Personal records and milestone badges mark real physical progress — first 5K, first bodyweight pull-up, thirty training days in a month.',
          points: [
            'Streak protection and weekly consistency targets',
            'Rotating challenges for distance, volume, and recovery',
            'Personal records across lifts and endurance metrics',
            'Milestones you can revisit in your training history',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Recovery',
          title: 'Rest is programmed, not optional',
          body: 'My Brothers Keeper schedules recovery days, mobility blocks, and sleep-aware soft recommendations so hard weeks do not quietly break you. Readiness indicators help you decide when to push intensity and when to keep the session easy.',
          points: [
            'Planned recovery and mobility sessions',
            'Readiness cues based on recent training load',
            'Stretch and mobility libraries for common tight spots',
            'Easy-day alternatives when you need to stay moving lightly',
          ],
        },
        {
          eyebrow: '06 Community',
          title: 'Train with people who keep you honest',
          body: 'Join member circles, club challenges, and accountability groups. Share completions, cheer streaks, and compete on team scoreboards when you want social fuel. Privacy controls let you keep detailed workouts private while still showing up on a challenge board.',
          points: [
            'Member circles and accountability groups',
            'Club and seasonal challenge scoreboards',
            'Cheer and completion sharing without oversharing',
            'Granular privacy on workout detail vs. challenge status',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Membership bridge',
          title: 'Fitness that feeds Centuries Mutual rewards',
          body: 'Eligible activity syncs into your Centuries Mutual membership so wellness progress can sit beside your rewards wallet where program rules allow. One identity, one ledger path — workouts do not live in a disconnected silo.',
          points: [
            'Automatic sync into your Centuries Mutual profile',
            'Eligible activity may unlock supplemental wallet credits',
            'Streaks and goals visible beside member surfaces',
            'Clear labeling of what counts toward rewards',
          ],
        },
        {
          eyebrow: '08 Nutrition & habits',
          title: 'Fuel and habits next to the work',
          body: 'Optional nutrition targets, hydration reminders, and habit check-ins sit beside training so the day has a full loop: move, fuel, recover, repeat. Nothing pretends to replace a clinician; everything supports the habits that make training stick.',
          points: [
            'Optional calorie and macro targets you control',
            'Hydration and habit check-ins',
            'Simple meal and snack logging',
            'Not a substitute for medical or clinical nutrition advice',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '09 Insights',
          title: 'See the long arc of your training',
          body: 'Dashboards show weekly volume, training frequency, pace trends, strength curves, and recovery balance. Exportable summaries help you review a month or a quarter without scrolling endless session cards.',
          points: [
            'Weekly and monthly training volume charts',
            'Strength and endurance trend lines',
            'Balance views across hard days and recovery',
            'Shareable or exportable summaries for coaches',
          ],
        },
        {
          eyebrow: '10 Access',
          title: 'Built for the phone you already carry',
          body: 'My Brothers Keeper is mobile-first: start a workout from the lock screen of your day, finish it in the gym, and review scores on the ride home. Notifications stay purposeful — session reminders, streak saves, and challenge starts — not spam.',
          points: [
            'iOS and Android member access via mybrotherskeeper.cc',
            'Offline-tolerant logging that syncs when you reconnect',
            'Purposeful reminders you can tune',
            'Help Desk support for sync and membership questions',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
