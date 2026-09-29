import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Not found</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">We couldn&apos;t find that product</h1>
      <p className="text-muted-foreground">It may have been renamed or removed from the catalogue.</p>
      <Button className="rounded-full" size="lg" render={<Link href="/products" />} nativeButton={false}>
        Back to all products
      </Button>
    </div>
  )
}
