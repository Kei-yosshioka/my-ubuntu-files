type MiniBreakdownRowProps = {
  label: string
  value: string
}

export default function MiniBreakdownRow({
  label,
  value,
}: MiniBreakdownRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#6a1f2d]/50 bg-[#16080a] px-3 py-2">
      <span className="text-xs text-[#c9a3ab]">{label}</span>
      <span className="text-sm font-semibold text-[#fff7f8]">{value}</span>
    </div>
  )
}