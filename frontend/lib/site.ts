export const site = {
  name: 'Zest Media',
  shortName: 'Zest',
  tagline: 'Print & Branding Studio',
  description:
    'A creative print and branding studio for local businesses, students, event organizers and individuals. Visiting cards, banners, apparel, stickers, posters, brochures, invitations and full brand identities.',
  // Number in international format, digits only, for wa.me links.
  whatsappNumber: '15551234567',
  phoneDisplay: '+1 (555) 123-4567',
  email: 'hello@inklinestudio.com',
  address: '24 Press Lane, Arts District',
  hours: 'Mon–Sat · 9:00am – 7:00pm',
  socials: {
    instagram: 'https://instagram.com',
    behance: 'https://behance.net',
  },
} as const

export function whatsappUrl(message: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`
  return `${base}?text=${encodeURIComponent(message)}`
}

export const defaultQuoteMessage = `Hi ${site.name}! I'd like a quote for a print & branding project.`
