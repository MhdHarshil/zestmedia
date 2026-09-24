'use client'

import { useState } from 'react'
import { whatsappUrl, site } from '@/lib/site'
import { ctaClasses } from '@/components/cta-button'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { products } from '@/lib/products'

const projectTypes = [...products.map((p) => p.name), 'Something else']

export function ContactForm() {
  const [name, setName] = useState('')
  const [type, setType] = useState(projectTypes[0])
  const [message, setMessage] = useState('')

  const buildMessage = () => {
    const lines = [
      `Hi ${site.name}!`,
      name.trim() ? `My name is ${name.trim()}.` : '',
      `I'm interested in: ${type}.`,
      message.trim() ? `\n${message.trim()}` : '',
    ].filter(Boolean)
    return lines.join(' ')
  }

  const fieldClass =
    'mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand focus:ring-2 focus:ring-brand/20'

  return (
    <form
      className="rounded-3xl border border-border bg-card p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault()
        window.open(whatsappUrl(buildMessage()), '_blank', 'noopener,noreferrer')
      }}
    >
      <h2 className="font-serif text-2xl font-semibold tracking-tight">Send us a message</h2>
      <p className="mt-1 text-sm text-muted-foreground">Fill this in and we&apos;ll continue the conversation on WhatsApp.</p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="text-sm font-semibold">Your name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Rivera" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="type" className="text-sm font-semibold">What can we print?</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} className={fieldClass}>
            {projectTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="message" className="text-sm font-semibold">Tell us about it</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Quantities, sizes, deadline, or a link to your design."
            className={`${fieldClass} resize-none`}
          />
        </div>
      </div>

      <button type="submit" className={ctaClasses('brand', 'lg', 'mt-6 w-full')}>
        <WhatsAppIcon className="size-[1.15em]" />
        Continue on WhatsApp
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Prefer email? Write to{' '}
        <a href={`mailto:${site.email}`} className="text-brand underline-offset-4 hover:underline">{site.email}</a>
      </p>
    </form>
  )
}
