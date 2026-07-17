import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marketing Dashboard',
  description: 'Manage and track your marketing campaigns',
}

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
