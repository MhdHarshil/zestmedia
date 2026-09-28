import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-2.5', className)} aria-label="Zest Media home">
      <Image
        src="/zest-mark.svg"
        alt=""
        width={52}
        height={34}
        className="h-8 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight">
          <span className="text-[#B0000D]">zest</span>{' '}
          <span className="text-[#F10B1C]">media</span>
        </span>
        <span className={cn('text-[11px] font-medium', inverted ? 'text-cream/70' : 'text-muted-foreground')}>
          Print & branding studio
        </span>
      </span>
    </Link>
  )
}
