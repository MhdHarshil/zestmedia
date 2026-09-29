'use client'

import { Loader2 } from 'lucide-react'
import { AdminDashboard } from './admin-dashboard'
import { AdminSessionProvider, useAdminSession } from './admin-session'
import { LoginForm } from './login-form'

function Gate() {
  const { token, ready } = useAdminSession()
  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center" role="status">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Loading admin</span>
      </div>
    )
  }
  return token ? <AdminDashboard /> : <LoginForm />
}

export function AdminApp() {
  return (
    <AdminSessionProvider>
      <Gate />
    </AdminSessionProvider>
  )
}
