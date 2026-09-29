import { products as editorialProducts } from '@/lib/products'
import { sampleWorks } from '@/lib/works'
import { API_URL } from '@/lib/site-config'
import type { Category, LoadResult, Product, Work } from '@/lib/types'

type ApiChoice = { id: number; label: string }
type ApiOption = { id: number; name: string; label: string; choices: ApiChoice[] }
type ApiCategory = { id: number; name: string; slug: string }
type ApiProduct = {
  id: number
  name: string
  slug: string
  tagline: string | null
  summary: string | null
  image_url: string | null
  image_urls: string[]
  description: string[] | null
  features: string[] | null
  turnaround: string | null
  starting_price: number | null
  category_id: number
  options: ApiOption[]
}
type ApiWork = Work

async function readList<T>(path: string): Promise<T[]> {
  const response = await fetch(`${API_URL}${path}`, { cache: 'no-store' })
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.detail || `Request failed (${response.status})`)
  }
  const payload: unknown = await response.json()
  return Array.isArray(payload) ? (payload as T[]) : []
}

function categoryFromApi(category: ApiCategory): Category {
  return { ...category, slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
}

function productFromApi(product: ApiProduct): Product {
  const images = product.image_urls?.filter(Boolean) ?? []
  const mainImage = images[0] || product.image_url || null
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description?.filter(Boolean).join('\n\n') || product.summary || product.tagline || null,
    category_id: product.category_id,
    image_url: mainImage,
    images: images.length ? images : mainImage ? [mainImage] : [],
    turnaround: product.turnaround,
    starting_price: product.starting_price,
    features: product.features ?? [],
    options: (product.options ?? []).map((option: ApiOption) => ({
      id: option.id,
      name: option.label || option.name,
      choices: (option.choices ?? []).map((choice) => ({ id: choice.id, label: choice.label })),
    })),
  }
}

function fixtureCategories(): Category[] {
  return [...new Set(editorialProducts.map((product) => product.category))].map((name, index) => ({
    id: index + 1,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  }))
}

function fixtureProducts(): Product[] {
  const categories = fixtureCategories()
  return editorialProducts.map((product, index) => {
    const category = categories.find((item) => item.name === product.category)
    return {
      id: index + 1,
      name: product.name,
      slug: product.slug,
      description: product.description.join('\n\n'),
      category_id: category?.id ?? null,
      image_url: product.image,
      images: product.images?.length ? product.images : [product.image],
      turnaround: product.turnaround,
      starting_price: null,
      features: product.features,
      options: product.options.map((option, optionIndex) => ({
        id: `${index + 1}-${optionIndex + 1}`,
        name: option.label,
        choices: option.choices.map((label, choiceIndex) => ({ id: `${index + 1}-${optionIndex + 1}-${choiceIndex + 1}`, label })),
      })),
    }
  })
}

export async function getCategories(): Promise<LoadResult<Category[]>> {
  if (!API_URL) return { data: fixtureCategories(), error: null, source: 'fixture' }
  try {
    const data = (await readList<ApiCategory>('/api/categories/')).map(categoryFromApi)
    return { data, error: null, source: 'api' }
  } catch (error) {
    return {
      data: fixtureCategories(),
      error: error instanceof Error ? error.message : 'Could not load categories',
      source: 'api',
    }
  }
}

export async function getProducts(): Promise<LoadResult<Product[]>> {
  if (!API_URL) return { data: fixtureProducts(), error: null, source: 'fixture' }
  try {
    const records = await readList<ApiProduct>('/api/products/')
    return { data: records.map(productFromApi), error: null, source: 'api' }
  } catch (error) {
    return {
      data: fixtureProducts(),
      error: error instanceof Error ? error.message : 'Could not load products',
      source: 'api',
    }
  }
}

export async function getWorks(): Promise<LoadResult<Work[]>> {
  if (!API_URL) return { data: sampleWorks, error: null, source: 'fixture' }
  try {
    const data = await readList<ApiWork>('/api/works/')
    return { data, error: null, source: 'api' }
  } catch (error) {
    return {
      data: sampleWorks,
      error: error instanceof Error ? error.message : 'Could not load portfolio work',
      source: 'api',
    }
  }
}

export async function getProductBySlug(slug: string): Promise<LoadResult<Product | null>> {
  const products = await getProducts()
  return {
    data: products.data.find((product) => product.slug === slug) ?? null,
    error: products.error,
    source: products.source,
  }
}
