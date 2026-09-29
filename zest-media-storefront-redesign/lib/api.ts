import { fixtureCategories, fixtureProducts, fixtureWorks } from './fixtures'
import { API_URL } from './site-config'
import type {
  Category,
  CategoryInput,
  ChoiceInput,
  ID,
  LoadResult,
  OptionInput,
  Product,
  ProductInput,
  SignedUpload,
  UploadSection,
  Work,
  WorkInput,
} from './types'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const isApiConfigured = API_URL.length > 0

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string | null
}

async function request<T>(path: string, { method = 'GET', body, token }: RequestOptions = {}): Promise<T> {
  if (!isApiConfigured) throw new ApiError('The API URL is not configured (NEXT_PUBLIC_API_URL).', 0)

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      ...(method === 'GET' && !token && typeof window === 'undefined'
        ? { next: { revalidate: 60 } }
        : { cache: 'no-store' as const }),
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const payload = await res.json()
      const detail = payload?.detail ?? payload?.message ?? payload?.error
      if (typeof detail === 'string') message = detail
      else if (Array.isArray(detail) && detail[0]?.msg) message = detail[0].msg
    } catch {}
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

function asList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    for (const key of ['items', 'data', 'results']) if (Array.isArray(obj[key])) return obj[key] as T[]
  }
  return []
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeProduct(p: Product): Product {
  const images = (p.images ?? []).filter(Boolean)
  return {
    ...p,
    slug: p.slug || slugify(p.name),
    images: images.length ? images : p.image_url ? [p.image_url] : [],
    features: p.features ?? [],
    options: (p.options ?? []).map((o) => ({ ...o, choices: o.choices ?? [] })),
  }
}

function normalizeCategory(c: Category): Category {
  return { ...c, slug: c.slug || slugify(c.name) }
}

async function load<T>(path: string, fixture: T[], map: (item: T) => T): Promise<LoadResult<T[]>> {
  if (!isApiConfigured) return { data: fixture.map(map), error: null, source: 'fixture' }
  try {
    const payload = await request<unknown>(path)
    return { data: asList<T>(payload).map(map), error: null, source: 'api' }
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Something went wrong', source: 'api' }
  }
}

// ---------- Public reads ----------

export async function getProducts() {
  const result = await load<Product>('/api/products/', fixtureProducts, normalizeProduct)
  return { ...result, data: result.data.filter((p) => p.is_active !== false) }
}

export function getCategories() {
  return load<Category>('/api/categories/', fixtureCategories, normalizeCategory)
}

export function getWorks() {
  return load<Work>('/api/works/', fixtureWorks, (w) => w)
}

// No product-by-slug endpoint exists, so load the list and match locally.
export async function getProductBySlug(slug: string) {
  const result = await getProducts()
  return { ...result, data: result.data.find((p) => p.slug === slug) ?? null }
}

// ---------- Admin (bearer token required) ----------

export async function login(email: string, password: string): Promise<string> {
  const payload = await request<Record<string, unknown>>('/api/auth/login', {
    method: 'POST',
    body: { email, username: email, password },
  })
  const token = payload?.access_token ?? payload?.token
  if (typeof token !== 'string' || !token) throw new ApiError('Login succeeded but no token was returned.', 500)
  return token
}

export const adminReads = {
  products: async () => asList<Product>(await request('/api/products/')).map(normalizeProduct),
  categories: async () => asList<Category>(await request('/api/categories/')).map(normalizeCategory),
  works: async () => asList<Work>(await request('/api/works/')),
}

export function createAdminApi(token: string) {
  const auth = { token }
  return {
    createProduct: (data: ProductInput) => request<Product>('/api/products/', { method: 'POST', body: data, ...auth }),
    updateProduct: (id: ID, data: Partial<ProductInput>) =>
      request<Product>(`/api/products/${id}`, { method: 'PATCH', body: data, ...auth }),
    deleteProduct: (id: ID) => request<void>(`/api/products/${id}`, { method: 'DELETE', ...auth }),

    createCategory: (data: CategoryInput) =>
      request<Category>('/api/categories/', { method: 'POST', body: data, ...auth }),
    updateCategory: (id: ID, data: Partial<CategoryInput>) =>
      request<Category>(`/api/categories/${id}`, { method: 'PATCH', body: data, ...auth }),
    deleteCategory: (id: ID) => request<void>(`/api/categories/${id}`, { method: 'DELETE', ...auth }),

    createOption: (productId: ID, data: OptionInput) =>
      request(`/api/options/${productId}/options`, { method: 'POST', body: data, ...auth }),
    updateOption: (productId: ID, optionId: ID, data: OptionInput) =>
      request(`/api/options/${productId}/options/${optionId}`, { method: 'PATCH', body: data, ...auth }),
    deleteOption: (productId: ID, optionId: ID) =>
      request<void>(`/api/options/${productId}/options/${optionId}`, { method: 'DELETE', ...auth }),

    createChoice: (optionId: ID, data: ChoiceInput) =>
      request(`/api/options/${optionId}/choices`, { method: 'POST', body: data, ...auth }),
    updateChoice: (optionId: ID, choiceId: ID, data: ChoiceInput) =>
      request(`/api/options/${optionId}/choices/${choiceId}`, { method: 'PATCH', body: data, ...auth }),
    deleteChoice: (optionId: ID, choiceId: ID) =>
      request<void>(`/api/options/${optionId}/choices/${choiceId}`, { method: 'DELETE', ...auth }),

    createWork: (data: WorkInput) => request<Work>('/api/works/', { method: 'POST', body: data, ...auth }),
    updateWork: (id: ID, data: Partial<WorkInput>) =>
      request<Work>(`/api/works/${id}`, { method: 'PATCH', body: data, ...auth }),
    deleteWork: (id: ID) => request<void>(`/api/works/${id}`, { method: 'DELETE', ...auth }),

    async uploadImage(file: File, section: UploadSection): Promise<string> {
      const signed = await request<SignedUpload>('/api/uploads/signed-url', {
        method: 'POST',
        body: { section, content_type: file.type, size: file.size },
        ...auth,
      })
      const res = await fetch(signed.upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!res.ok) throw new ApiError(`Upload failed (${res.status})`, res.status)
      return signed.public_url
    },
  }
}

export type AdminApi = ReturnType<typeof createAdminApi>
