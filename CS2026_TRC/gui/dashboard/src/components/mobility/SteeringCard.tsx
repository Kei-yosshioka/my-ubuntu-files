import type { WheelAngles } from "@/lib/telemetry"
import wheelsImage from "@/assets/wheel.png"

type SteeringCardProps = {
  wheelAngles: WheelAngles
}

const wheels = [
  { key: "fl" as const, label: "Front Left" },
  { key: "fr" as const, label: "Front Right" },
  { key: "rl" as const, label: "Rear Left" },
  { key: "rr" as const, label: "Rear Right" },
]

export default function SteeringCard({ wheelAngles }: SteeringCardProps) {
  return (
    <section className="min-h-0 overflow-hidden rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] shadow-xl">
      <div className="border-b border-[#53202b] bg-[#1d0a0d] px-3 py-1.5 text-center text-lg font-semibold tracking-tight text-[#f4f4f4]">
        STR
      </div>

      <div className="grid h-[calc(100%-38px)] grid-cols-2 gap-2 p-2">
        {wheels.map((wheel) => {
          const angle = wheelAngles[wheel.key]

          return (
            <div key={wheel.key} className="rounded-2xl bg-[#140608] p-2">
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-12 items-center justify-center">
                  <div className="flex h-12 items-center justify-center">
                    <img
                        src={wheelsImage}
                        alt="wheel"
                        className="h-10 w-10 object-contain transition-transform duration-75 ease-out"
                        style={{
                        transform: angle === null ? "rotate(0deg)" : `rotate(${angle}deg)`,
                        opacity: angle === null ? 0.6 : 1,
                        }}
                    />
                    </div>

                    <div className="text-[10px] text-[#d4c7ca]">
                    {angle === null ? "N/A" : `${Math.round(angle)}°`}
                    </div>
                </div>

                <div className="text-center text-xs leading-tight text-[#f4f4f4]">
                  {wheel.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}