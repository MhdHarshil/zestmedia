import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'

interface SectionHeadingProps {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  link?: { href: string; label: string }
}

export function SectionHeading({ id, eyebrow, title, description, link }: SectionHeadingProps) {
  return (
    <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex max-w-2xl flex-col gap-2">
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
        <h2 id={id} className="text-balance text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
        {description ? <p className="text-pretty leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {link ? (
        <Link
          href={link.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary"
        >
          {link.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ) : null}
    </Reveal>
  )
}
