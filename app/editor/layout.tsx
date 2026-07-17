import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Newspaper Editor CMS',
  description: 'Enterprise-level newspaper editor CMS powered by Box.com',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
