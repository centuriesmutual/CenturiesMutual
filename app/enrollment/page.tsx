import { redirect } from 'next/navigation'

/** Legacy path — keep so old bookmarks still land on the renamed Enroll flow. */
export default function EnrollmentRedirect() {
  redirect('/enroll')
}
