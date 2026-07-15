import { redirect } from 'next/navigation'

/** Legacy hyphenated path — keep bookmarks working. */
export default function LegacyCreateAccountRedirect() {
  redirect('/createaccount')
}
