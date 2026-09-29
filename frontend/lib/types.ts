export type ID = number | string

export interface Category {
  id: ID
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
}

export interface OptionChoice {
  id: ID
  option_id?: ID
  label: string
}

export interface ProductOption {
  id: ID
  product_id?: ID
  name: string
  choices: OptionChoice[]
}

export interface Product {
  id: ID
  name: string
  slug: string
  description?: string | null
  category_id?: ID | null
  image_url?: string | null
  images?: string[] | null
  turnaround?: string | null
  starting_price?: number | null
  features?: string[] | null
  is_active?: boolean
  options?: ProductOption[] | null
}

export interface Work {
  id: ID
  title: string
  description?: string | null
  category?: string | null
  client?: string | null
  image_url?: string | null
}

export type ProductInput = Omit<Product, 'id' | 'options'>
export type CategoryInput = Omit<Category, 'id'>
export type WorkInput = Omit<Work, 'id'>
export type OptionInput = { name: string }
export type ChoiceInput = { label: string }

export type UploadSection = 'products' | 'categories' | 'works'

export interface SignedUpload {
  upload_url: string
  public_url: string
}

export type DataSource = 'api' | 'fixture'

export interface LoadResult<T> {
  data: T
  error: string | null
  source: DataSource
}
