import { redirect } from 'next/navigation'

/** Legacy path — Compound Earnings now lives at /compoundearnings. */
export default function RentalEquityRedirect() {
  redirect('/compoundearnings')
}
