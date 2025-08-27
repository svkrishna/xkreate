import { redirect } from 'next/navigation'

export default function Home() {
  // Always redirect to login for now - let the login page handle auth check
  redirect('/login')
}
