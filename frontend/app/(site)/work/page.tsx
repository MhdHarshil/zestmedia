import type { Metadata } from 'next'
import { WorkGallery } from '@/components/work/work-gallery'
import { CtaBand } from '@/components/site/cta-band'
import { LoadNotice } from '@/components/site/load-notice'
import { PageHero } from '@/components/site/page-hero'
import { getWorks } from '@/lib/storefront-api'

export const metadata: Metadata = {
  title: 'Our work',
  description: 'A portfolio of print and branding projects produced by Zest Media.',
}

export default async function WorkPage() {
  const works = await getWorks()
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Work we're proud of"
        description="A selection of cards, packaging, signage and more — designed, proofed and printed in our studio."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        {works.error ? (
          <div className="mb-8">
            <LoadNotice error={works.error} />
          </div>
        ) : null}
        <WorkGallery works={works.data} />
      </div>
      <CtaBand />
    </>
  )
}
