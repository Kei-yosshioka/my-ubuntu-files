import VideoTile from "@/components/shared/VideoTile"

type CameraPanelProps = {
  title: string
  path: string
  baseUrl: string
  enabled: boolean
  onToggle: () => void
}

export default function CameraPanel({
  title,
  path,
  baseUrl,
  enabled,
  onToggle,
}: CameraPanelProps) {
  return (
    <section className="min-h-0 overflow-hidden rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] shadow-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-[#53202b] px-3 py-2">
        <h2 className="text-sm font-semibold leading-tight text-[#fff3f5]">
          {title}
        </h2>

        <div className="rounded-full bg-[#7b2940] px-2.5 py-1 text-[10px] font-medium text-[#ffe7ed]">
          {enabled ? "On" : "Off"}
        </div>
      </div>

      <div className="relative flex h-[calc(100%-44px)] min-h-0 items-center justify-center bg-[#120406] p-2">
        {enabled ? (
          <div className="h-full w-full overflow-hidden rounded-[18px] border border-[#5a2f38] bg-black">
            <VideoTile
              path={path}
              baseUrl={baseUrl}
              enabled={enabled}
              title={title}
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-[18px] border border-dashed border-[#5a2f38] bg-[#0e0506] text-sm text-[#8d6d75]">
            Camera disabled
          </div>
        )}

        <button
          onClick={onToggle}
          className={`absolute bottom-3 right-3 rounded-2xl px-3 py-1.5 text-xs font-semibold shadow-lg transition ${
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