'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { whatsappUrl, site } from '@/lib/site'
import { ctaClasses } from '@/components/cta-button'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import type { Product } from '@/lib/products'

export function QuoteForm({ product }: { product: Product }) {
  const initial = Object.fromEntries(product.options.map((o) => [o.id, o.choices[0]]))
  const [selected, setSelected] = useState<Record<string, string>>(initial)
  const [notes, setNotes] = useState('')
  const buildMessage = () => {
    const lines = [
      `Hi ${site.name}! I'd like a quote for ${product.name}.`,
      '',
      ...product.options.map((o) => `• ${o.label}: ${selected[o.id]}`),
    ]
    if (notes.trim()) {
      lines.push('', `Notes: ${notes.trim()}`)
    }
    return lines.join('\n')
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-serif text-2xl font-semibold tracking-tight">Build your quote</h2>
      {product.startingPrice != null && <p className="mt-2 text-lg font-semibold text-brand">Starting at ₹{product.startingPrice.toLocaleString('en-IN')}</p>}
      <p className="mt-1 text-sm text-muted-foreground">
        Choose your options and add any project notes. We&apos;ll confirm pricing on WhatsApp.
      </p>

      <div className="mt-6 space-y-6">
        {product.options.map((option) => (
          <fieldset key={option.id}>
            <legend className="text-sm font-semibold">{option.label}</legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {option.choices.map((choice) => {
                const isActive = selected[option.id] === choice
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setSelected((prev) => ({ ...prev, [option.id]: choice }))}
                    className={cn(
                      'rounded-full border px-3.5 py-2 text-sm transition-colors',
                      isActive
                        ? 'border-brand bg-brand/10 font-medium text-brand'
                        : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                    )}
                    aria-pressed={isActive}
                  >
                    {choice}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}

        <div>
          <label htmlFor="quote-notes" className="text-sm font-semibold">
            Project notes <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="quote-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Deadline, colors, quantity details, or anything else we should know."
            className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

      </div>

      <a
        href={whatsappUrl(buildMessage())}
        target={site.whatsappNumber ? '_blank' : undefined}
        rel={site.whatsappNumber ? 'noopener noreferrer' : undefined}
        aria-disabled={!site.whatsappNumber}
        className={ctaClasses('brand', 'lg', 'mt-8 w-full')}
      >
        <WhatsAppIcon className="size-[1.15em]" />
        {site.whatsappNumber ? 'Send my request on WhatsApp' : 'Set up WhatsApp contact to send request'}
      </a>
      <p className="mt-3 text-center text-xs text-muted-foreground">No online payment. We&apos;ll confirm price and timing first.</p>
    </div>
  )
}
