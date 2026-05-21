import VideoTile from "@/components/shared/VideoTile"

type ScienceCameraPanelProps = {
  title: string
  path: string
  baseUrl: string
  enabled: boolean
  onToggle: () => void
  className?: string
  videoClassName?: string
}

export default function ScienceCameraPanel({
  title,
  path,
  baseUrl,
  enabled,
  onToggle,
  className = "",
  videoClassName = "",
}: ScienceCameraPanelProps) {
  return (
    <section
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] shadow-2xl ${className}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#53202b] px-3 py-2">
        <h2 className="text-sm font-semibold leading-tight text-[#fff3f5]">
          {title}
        </h2>

        <div className="rounded-full bg-[#7b2940] px-2.5 py-1 text-[10px] font-medium text-[#ffe7ed]">
          {enabled ? "On" : "Off"}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 bg-[#120406] p-2">
        <div
          className={`h-full w-full overflow-hidden rounded-[18px] border border-[#5a2f38] bg-black ${videoClassName}`}
        >
          {enabled ? (
            <VideoTile
              path={path}
              baseUrl={baseUrl}
              enabled={enabled}
              title={title}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0e0506] text-sm text-[#8d6d75]">
              Camera disabled
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          className={`absolute bottom-4 right-4 rounded-2xl px-3 py-1.5 text-xs font-semibold shadow-lg transition ${
            enabled
              ? "bg-[#8b2740] text-white hover:bg-[#a22f4b]"
              : "bg-[#342226] text-[#f3d9df] hover:bg-[#433034]"
          }`}
        >
          {enabled ? "Turn Off" : "Turn On"}
        </button>
      </div>
    </section>
  )
}