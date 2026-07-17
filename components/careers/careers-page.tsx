import { ImmersivePage } from '@/components/immersive/immersive-page'
import { CareersApplicationForm } from '@/components/careers/careers-application-form'

export function CareersPageView() {
  return (
    <ImmersivePage
      eyebrow="— Careers"
      title="Build the Common Wealth"
      lead="Centuries Mutual is a member-owned brokerage and healthcare rewards network. We are building durable financial and health infrastructure for families and neighborhoods — and we are looking for people who want their work to compound into lasting value. Join a team that treats stewardship, transparency, and community as first principles."
      ctaLabel="View open roles"
      ctaHref="#apply"
      secondaryLabel="Back home"
      secondaryHref="/"
      sections={[
        {
          eyebrow: '01 Mission',
          title: 'Work that compounds',
          body: 'We connect health coverage, everyday savings, and community rewards into one membership. Everything we ship is designed to protect families today and grow what they pass on tomorrow. If you want your work to matter for generations — not quarters — this is the place.',
          points: [
            'Member-owned, mission-first organization',
            'Real outcomes for families and neighborhoods',
            'Long-term thinking over short-term optics',
            'Stewardship and transparency as defaults',
          ],
        },
        {
          eyebrow: '02 Culture',
          title: 'How we operate',
          body: 'Small teams, high ownership, and clear communication. We document decisions, respect members\u2019 trust, and hold ourselves to a high standard of care with sensitive data. We value people who are both rigorous and kind.',
          points: [
            'High autonomy with clear accountability',
            'Bias toward clarity and written thinking',
            'Care with member data and compliance',
            'Feedback that is direct and respectful',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Open roles',
          title: 'Where you might fit',
          body: 'We hire across member services, licensed insurance, enrollment, community outreach, engineering, and compliance. Do not see your exact role? Apply with \u201CGeneral Interest\u201D and tell us how you would contribute.',
          points: [
            'Licensed Insurance Agents & Enrollment Coordinators',
            'Member Services & Community Outreach',
            'Software Engineers building the membership platform',
            'Compliance & Operations professionals',
          ],
        },
        {
          eyebrow: '04 Benefits',
          title: 'How we take care of our team',
          body: 'We extend the same philosophy we offer members to the people who build Centuries Mutual: meaningful health coverage, rewards, and support for long-term financial health.',
          points: [
            'Health, dental & vision coverage',
            'Membership rewards and wellness programs',
            'Support for licensing and professional growth',
            'Flexible, outcome-oriented work',
          ],
          tone: 'cream',
        },
      ]}
    >
      <CareersApplicationForm />
    </ImmersivePage>
  )
}
