import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './admin/admin.css'
import BootstrapClient from './components/BootstrapClient'

export const metadata = {
  title: 'Office · Centuries Mutual',
  description: 'Centuries Mutual agent workspace',
}

export default function OfficeLayout({ children }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <BootstrapClient />
      {children}
    </>
  )
}
