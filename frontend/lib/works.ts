export type ApiWork = {
  id: number
  title: string
  category: string
  image_url: string
  description: string | null
  featured: boolean
}

export const sampleWorks: ApiWork[] = [
  { id: -1, image_url: '/images/custom-branding.png', title: 'Cohesive brand identity kit', category: 'Branding', description: null, featured: true },
  { id: -2, image_url: '/images/visiting-cards.png', title: 'Letterpress visiting cards', category: 'Stationery', description: null, featured: false },
  { id: -3, image_url: '/images/work-1.png', title: 'Debossed card detail', category: 'Stationery', description: null, featured: false },
  { id: -4, image_url: '/images/posters.png', title: 'Gallery poster series', category: 'Large Format', description: null, featured: false },
  { id: -5, image_url: '/images/tshirt-printing.png', title: 'Event merch tees', category: 'Apparel', description: null, featured: false },
  { id: -6, image_url: '/images/work-2.png', title: 'Branded packaging set', category: 'Branding', description: null, featured: true },
  { id: -7, image_url: '/images/stickers.png', title: 'Die-cut sticker pack', category: 'Small Format', description: null, featured: false },
  { id: -8, image_url: '/images/invitations.png', title: 'Foil-stamped invitations', category: 'Stationery', description: null, featured: false },
  { id: -9, image_url: '/images/work-3.png', title: 'Large-format event banner', category: 'Large Format', description: null, featured: false },
  { id: -10, image_url: '/images/brochures.png', title: 'Tri-fold brochures', category: 'Stationery', description: null, featured: false },
  { id: -11, image_url: '/images/work-4.png', title: 'Event welcome collateral', category: 'Events', description: null, featured: true },
  { id: -12, image_url: '/images/flex-banners.png', title: 'Roll-up standees', category: 'Large Format', description: null, featured: false },
]
