import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'
import { TaxFilingFlow } from '@/components/immersive/tax-filing-flow'

export const metadata: Metadata = {
  title: 'Taxes',
  description:
    'Centuries Mutual tax information and a guided member tax filing flow.',
}

export default function TaxesPage() {
  return (
    <ImmersivePage
      eyebrow="— Member Hub"
      title="Taxes"
      lead="Tax information for Centuries Mutual members — year-end documents, estimated figures, and a guided filing flow that keeps your return beside the same membership identity that holds your coverage and rewards."
      ctaLabel="Client Portal"
      ctaHref="/login"
      sections={[
        {
          eyebrow: '01 Information',
          title: 'What members can find here',
          body: 'Use this surface for educational tax context tied to membership activity — rewards statements, payment histories, and document exports that support accurate filing. This is not personalized tax advice.',
          points: [
            'Year-end document pointers from your membership',
            'Payment and rewards histories that inform returns',
            'Plain-language notes on common filing statuses',
            'Links to Documents for retained statements',
          ],
        },
        {
          eyebrow: '02 Stewardship',
          title: 'File with a clear record',
          body: 'The guided flow below walks household details, income, deductions, and review before a demo confirmation ID is issued. Use it to organize a return; consult a licensed tax professional for advice.',
          points: [
            'Step-by-step household and income capture',
            'Standard or itemized deduction path',
            'Review before you submit the demo filing',
            'Confirmation ID stored for your member session',
          ],
          tone: 'cream',
        },
      ]}
    >
      <TaxFilingFlow />
    </ImmersivePage>
  )
}
