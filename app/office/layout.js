import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './admin/admin.css'
import BootstrapClient from './components/BootstrapClient'

export const metadata = {
  title: 'Office Dashboard',
  description: 'Modern office management system',
  keywords: 'office dashboard, workspace management, professional tools',
  openGraph: {
    title: 'Office Dashboard',
    description: 'Professional office dashboard for managing your workspace.',
    type: 'website',
  },
}

export default function OfficeLayout({ children }) {
  return (
    <>
      <BootstrapClient />
      {children}
    </>
  )
}
