"use client"

import { useState } from "react"
import { Cpu, User } from "lucide-react"
import { cn } from "@/lib/utils"

type ScoreData = { ai: number; human: number; change: number; rank: number }
type Company = {
  id: string
  name: string
  sector: string
  region: string
  yearlyData: Record<number, ScoreData>
}

const COMPANIES: Company[] = [
  {
    id: "northwind", name: "Northwind Capital", sector: "Financials", region: "EU",
    yearlyData: {
      2024: { rank: 1, ai: 94, human: 91, change: 1.8 },
      2023: { rank: 2, ai: 91, human: 89, change: 2.1 },
      2022: { rank: 3, ai: 85, human: 85, change: 0.0 }
    }
  },
  {
    id: "helios", name: "Helios Energy Group", sector: "Utilities", region: "US",
    yearlyData: {
      2024: { rank: 2, ai: 90, human: 88, change: 0.6 },
      2023: { rank: 1, ai: 92, human: 85, change: -1.2 },
      2022: { rank: 1, ai: 90, human: 80, change: 0.0 }
    }
  },
  {
    id: "meridian", name: "Meridian Pharma", sector: "Healthcare", region: "UK",
    yearlyData: {
      2024: { rank: 3, ai: 85, human: 90, change: -0.9 },
      2023: { rank: 3, ai: 86, human: 88, change: 1.5 },
      2022: { rank: 4, ai: 82, human: 80, change: 0.0 }
    }
  },
  {
    id: "aster", name: "Aster Industrial", sector: "Industrials", region: "JP",
    yearlyData: {
      2024: { rank: 4, ai: 88, human: 80, change: 2.3 },
      2023: { rank: 5, ai: 82, human: 75, change: 4.1 },
      2022: { rank: 6, ai: 75, human: 70, change: 0.0 }
    }
  },
  {
    id: "vanta", name: "Vanta Technologies", sector: "Technology", region: "US",
    yearlyData: {
      2024: { rank: 5, ai: 86, human: 79, change: 0.0 },
      2023: { rank: 4, ai: 86, human: 79, change: -2.0 },
      2022: { rank: 2, ai: 88, human: 85, change: 0.0 }
    }
  },
  {
    id: "brightline", name: "Brightline Retail", sector: "Consumer", region: "EU",
    yearlyData: {
      2024: { rank: 6, ai: 80, human: 77, change: -1.4 },
      2023: { rank: 6, ai: 81, human: 80, change: 0.5 },
      2022: { rank: 5, ai: 80, human: 80, change: 0.0 }
    }
  }
]

export function CorporateLeaderboard() {
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const years = [2022, 2023, 2024]

  const sortedCompanies = [...COMPANIES].sort((a, b) =>
    a.yearlyData[selectedYear].rank - b.yearlyData[selectedYear].rank
  )

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Transparency Leaderboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Multi-dimensional scoring: Machine Readability vs. Human Readability.</p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg w-fit">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                selectedYear === year
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground font-medium">
              <th className="p-4 pl-6">Rank & Company</th>
              <th className="p-4 text-right">Scores <span className="text-xs font-normal">(AI, Human)</span></th>
              <th className="p-4 pr-6 text-right">Readability Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y text-muted-foreground">
            {sortedCompanies.map((company) => {
              const data = company.yearlyData[selectedYear]
              const gap = data.ai - data.human
              const isPositive = gap >= 0
              const widthPct = Math.min(100, (Math.abs(gap) / 20) * 100)

              return (
                <tr key={company.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-foreground w-4">{data.rank}</span>
                      <div>
                        <div className="font-semibold text-foreground">{company.name}</div>
                        <div className="text-xs text-muted-foreground">{company.sector} · {company.region}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 font-mono text-base">
                      <span className="font-bold text-foreground">({data.ai}, {data.human})</span>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-xs mt-1">
                      <span className="flex items-center gap-1 text-primary"><Cpu className="size-3" /> AI</span>
                      <span className="flex items-center gap-1 text-blue-600"><User className="size-3" /> Human</span>
                    </div>
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="relative flex h-2 w-24 bg-muted rounded-full items-center">
                        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-neutral-700/50 z-0" />
                        
                        {!isPositive && (
                          <div className="flex w-1/2 justify-end pr-[2px] z-10">
                            <div 
                              className="h-2 bg-red-500 rounded-full" 
                              style={{ width: `${widthPct}%` }}
                            />
                          </div>
                        )}
                        {isPositive && <div className="w-1/2" />}


                        {isPositive && (
                          <div className="flex w-1/2 justify-start pl-[2px] z-10">
                            <div 
                              className="h-2 bg-green-500 rounded-full" 
                              style={{ width: `${widthPct}%` }}
                            />
                          </div>
                        )}
                        {!isPositive && <div className="w-1/2" />}
                      </div>

                      <span className={cn(
                        "font-mono text-xs font-bold w-12 text-right",
                        gap > 0 ? "text-green-500" : gap < 0 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {gap > 0 ? `+${gap}` : gap} pt
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CorporateLeaderboard