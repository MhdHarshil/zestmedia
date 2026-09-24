import type { Metadata } from 'next'
import { MapPin, Mail, Phone, Clock, MessageCircle } from 'lucide-react'
import { Kicker } from '@/components/section-heading'
import { ContactForm } from '@/components/contact-form'
import { WhatsAppQuoteButton } from '@/components/cta-button'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${site.name}. Get a quote on WhatsApp, call, email or visit the studio.`,
}

const details = [
  { icon: MapPin, label: 'Visit the studio', value: site.address },
  { icon: Phone, label: 'Call us', value: site.phoneDisplay, href: `tel:${site.phoneDisplay.replace(/\s/g, '')}` },
  { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { icon: Clock, label: 'Opening hours', value: site.hours },
]

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Kicker>Contact</Kicker>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-2xl font-serif text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Let&apos;s talk about your project.
            </h1>
            <p className="max-w-sm text-muted-foreground">
              The fastest way to a quote is WhatsApp — send your details and any artwork, and we&apos;ll reply with pricing and timing.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="rounded-3xl border border-border bg-brand p-6 text-brand-foreground md:p-8">
              <MessageCircle className="size-8" />
              <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight">Get a quote on WhatsApp</h2>
              <p className="mt-2 max-w-sm text-sm opacity-90">
                Chat directly with the studio. No account, no online payment — just a quick, honest quote.
              </p>
              <div className="mt-6">
                <WhatsAppQuoteButton
                  variant="ink"
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                />
              </div>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="rounded-2xl border border-border bg-card p-5">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <d.icon className="size-4 text-brand" />
                    {d.label}
                  </dt>
                  <dd className="mt-2 font-medium">
                    {d.href ? (
                      <a href={d.href} className="transition-colors hover:text-brand">{d.value}</a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  )
}
