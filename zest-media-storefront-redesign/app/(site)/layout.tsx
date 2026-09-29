import { ScrollProgress } from '@/components/motion/scroll-progress'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { getCategories } from '@/lib/api'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { data: categories } = await getCategories()
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter categories={categories} />
    </>
  )
}
