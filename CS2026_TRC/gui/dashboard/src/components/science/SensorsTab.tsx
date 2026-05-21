import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Download, Thermometer, Wind, Sun } from "lucide-react"

import { useTelemetryStore, type SensorKey } from "@/store/useTelemetryStore"

// ---------- Sensor group definitions ----------

type SensorGroupKey = "environmental" | "air_quality" | "radiation"

type SensorMeta = {
  key: SensorKey
  label: string
  unit: string
  color: string
  group: SensorGroupKey
}

const SENSORS: SensorMeta[] = [
  { key: "temperature", label: "Air Temperature", unit: "°C",  color: "#f87171", group: "environmental" },
  { key: "humidity",    label: "Humidity",        unit: "%",   color: "#60a5fa", group: "environmental" },
  { key: "pressure",    label: "Pressure",        unit: "hPa", color: "#a78bfa", group: "environmental" },
  { key: "altitude",    label: "Altitude",        unit: "m",   color: "#34d399", group: "environmental" },
  { key: "eco2",        label: "eCO₂",            unit: "ppm", color: "#fbbf24", group: "air_quality" },
  { key: "tvoc",        label: "TVOC",            unit: "ppb", color: "#fb923c", group: "air_quality" },
  { key: "hcho",        label: "HCHO",            unit: "ppb", color: "#f472b6", group: "air_quality" },
  { key: "nh3_ppm",     label: "NH₃",             unit: "ppm", color: "#c084fc", group: "air_quality" },
  { key: "hcn_ppm",     label: "HCN",             unit: "ppm", color: "#e879f9", group: "air_quality" },
  { key: "uv",          label: "UV Intensity",    unit: "mW",  color: "#22d3ee", group: "radiation" },
]

const GROUPS: { key: SensorGroupKey; label: string; icon: React.ReactNode }[] = [
  { key: "environmental", label: "Environmental", icon: <Thermometer className="h-3.5 w-3.5" /> },
  { key: "air_quality",   label: "Air Quality",   icon: <Wind className="h-3.5 w-3.5" /> },
  { key: "radiation",     label: "Radiation",     icon: <Sun className="h-3.5 w-3.5" /> },
]

// ---------- Helpers ----------

function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

// ---------- Individual sensor graph ----------

type SensorGraphProps = {
  meta: SensorMeta
}

function SensorGraph({ meta }: SensorGraphProps) {
  const data = useTelemetryStore((s) => s.science.history[meta.key])
  const current = useTelemetryStore((s) => s.science.current[meta.key])

  const hasData = data.length > 0
  const displayValue =
    current === null ? "—" : `${current.toFixed(2)} ${meta.unit}`

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-[#6a1f2d] bg-[#1a080b] shadow-xl">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#53202b] px-3 py-2">
        <h3 className="text-xs font-semibold text-[#fff3f5]">{meta.label}</h3>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-mono font-semibold"
          style={{ color: meta.color, backgroundColor: `${meta.color}20` }}
        >
          {displayValue}
        </span>
      </div>

      <div className="min-h-0 flex-1 px-2 py-2">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a1820" />
              <XAxis
                dataKey="t"
                stroke="#9f7d85"
                fontSize={10}
                tickFormatter={formatMs}
                tickCount={5}
              />
              <YAxis
                stroke="#9f7d85"
                fontSize={10}
                domain={["auto", "auto"]}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "#1d0a0d",
                  border: "1px solid #53202b",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                labelFormatter={(ms) => `t = ${formatMs(ms as number)}`}
                formatter={(value) => {
                    const num = typeof value === "number" ? value : Number(value)
                    return [`${Number.isFinite(num) ? num.toFixed(2) : "—"} ${meta.unit}`, meta.label]
                    }}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke={meta.color}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#8d6d75]">
            Awaiting mission start
          </div>
        )}
      </div>
    </section>
  )
}

// ---------- Main tab ----------

export default function SensorsTab() {
  const [activeGroup, setActiveGroup] = useState<SensorGroupKey>("environmental")
  const exportCsv = useTelemetryStore((s) => s.exportSensorCsv)
  const missionIsRunning = useTelemetryStore((s) => s.mission.isRunning)
  const missionHasStarted = useTelemetryStore((s) => s.mission.startedAt !== null)

  const sensorsInGroup = SENSORS.filter((s) => s.group === activeGroup)

  // Status line text
  let statusText = "No mission started"
  let statusColor = "text-[#8d6d75]"
  if (missionIsRunning) {
    statusText = "Logging mission data…"
    statusColor = "text-[#34d399]"
  } else if (missionHasStarted) {
    statusText = "Mission paused — displaying recorded data"
    statusColor = "text-[#fbbf24]"
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Group sub-tabs + export */}
      <div className="flex shrink-0 items-center justify-between gap-3 rounded-[18px] border border-[#6a1f2d] bg-[#1a080b] px-3 py-2">
        <div className="flex flex-wrap gap-1.5">
          {GROUPS.map((g) => {
            const isActive = g.key === activeGroup
            return (
              <button
                key={g.key}
                onClick={() => setActiveGroup(g.key)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#8b2740] text-white"
                    : "bg-[#241014] text-[#d4c7ca] hover:bg-[#32161c]"
                }`}
              >
                {g.icon}
                {g.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[11px] ${statusColor}`}>{statusText}</span>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#5a1a26] bg-[#16080a] px-3 py-1.5 text-xs font-semibold text-[#f8edef] transition hover:bg-[#241014]"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Graph grid */}
      <div
        className={`grid min-h-0 flex-1 gap-3 ${
          sensorsInGroup.length <= 2
            ? "grid-cols-1 md:grid-cols-2"
            : sensorsInGroup.length <= 4
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {sensorsInGroup.map((meta) => (
          <SensorGraph key={meta.key} meta={meta} />
        ))}
      </div>
    </div>
  )
}