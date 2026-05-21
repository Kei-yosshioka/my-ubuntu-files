type DashboardHeaderProps = {
  rtspHealthy: boolean | null
}

export default function DashboardHeader({ rtspHealthy }: DashboardHeaderProps) {
  const statusText =
    rtspHealthy === null ? "N/A" : rtspHealthy ? "Healthy" : "Disconnected"

  const dotClass =
    rtspHealthy === null
      ? "bg-slate-500"
      : rtspHealthy
      ? "bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
      : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.75)]"

  return (
    <header className="shrink-0 rounded-[28px] border border-[#6a1f2d] bg-[#1d0a0d] px-5 py-3 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f8edef] md:text-3xl">
            Karura Dashboard
          </h1>
          <p className="text-sm text-[#c9a3ab]">Multi-camera operator view</p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#5a1a26] bg-[#16080a] px-4 py-2">
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${dotClass}`} />
            <span className="text-sm font-medium text-[#ecd2d8]">RTSP Link</span>
          </div>
          <span className="text-sm text-[#c9a3ab]">{statusText}</span>
        </div>
      </div>
    </header>
  )
}