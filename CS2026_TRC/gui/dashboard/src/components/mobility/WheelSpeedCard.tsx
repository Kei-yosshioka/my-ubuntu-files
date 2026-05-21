import type { WheelSpeeds } from "@/lib/telemetry"

type WheelSpeedCardProps = {
  wheelSpeeds: WheelSpeeds
}

const wheels = [
  { key: "fl" as const, label: "Front Left" },
  { key: "fr" as const, label: "Front Right" },
  { key: "rl" as const, label: "Rear Left" },
  { key: "rr" as const, label: "Rear Right" },
]

const MAX_RPM = 250

export default function WheelSpeedCard({ wheelSpeeds }: WheelSpeedCardProps) {
  return (
    <section className="min-h-0 overflow-hidden rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] shadow-xl">
      <div className="border-b border-[#53202b] bg-[#1d0a0d] px-3 py-1.5 text-center text-lg font-semibold tracking-tight text-[#f4f4f4]">
        Speed
      </div>

      <div className="grid h-[calc(100%-38px)] gap-2 p-2">
        {wheels.map((wheel) => {
          const rpm = wheelSpeeds[wheel.key]
          const width =
            rpm === null ? 0 : Math.max(0, Math.min(100, (rpm / MAX_RPM) * 100))

          return (
            <div key={wheel.key} className="rounded-2xl bg-[#140608] p-2">
              <div className="mb-1 flex items-center justify-between text-[#f4f4f4]">
                <span className="text-[11px]">{wheel.label}</span>
                <span className="text-[11px] text-[#d0d0d0]">
                  {rpm === null ? "N/A" : `${rpm} rpm`}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-[#2e1e22]">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-75"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}