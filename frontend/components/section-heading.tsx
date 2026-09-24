import { cn } from '@/lib/utils'

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand', className)}>
      <span className="inline-block h-px w-6 bg-brand" />
      {children}
    </span>
  )
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  className,
}: {
  kicker?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.05]">
        {title}
      </h2>
      {description && (
        <p className={cn('max-w-xl text-muted-foreground', align === 'center' && 'mx-auto')}>{description}</p>
      )}
    </div>
  )
}
