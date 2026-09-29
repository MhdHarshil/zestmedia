import { AlertTriangle } from 'lucide-react'

export function LoadNotice({ error }: { error: string | null }) {
  if (!error) return null
  return (
    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
      <div>
        <p className="font-semibold text-foreground">We couldn&apos;t load the latest catalogue.</p>
        <p className="text-muted-foreground">{error} You can still message us on WhatsApp for a quote.</p>
      </div>
    </div>
  )
}
