'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AlertTriangle, Loader2, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isApiConfigured, login } from '@/lib/api'
import { useAdminSession } from './admin-session'

export function LoginForm() {
  const { signIn } = useAdminSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-teal-deep p-12 text-cream lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/25 blur-3xl" />
        <Link href="/" className="relative text-lg font-extrabold">
          Zest Media
        </Link>
        <div className="relative flex max-w-md flex-col gap-3">
          <h1 className="text-balance text-4xl font-extrabold tracking-tight">Studio dashboard</h1>
          <p className="leading-relaxed text-cream/75">
            Manage products, categories, product options and portfolio work shown on the storefront.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <form
          className="animate-rise flex w-full max-w-sm flex-col gap-5"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setPending(true)
            try {
              signIn(await login(email.trim(), password))
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Sign in failed')
            } finally {
              setPending(false)
            }
          }}
        >
          <div className="flex flex-col gap-2">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Admin sign in</h2>
            <p className="text-sm text-muted-foreground">Use your studio admin account.</p>
          </div>

          {!isApiConfigured ? (
            <p className="flex gap-2 rounded-xl border border-primary/30 bg-accent p-3 text-sm text-accent-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Set NEXT_PUBLIC_API_URL to connect the dashboard to your API.
            </p>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="h-11 rounded-full" disabled={pending || !isApiConfigured}>
            {pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
          <Link href="/" className="text-center text-sm text-muted-foreground hover:text-foreground">
            Back to storefront
          </Link>
        </form>
      </section>
    </main>
  )
}
