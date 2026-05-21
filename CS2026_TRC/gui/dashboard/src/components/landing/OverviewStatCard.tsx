import type { ReactNode } from "react"

type OverviewStatCardProps = {
  title: string
  value: string
  subtext: string
  icon: ReactNode
  children?: ReactNode
  centerContent?: boolean
}

export default function OverviewStatCard({
  title,
  value,
  subtext,
  icon,
  children,
  centerContent = false,
}: OverviewStatCardProps) {
  const hasBreakdown = Boolean(children)

  return (
    <div className="flex h-full min-h-[210px] flex-col rounded-[24px] border border-[#f8edef]/12 bg-[#1a0d11]/95 p-5 shadow-2xl backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#c9a3ab]">
          {title}
        </p>

        <div className="rounded-full border border-[#6a1f2d] bg-[#16080a] p-2 text-[#f2a7b8]">
          {icon}
        </div>
      </div>

      <div
        className={`flex flex-1 ${
          centerContent && !hasBreakdown
            ? "items-center justify-center"
            : "flex-col"
        }`}
      >
        <div className={centerContent && !hasBreakdown ? "text-center" : ""}>
          <div className="text-3xl font-bold tracking-tight text-[#fff7f8]">
            {value}
          </div>

          <p className="mt-2 text-sm text-[#f8edef]/60">{subtext}</p>
        </div>
      </div>

      {hasBreakdown && <div className="mt-4 flex flex-col gap-2">{children}</div>}
    </div>
  )
}