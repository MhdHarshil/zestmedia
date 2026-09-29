'use client'

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { toast } from 'sonner'
import { ApiError, createAdminApi, type AdminApi } from '@/lib/api'

// The bearer token lives in sessionStorage so it is cleared when the tab closes.
const KEY = 'zest-admin-token'
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const read = () => (typeof window === 'undefined' ? null : window.sessionStorage.getItem(KEY))
const write = (token: string | null) => {
  if (token) window.sessionStorage.setItem(KEY, token)
  else window.sessionStorage.removeItem(KEY)
  listeners.forEach((l) => l())
}

interface Session {
  token: string | null
  ready: boolean
  api: AdminApi | null
  signIn: (token: string) => void
  signOut: () => void
  run: <T>(action: () => Promise<T>, success?: string) => Promise<T | undefined>
}

const SessionContext = createContext<Session | null>(null)

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const token = useSyncExternalStore(subscribe, read, () => null)
  const ready = useSyncExternalStore(subscribe, () => true, () => false)
  const api = useMemo(() => (token ? createAdminApi(token) : null), [token])

  const signOut = useCallback(() => write(null), [])

  const run = useCallback(
    async <T,>(action: () => Promise<T>, success?: string) => {
      try {
        const result = await action()
        if (success) toast.success(success)
        return result
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          toast.error('Your session has expired. Please sign in again.')
          write(null)
        } else {
          toast.error(err instanceof Error ? err.message : 'Something went wrong')
        }
        return undefined
      }
    },
    [],
  )

  const value = useMemo<Session>(
    () => ({ token, ready, api, signIn: (t) => write(t), signOut, run }),
    [token, ready, api, signOut, run],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useAdminSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useAdminSession must be used inside AdminSessionProvider')
  return ctx
}
