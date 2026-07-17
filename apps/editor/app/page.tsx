import { redirect } from 'next/navigation';

export default function Home() {
  // Always redirect to login - let login page handle auth check
  redirect('/login');
}

