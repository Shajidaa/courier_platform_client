import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/dist/client/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Platform is live
        </div>
        <h1 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Courier logistics, managed from one place
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          CourierPro gives you full visibility over shipments, hubs, vehicles and payments — built for teams that move fast.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/login">
              Get started <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard">View dashboard</Link>
          </Button>
        </div>
      </section>
  )
}
