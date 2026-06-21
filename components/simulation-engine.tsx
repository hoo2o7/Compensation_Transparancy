"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowDownRight, ArrowUpRight, Loader2, RotateCcw, WifiOff } from "lucide-react"
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
}

// Keys MUST match the model's FEATURES (see backend/main.py).
const DRIVERS: Driver[] = [
  { key: "orbis_turn", label: "Corporate Size", metric: "TURN \u00b7 Turnover", min: 0, max: 360, step: 10, baseline: 21.3, prefix: "\u20ac", suffix: "B", decimals: 0 },
  { key: "orbis_roa", label: "Profitability", metric: "ROA \u00b7 Return on Assets", min: -20, max: 40, step: 0.5, baseline: 3.7, suffix: "%", decimals: 1, signed: true },
  { key: "orbis_gear", label: "Financial Stability", metric: "GEAR \u00b7 Gearing", min: 0, max: 500, step: 5, baseline: 120, suffix: "%", decimals: 0 },
  { key: "orbis_grma", label: "Margin / Profit", metric: "GRMA \u00b7 Gross Margin", min: -10, max: 90, step: 0.5, baseline: 25, suffix: "%", decimals: 1, signed: true },
  { key: "cp_female_ratio", label: "Board Female Ratio", metric: "Vorstand \u00b7 pgender", min: 0, max: 100, step: 1, baseline: 20, suffix: "%", decimals: 0 },
  { key: "cp_foreign_ratio", label: "Board Foreign Ratio", metric: "Vorstand \u00b7 pnationality", min: 0, max: 100, step: 1, baseline: 29, suffix: "%", decimals: 0 },
  { key: "salary_bt", label: "Executive Salary", metric: "salary_bt \u00b7 before tax", min: 0, max: 30, step: 0.5, baseline: 5, prefix: "\u20ac", suffix: "M", decimals: 1 },
]

const DEFAULTS: Record<string, number> = Object.fromEntries(DRIVERS.map((d) => [d.key, d.baseline]))
const DRIVER_BY_KEY: Record<string, Driver> = Object.fromEntries(DRIVERS.map((d) => [d.key, d]))

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const BASE_SCORE = 58

type Contribution = { key: string; transparency: number; readability: number }
type ExplainResponse = {
  transparency: number
  readability: number
  transparency_raw: number
  readability_raw: number
  contributions: Contribution[]
}

function fmt(d: Driver, v: number) {
  const sign = d.signed && v > 0 ? "+" : ""
  const num = v.toLocaleString("en-US", { minimumFractionDigits: d.decimals, maximumFractionDigits: d.decimals })
  return `${d.prefix ?? ""}${sign}${num}${d.suffix ?? ""}`
}

function band(score: number) {
  if (score >= 70) return { label: "Strong", stroke: "#34d399", text: "text-emerald-400", bg: "bg-emerald-400/10" }
  if (score >= 45) return { label: "Moderate", stroke: "#fbbf24", text: "text-amber-400", bg: "bg-amber-400/10" }
  return { label: "At Risk", stroke: "#f87171", text: "text-red-400", bg: "bg-red-400/10" }
}

export function SimulationEngine() {
  const [metrics, setMetrics] = useState<Record<string, number>>(DEFAULTS)
  const [result, setResult] = useState<ExplainResponse | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")

  const abortRef = useRef<AbortController | null>(null)

  // Debounced call to the ML backend whenever any metric changes.
  useEffect(() => {
    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setStatus("loading")

      try {
        const res = await fetch(`${API_URL}/explain`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features: metrics, baseline: DEFAULTS }),
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: ExplainResponse = await res.json()
        setResult(data)
        setStatus("ok")
      } catch (err) {
        if ((err as Error).name !== "AbortError") setStatus("error")
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [metrics])

  const transparency = result?.transparency ?? BASE_SCORE
  const readability = result?.readability ?? BASE_SCORE

  const contributions = useMemo(() => {
    const list = result?.contributions ?? []
    return list
      .map((c) => ({
        ...c,
        label: DRIVER_BY_KEY[c.key]?.label ?? c.key,
        shap: c.transparency,
      }))
      .sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap))
  }, [result])

  const maxAbs = Math.max(...contributions.map((c) => Math.abs(c.shap)), 0.001)
  const tone = band(transparency)

  const chartSize = 220
  const padding = 25
  const plotSize = chartSize - padding * 2

  const dotX = padding + (readability / 100) * plotSize
  const dotY = padding + ((100 - transparency) / 100) * plotSize

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
            const currentVal = metrics[d.key] ?? d.baseline

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
                        const valStr = e.target.value
                        if (valStr === "") {
                          setMetrics((prev) => ({ ...prev, [d.key]: 0 }))
                          return
                        }
                        const n = Number(valStr)
                        if (!Number.isNaN(n)) setMetrics((prev) => ({ ...prev, [d.key]: n }))
                      }}
                      className="w-20 rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-right tabular-nums outline-none focus:border-primary"
                    />
                    {d.suffix && <span>{d.suffix}</span>}
                  </div>
                </div>

                <Slider
                  aria-label={d.label}
                  value={Math.min(d.max, Math.max(d.min, currentVal))}
                  min={d.min}
                  max={d.max}
                  step={d.step}
                  onValueChange={(v) => setMetrics((prev) => ({ ...prev, [d.key]: Array.isArray(v) ? v[0] : v }))}
                />

                <div className="relative h-4 text-[10px] text-muted-foreground">
                  <span className="absolute left-0">{fmt(d, d.min)}</span>
                  <span className="absolute right-0 flex items-center gap-0.5">
                    {fmt(d, d.max)}
                    {currentVal > d.max && <span className="text-amber-400">↗</span>}
                  </span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-card/60">
          <CardContent className="flex flex-col items-center pt-8 pb-7">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Multi-Dimensional ML Analytics
              </p>
              {status === "loading" && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
              {status === "error" && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400" title={`Cannot reach ${API_URL}`}>
                  <WifiOff className="size-3" />
                  API offline
                </span>
              )}
            </div>

            <div className="relative mt-6 grid place-items-center">
              <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`} className="overflow-visible">
                <rect x={padding} y={padding} width={plotSize} height={plotSize} fill="none" stroke="var(--muted-foreground)" strokeWidth="1" strokeOpacity="0.2" />
                <line x1={padding} y1={padding + plotSize / 2} x2={padding + plotSize} y2={padding + plotSize / 2} stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="4" strokeOpacity="0.15" />
                <line x1={padding + plotSize / 2} y1={padding} x2={padding + plotSize / 2} y2={padding + plotSize} stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="4" strokeOpacity="0.15" />

                <text x={padding + plotSize / 2} y={chartSize - 4} fill="var(--muted-foreground)" fontSize="10" fontWeight="bold" textAnchor="middle">Readability</text>
                <text x={4} y={padding + plotSize / 2} fill="var(--muted-foreground)" fontSize="10" fontWeight="bold" textAnchor="middle" transform={`rotate(-90, 4, ${padding + plotSize / 2})`}>AI accuracy</text>

                <text x={padding - 4} y={padding + 4} fill="var(--muted-foreground)" fontSize="9" textAnchor="end">100</text>
                <text x={padding - 4} y={padding + plotSize + 3} fill="var(--muted-foreground)" fontSize="9" textAnchor="end">0</text>
                <text x={padding + plotSize} y={padding + plotSize + 12} fill="var(--muted-foreground)" fontSize="9" textAnchor="middle">100</text>

                <circle
                  cx={dotX}
                  cy={dotY}
                  r="7"
                  fill={tone.stroke}
                  style={{ filter: `drop-shadow(0 0 8px ${tone.stroke})`, transition: "cx 0.3s ease, cy 0.3s ease" }}
                />
                <circle cx={dotX} cy={dotY} r="2" fill="#fff" style={{ transition: "cx 0.3s ease, cy 0.3s ease" }} />
              </svg>
            </div>

            <div className="mt-6 flex items-center gap-6 bg-muted/30 px-5 py-3 rounded-xl border border-border/40 font-mono">
              <div className="text-center">
                <span className="block text-[10px] text-muted-foreground font-sans uppercase font-bold tracking-wider">AI accuracy (Y)</span>
                <span className="text-2xl font-bold text-foreground">{Math.round(transparency)}</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <span className="block text-[10px] text-muted-foreground font-sans uppercase font-bold tracking-wider">Readability (X)</span>
                <span className="text-2xl font-bold text-blue-400">{Math.round(readability)}</span>
              </div>
            </div>

            <Badge variant="secondary" className={cn("mt-4 px-3 py-1 text-sm font-semibold", tone.bg, tone.text)}>
              Status: {tone.label}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60">
            <CardTitle className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              SHAP Contribution Breakdown
            </CardTitle>
            <span className="text-[11px] text-muted-foreground">vs. baseline &middot; AI accuracy</span>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-5">
            {contributions.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                {status === "error"
                  ? "Backend unreachable \u2014 start the FastAPI server on port 8000."
                  : "Adjust a metric to see model contributions."}
              </p>
            )}
            {contributions.map((c) => {
              const positive = c.shap >= 0
              const halfPct = (Math.abs(c.shap) / maxAbs) * 50
              return (
                <div key={c.key} className="flex items-center gap-3 text-sm">
                  <span className="w-32 shrink-0 truncate text-right text-muted-foreground" title={c.label}>
                    {c.label}
                  </span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-lg border border-border/60 bg-muted/30">
                    <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
                    <div
                      className={cn("absolute top-1/2 h-3.5 -translate-y-1/2 rounded-sm", positive ? "bg-emerald-400/80" : "bg-red-400/80")}
                      style={positive ? { left: "50%", width: `${halfPct}%` } : { right: "50%", width: `${halfPct}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "flex w-20 shrink-0 items-center justify-end gap-0.5 font-mono text-xs font-semibold tabular-nums",
                      positive ? "text-emerald-400" : "text-red-400",
                    )}
                  >
                    {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                    {positive ? "+" : ""}
                    {c.shap.toFixed(1)} pts
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SimulationEngine
