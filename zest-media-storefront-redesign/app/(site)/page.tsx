import { CategoryTiles } from '@/components/home/category-tiles'
import { Hero } from '@/components/home/hero'
import { ProcessSteps } from '@/components/home/process-steps'
import { ProductShelf } from '@/components/home/product-shelf'
import { PromoPanels } from '@/components/home/promo-panels'
import { WorkTeaser } from '@/components/home/work-teaser'
import { ScrollMarquee } from '@/components/motion/scroll-marquee'
import { BenefitsStrip } from '@/components/site/benefits-strip'
import { CtaBand } from '@/components/site/cta-band'
import { LoadNotice } from '@/components/site/load-notice'
import { getCategories, getProducts, getWorks } from '@/lib/api'

export default async function HomePage() {
  const [products, categories, works] = await Promise.all([getProducts(), getCategories(), getWorks()])
  const marqueeItems = categories.data.length
    ? categories.data.map((c) => c.name)
    : ['Visiting cards', 'Packaging', 'Brochures', 'Banners', 'Stickers']

  return (
    <>
      <Hero />
      <div className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 md:-mt-16 md:px-6">
        <BenefitsStrip />
      </div>
      {products.error || categories.error ? (
        <div className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
          <LoadNotice error={products.error ?? categories.error} />
        </div>
      ) : null}
      <CategoryTiles categories={categories.data} products={products.data} />
      <ScrollMarquee items={marqueeItems} />
      <ProductShelf products={products.data} categories={categories.data} />
      <PromoPanels categories={categories.data} />
      <WorkTeaser works={works.data} />
      <ProcessSteps />
      <div className="pt-16 md:pt-24" />
      <CtaBand />
    </>
  )
}
