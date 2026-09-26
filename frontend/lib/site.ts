export const site = {
  name: 'Zest Media',
  shortName: 'Zest',
  tagline: 'Print & Branding Studio',
  description:
    'A creative print and branding studio for local businesses, students, event organizers and individuals. Visiting cards, banners, apparel, stickers, posters, brochures, invitations and full brand identities.',
  // WhatsApp number must use international digits only, without a leading +.
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  phoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  address: process.env.NEXT_PUBLIC_STUDIO_ADDRESS || '',
  hours: process.env.NEXT_PUBLIC_STUDIO_HOURS || '',
  socials: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
    behance: process.env.NEXT_PUBLIC_BEHANCE_URL || '',
  },
} as const

export function whatsappUrl(message: string): string {
  if (!site.whatsappNumber) return '/contact#contact-form'
  const base = `https://wa.me/${site.whatsappNumber}`
  return `${base}?text=${encodeURIComponent(message)}`
}

export const defaultQuoteMessage = `Hi ${site.name}! I'd like a quote for a print & branding project.`
