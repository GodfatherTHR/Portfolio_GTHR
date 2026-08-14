import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from './login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login | Shariful Haque',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <LoginForm />
    </div>
  )
}
