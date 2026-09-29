import { Eye, MessageCircle, PenTool, Printer } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const icons = { pen: PenTool, eye: Eye, printer: Printer, message: MessageCircle }

export function BenefitsStrip({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-lg shadow-teal-deep/5 lg:grid-cols-4',
        className,
      )}
    >
      {siteConfig.benefits.map((b, i) => {
        const Icon = icons[b.icon]
        return (
          <li key={b.title} className="bg-card">
            <Reveal delay={i * 90} className="flex h-full items-start gap-3 p-4 md:p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-foreground">{b.title}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">{b.text}</span>
              </span>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}
