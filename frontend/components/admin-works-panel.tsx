'use client'

import { useEffect, useState } from 'react'
import { apiRequest, getCategories, uploadAdminImage } from '@/lib/api'
import type { ApiCategory } from '@/lib/api'
import type { ApiWork } from '@/lib/works'

type WorkDraft = {
  title: string
  category: string
  image_url: string
  description: string
  featured: boolean
}

const blankWork: WorkDraft = { title: '', category: '', image_url: '', description: '', featured: false }
const fieldClass = 'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm'
const buttonClass = 'rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground disabled:opacity-50'

export function AdminWorksPanel({ token }: { token: string }) {
  const [works, setWorks] = useState<ApiWork[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [draft, setDraft] = useState<WorkDraft>(blankWork)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  const auth = (method: string, body?: unknown) => ({
    method,
    headers: { Authorization: `Bearer ${token}` },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  async function loadWorks() {
    const [nextWorks, nextCategories] = await Promise.all([
      apiRequest<ApiWork[]>('/api/works/'),
      getCategories(),
    ])
    setWorks(nextWorks)
    setCategories(nextCategories)
  }

  useEffect(() => {
    loadWorks().catch((e) => setError(e instanceof Error ? e.message : 'Could not load works'))
  }, [])

  function editWork(work: ApiWork) {
    setEditingId(work.id)
    setDraft({
      title: work.title,
      category: work.category,
      image_url: work.image_url,
      description: work.description || '',
      featured: work.featured,
    })
  }

  async function saveWork(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const payload = { ...draft, description: draft.description.trim() || null }
      await apiRequest(editingId ? `/api/works/${editingId}` : '/api/works/', {
        ...auth(editingId ? 'PATCH' : 'POST', payload),
      })
      setDraft(blankWork)
      setEditingId(null)
      await loadWorks()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save work')
    } finally {
      setBusy(false)
    }
  }

  async function uploadWorkImage(file: File | undefined) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const image_url = await uploadAdminImage(file, 'works', token)
      setDraft((current) => ({ ...current, image_url }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not upload image')
    } finally {
      setUploading(false)
    }
  }

  async function deleteWork(work: ApiWork) {
    if (!window.confirm(`Delete “${work.title}” from Our Work?`)) return
    setError('')
    try {
      await apiRequest(`/api/works/${work.id}`, auth('DELETE'))
      await loadWorks()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete work')
    }
  }

  return (
    <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="rounded-2xl border border-border bg-card p-5 md:p-7">
        <h2 className="font-serif text-xl font-semibold">{editingId ? 'Edit work' : 'Add to Our Work'}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Add a project title and upload its image, or paste an existing image URL.</p>
        <form onSubmit={saveWork} className="mt-5 space-y-4">
          <label className="block text-sm">Title<input className={`${fieldClass} mt-1`} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required maxLength={200} /></label>
          <label className="block text-sm">Category<select className={`${fieldClass} mt-1`} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} required>
            <option value="">Choose a category</option>
            {draft.category && !categories.some((category) => category.name === draft.category) && <option value={draft.category}>{draft.category}</option>}
            {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          </select></label>
          <div className="space-y-2">
            <span className="block text-sm font-medium">Project image</span>
            <div className="flex flex-wrap items-center gap-3">
              <label className={`${buttonClass} inline-flex cursor-pointer items-center ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                {uploading ? 'Uploading image…' : draft.image_url ? 'Replace image' : 'Upload image'}
                <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" disabled={uploading} onChange={(e) => { void uploadWorkImage(e.target.files?.[0]); e.currentTarget.value = '' }} />
              </label>
              <span className="text-xs text-muted-foreground">JPEG, PNG, WebP, AVIF, or GIF · max 8 MB</span>
            </div>
            {draft.image_url && <div className="flex items-center gap-3 rounded-xl border border-border p-2">
              <img src={draft.image_url} alt="Project image preview" className="size-20 rounded-lg bg-muted object-cover" />
              <p className="min-w-0 break-all text-xs text-muted-foreground">Image ready to save</p>
            </div>}
            <label className="block text-xs text-muted-foreground">Or use an image URL<input className={`${fieldClass} mt-1 text-sm text-foreground`} value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} required placeholder="https://…" /></label>
          </div>
          <label className="block text-sm">Description (optional)<textarea className={`${fieldClass} mt-1`} rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} /> Feature this project</label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2"><button className={buttonClass} disabled={busy || uploading}>{busy ? 'Saving…' : editingId ? 'Save changes' : 'Add work'}</button>{editingId && <button type="button" className="rounded-xl border border-border px-4 py-2.5 text-sm" onClick={() => { setEditingId(null); setDraft(blankWork) }}>Cancel</button>}</div>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold">Portfolio entries</h2>
        <div className="mt-4 space-y-3">
          {works.length === 0 && <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">No saved work yet. Add your first project here.</p>}
          {works.map((work) => (
            <article key={work.id} className="flex gap-4 rounded-2xl border border-border bg-card p-3">
              <img src={work.image_url} alt="" className="size-20 rounded-xl bg-muted object-cover" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{work.title}{work.featured && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs">Featured</span>}</h3>
                <p className="text-sm text-muted-foreground">{work.category}</p>
                <div className="mt-2 flex gap-3 text-sm"><button className="text-brand underline" onClick={() => editWork(work)}>Edit</button><button className="text-destructive underline" onClick={() => deleteWork(work)}>Delete</button></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
