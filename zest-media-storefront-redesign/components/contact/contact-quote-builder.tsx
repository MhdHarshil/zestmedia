'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Category } from '@/lib/types'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

export function ContactQuoteBuilder({ categories }: { categories: Category[] }) {
  const [name, setName] = useState('')
  const [business, setBusiness] = useState('')
  const [service, setService] = useState('')
  const [deadline, setDeadline] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState<string | null>(null)

  const services = categories.length ? categories.map((c) => c.name) : ['Something else']

  const buildMessage = () =>
    [
      'Hi Zest Media, I would like a quote.',
      `• Name: ${name.trim()}`,
      business.trim() && `• Business: ${business.trim()}`,
      service && `• Service: ${service}`,
      deadline && `• Needed by: ${deadline}`,
      '',
      details.trim(),
    ]
      .filter((l) => l !== false && l !== undefined)
      .join('\n')

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (!name.trim() || !details.trim()) {
          setError('Please add your name and a few details about the job.')
          return
        }
        setError(null)
        window.open(whatsappUrl(buildMessage()), '_blank', 'noopener,noreferrer')
      }}
      className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm md:p-8"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-foreground">Build your quote request</h2>
        <p className="text-sm text-muted-foreground">
          This opens WhatsApp with your message ready to send — nothing is sent until you tap send.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="c-name">Your name</Label>
          <Input id="c-name" value={name} onChange={(e) => setName(e.target.value.slice(0, 80))} autoComplete="name" className="h-11" aria-invalid={Boolean(error && !name.trim())} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="c-business">Business (optional)</Label>
          <Input id="c-business" value={business} onChange={(e) => setBusiness(e.target.value.slice(0, 80))} autoComplete="organization" className="h-11" />
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={service === s}
              onClick={() => setService(service === s ? '' : s)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
                service === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="c-deadline">Needed by (optional)</Label>
        <Input id="c-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-11 sm:max-w-60" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="c-details">Job details</Label>
        <Textarea
          id="c-details"
          rows={5}
          value={details}
          onChange={(e) => setDetails(e.target.value.slice(0, 1000))}
          placeholder="Quantity, size, paper, finish, whether you have artwork…"
          aria-invalid={Boolean(error && !details.trim())}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-12 rounded-full text-base">
        <MessageCircle data-icon="inline-start" />
        Continue on WhatsApp
      </Button>
    </form>
  )
}
