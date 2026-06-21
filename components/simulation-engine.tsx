"use client"

import { useMemo, useState } from "react"
import { RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Driver = {
  key: string
  label: string
  metric: string
  min: number
  max: number
  step: number
  baseline: number
  prefix?: string
  suffix?: string
  decimals: number
  signed?: boolean
  weight: number
}

const DRIVERS: Driver[] = [
  { key: "orbis_turn", label: "Corporate Size", metric: "TURN \u00b7 Turnover", min: 0, max: 360, step: 10, baseline: 21.3, prefix: "\u20ac", suffix: "B", decimals: 0, weight: 6 },
  { key: "orbis_roa", label: "Profitability", metric: "ROA \u00b7 Return on Assets", min: -20, max: 40, step: 0.5, baseline: 3.7, suffix: "%", decimals: 1, signed: true, weight: 12 },
  { key: "orbis_gear", label: "Financial Stability", metric: "GEAR \u00b7 Gearing", min: 0, max: 500, step: 5, baseline: 120, suffix: "%", decimals: 0, weight: -10 },
  { key: "orbis_grma", label: "Margin / Profit", metric: "GRMA \u00b7 Gross Margin", min: -10, max: 90, step: 0.5, baseline: 25, suffix: "%", decimals: 1, signed: true, weight: 8 },
  { key: "cp_female_ratio", label: "Board Female Ratio", metric: "Vorstand \u00b7 pgender", min: 0, max: 100, step: 1, baseline: 20, suffix: "%", decimals: 0, weight: 14 },
  { key: "cp_foreign_ratio", label: "Board Foreign Ratio", metric: "Vorstand \u00b7 pnationality", min: 0, max: 100, step: 1, baseline: 29, suffix: "%", decimals: 0, weight: 12 },
  { key: "multi_year_bonus_bt", label: "Long-term Incentive", metric: "LTI share \u00b7 ltigoal", min: 0, max: 100, step: 1, baseline: 0, suffix: "M", decimals: 0, weight: 10 },
]

const DEFAULTS: Record<string, number> = Object.fromEntries(DRIVERS.map((d) => [d.key, d.baseline]))

const BASE_SCORE = 58

function fmt(d: Driver, v: number) {
  const sign = d.signed && v > 0 ? "+" : ""
  const num = v.toLocaleString("en-US", { minimumFractionDigits: d.decimals, maximumFractionDigits: d.decimals })
  return `${d.prefix ?? ""}${sign}${num}${d.suffix ?? ""}`
}

export function SimulationEngine() {
  const [metrics, setMetrics] = useState<Record<string, number>>(DEFAULTS)

  const { transparency, readability } = useMemo(() => {
    const total = DRIVERS.reduce((sum, d) => {
      const value = metrics[d.key] ?? d.baseline
      const clampedValue = Math.min(d.max, Math.max(d.min, value))
      return sum + d.weight * ((clampedValue - d.baseline) / (d.max - d.min))
    }, 0)

    const finalTransparency = Math.min(100, Math.max(0, BASE_SCORE + total))
    const finalReadability = Math.min(100, Math.max(0, BASE_SCORE - total * 0.5))

    return { transparency: finalTransparency, readability: finalReadability }
  }, [metrics])


  const chartSize = 360
  const padding = 34
  const plotSize = chartSize - padding * 2

  const dotX = padding + (readability / 100) * plotSize
  const dotY = padding + ((100 - transparency) / 100) * plotSize

  const handleSliderUpdate = (key: string, val: number[]) => {
    if (val && val.length > 0) {
      setMetrics((prev) => ({ ...prev, [key]: val[0] }))
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-card/60">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60">
          <CardTitle className="text-base">Financial &amp; Governance Metrics</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMetrics(DEFAULTS)}
            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Reset to Baseline
          </Button>
        </CardHeader>
        <CardContent className="space-y-7 pt-6">
          {DRIVERS.map((d) => {
            const currentVal = metrics[d.key] ?? d.baseline;
            const sliderValue = [Math.min(d.max, Math.max(d.min, currentVal))];

            return (
              <div key={d.key} className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{d.label}</p>
                    <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {d.metric}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 font-mono text-sm font-semibold text-primary">
                    {d.prefix && <span>{d.prefix}</span>}
                    <input
                      type="number"
                      value={isNaN(currentVal) ? "" : currentVal}
                      step={d.step}
                      onChange={(e) => {
                        const valStr = e.target.value;
                        if (valStr === "") {
                          setMetrics((prev) => ({ ...prev, [d.key]: 0 }));
                          return;
                        }
                        const n = Number(valStr);
                        if (!Number.isNaN(n)) setMetrics((prev) => ({ ...prev, [d.key]: n }));
                      }}
                      className="w-20 rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-right tabular-nums outline-none focus:border-primary"
                    />
                    {d.suffix && <span>{d.suffix}</span>}
                  </div>
                </div>
                
                <Slider
                  aria-label={d.label}
                  value={Math.min(d.max, Math.max(d.min, metrics[d.key]))}
                  min={d.min}
                  max={d.max}
                  step={d.step}
                  onValueChange={(v) => setMetrics((prev) => ({ ...prev, [d.key]: Array.isArray(v) ? v[0] : v }))}
/>
                
                <div className="relative h-4 text-[10px] text-muted-foreground">
                  <span className="absolute left-0">{fmt(d, d.min)}</span>
                  <span className="absolute right-0 flex items-center gap-0.5">
                    {fmt(d, d.max)}
                    {metrics[d.key] > d.max && <span className="text-amber-400">↗</span>}
                  </span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-card/60">
          <CardContent className="flex flex-col items-center pt-10 pb-9">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Multi-Dimensional ML Analytics
            </p>

            <div className="relative mt-8 grid place-items-center">
              <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`} className="overflow-visible">
                <rect x={padding} y={padding} width={plotSize} height={plotSize} fill="none" stroke="var(--muted-foreground)" strokeWidth="1" strokeOpacity="0.2" />
                <line x1={padding} y1={padding + plotSize / 2} x2={padding + plotSize} y2={padding + plotSize / 2} stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="4" strokeOpacity="0.15" />
                <line x1={padding + plotSize / 2} y1={padding} x2={padding + plotSize / 2} y2={padding + plotSize} stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="4" strokeOpacity="0.15" />

                <text x={padding + plotSize / 2} y={chartSize - 4} fill="var(--muted-foreground)" fontSize="10" fontWeight="bold" textAnchor="middle">Human Readability</text>
                <text x={4} y={padding + plotSize / 2} fill="var(--muted-foreground)" fontSize="10" fontWeight="bold" textAnchor="middle" transform={`rotate(-90, 4, ${padding + plotSize / 2})`}>Machine Transparency</text>

                <text x={padding - 4} y={padding + 4} fill="var(--muted-foreground)" fontSize="9" textAnchor="end">100</text>
                <text x={padding - 4} y={padding + plotSize + 3} fill="var(--muted-foreground)" fontSize="9" textAnchor="end">0</text>
                <text x={padding + plotSize} y={padding + plotSize + 12} fill="var(--muted-foreground)" fontSize="9" textAnchor="middle">100</text>

                <circle
                  cx={dotX}
                  cy={dotY}
                  r="7"
                  fill="#34d399"
                  style={{ filter: "drop-shadow(0 0 8px #34d399)", transition: "cx 0.3s ease, cy 0.3s ease" }}
                />
                <circle cx={dotX} cy={dotY} r="2" fill="#fff" style={{ transition: "cx 0.3s ease, cy 0.3s ease" }} />
              </svg>
            </div>

            <div className="mt-8 flex items-center gap-10 bg-muted/30 px-8 py-5 rounded-xl border border-border/40 font-mono">
              <div className="text-center">
                <span className="block text-xs text-muted-foreground font-sans uppercase font-bold tracking-wider">Transparency (Y)</span>
                <span className="text-4xl font-bold text-foreground">{Math.round(transparency)}</span>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <span className="block text-xs text-muted-foreground font-sans uppercase font-bold tracking-wider">Readability (X)</span>
                <span className="text-4xl font-bold text-blue-400">{Math.round(readability)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SimulationEngine
