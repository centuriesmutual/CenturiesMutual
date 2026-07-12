import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Create Account',
  },
  description:
    'Create your Centuries Mutual membership account for coverage, rewards, and care access.',
}

export default function CreateAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
