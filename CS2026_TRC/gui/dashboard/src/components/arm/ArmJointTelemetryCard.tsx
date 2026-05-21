type ArmJointTelemetryCardProps = {
  label: string
  value: string | number
}

export default function ArmJointTelemetryCard({
  label,
  value,
}: ArmJointTelemetryCardProps) {
  return (
    <div className="rounded-[18px] border border-[#5a2f38] bg-[#120406] px-4 py-3 shadow-md">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b78f98]">
        Motor Current Value
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="text-base font-semibold text-[#fff3f5]">{label}</div>
        <div className="text-lg font-bold text-[#ffe7ed]">{value}</div>
      </div>
    </div>
  )
}