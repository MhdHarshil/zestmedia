import type { Product } from '@/lib/products'
import { products as editorialProducts } from '@/lib/products'
import { sampleWorks } from '@/lib/works'
import type { ApiWork } from '@/lib/works'

export type ApiChoice = { id: number; label: string }
export type ApiOption = { id: number; name: string; label: string; choices: ApiChoice[] }
export type ApiProduct = {
  id: number
  name: string
  slug: string
  tagline: string | null
  summary: string | null
  image_url: string | null
  image_urls: string[]
  description: string[] | null
  features: string[] | null
  audiences: string[] | null
  turnaround: string | null
  starting_price: number | null
  category_id: number
  options: ApiOption[]
}
export type ApiCategory = { id: number; name: string; slug: string }

const dressPrintingEditorial: Pick<Product, 'category' | 'summary' | 'tagline' | 'description' | 'features' | 'audiences'> = {
  category: 'Apparel',
  summary: 'Custom dress printing for your brand, team, or event.',
  tagline: 'Custom dresses printed for your brand.',
  description: [
    'Custom printed dresses help your brand stand out. We print your design with crisp colors and a clean finish, so each dress feels ready for your team or event.',
    'Choose a dress style, colors, and print placement to create a look that fits your brand or occasion.',
  ],
  features: ['Custom designs and colors', 'Comfortable fabric options', 'Print placement choices', 'Single & bulk orders'],
  audiences: ['Teams', 'Businesses', 'Events'],
}

export function getEditorial(record: ApiProduct): Partial<Product> | undefined {
  const builtIn = editorialProducts.find((item) => item.slug === record.slug)
  if (builtIn) return builtIn
  const name = record.name.trim().toLowerCase()
  const slug = record.slug.trim().toLowerCase()
  const normalizedName = name.replace(/[^a-z0-9]/g, '')
  const normalizedSlug = slug.replace(/[^a-z0-9]/g, '')
  if (normalizedName.includes('tshirtprinting') || normalizedSlug.includes('tshirtprinting')) {
    return editorialProducts.find((item) => item.slug === 't-shirt-printing')
  }
  if (name.includes('dress') || slug.includes('dress')) return dressPrintingEditorial
  return undefined
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail || `Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

export async function uploadAdminImage(file: File, section: 'products' | 'works', token: string): Promise<string> {
  const maxBytes = 8 * 1024 * 1024
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
  if (!allowedTypes.includes(file.type)) throw new Error('Choose a JPEG, PNG, WebP, AVIF, or GIF image.')
  if (file.size <= 0 || file.size > maxBytes) throw new Error('Images must be smaller than 8 MB.')
  const signed = await apiRequest<{ upload_url: string; public_url: string }>('/api/uploads/signed-url', {
    method: 'POST', headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ section, content_type: file.type, size: file.size }),
  })
  const body = new FormData()
  body.append('cacheControl', '3600')
  body.append('', file)
  const response = await fetch(signed.upload_url, {
    method: 'PUT', headers: { 'x-upsert': 'false' }, body,
  })
  if (!response.ok) {
    const detail = await response.json().catch(() => null)
    throw new Error(detail?.message || detail?.error || `Image upload failed (${response.status})`)
  }
  return signed.public_url
}

export async function getCategories(): Promise<ApiCategory[]> {
  return apiRequest<ApiCategory[]>('/api/categories/')
}

export async function getWorks(): Promise<ApiWork[]> {
  try {
    const works = await apiRequest<ApiWork[]>('/api/works/')
    return works.length ? works : sampleWorks
  } catch {
    return sampleWorks
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const [records, categories] = await Promise.all([
      apiRequest<ApiProduct[]>('/api/products/'),
      getCategories(),
    ])
    return records.map((record) => {
      const editorial = getEditorial(record)
      return {
        slug: record.slug,
        name: record.name,
        category: editorial === dressPrintingEditorial ? editorial.category! : categories.find((item) => item.id === record.category_id)?.name || editorial?.category || 'Other',
        tagline: editorial === dressPrintingEditorial ? editorial.tagline! : record.tagline || editorial?.tagline || '',
        summary: editorial === dressPrintingEditorial ? editorial.summary! : record.summary || editorial?.summary || '',
        description: (record.description ?? editorial?.description) || [],
        image: record.image_urls[0] || record.image_url || editorial?.image || '/placeholder.svg',
        images: record.image_urls.length ? record.image_urls : (record.image_url ? [record.image_url] : []),
        features: (record.features ?? editorial?.features) || [],
        audiences: (record.audiences ?? editorial?.audiences) || [],
        turnaround: record.turnaround || editorial?.turnaround || 'Contact us',
        startingPrice: record.starting_price,
        options: record.options.map((option) => ({
          id: String(option.id),
          label: option.label,
          choices: option.choices.map((choice) => choice.label),
        })),
      }
    })
  } catch {
    // Keep the public site usable while the API is not configured during local setup.
    return editorialProducts
  }
}

export function productFromApi(record: ApiProduct, categories: ApiCategory[]): Product {
  const editorial = getEditorial(record)
  return {
    slug: record.slug,
    name: record.name,
    category: editorial === dressPrintingEditorial ? editorial.category! : categories.find((item) => item.id === record.category_id)?.name || editorial?.category || 'Other',
    tagline: editorial === dressPrintingEditorial ? editorial.tagline! : record.tagline || editorial?.tagline || '',
    summary: editorial === dressPrintingEditorial ? editorial.summary! : record.summary || editorial?.summary || '',
    description: (record.description ?? editorial?.description) || [],
    image: record.image_urls[0] || record.image_url || editorial?.image || '/placeholder.svg',
    images: record.image_urls.length ? record.image_urls : (record.image_url ? [record.image_url] : []),
    features: (record.features ?? editorial?.features) || [],
    audiences: (record.audiences ?? editorial?.audiences) || [],
    turnaround: record.turnaround || editorial?.turnaround || 'Contact us',
    startingPrice: record.starting_price,
    options: record.options.map((option) => ({ id: String(option.id), label: option.label, choices: option.choices.map((choice) => choice.label) })),
  }
}
