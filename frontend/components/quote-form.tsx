'use client'

import { useRef, useState } from 'react'
import { Upload, X, FileImage } from 'lucide-react'
import { cn } from '@/lib/utils'
import { whatsappUrl, site } from '@/lib/site'
import { ctaClasses } from '@/components/cta-button'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import type { Product } from '@/lib/products'

export function QuoteForm({ product }: { product: Product }) {
  const initial = Object.fromEntries(product.options.map((o) => [o.id, o.choices[0]]))
  const [selected, setSelected] = useState<Record<string, string>>(initial)
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (list: FileList | null) => {
    if (!list) return
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, 5))
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const buildMessage = () => {
    const lines = [
      `Hi ${site.name}! I'd like a quote for ${product.name}.`,
      '',
      ...product.options.map((o) => `• ${o.label}: ${selected[o.id]}`),
    ]
    if (notes.trim()) {
      lines.push('', `Notes: ${notes.trim()}`)
    }
    if (files.length > 0) {
      lines.push('', `I have ${files.length} design file${files.length > 1 ? 's' : ''} to share (${files.map((f) => f.name).join(', ')}).`)
    }
    return lines.join('\n')
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-serif text-2xl font-semibold tracking-tight">Build your quote</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose your options and select your artwork. We&apos;ll confirm pricing on WhatsApp.
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

        <div>
          <span className="text-sm font-semibold">Artwork file names <span className="font-normal text-muted-foreground">(optional)</span></span>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              addFiles(e.dataTransfer.files)
            }}
            className={cn(
              'mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors',
              dragging ? 'border-brand bg-brand/5' : 'border-border hover:border-foreground/30',
            )}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                inputRef.current?.click()
              }
            }}
          >
            <Upload className="size-5 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Select files to include their names</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, PNG, JPG, AI — up to 5 files</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.ai,.svg,.eps,image/*,application/pdf"
              className="sr-only"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((file, i) => (
                <li key={`${file.name}-${i}`} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <FileImage className="size-4 shrink-0 text-brand" />
                    <span className="truncate">{file.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Files are not uploaded. When WhatsApp opens, attach them in the chat so we can review your artwork.
          </p>
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
