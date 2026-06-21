"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/reports", label: "Reports" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="size-4.5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Clarity</p>
            <p className="text-xs text-muted-foreground">Transparency Intelligence</p>
          </div>
        </div>
        <nav className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1 text-sm">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3.5 py-1.5 font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
