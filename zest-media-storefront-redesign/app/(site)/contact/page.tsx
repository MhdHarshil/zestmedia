import type { Metadata } from 'next'
import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react'
import { ContactQuoteBuilder } from '@/components/contact/contact-quote-builder'
import { Reveal } from '@/components/motion/reveal'
import { PageHero } from '@/components/site/page-hero'
import { getCategories } from '@/lib/api'
import { siteConfig } from '@/lib/site-config'
import { whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get a print quote from Zest Media on WhatsApp or by email.',
}

const steps = [
  'Tell us what you need using the form — it builds a WhatsApp message for you.',
  'We reply with options, a price and a turnaround time.',
  'Approve your digital proof and we start printing.',
]

export default async function ContactPage() {
  const { data: categories } = await getCategories()
  const details = [
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with our team', href: whatsappUrl('Hi Zest Media!') },
    { icon: Mail, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: Clock, label: 'Studio hours', value: siteConfig.hours },
    { icon: MapPin, label: 'Studio', value: siteConfig.address },
  ]

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's get your project printed"
        description="The fastest way to a quote is WhatsApp. Fill in the details below and we'll take it from there."
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
        <div className="flex flex-col gap-8">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {details.map((d, i) => {
              const content = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <d.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d.label}</span>
                    <span className="font-semibold text-foreground">{d.value}</span>
                  </span>
                </>
              )
              return (
                <li key={d.label}>
                  <Reveal delay={i * 80}>
                    {d.href ? (
                      <a
                        href={d.href}
                        target={d.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">{content}</div>
                    )}
                  </Reveal>
                </li>
              )
            })}
          </ul>

          <Reveal className="rounded-3xl bg-teal-deep p-6 text-cream">
            <h2 className="text-lg font-bold">How quoting works</h2>
            <ol className="mt-4 flex flex-col gap-4">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm leading-relaxed text-cream/80">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal variant="right">
          <ContactQuoteBuilder categories={categories} />
        </Reveal>
      </div>
    </>
  )
}
