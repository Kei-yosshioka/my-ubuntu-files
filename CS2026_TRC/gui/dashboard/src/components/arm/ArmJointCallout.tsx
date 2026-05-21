import ArmStatusLed from "@/components/arm/ArmStatusLed"

type ArmJointCalloutProps = {
  label: string
  position: string
  rpm: string
  temp: string
  canOnline: boolean
  x: string
  y: string
  align?: "left" | "right"
  lineAngle?: number
  lineLength?: number
}

export default function ArmJointCallout({
  label,
  position,
  rpm,
  temp,
  canOnline,
  x,
  y,
  align = "left",
  lineAngle = 0,
  lineLength = 56,
}: ArmJointCalloutProps) {
  const isLeft = align === "left"

  return (
    <div
      className="absolute z-30"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className={`relative flex items-center gap-3 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        <div className="relative flex items-center justify-center shrink-0">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#d9485f] shadow-[0_0_16px_rgba(217,72,95,0.7)]" />
          <span className="absolute h-7 w-7 rounded-full border border-[#d9485f]/40" />
        </div>

        <div
          className={`group relative min-w-[160px] max-w-[240px] rounded-2xl border border-[#6a1f2d] bg-[#1a080b]/95 px-3 py-2 shadow-2xl backdrop-blur transition-all duration-200 hover:scale-[1.02] ${
            isLeft ? "origin-left" : "origin-right"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b78f98]">
                Joint
              </div>
              <div className="text-sm font-bold text-[#fff3f5]">{label}</div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b78f98]">
                Position
              </div>
              <div className="text-sm font-bold text-[#ffe7ed]">{position}</div>
            </div>
          </div>

          <div className="mt-0 max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:mt-3 group-hover:max-h-48 group-hover:opacity-100">
            <div className="grid grid-cols-2 gap-2 text-xs text-[#f3d9df]">
              <div className="rounded-xl bg-[#120406] px-2.5 py-2">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#b78f98]">
                  RPM
                </div>
                <div className="mt-1 font-semibold">{rpm}</div>
              </div>

              <div className="rounded-xl bg-[#120406] px-2.5 py-2">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#b78f98]">
                  Temp
                </div>
                <div className="mt-1 font-semibold">{temp}</div>
              </div>

              <div className="col-span-2 rounded-xl bg-[#120406] px-2.5 py-2">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#b78f98]">
                  CAN Status
                </div>
                <div className="mt-1">
                  <ArmStatusLed online={canOnline} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute top-1/2 z-0"
          style={{
            left: isLeft ? "14px" : undefined,
            right: isLeft ? undefined : "14px",
            width: `${lineLength}px`,
            height: "2px",
            background: "rgba(217,72,95,0.85)",
            transformOrigin: isLeft ? "left center" : "right center",
            transform: `translateY(-50%) rotate(${isLeft ? lineAngle : -lineAngle}deg)`,
            boxShadow: "0 0 10px rgba(217,72,95,0.45)",
          }}
        />
      </div>
    </div>
  )
}