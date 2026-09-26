'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { apiRequest, getCategories, getEditorial, uploadAdminImage } from '@/lib/api'
import type { ApiCategory, ApiProduct } from '@/lib/api'
import { AdminWorksPanel } from '@/components/admin-works-panel'

type ProductDraft = {
  name: string
  slug: string
  tagline: string
  summary: string
  description: string[]
  features: string[]
  audiences: string[]
  image_urls: string[]
  turnaround: string
  category_id: string
}

const emptyDraft: ProductDraft = {
  name: '', slug: '', tagline: '', summary: '', description: [''], features: [''], audiences: [''], image_urls: [''], turnaround: '', category_id: '',
}

const fieldClass = 'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm'
const buttonClass = 'rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground disabled:opacity-50'

export function AdminPanel() {
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft)
  const [editing, setEditing] = useState<number | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [optionBusy, setOptionBusy] = useState(false)
  const [addingOptionFor, setAddingOptionFor] = useState<number | null>(null)
  const [newOptionLabel, setNewOptionLabel] = useState('')
  const [addingChoiceFor, setAddingChoiceFor] = useState<number | null>(null)
  const [newChoiceLabel, setNewChoiceLabel] = useState('')
  const [editingOptionId, setEditingOptionId] = useState<number | null>(null)
  const [editingOptionLabel, setEditingOptionLabel] = useState('')
  const [editingChoice, setEditingChoice] = useState<{ id: number; optionId: number } | null>(null)
  const [editingChoiceLabel, setEditingChoiceLabel] = useState('')
  const [section, setSection] = useState<'catalogue' | 'works'>('catalogue')

  const authed = (method: string, body?: unknown) => ({
    method,
    headers: { Authorization: `Bearer ${token}` },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  async function refresh() {
    const [nextProducts, nextCategories] = await Promise.all([
      apiRequest<ApiProduct[]>('/api/products/'),
      getCategories(),
    ])
    setProducts(nextProducts)
    setCategories(nextCategories)
  }

  async function login(event: FormEvent) {
    event.preventDefault()
    setBusy(true); setError('')
    try {
      const result = await apiRequest<{ access_token: string }>('/api/auth/login', {
        method: 'POST', body: JSON.stringify({ username, password }),
      })
      setToken(result.access_token)
      const [nextProducts, nextCategories] = await Promise.all([
        apiRequest<ApiProduct[]>('/api/products/'), getCategories(),
      ])
      setProducts(nextProducts); setCategories(nextCategories); setPassword('')
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not sign in') }
    finally { setBusy(false) }
  }

  function startEdit(product: ApiProduct) {
    const editorial = getEditorial(product)
    setEditing(product.id)
    setDraft({
      name: product.name, slug: product.slug, tagline: product.tagline || '',
      summary: product.summary || '',
      description: product.description ?? editorial?.description ?? [''],
      features: product.features ?? editorial?.features ?? [''],
      audiences: product.audiences ?? editorial?.audiences ?? [''],
      image_urls: product.image_urls.length ? product.image_urls : [product.image_url || ''],
      turnaround: product.turnaround || '', category_id: String(product.category_id),
    })
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    const payload = {
      ...draft,
      category_id: Number(draft.category_id),
      image_urls: draft.image_urls.map((url) => url.trim()).filter(Boolean),
      description: draft.description.map((paragraph) => paragraph.trim()).filter(Boolean),
      features: draft.features.map((feature) => feature.trim()).filter(Boolean),
      audiences: draft.audiences.map((audience) => audience.trim()).filter(Boolean),
      tagline: draft.tagline || null, summary: draft.summary || null,
      image_url: draft.image_urls.map((url) => url.trim()).find(Boolean) || null,
      turnaround: draft.turnaround || null,
    }
    try {
      await apiRequest(editing ? `/api/products/${editing}` : '/api/products/', {
        ...authed(editing ? 'PATCH' : 'POST', payload),
      })
      setDraft(emptyDraft); setEditing(null); await refresh(); setNotice('Product saved.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save product') }
    finally { setBusy(false) }
  }

  async function addProductImages(files: FileList | null) {
    if (!files?.length) return
    setUploading(true); setError(''); setNotice('')
    try {
      const uploaded = await Promise.all(Array.from(files).map((file) => uploadAdminImage(file, 'products', token)))
      setDraft((current) => ({ ...current, image_urls: [...current.image_urls.filter((url) => url.trim()), ...uploaded] }))
      setNotice(`${uploaded.length} image${uploaded.length === 1 ? '' : 's'} uploaded. Save the product to keep them.`)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not upload image') }
    finally { setUploading(false) }
  }

  async function removeProduct(product: ApiProduct) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return
    setError(''); setNotice('')
    try { await apiRequest(`/api/products/${product.id}`, authed('DELETE')); await refresh(); setNotice('Product deleted.') }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not delete product') }
  }

  async function createCategory(event: FormEvent) {
    event.preventDefault(); setError(''); setNotice('')
    const slug = categoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    try {
      await apiRequest('/api/categories/', { ...authed('POST', { name: categoryName.trim(), slug }) })
      setCategoryName(''); await refresh(); setNotice('Category created.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create category') }
  }

  async function renameCategory(category: ApiCategory) {
    const name = window.prompt('Category name', category.name)?.trim()
    if (!name || name === category.name) return
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    try { await apiRequest(`/api/categories/${category.id}`, { ...authed('PATCH', { name, slug }) }); await refresh() }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not rename category') }
  }

  async function removeCategory(category: ApiCategory) {
    if (!window.confirm(`Delete category ${category.name}?`)) return
    try { await apiRequest(`/api/categories/${category.id}`, authed('DELETE')); await refresh() }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not delete category') }
  }

  async function submitNewOption(event: FormEvent<HTMLFormElement>, productId: number) {
    event.preventDefault()
    const label = newOptionLabel.trim()
    if (!label) return
    const name = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    setOptionBusy(true); setError('')
    try {
      await apiRequest(`/api/options/${productId}/options`, { ...authed('POST', { name, label }) })
      setAddingOptionFor(null); setNewOptionLabel(''); await refresh()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create option') }
    finally { setOptionBusy(false) }
  }

  async function submitNewChoice(event: FormEvent<HTMLFormElement>, optionId: number) {
    event.preventDefault()
    const label = newChoiceLabel.trim()
    if (!label) return
    setOptionBusy(true); setError('')
    try {
      await apiRequest(`/api/options/${optionId}/choices`, { ...authed('POST', { label }) })
      setAddingChoiceFor(null); setNewChoiceLabel(''); await refresh()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create choice') }
    finally { setOptionBusy(false) }
  }

  async function submitOptionEdit(event: FormEvent<HTMLFormElement>, productId: number, optionId: number) {
    event.preventDefault()
    const label = editingOptionLabel.trim()
    if (!label) return
    const name = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    setOptionBusy(true); setError('')
    try {
      await apiRequest(`/api/options/${productId}/options/${optionId}`, { ...authed('PATCH', { name, label }) })
      setEditingOptionId(null); setEditingOptionLabel(''); await refresh()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not rename option') }
    finally { setOptionBusy(false) }
  }

  async function submitChoiceEdit(event: FormEvent<HTMLFormElement>, optionId: number, choiceId: number) {
    event.preventDefault()
    const label = editingChoiceLabel.trim()
    if (!label) return
    setOptionBusy(true); setError('')
    try {
      await apiRequest(`/api/options/${optionId}/choices/${choiceId}`, { ...authed('PATCH', { label }) })
      setEditingChoice(null); setEditingChoiceLabel(''); await refresh()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not rename choice') }
    finally { setOptionBusy(false) }
  }

  async function removeOption(productId: number, optionId: number) {
    if (!window.confirm('Delete this option and its choices?')) return
    try { await apiRequest(`/api/options/${productId}/options/${optionId}`, authed('DELETE')); await refresh() }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not delete option') }
  }

  async function removeChoice(optionId: number, choiceId: number) {
    if (!window.confirm('Delete this choice?')) return
    try { await apiRequest(`/api/options/${optionId}/choices/${choiceId}`, authed('DELETE')); await refresh() }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not delete choice') }
  }

  if (!token) return (
    <main className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-serif text-3xl font-semibold">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">Use the admin account created for this backend.</p>
      <form onSubmit={login} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
        <label className="block text-sm font-medium">Username<input className={`${fieldClass} mt-1`} autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
        <label className="block text-sm font-medium">Password<input className={`${fieldClass} mt-1`} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button className={`${buttonClass} w-full`} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  )

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-muted-foreground">ZestMedia</p><h1 className="mt-1 font-serif text-3xl font-semibold">Admin dashboard</h1></div>
        <button className="rounded-xl border border-border px-4 py-2 text-sm" onClick={() => { setToken(''); setProducts([]) }}>Sign out</button>
      </div>
      {(error || notice) && <p role={error ? 'alert' : 'status'} className={`mt-5 rounded-xl p-3 text-sm ${error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>{error || notice}</p>}

      <nav className="mt-6 flex gap-2" aria-label="Admin sections">
        <button type="button" aria-pressed={section === 'catalogue'} className={`${section === 'catalogue' ? buttonClass : 'rounded-xl border border-border px-4 py-2.5 text-sm'}`} onClick={() => setSection('catalogue')}>Products &amp; categories</button>
        <button type="button" aria-pressed={section === 'works'} className={`${section === 'works' ? buttonClass : 'rounded-xl border border-border px-4 py-2.5 text-sm'}`} onClick={() => setSection('works')}>Our Work</button>
      </nav>

      {section === 'works' ? <AdminWorksPanel token={token} /> : <>
      <section className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-7">
        <h2 className="font-serif text-xl font-semibold">{editing ? 'Edit product' : 'Add product'}</h2>
        {categories.length === 0 && <p className="mt-3 text-sm text-amber-800">Create a category before adding products.</p>}
        <form onSubmit={saveProduct} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">Name<input className={`${fieldClass} mt-1`} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required /></label>
          <label className="text-sm">URL slug<input className={`${fieldClass} mt-1`} value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} required /></label>
          <label className="text-sm">Tagline<input className={`${fieldClass} mt-1`} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></label>
          <label className="text-sm">Turnaround<input className={`${fieldClass} mt-1`} value={draft.turnaround} onChange={(e) => setDraft({ ...draft, turnaround: e.target.value })} /></label>
          <label className="text-sm md:col-span-2">Summary<textarea className={`${fieldClass} mt-1`} rows={3} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /></label>
          <fieldset className="space-y-2 md:col-span-2">
            <legend className="text-sm font-medium">Product page descriptions</legend>
            <p className="text-xs text-muted-foreground">Add each paragraph that should appear under the product tagline.</p>
            {draft.description.map((paragraph, index) => <div key={index} className="flex items-start gap-2">
              <textarea className={fieldClass} rows={3} value={paragraph} aria-label={`Description paragraph ${index + 1}`} placeholder="Describe this product" onChange={(e) => setDraft({ ...draft, description: draft.description.map((value, i) => i === index ? e.target.value : value) })} />
              <button type="button" className="rounded-xl border border-border px-3 py-2 text-sm" aria-label={`Remove paragraph ${index + 1}`} onClick={() => setDraft({ ...draft, description: draft.description.filter((_, i) => i !== index) })}>Remove</button>
            </div>)}
            <button type="button" className="text-sm font-medium text-brand underline" onClick={() => setDraft({ ...draft, description: [...draft.description, ''] })}>Add paragraph</button>
          </fieldset>
          <fieldset className="space-y-2 md:col-span-2">
            <legend className="text-sm font-medium">Product features</legend>
            <p className="text-xs text-muted-foreground">Add the short feature callouts shown in the product page cards.</p>
            {draft.features.map((feature, index) => <div key={index} className="flex gap-2">
              <input className={fieldClass} value={feature} aria-label={`Product feature ${index + 1}`} placeholder="For example, Single and bulk orders" onChange={(e) => setDraft({ ...draft, features: draft.features.map((value, i) => i === index ? e.target.value : value) })} />
              <button type="button" className="rounded-xl border border-border px-3 text-sm" aria-label={`Remove feature ${index + 1}`} onClick={() => setDraft({ ...draft, features: draft.features.filter((_, i) => i !== index) })}>Remove</button>
            </div>)}
            <button type="button" className="text-sm font-medium text-brand underline" onClick={() => setDraft({ ...draft, features: [...draft.features, ''] })}>Add feature</button>
          </fieldset>
          <fieldset className="space-y-2 md:col-span-2">
            <legend className="text-sm font-medium">Great for</legend>
            <p className="text-xs text-muted-foreground">Add the audiences shown beside the product turnaround.</p>
            {draft.audiences.map((audience, index) => <div key={index} className="flex gap-2">
              <input className={fieldClass} value={audience} aria-label={`Great for audience ${index + 1}`} placeholder="For example, Small businesses" onChange={(e) => setDraft({ ...draft, audiences: draft.audiences.map((value, i) => i === index ? e.target.value : value) })} />
              <button type="button" className="rounded-xl border border-border px-3 text-sm" aria-label={`Remove audience ${index + 1}`} onClick={() => setDraft({ ...draft, audiences: draft.audiences.filter((_, i) => i !== index) })}>Remove</button>
            </div>)}
            <button type="button" className="text-sm font-medium text-brand underline" onClick={() => setDraft({ ...draft, audiences: [...draft.audiences, ''] })}>Add audience</button>
          </fieldset>
          <fieldset className="space-y-2 md:col-span-2">
            <legend className="text-sm font-medium">Product images</legend>
            <p className="text-xs text-muted-foreground">Upload multiple images, or paste existing URLs. The first image is used on product cards.</p>
            <label className="inline-flex cursor-pointer items-center rounded-xl border border-border px-3 py-2 text-sm">{uploading ? 'Uploading…' : 'Choose images'}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" multiple disabled={uploading} onChange={(e) => { void addProductImages(e.target.files); e.currentTarget.value = '' }} /></label>
            {draft.image_urls.map((imageUrl, index) => <div key={index} className="flex gap-2">
              <input className={fieldClass} type="text" value={imageUrl} placeholder="https://… or /images/product.jpg" aria-label={`Product image ${index + 1}`} onChange={(e) => setDraft({ ...draft, image_urls: draft.image_urls.map((url, i) => i === index ? e.target.value : url) })} />
              <button type="button" className="rounded-xl border border-border px-3 text-sm" aria-label={`Remove image ${index + 1}`} disabled={draft.image_urls.length === 1} onClick={() => setDraft({ ...draft, image_urls: draft.image_urls.filter((_, i) => i !== index) })}>Remove</button>
            </div>)}
            <button type="button" className="text-sm font-medium text-brand underline" onClick={() => setDraft({ ...draft, image_urls: [...draft.image_urls, ''] })}>Add another image</button>
          </fieldset>
          <label className="text-sm">Category<select className={`${fieldClass} mt-1`} value={draft.category_id} onChange={(e) => setDraft({ ...draft, category_id: e.target.value })} required><option value="">Choose category</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></label>
          <div className="flex gap-2 md:col-span-2"><button className={buttonClass} disabled={busy || uploading || !categories.length}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create product'}</button>{editing && <button type="button" className="rounded-xl border border-border px-4 py-2.5 text-sm" onClick={() => { setEditing(null); setDraft(emptyDraft) }}>Cancel</button>}</div>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-7">
        <h2 className="font-serif text-xl font-semibold">Categories</h2>
        <form onSubmit={createCategory} className="mt-4 flex flex-wrap gap-2"><input className={`${fieldClass} max-w-sm`} placeholder="New category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required /><button className={buttonClass}>Add category</button></form>
        <ul className="mt-4 flex flex-wrap gap-2">{categories.map((category) => <li key={category.id} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm">{category.name}<button className="text-brand underline" onClick={() => renameCategory(category)}>Rename</button><button className="text-red-700 underline" onClick={() => removeCategory(category)}>Delete</button></li>)}</ul>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-2xl font-semibold">Products and options</h2>
        <div className="mt-4 space-y-4">
          {products.map((product) => <article key={product.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="font-serif text-xl font-semibold">{product.name}</h3><p className="text-sm text-muted-foreground">/{product.slug} · {categories.find((cat) => cat.id === product.category_id)?.name}</p></div>
              <div className="flex gap-2"><button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => startEdit(product)}>Edit</button><button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700" onClick={() => removeProduct(product)}>Delete</button></div>
            </div>

            <div className="mt-4 space-y-3">
              {product.options.map((option) => <div key={option.id} className="rounded-xl bg-secondary p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {editingOptionId === option.id ? <form onSubmit={(event) => submitOptionEdit(event, product.id, option.id)} className="flex min-w-0 flex-1 flex-wrap gap-2">
                    <input className={`${fieldClass} max-w-sm`} autoFocus value={editingOptionLabel} onChange={(event) => setEditingOptionLabel(event.target.value)} aria-label="Option label" required />
                    <button className={buttonClass} disabled={optionBusy}>Save</button>
                    <button type="button" className="rounded-xl border border-border px-4 py-2.5 text-sm" onClick={() => { setEditingOptionId(null); setEditingOptionLabel('') }}>Cancel</button>
                  </form> : <p className="text-sm font-semibold">{option.label}</p>}
                  {editingOptionId !== option.id && <div className="flex flex-wrap gap-3 text-sm">
                    <button type="button" className="text-brand underline" onClick={() => { setEditingOptionId(option.id); setEditingOptionLabel(option.label) }}>Rename</button>
                    <button type="button" className="text-brand underline" onClick={() => { setAddingChoiceFor(option.id); setNewChoiceLabel('') }}>Add choice</button>
                    <button type="button" className="text-red-700 underline" onClick={() => removeOption(product.id, option.id)}>Delete option</button>
                  </div>}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {option.choices.map((choice) => editingChoice?.id === choice.id && editingChoice.optionId === option.id ? <form key={choice.id} onSubmit={(event) => submitChoiceEdit(event, option.id, choice.id)} className="flex flex-wrap gap-2 rounded-full border border-border bg-background p-1">
                    <input className="min-w-32 rounded-full bg-transparent px-2 text-xs outline-none" autoFocus value={editingChoiceLabel} onChange={(event) => setEditingChoiceLabel(event.target.value)} aria-label="Choice label" required />
                    <button className="text-xs font-semibold text-brand" disabled={optionBusy}>Save</button>
                    <button type="button" className="px-1 text-xs" onClick={() => { setEditingChoice(null); setEditingChoiceLabel('') }}>Cancel</button>
                  </form> : <span key={choice.id} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs">
                    {choice.label}
                    <button type="button" aria-label={`Rename ${choice.label}`} className="text-brand" onClick={() => { setEditingChoice({ id: choice.id, optionId: option.id }); setEditingChoiceLabel(choice.label) }}>✎</button>
                    <button type="button" aria-label={`Delete ${choice.label}`} className="text-red-700" onClick={() => removeChoice(option.id, choice.id)}>×</button>
                  </span>)}
                </div>

                {addingChoiceFor === option.id && <form onSubmit={(event) => submitNewChoice(event, option.id)} className="mt-3 flex flex-wrap gap-2">
                  <input className={`${fieldClass} max-w-sm`} autoFocus value={newChoiceLabel} onChange={(event) => setNewChoiceLabel(event.target.value)} placeholder={`New choice for ${option.label}`} aria-label={`New choice for ${option.label}`} required />
                  <button className={buttonClass} disabled={optionBusy}>Add choice</button>
                  <button type="button" className="rounded-xl border border-border px-4 py-2.5 text-sm" onClick={() => { setAddingChoiceFor(null); setNewChoiceLabel('') }}>Cancel</button>
                </form>}
              </div>)}
            </div>

            {addingOptionFor === product.id ? <form onSubmit={(event) => submitNewOption(event, product.id)} className="mt-3 flex flex-wrap gap-2">
              <input className={`${fieldClass} max-w-sm`} autoFocus value={newOptionLabel} onChange={(event) => setNewOptionLabel(event.target.value)} placeholder="Option name (for example, Paper stock)" aria-label="New product option name" required />
              <button className={buttonClass} disabled={optionBusy}>Add option</button>
              <button type="button" className="rounded-xl border border-border px-4 py-2.5 text-sm" onClick={() => { setAddingOptionFor(null); setNewOptionLabel('') }}>Cancel</button>
            </form> : <button type="button" className="mt-3 text-sm font-medium text-brand underline" onClick={() => { setAddingOptionFor(product.id); setNewOptionLabel('') }}>Add option</button>}
          </article>)}
        </div>
      </section>
      </>}
    </main>
  )
}
