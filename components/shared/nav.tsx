
import MyContainer from './myContainer'
import { Package } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
export default function Nav() {
  return (
    <MyContainer> {/* Nav */}
      < div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="size-4" />
          </div>
          <span className="font-heading font-semibold text-foreground">CourierPro</span>
        </div>
        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link  href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/login">Get started</Link>
          </Button>
        </nav>
      </div></MyContainer>
  )
}
