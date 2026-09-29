'use client'

import { useState } from 'react'
import { Check, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Product } from '@/lib/types'
import { productQuoteMessage, whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

export function ProductQuoteForm({ product, categoryName }: { product: Product; categoryName?: string }) {
  const options = (product.options ?? []).filter((o) => o.choices.length)
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')

  const selections = options
    .filter((o) => selected[String(o.id)])
    .map((o) => ({ name: o.name, value: selected[String(o.id)] }))
  const href = whatsappUrl(productQuoteMessage(product.name, selections, { quantity, notes: notes.trim() }))
  const missing = options.length - selections.length

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise flex flex-col gap-3">
        {categoryName ? (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{categoryName}</p>
        ) : null}
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{product.name}</h1>
        {product.description ? <p className="text-pretty leading-relaxed text-muted-foreground">{product.description}</p> : null}
        {product.turnaround ? (
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">
            <Clock className="size-4" aria-hidden="true" /> Turnaround: {product.turnaround}
          </p>
        ) : null}
      </div>

      {product.features?.length ? (
        <ul className="animate-rise grid gap-2 sm:grid-cols-2" style={{ animationDelay: '100ms' }}>
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> {f}
            </li>
          ))}
        </ul>
      ) : null}

      <form
        className="animate-rise flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"
        style={{ animationDelay: '180ms' }}
        onSubmit={(e) => {
          e.preventDefault()
          window.open(href, '_blank', 'noopener,noreferrer')
        }}
      >
        <h2 className="text-lg font-bold text-foreground">Configure your order</h2>

        {options.map((option) => {
          const value = selected[String(option.id)]
          const labelId = `option-${option.id}`
          return (
            <fieldset key={option.id} className="flex flex-col gap-2.5">
              <legend id={labelId} className="mb-2.5 flex w-full items-center justify-between text-sm font-semibold text-foreground">
                {option.name}
                {value ? <span className="font-normal text-muted-foreground">{value}</span> : null}
              </legend>
              <div role="radiogroup" aria-labelledby={labelId} className="flex flex-wrap gap-2">
                {option.choices.map((choice) => {
                  const checked = value === choice.label
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      onClick={() => setSelected((s) => ({ ...s, [String(option.id)]: choice.label }))}
                      className={cn(
                        'rounded-xl border px-3.5 py-2 text-sm font-medium transition-all',
                        checked
                          ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                          : 'border-border bg-background text-foreground hover:border-primary/60',
                      )}
                    >
                      {choice.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )
        })}

        {!options.some((o) => o.name.toLowerCase() === 'quantity') ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="quote-quantity">Quantity (optional)</Label>
            <Input
              id="quote-quantity"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.replace(/[^\d]/g, '').slice(0, 7))}
              placeholder="e.g. 500"
              className="h-11"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="quote-notes">Notes for our team (optional)</Label>
          <Textarea
            id="quote-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 600))}
            placeholder="Sizes, colours, deadline, artwork status…"
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" className="h-12 w-full rounded-full text-base">
            <MessageCircle data-icon="inline-start" />
            Request quote on WhatsApp
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {missing > 0
              ? `${missing} option${missing > 1 ? 's' : ''} not selected — you can still send and we'll help you decide.`
              : 'Your selections will be included in the message.'}
          </p>
        </div>
      </form>
    </div>
  )
}
