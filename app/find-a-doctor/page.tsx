import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Find a Provider',
  description:
    'Find in-network providers, specialists, dentists, and facilities for your Centuries Mutual plan.',
}

export default function FindADoctorPage() {
  return (
    <ImmersivePage
      eyebrow="— Care access"
      title="Find a Provider"
      lead="Locate in-network physicians, specialists, dentists, hospitals, and clinics for your Centuries Mutual plan. Confirm participation before you book — networks and directories are defined by your plan documents and carrier, not by marketing pages."
      ctaLabel="Sign up to get started"
      ctaHref="/signup?plan=find-a-provider"
      secondaryLabel="Carrier Portal"
      secondaryHref="/carrier-portal"
      sections={[
        {
          eyebrow: '01 Search',
          title: 'Providers and facilities by plan and place',
          body: 'Search by name, specialty, ZIP code, or facility type. Results respect the network tied to your active Centuries Mutual coverage — Individual & Family, Group, Medicare Advantage, Supplement pathways, or Dental — so you see providers that match how you are covered.',
          points: [
            'Name, specialty, and location search',
            'Results filtered to your plan’s network when logged in',
            'Hospitals, clinics, and dental providers included',
            'Always verify participation before a visit',
          ],
        },
        {
          eyebrow: '02 Why it matters',
          title: 'In-network care protects your wallet',
          body: 'Seeing an out-of-network provider can mean higher cost sharing or no coverage for non-emergency care, depending on your plan. Find a Provider exists so “in network” is a check you run before the appointment — not a surprise on the EOB.',
          points: [
            'In-network vs. out-of-network cost patterns',
            'Emergency exceptions summarized in plan documents',
            'Referral rules for HMO-style designs',
            'Dental network checks for oral health visits',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Specialists',
          title: 'From primary care to specialty',
          body: 'Start with primary care when your plan expects it, then locate cardiology, orthopedics, behavioral health, OB/GYN, and other specialties. Prior authorization needs are called out in plan materials — Find a Provider helps you find people; documents define process.',
          points: [
            'Primary care and specialty directories',
            'Behavioral health and women’s health categories',
            'Prior auth is plan-ruled — confirm in documents',
            'Help Desk for navigation questions, not clinical advice',
          ],
        },
        {
          eyebrow: '04 Medicare paths',
          title: 'Advantage networks and Supplement flexibility',
          body: 'Medicare Advantage members typically need plan-network providers. Medicare Supplement members generally follow Original Medicare acceptance — still confirm the physician accepts Medicare and any supplement billing practices.',
          points: [
            'Advantage: use plan network directories',
            'Supplement: Medicare-accepting providers',
            'Dual checks when you have multiple coverages',
            'Carrier Portal for carrier network tools',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Dental',
          title: 'Find a dentist the same way',
          body: 'Dental networks are separate from medical networks. Search dental providers tied to your dental plan, confirm participation for major work, and ask for pre-treatment estimates when the plan recommends them.',
          points: [
            'Dental-specific network search',
            'Confirm before crowns, ortho, or surgery',
            'Pre-treatment estimates when available',
            'EOBs land in Documents after claims',
          ],
        },
        {
          eyebrow: '06 Member access',
          title: 'Sign up or log in for personalized results',
          body: 'Anonymous browse may show general directories. Signed-in members see results aligned to active coverage. Create an account, complete enrollment, then return here with plan-aware search.',
          points: [
            'Personalized results after membership and coverage',
            'Create Account starts the membership path',
            'Login for returning members',
            'Coverage must be effective for full plan filtering',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Accuracy',
          title: 'Directories can change — verify',
          body: 'Provider directories update continuously and can lag. Call the office to confirm they still participate in your specific plan product. Centuries Mutual and carriers are not liable for directory errors beyond what law and plan documents require.',
          points: [
            'Call to confirm participation',
            'Directories may lag real-world changes',
            'Plan documents and carrier data govern',
            'Report outdated listings via Help Desk',
          ],
        },
        {
          eyebrow: '08 Related tools',
          title: 'Carrier Portal and plan pages',
          body: 'Some carriers issue their own find-care tools, ID card apps, and claims portals. Use Carrier Portal when your carrier provides access. Plan pages explain benefits; Find a Provider explains where to receive them.',
          points: [
            'Carrier Portal for carrier-issued tools',
            'Plan pages for benefit design',
            'Documents for EOBs and ID cards',
            'Help Desk when tools disagree',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
