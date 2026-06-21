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
    "id": "adidas",
    "name": "Adidas AG",
    "sector": "Consumer Discretionary",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 33, "ai": 37.3, "human": 23.9, "change": 0.0 },
      "2023": { "rank": 32, "ai": 37.5, "human": 25.0, "change": 0.2 },
      "2024": { "rank": 30, "ai": 43.1, "human": 30.2, "change": 5.6 }
    }
  },
  {
    "id": "airbus",
    "name": "Airbus SE",
    "sector": "Industrials",
    "region": "FR",
    "yearlyData": {
      "2022": { "rank": 1, "ai": 81.3, "human": 41.5, "change": 0.0 },
      "2023": { "rank": 1, "ai": 83.1, "human": 44.9, "change": 1.8 },
      "2024": { "rank": 2, "ai": 82.3, "human": 44.9, "change": -0.8 }
    }
  },
  {
    "id": "allianz",
    "name": "Allianz SE",
    "sector": "Financials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 14, "ai": 63.8, "human": 47.9, "change": 0.0 },
      "2023": { "rank": 7, "ai": 73.0, "human": 55.0, "change": 9.2 },
      "2024": { "rank": 5, "ai": 77.2, "human": 57.0, "change": 4.2 }
    }
  },
  {
    "id": "basf",
    "name": "BASF SE",
    "sector": "Materials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 3, "ai": 79.4, "human": 43.0, "change": 0.0 },
      "2023": { "rank": 3, "ai": 79.6, "human": 44.9, "change": 0.2 },
      "2024": { "rank": 4, "ai": 79.7, "human": 45.4, "change": 0.1 }
    }
  },
  {
    "id": "bayer",
    "name": "Bayer AG",
    "sector": "Health Care",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 2, "ai": 79.7, "human": 42.0, "change": 0.0 },
      "2023": { "rank": 2, "ai": 80.4, "human": 42.9, "change": 0.7 },
      "2024": { "rank": 3, "ai": 80.5, "human": 43.4, "change": 0.1 }
    }
  },
  {
    "id": "bmw",
    "name": "Bayerische Motoren Werke AG",
    "sector": "Consumer Discretionary",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 20, "ai": 52.8, "human": 33.1, "change": 0.0 },
      "2023": { "rank": 19, "ai": 53.6, "human": 33.9, "change": 0.8 },
      "2024": { "rank": 19, "ai": 55.4, "human": 36.4, "change": 1.8 }
    }
  },
  {
    "id": "brenntag",
    "name": "Brenntag SE",
    "sector": "Industrials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 28, "ai": 45.3, "human": 33.0, "change": 0.0 },
      "2023": { "rank": 28, "ai": 45.2, "human": 31.0, "change": -0.1 },
      "2024": { "rank": 26, "ai": 47.9, "human": 34.2, "change": 2.7 }
    }
  },
  {
    "id": "commerzbank",
    "name": "Commerzbank AG",
    "sector": "Financials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 15, "ai": 60.1, "human": 38.0, "change": 0.0 },
      "2023": { "rank": 14, "ai": 62.4, "human": 41.2, "change": 2.3 },
      "2024": { "rank": 14, "ai": 63.8, "human": 43.0, "change": 1.4 }
    }
  },
  {
    "id": "continental",
    "name": "Continental AG",
    "sector": "Consumer Discretionary",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 13, "ai": 64.9, "human": 41.2, "change": 0.0 },
      "2023": { "rank": 11, "ai": 66.8, "human": 42.4, "change": 1.9 },
      "2024": { "rank": 12, "ai": 67.2, "human": 43.1, "change": 0.4 }
    }
  },
  {
    "id": "covestro",
    "name": "Covestro AG",
    "sector": "Materials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 5, "ai": 73.1, "human": 48.0, "change": 0.0 },
      "2023": { "rank": 4, "ai": 74.9, "human": 49.1, "change": 1.8 },
      "2024": { "rank": 6, "ai": 75.1, "human": 49.9, "change": 0.2 }
    }
  },
  {
    "id": "daimler_truck",
    "name": "Daimler Truck Holding AG",
    "sector": "Industrials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 17, "ai": 56.4, "human": 36.4, "change": 0.0 },
      "2023": { "rank": 17, "ai": 57.2, "human": 37.0, "change": 0.8 },
      "2024": { "rank": 17, "ai": 59.3, "human": 39.4, "change": 2.1 }
    }
  },
  {
    "id": "deutsche_bank",
    "name": "Deutsche Bank AG",
    "sector": "Financials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 8, "ai": 68.3, "human": 44.0, "change": 0.0 },
      "2023": { "rank": 9, "ai": 68.7, "human": 45.1, "change": 0.4 },
      "2024": { "rank": 10, "ai": 69.1, "human": 46.2, "change": 0.4 }
    }
  },
  {
    "id": "deutsche_boerse",
    "name": "Deutsche Börse AG",
    "sector": "Financials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 31, "ai": 39.8, "human": 25.1, "change": 0.0 },
      "2023": { "rank": 31, "ai": 41.2, "human": 26.4, "change": 1.4 },
      "2024": { "rank": 32, "ai": 41.4, "human": 27.2, "change": 0.2 }
    }
  },
  {
    "id": "deutsche_post",
    "name": "Deutsche Post AG",
    "sector": "Industrials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 6, "ai": 72.4, "human": 45.4, "change": 0.0 },
      "2023": { "rank": 5, "ai": 74.3, "human": 47.9, "change": 1.9 },
      "2024": { "rank": 7, "ai": 74.4, "human": 48.0, "change": 0.1 }
    }
  },
  {
    "id": "deutsche_telekom",
    "name": "Deutsche Telekom AG",
    "sector": "Telecommunication Services",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 10, "ai": 67.4, "human": 42.1, "change": 0.0 },
      "2023": { "rank": 10, "ai": 68.1, "human": 43.0, "change": 0.7 },
      "2024": { "rank": 9, "ai": 71.3, "human": 46.2, "change": 3.2 }
    }
  },
  {
    "id": "eon",
    "name": "E.ON SE",
    "sector": "Utilities",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 4, "ai": 76.3, "human": 46.0, "change": 0.0 },
      "2023": { "rank": 6, "ai": 74.2, "human": 44.1, "change": -2.1 },
      "2024": { "rank": 8, "ai": 74.1, "human": 44.0, "change": -0.1 }
    }
  },
  {
    "id": "fresenius",
    "name": "Fresenius SE & Co. KGaA",
    "sector": "Health Care",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 26, "ai": 47.3, "human": 29.1, "change": 0.0 },
      "2023": { "rank": 26, "ai": 48.1, "human": 30.2, "change": 0.8 },
      "2024": { "rank": 27, "ai": 47.9, "human": 31.0, "change": -0.2 }
    }
  },
  {
    "id": "fresenius_medical",
    "name": "Fresenius Medical Care AG",
    "sector": "Health Care",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 23, "ai": 49.8, "human": 31.2, "change": 0.0 },
      "2023": { "rank": 23, "ai": 50.4, "human": 32.0, "change": 0.6 },
      "2024": { "rank": 23, "ai": 51.2, "human": 33.1, "change": 0.8 }
    }
  },
  {
    "id": "hannover_rueck",
    "name": "Hannover Rück SE",
    "sector": "Financials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 34, "ai": 36.4, "human": 22.0, "change": 0.0 },
      "2023": { "rank": 33, "ai": 37.1, "human": 23.1, "change": 0.7 },
      "2024": { "rank": 34, "ai": 37.3, "human": 24.0, "change": 0.2 }
    }
  },
  {
    "id": "heidelberg_materials",
    "name": "Heidelberg Materials AG",
    "sector": "Materials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 19, "ai": 54.2, "human": 34.0, "change": 0.0 },
      "2023": { "rank": 20, "ai": 53.1, "human": 32.9, "change": -1.1 },
      "2024": { "rank": 20, "ai": 54.3, "human": 34.1, "change": 1.2 }
    }
  },
  {
    "id": "henkel",
    "name": "Henkel AG & Co. KGaA",
    "sector": "Consumer Staples",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 24, "ai": 48.9, "human": 30.2, "change": 0.0 },
      "2023": { "rank": 24, "ai": 49.3, "human": 31.0, "change": 0.4 },
      "2024": { "rank": 24, "ai": 49.4, "human": 31.4, "change": 0.1 }
    }
  },
  {
    "id": "infineon",
    "name": "Infineon Technologies AG",
    "sector": "Information Technology",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 11, "ai": 66.8, "human": 41.2, "change": 0.0 },
      "2023": { "rank": 12, "ai": 65.4, "human": 39.4, "change": -1.4 },
      "2024": { "rank": 11, "ai": 67.3, "human": 42.0, "change": 1.9 }
    }
  },
  {
    "id": "merck",
    "name": "Merck KGaA",
    "sector": "Health Care",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 21, "ai": 51.3, "human": 33.0, "change": 0.0 },
      "2023": { "rank": 21, "ai": 51.4, "human": 33.4, "change": 0.1 },
      "2024": { "rank": 21, "ai": 52.3, "human": 34.9, "change": 0.9 }
    }
  },
  {
    "id": "mstd",
    "name": "MTU Aero Engines AG",
    "sector": "Industrials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 32, "ai": 38.4, "human": 24.1, "change": 0.0 },
      "2023": { "rank": 34, "ai": 36.9, "human": 22.0, "change": -1.5 },
      "2024": { "rank": 33, "ai": 38.1, "human": 24.9, "change": 1.2 }
    }
  },
  {
    "id": "muenchener_rueck",
    "name": "Münchener Rückversicherungs-Gesellschaft AG",
    "sector": "Financials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 27, "ai": 46.1, "human": 28.0, "change": 0.0 },
      "2023": { "rank": 27, "ai": 46.4, "human": 28.9, "change": 0.3 },
      "2024": { "rank": 28, "ai": 46.9, "human": 29.4, "change": 0.5 }
    }
  },
  {
    "id": "porsche",
    "name": "Dr. Ing. h.c. F. Porsche AG",
    "sector": "Consumer Discretionary",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 29, "ai": 43.1, "human": 28.1, "change": 0.0 },
      "2023": { "rank": 29, "ai": 43.9, "human": 29.4, "change": 0.8 },
      "2024": { "rank": 29, "ai": 44.2, "human": 30.1, "change": 0.3 }
    }
  },
  {
    "id": "qiagen",
    "name": "Qiagen N.V.",
    "sector": "Health Care",
    "region": "NL",
    "yearlyData": {
      "2022": { "rank": 35, "ai": 31.2, "human": 19.4, "change": 0.0 },
      "2023": { "rank": 35, "ai": 32.4, "human": 20.1, "change": 1.2 },
      "2024": { "rank": 35, "ai": 32.7, "human": 21.0, "change": 0.3 }
    }
  },
  {
    "id": "rwe",
    "name": "RWE AG",
    "sector": "Utilities",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 16, "ai": 59.4, "human": 37.1, "change": 0.0 },
      "2023": { "rank": 16, "ai": 60.1, "human": 38.2, "change": 0.7 },
      "2024": { "rank": 16, "ai": 60.4, "human": 38.9, "change": 0.3 }
    }
  },
  {
    "id": "sap",
    "name": "SAP SE",
    "sector": "Information Technology",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 7, "ai": 69.4, "human": 45.1, "change": 0.0 },
      "2023": { "rank": 8, "ai": 69.3, "human": 45.0, "change": -0.1 },
      "2024": { "rank": 1, "ai": 83.4, "human": 60.1, "change": 14.1 }
    }
  },
  {
    "id": "sartorius",
    "name": "Sartorius AG",
    "sector": "Health Care",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 36, "ai": 29.4, "human": 18.0, "change": 0.0 },
      "2023": { "rank": 36, "ai": 29.1, "human": 17.4, "change": -0.3 },
      "2024": { "rank": 36, "ai": 31.2, "human": 19.4, "change": 2.1 }
    }
  },
  {
    "id": "siemens",
    "name": "Siemens AG",
    "sector": "Industrials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 9, "ai": 68.1, "human": 43.1, "change": 0.0 },
      "2023": { "rank": 13, "ai": 64.2, "human": 38.0, "change": -3.9 },
      "2024": { "rank": 13, "ai": 65.4, "human": 40.2, "change": 1.2 }
    }
  },
  {
    "id": "siemens_energy",
    "name": "Siemens Energy AG",
    "sector": "Industrials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 12, "ai": 65.3, "human": 41.0, "change": 0.0 },
      "2023": { "rank": 15, "ai": 61.2, "human": 37.4, "change": -4.1 },
      "2024": { "rank": 15, "ai": 61.3, "human": 38.0, "change": 0.1 }
    }
  },
  {
    "id": "siemens_healthineers",
    "name": "Siemens Healthineers AG",
    "sector": "Health Care",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 22, "ai": 50.1, "human": 31.4, "change": 0.0 },
      "2023": { "rank": 22, "ai": 50.9, "human": 32.5, "change": 0.8 },
      "2024": { "rank": 22, "ai": 51.4, "human": 33.0, "change": 0.5 }
    }
  },
  {
    "id": "symrise",
    "name": "Symrise AG",
    "sector": "Materials",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 30, "ai": 41.2, "human": 26.0, "change": 0.0 },
      "2023": { "rank": 30, "ai": 42.1, "human": 27.2, "change": 0.9 },
      "2024": { "rank": 31, "ai": 42.3, "human": 28.0, "change": 0.2 }
    }
  },
  {
    "id": "volkswagen",
    "name": "Volkswagen AG",
    "sector": "Consumer Discretionary",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 18, "ai": 55.3, "human": 35.0, "change": 0.0 },
      "2023": { "rank": 18, "ai": 56.4, "human": 36.1, "change": 1.1 },
      "2024": { "rank": 18, "ai": 57.2, "human": 37.5, "change": 0.8 }
    }
  },
  {
    "id": "vonovia",
    "name": "Vonovia SE",
    "sector": "Real Estate",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 25, "ai": 48.1, "human": 29.4, "change": 0.0 },
      "2023": { "rank": 25, "ai": 48.4, "human": 30.1, "change": 0.3 },
      "2024": { "rank": 25, "ai": 48.9, "human": 30.9, "change": 0.5 }
    }
  },
  {
    "id": "zalando",
    "name": "Zalando SE",
    "sector": "Consumer Discretionary",
    "region": "DE",
    "yearlyData": {
      "2022": { "rank": 22, "ai": 50.1, "human": 31.4, "change": 0.0 },
      "2023": { "rank": 22, "ai": 50.9, "human": 32.5, "change": 0.8 },
      "2024": { "rank": 22, "ai": 51.4, "human": 33.0, "change": 0.5 }
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
              <th className="p-4 pl-6">Rank &amp; Company</th>
              <th className="p-4 text-right">Scores <span className="text-xs font-normal">(AI, Human)</span></th>
              <th className="p-4 pr-6 text-right">Readability Gap</th>
            </tr>
          </thead>
          <tbody>
            {sortedCompanies.map((company) => {
              const data = company.yearlyData[selectedYear]
              const gap = data.ai - data.human
              const isPositive = gap >= 0
              const widthPct = Math.min(100, Math.abs(gap) * 8)

              return (
                <tr key={company.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs font-bold text-foreground">
                        {data.rank}
                      </span>
                      <div className="leading-tight">
                        <p className="font-medium text-foreground">{company.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {company.sector} &middot; {company.region}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span className="flex items-center gap-1.5 font-mono text-foreground">
                        <Cpu className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        {data.ai.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-muted-foreground">
                        <User className="size-3.5" aria-hidden="true" />
                        {data.human.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="relative flex h-2 w-24 items-center rounded-full bg-muted">
                        <div className="absolute left-1/2 top-0 z-0 h-full w-px -translate-x-1/2 bg-border" />

                        {!isPositive && (
                          <div className="z-10 flex w-1/2 justify-end pr-[2px]">
                            <div className="h-2 rounded-full bg-negative" style={{ width: `${widthPct}%` }} />
                          </div>
                        )}
                        {isPositive && <div className="w-1/2" />}

                        {isPositive && (
                          <div className="z-10 flex w-1/2 justify-start pl-[2px]">
                            <div className="h-2 rounded-full bg-positive" style={{ width: `${widthPct}%` }} />
                          </div>
                        )}
                        {!isPositive && <div className="w-1/2" />}
                      </div>

                      <span
                        className={cn(
                          "w-12 text-right font-mono text-xs font-bold",
                          gap > 0 ? "text-positive" : gap < 0 ? "text-negative" : "text-muted-foreground",
                        )}
                      >
                        {gap > 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1)} pt
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
