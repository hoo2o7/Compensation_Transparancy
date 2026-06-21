"use client"

import { useState } from "react"
import { Cpu, User } from "lucide-react"
import { cn } from "@/lib/utils"

type ScoreData = { transparency: number; readability: number; change: number; rank: number }
type Company = {
  id: string
  name: string
  sector: string
  region: string
  yearlyData: Record<number, ScoreData>
}

const COMPANIES: Company[] = [
  {
    id: "continental", name: "Continental", sector: "DAX", region: "Niedersachsen",
    yearlyData: {
      2022: { rank: 27, transparency: 17, readability: 53, change: 0.0 },
      2023: { rank: 20, transparency: 12, readability: 53, change: -5 },
      2024: { rank: 1, transparency: 93, readability: 44, change: 81 }
    }
  },
  {
    id: "porsche", name: "Porsche", sector: "DAX", region: "Baden-Wuerttemberg",
    yearlyData: {
      2022: { rank: 1, transparency: 100, readability: 68, change: 0.0 }
    }
  },
  {
    id: "deutsche-bank", name: "Deutsche Bank", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 19, transparency: 34, readability: 79, change: 0.0 },
      2023: { rank: 33, transparency: 7, readability: 78, change: -27 },
      2024: { rank: 2, transparency: 82, readability: 65, change: 75 }
    }
  },
  {
    id: "deutsche-post", name: "Deutsche Post", sector: "DAX", region: "Nordrhein-Westfalen",
    yearlyData: {
      2022: { rank: 33, transparency: 7, readability: 65, change: 0.0 },
      2023: { rank: 7, transparency: 52, readability: 67, change: 45 },
      2024: { rank: 3, transparency: 77, readability: 64, change: 25 }
    }
  },
  {
    id: "merck", name: "Merck", sector: "DAX", region: "Hessen",
    yearlyData: {
      2022: { rank: 18, transparency: 36, readability: 85, change: 0.0 },
      2023: { rank: 28, transparency: 10, readability: 87, change: -26 },
      2024: { rank: 4, transparency: 68, readability: 89, change: 58 }
    }
  },
  {
    id: "volkswagen", name: "Volkswagen", sector: "DAX", region: "Niedersachsen",
    yearlyData: {
      2022: { rank: 34, transparency: 5, readability: 47, change: 0.0 },
      2023: { rank: 3, transparency: 67, readability: 46, change: 62 },
      2024: { rank: 5, transparency: 67, readability: 48, change: 0 }
    }
  },
  {
    id: "sartorius", name: "Sartorius", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 10, transparency: 52, readability: 70, change: 0.0 },
      2023: { rank: 4, transparency: 64, readability: 75, change: 12 },
      2024: { rank: 6, transparency: 64, readability: 74, change: 0 }
    }
  },
  {
    id: "vonovia", name: "Vonovia", sector: "DAX", region: "Nordrhein-Westfalen",
    yearlyData: {
      2022: { rank: 5, transparency: 81, readability: 63, change: 0.0 },
      2023: { rank: 10, transparency: 39, readability: 66, change: -42 },
      2024: { rank: 7, transparency: 63, readability: 50, change: 24 }
    }
  },
  {
    id: "fresenius", name: "Fresenius", sector: "DAX", region: "Hessen",
    yearlyData: {
      2022: { rank: 25, transparency: 22, readability: 64, change: 0.0 },
      2023: { rank: 15, transparency: 25, readability: 61, change: 3 },
      2024: { rank: 8, transparency: 62, readability: 62, change: 37 }
    }
  },
  {
    id: "mtu", name: "MTU", sector: "DAX", region: "Bayern",
    yearlyData: {
      2022: { rank: 23, transparency: 24, readability: 42, change: 0.0 },
      2023: { rank: 16, transparency: 23, readability: 43, change: -1 },
      2024: { rank: 9, transparency: 54, readability: 29, change: 31 }
    }
  },
  {
    id: "adidas", name: "Adidas", sector: "DAX", region: "Bayern",
    yearlyData: {
      2022: { rank: 36, transparency: 3, readability: 83, change: 0.0 },
      2023: { rank: 8, transparency: 42, readability: 72, change: 39 },
      2024: { rank: 10, transparency: 53, readability: 62, change: 11 }
    }
  },
  {
    id: "siemens", name: "Siemens", sector: "DAX", region: "Berlin",
    yearlyData: {
      2022: { rank: 28, transparency: 16, readability: 70, change: 0.0 },
      2023: { rank: 12, transparency: 38, readability: 71, change: 22 },
      2024: { rank: 11, transparency: 50, readability: 68, change: 12 }
    }
  },
  {
    id: "commerzbank", name: "Commerzbank", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 11, transparency: 51, readability: 70, change: 0.0 },
      2023: { rank: 22, transparency: 11, readability: 62, change: -40 },
      2024: { rank: 12, transparency: 45, readability: 68, change: 34 }
    }
  },
  {
    id: "bayer", name: "Bayer", sector: "DAX", region: "Nordrhein-Westfalen",
    yearlyData: {
      2022: { rank: 17, transparency: 37, readability: 65, change: 0.0 },
      2023: { rank: 30, transparency: 8, readability: 65, change: -29 },
      2024: { rank: 13, transparency: 43, readability: 69, change: 35 }
    }
  },
  {
    id: "siemens-healthineers", name: "Siemens Healthineers", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 15, transparency: 39, readability: 69, change: 0.0 },
      2023: { rank: 2, transparency: 79, readability: 69, change: 40 },
      2024: { rank: 14, transparency: 42, readability: 66, change: -37 }
    }
  },
  {
    id: "airbus", name: "Airbus", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 4, transparency: 81, readability: 82, change: 0.0 },
      2023: { rank: 1, transparency: 79, readability: 80, change: -2 },
      2024: { rank: 15, transparency: 41, readability: 76, change: -38 }
    }
  },
  {
    id: "heidelberg-materials", name: "Heidelberg Materials", sector: "DAX", region: "Baden-Wuerttemberg",
    yearlyData: {
      2023: { rank: 29, transparency: 10, readability: 60, change: 0.0 },
      2024: { rank: 16, transparency: 37, readability: 59, change: 27 }
    }
  },
  {
    id: "rheinmetall", name: "Rheinmetall", sector: "DAX", region: "Nordrhein-Westfalen",
    yearlyData: {
      2022: { rank: 32, transparency: 10, readability: 57, change: 0.0 },
      2023: { rank: 5, transparency: 60, readability: 55, change: 50 },
      2024: { rank: 17, transparency: 34, readability: 54, change: -26 }
    }
  },
  {
    id: "zalando", name: "Zalando", sector: "DAX", region: "Berlin",
    yearlyData: {
      2022: { rank: 35, transparency: 4, readability: 65, change: 0.0 },
      2023: { rank: 38, transparency: 0, readability: 31, change: -4 },
      2024: { rank: 18, transparency: 34, readability: 45, change: 34 }
    }
  },
  {
    id: "basf", name: "BASF", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 7, transparency: 69, readability: 57, change: 0.0 },
      2023: { rank: 24, transparency: 10, readability: 53, change: -59 },
      2024: { rank: 19, transparency: 32, readability: 52, change: 22 }
    }
  },
  {
    id: "qiagen", name: "Qiagen", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 26, transparency: 20, readability: 91, change: 0.0 },
      2023: { rank: 17, transparency: 23, readability: 88, change: 3 },
      2024: { rank: 20, transparency: 25, readability: 87, change: 2 }
    }
  },
  {
    id: "rwe", name: "RWE", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 38, transparency: 0, readability: 88, change: 0.0 },
      2023: { rank: 35, transparency: 6, readability: 100, change: 6 },
      2024: { rank: 21, transparency: 24, readability: 87, change: 18 }
    }
  },
  {
    id: "henkel", name: "Henkel", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 31, transparency: 10, readability: 52, change: 0.0 },
      2023: { rank: 19, transparency: 20, readability: 40, change: 10 },
      2024: { rank: 22, transparency: 16, readability: 37, change: -4 }
    }
  },
  {
    id: "brenntag", name: "Brenntag", sector: "DAX", region: "Nordrhein-Westfalen",
    yearlyData: {
      2022: { rank: 30, transparency: 12, readability: 52, change: 0.0 },
      2023: { rank: 34, transparency: 6, readability: 67, change: -6 },
      2024: { rank: 23, transparency: 14, readability: 64, change: 8 }
    }
  },
  {
    id: "infineon", name: "Infineon", sector: "DAX", region: "Bayern",
    yearlyData: {
      2022: { rank: 12, transparency: 42, readability: 51, change: 0.0 },
      2023: { rank: 27, transparency: 10, readability: 51, change: -32 },
      2024: { rank: 24, transparency: 14, readability: 50, change: 4 }
    }
  },
  {
    id: "bmw", name: "BMW", sector: "DAX", region: "Bayern",
    yearlyData: {
      2022: { rank: 9, transparency: 58, readability: 64, change: 0.0 },
      2023: { rank: 36, transparency: 2, readability: 69, change: -56 },
      2024: { rank: 25, transparency: 12, readability: 72, change: 10 }
    }
  },
  {
    id: "covestro", name: "Covestro", sector: "DAX", region: "Nordrhein-Westfalen",
    yearlyData: {
      2022: { rank: 24, transparency: 22, readability: 72, change: 0.0 },
      2023: { rank: 25, transparency: 10, readability: 76, change: -12 }
    }
  },
  {
    id: "sap", name: "SAP", sector: "DAX", region: "Baden-Wuerttemberg",
    yearlyData: {
      2022: { rank: 14, transparency: 40, readability: 36, change: 0.0 },
      2023: { rank: 11, transparency: 38, readability: 39, change: -2 },
      2024: { rank: 26, transparency: 12, readability: 39, change: -26 }
    }
  },
  {
    id: "symrise", name: "Symrise", sector: "DAX", region: "Niedersachsen",
    yearlyData: {
      2022: { rank: 8, transparency: 69, readability: 69, change: 0.0 },
      2023: { rank: 18, transparency: 22, readability: 69, change: -47 },
      2024: { rank: 27, transparency: 12, readability: 75, change: -10 }
    }
  },
  {
    id: "deutsche-telekom", name: "Deutsche Telekom", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 13, transparency: 41, readability: 66, change: 0.0 },
      2023: { rank: 9, transparency: 42, readability: 68, change: 1 },
      2024: { rank: 28, transparency: 11, readability: 69, change: -31 }
    }
  },
  {
    id: "mercedes-benz", name: "Mercedes-Benz", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 2, transparency: 98, readability: 67, change: 0.0 },
      2023: { rank: 21, transparency: 12, readability: 68, change: -86 },
      2024: { rank: 29, transparency: 11, readability: 68, change: -1 }
    }
  },
  {
    id: "siemens-energy", name: "Siemens Energy", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 29, transparency: 14, readability: 83, change: 0.0 },
      2023: { rank: 6, transparency: 59, readability: 81, change: 45 },
      2024: { rank: 30, transparency: 11, readability: 86, change: -48 }
    }
  },
  {
    id: "daimler-truck", name: "Daimler Truck", sector: "DAX", region: "Bremen",
    yearlyData: {
      2022: { rank: 37, transparency: 2, readability: 66, change: 0.0 },
      2023: { rank: 31, transparency: 8, readability: 66, change: 6 },
      2024: { rank: 31, transparency: 10, readability: 74, change: 2 }
    }
  },
  {
    id: "allianz", name: "Allianz", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 3, transparency: 85, readability: 85, change: 0.0 },
      2023: { rank: 23, transparency: 10, readability: 84, change: -75 },
      2024: { rank: 32, transparency: 9, readability: 83, change: -1 }
    }
  },
  {
    id: "munich-re", name: "Munich RE", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 16, transparency: 38, readability: 63, change: 0.0 },
      2023: { rank: 32, transparency: 8, readability: 58, change: -30 },
      2024: { rank: 33, transparency: 9, readability: 59, change: 1 }
    }
  },
  {
    id: "hannover-r-ck", name: "Hannover R\u00fcck", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 6, transparency: 74, readability: 51, change: 0.0 },
      2023: { rank: 26, transparency: 10, readability: 46, change: -64 },
      2024: { rank: 34, transparency: 7, readability: 47, change: -3 }
    }
  },
  {
    id: "beiersdorf", name: "Beiersdorf", sector: "DAX", region: "Germany",
    yearlyData: {
      2022: { rank: 20, transparency: 29, readability: 94, change: 0.0 },
      2023: { rank: 13, transparency: 37, readability: 95, change: 8 },
      2024: { rank: 35, transparency: 5, readability: 87, change: -32 }
    }
  },
  {
    id: "deutsche-b-rse", name: "Deutsche B\u00f6rse", sector: "DAX", region: "Hessen",
    yearlyData: {
      2022: { rank: 21, transparency: 29, readability: 64, change: 0.0 },
      2023: { rank: 14, transparency: 36, readability: 59, change: 7 },
      2024: { rank: 36, transparency: 0, readability: 55, change: -36 }
    }
  },
  {
    id: "e-on", name: "E.ON", sector: "DAX", region: "Nordrhein-Westfalen",
    yearlyData: {
      2022: { rank: 22, transparency: 28, readability: 88, change: 0.0 },
      2023: { rank: 37, transparency: 0, readability: 87, change: -28 }
    }
  },
  {
    id: "fresenius-medical-care", name: "Fresenius Medical Care", sector: "DAX", region: "Germany",
    yearlyData: {
      2024: { rank: 37, transparency: 0, readability: 67, change: 0.0 }
    }
  }
]

// Reused from the dashboard simulation engine — color band by AI accuracy score.
function band(score: number) {
  if (score >= 70) return { stroke: "#34d399", text: "text-emerald-400" }
  if (score >= 45) return { stroke: "#fbbf24", text: "text-amber-400" }
  return { stroke: "#f87171", text: "text-red-400" }
}

export function CorporateLeaderboard() {
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const years = [2022, 2023, 2024]

  const sortedCompanies = COMPANIES
    .filter((c) => c.yearlyData[selectedYear])
    .sort((a, b) => a.yearlyData[selectedYear].rank - b.yearlyData[selectedYear].rank)

  // Chart geometry (X = AI accuracy, Y = Readability), reusing dashboard asset.
  const chartSize = 380
  const padding = 34
  const plotSize = chartSize - padding * 2

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Transparency Leaderboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Multi-dimensional scoring: AI accuracy vs. Readability.</p>
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

      {/* Desktop: graph left + list right. Mobile: stacked (graph on top). */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT — 2D scatter (X = AI accuracy, Y = Readability) */}
        <div className="flex items-center justify-center border-b p-6 lg:border-b-0 lg:border-r">
          <svg
            width="100%"
            viewBox={`0 0 ${chartSize} ${chartSize}`}
            className="max-w-[420px] overflow-visible"
          >
            <rect x={padding} y={padding} width={plotSize} height={plotSize} fill="none" stroke="var(--muted-foreground)" strokeWidth="1" strokeOpacity="0.2" />
            <line x1={padding} y1={padding + plotSize / 2} x2={padding + plotSize} y2={padding + plotSize / 2} stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="4" strokeOpacity="0.15" />
            <line x1={padding + plotSize / 2} y1={padding} x2={padding + plotSize / 2} y2={padding + plotSize} stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="4" strokeOpacity="0.15" />

            <text x={padding + plotSize / 2} y={chartSize - 6} fill="var(--muted-foreground)" fontSize="11" fontWeight="bold" textAnchor="middle">AI accuracy</text>
            <text x={12} y={padding + plotSize / 2} fill="var(--muted-foreground)" fontSize="11" fontWeight="bold" textAnchor="middle" transform={`rotate(-90, 12, ${padding + plotSize / 2})`}>Readability</text>

            <text x={padding} y={padding + plotSize + 14} fill="var(--muted-foreground)" fontSize="9" textAnchor="middle">0</text>
            <text x={padding + plotSize} y={padding + plotSize + 14} fill="var(--muted-foreground)" fontSize="9" textAnchor="middle">100</text>
            <text x={padding - 6} y={padding + plotSize + 3} fill="var(--muted-foreground)" fontSize="9" textAnchor="end">0</text>
            <text x={padding - 6} y={padding + 4} fill="var(--muted-foreground)" fontSize="9" textAnchor="end">100</text>

            {sortedCompanies.map((company) => {
              const data = company.yearlyData[selectedYear]
              const cx = padding + (data.transparency / 100) * plotSize
              const cy = padding + ((100 - data.readability) / 100) * plotSize
              const tone = band(data.transparency)
              const isHovered = hoveredId === company.id
              const dimmed = hoveredId !== null && !isHovered

              return (
                <g
                  key={company.id}
                  onMouseEnter={() => setHoveredId(company.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
                  opacity={dimmed ? 0.25 : 1}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 8 : 5}
                    fill={tone.stroke}
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 8px ${tone.stroke})` : "none",
                      transition: "r 0.15s ease",
                    }}
                  />
                  {isHovered && (
                    <text x={cx} y={cy - 12} fill="var(--foreground)" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {company.name}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* RIGHT — interactive company list */}
        <div className="overflow-x-auto lg:max-h-[440px] lg:overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="border-b bg-muted/50 text-muted-foreground font-medium">
                <th className="p-3 pl-5">Rank & Company</th>
                <th className="p-3 text-right">
                  <span className="flex items-center justify-end gap-1"><Cpu className="size-3" /> AI accuracy</span>
                </th>
                <th className="p-3 pr-5 text-right">
                  <span className="flex items-center justify-end gap-1"><User className="size-3" /> Readability</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y text-muted-foreground">
              {sortedCompanies.map((company) => {
                const data = company.yearlyData[selectedYear]
                const isHovered = hoveredId === company.id

                return (
                  <tr
                    key={company.id}
                    onMouseEnter={() => setHoveredId(company.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={cn(
                      "transition-colors cursor-pointer",
                      isHovered ? "bg-primary/10" : "hover:bg-muted/30",
                    )}
                  >
                    <td className="p-3 pl-5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-bold text-foreground w-4">{data.rank}</span>
                        <div>
                          <div className="font-semibold text-foreground">{company.name}</div>
                          <div className="text-xs text-muted-foreground">{company.sector} · {company.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-mono text-base font-bold text-primary">{data.transparency}</span>
                    </td>
                    <td className="p-3 pr-5 text-right">
                      <span className="font-mono text-base font-bold text-blue-600">{data.readability}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CorporateLeaderboard