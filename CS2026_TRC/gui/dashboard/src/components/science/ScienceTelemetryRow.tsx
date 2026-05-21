type ScienceTelemetryRowProps = {
  label: string
  value: string
}

export default function ScienceTelemetryRow({
  label,
  value,
}: ScienceTelemetryRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#4f2330] bg-[#130608] px-3 py-2.5 text-sm">
      <span className="text-[#cbaab2]">{label}</span>
      <span className="font-semibold text-[#fff3f5]">{value}</span>
    </div>
  )
}