export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '')
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/[^\d]/g, '')

export const siteConfig = {
  name: 'Zest Media',
  tagline: 'Print & branding studio',
  email: 'hello@zestmedia.studio',
  address: 'Visit our studio — address shared on WhatsApp',
  hours: 'Mon – Sat, 10:00 – 19:00',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/work', label: 'Our work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  benefits: [
    { icon: 'pen', title: 'Design support', text: 'Artwork help from our in-house team' },
    { icon: 'eye', title: 'Proof before print', text: 'Approve a digital proof first' },
    { icon: 'printer', title: 'In-house production', text: 'Printed and finished in our studio' },
    { icon: 'message', title: 'Quote on WhatsApp', text: 'Fast replies, no sign-up needed' },
  ],
  promos: [
    {
      eyebrow: 'Brand starter',
      title: 'Visiting cards & stationery that feel premium',
      text: 'Thick stocks, spot UV and matching letterheads for a consistent first impression.',
      categorySlug: 'visiting-cards',
      image: '/images/visiting-cards.png',
      tone: 'teal',
    },
    {
      eyebrow: 'Packaging',
      title: 'Boxes and bags your customers keep',
      text: 'Custom mailers, product boxes and paper bags printed to your brand colours.',
      categorySlug: 'packaging',
      image: '/images/packaging.png',
      tone: 'orange',
    },
  ],
} as const
