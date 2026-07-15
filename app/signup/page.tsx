import { redirect } from 'next/navigation'

/** Legacy route — membership signup is Create Account only. */
export default function SignupPage() {
  redirect('/createaccount')
}
