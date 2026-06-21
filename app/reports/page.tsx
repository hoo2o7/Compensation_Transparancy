import { BarChart3, Sparkles } from "lucide-react"
import { CorporateLeaderboard } from "@/components/corporate-leaderboard"
import { SimulationEngine } from "@/components/simulation-engine"
import { SiteHeader } from "@/components/site-header"

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <section aria-labelledby="leaderboard-heading">
          <h2 id="leaderboard-heading" className="sr-only">Corporate leaderboard</h2>
          <CorporateLeaderboard />
        </section>
      </div>
    </main>
  )
}
