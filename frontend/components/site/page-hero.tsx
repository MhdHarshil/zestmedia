import type { ReactNode } from 'react'

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-cream text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-4 py-12 md:px-6 md:py-16">
        <p className="animate-rise text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1
          className="animate-rise max-w-3xl text-balance text-3xl font-extrabold tracking-tight md:text-5xl"
          style={{ animationDelay: '80ms' }}
        >
          {title}
        </h1>
        {description ? (
          <p className="animate-rise max-w-2xl text-pretty leading-relaxed text-muted-foreground" style={{ animationDelay: '160ms' }}>
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  )
}
