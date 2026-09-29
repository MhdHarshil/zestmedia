'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { ExternalLink, FolderTree, Images, LogOut, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { adminReads } from '@/lib/api'
import { useAdminSession } from './admin-session'
import { CategoriesPanel } from './categories-panel'
import { ProductsPanel } from './products-panel'
import { WorksPanel } from './works-panel'

export function useAdminData() {
  const products = useSWR('admin/products', adminReads.products)
  const categories = useSWR('admin/categories', adminReads.categories)
  const works = useSWR('admin/works', adminReads.works)
  return { products, categories, works }
}

export function AdminDashboard() {
  const { signOut } = useAdminSession()
  const { products, categories, works } = useAdminData()

  const stats = [
    { label: 'Products', value: products.data?.length, icon: Package },
    { label: 'Categories', value: categories.data?.length, icon: FolderTree },
    { label: 'Portfolio pieces', value: works.data?.length, icon: Images },
  ]

  return (
    <div className="min-h-dvh bg-muted/40">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary font-extrabold text-primary-foreground">Z</span>
            <span className="font-extrabold text-foreground">Studio admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/" target="_blank" />} nativeButton={false}>
              <ExternalLink data-icon="inline-start" />
              <span className="hidden sm:inline">View site</span>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut data-icon="inline-start" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <ul className="grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <li key={s.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <s.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-2xl font-extrabold tabular-nums text-foreground">{s.value ?? '—'}</span>
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              </span>
            </li>
          ))}
        </ul>

        <Tabs defaultValue="products" className="flex flex-col gap-4">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="works">Portfolio</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductsPanel products={products} categories={categories.data ?? []} />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesPanel categories={categories} products={products.data ?? []} />
          </TabsContent>
          <TabsContent value="works">
            <WorksPanel works={works} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
