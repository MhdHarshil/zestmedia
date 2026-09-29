'use client'

import Image from 'next/image'
import { useId, useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import type { UploadSection } from '@/lib/types'
import { useAdminSession } from './admin-session'

const MAX_BYTES = 8 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function ImageUpload({
  section,
  values,
  onChange,
  multiple = false,
  label = 'Image',
}: {
  section: UploadSection
  values: string[]
  onChange: (urls: string[]) => void
  multiple?: boolean
  label?: string
}) {
  const { api, run } = useAdminSession()
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const [uploading, setUploading] = useState(0)

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || !api) return
    const list = Array.from(files).slice(0, multiple ? 8 : 1)
    const valid = list.filter((f) => {
      if (!ACCEPTED.includes(f.type)) return toast.error(`${f.name}: unsupported file type`), false
      if (f.size > MAX_BYTES) return toast.error(`${f.name}: file is larger than 8 MB`), false
      return true
    })
    if (!valid.length) return
    setUploading(valid.length)
    const uploaded: string[] = []
    for (const file of valid) {
      const url = await run(() => api.uploadImage(file, section))
      if (url) uploaded.push(url)
      setUploading((n) => n - 1)
    }
    if (uploaded.length) {
      toast.success(uploaded.length > 1 ? `${uploaded.length} images uploaded` : 'Image uploaded')
      onChange(multiple ? [...values, ...uploaded] : uploaded.slice(0, 1))
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {values.map((src, i) => (
          <div key={src + i} className="relative size-20 overflow-hidden rounded-lg border border-border bg-muted">
            <Image src={src} alt="" fill sizes="80px" className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              aria-label={`Remove image ${i + 1}`}
              className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-foreground/80 text-background"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        {multiple || !values.length ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading > 0}
            className="grid size-20 place-items-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
          >
            {uploading > 0 ? (
              <span className="flex flex-col items-center gap-1 text-[11px]" role="status">
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                Uploading
              </span>
            ) : (
              <span className="flex flex-col items-center gap-1 text-[11px]">
                <ImagePlus className="size-5" aria-hidden="true" />
                Upload
              </span>
            )}
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF up to 8 MB.</p>
    </div>
  )
}
