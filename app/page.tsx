import { BarChart3, Sparkles } from "lucide-react"
import { CorporateLeaderboard } from "@/components/corporate-leaderboard"
import { SimulationEngine } from "@/components/simulation-engine"
import { SiteHeader } from "@/components/site-header"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <header className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
            <BarChart3 className="size-5" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Transparency Analytics</h1>
            <p className="text-sm text-muted-foreground text-pretty">
              Corporate governance &amp; disclosure scoring powered by ML
            </p>
          </div>
        </header>

        <section aria-labelledby="simulation-heading">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-4" />
              <span id="simulation-heading" className="text-xs font-semibold uppercase tracking-[0.22em]">
                What-if Simulation Engine
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>
          <SimulationEngine />
        </section>
      </div>
    </main>
  )
}
