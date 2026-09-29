import { Reveal } from '@/components/motion/reveal'
import { SectionHeading } from '@/components/site/section-heading'

const steps = [
  { title: 'Choose a product', text: 'Browse the catalogue and pick the options that suit your job.' },
  { title: 'Send it on WhatsApp', text: 'Your selections arrive as a ready-made message — just hit send.' },
  { title: 'Approve your proof', text: 'We share a digital proof and tweak it until it is right.' },
  { title: 'Print & collect', text: 'Produced in our studio and ready for pickup or dispatch.' },
]

export function ProcessSteps() {
  return (
    <section aria-labelledby="process-title" className="bg-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading id="process-title" eyebrow="How it works" title="From idea to print in four steps" />
        <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
          <span aria-hidden="true" className="absolute left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] bg-border md:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal delay={i * 140} className="flex gap-4 md:flex-col">
                <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground ring-4 ring-muted">
                  {i + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-bold text-foreground">{s.title}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{s.text}</span>
                </span>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
