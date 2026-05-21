import { useEffect, useRef, useState } from "react"
import { startWhepPlayback, stopWhepPlayback } from "@/lib/whep"

type VideoTileProps = {
  path: string
  baseUrl: string
  enabled: boolean
  title: string
}

export default function VideoTile({
  path,
  baseUrl,
  enabled,
  title,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "error">("idle")
  const [errorText, setErrorText] = useState<string>("")
  const retryTimerRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    let session: Awaited<ReturnType<typeof startWhepPlayback>> | null = null

    async function connect() {
      if (!enabled || !videoRef.current) return

      setStatus("connecting")
      setErrorText("")

      try {
        session = await startWhepPlayback(videoRef.current, path, baseUrl)
        if (cancelled) {
          await stopWhepPlayback(session)
          return
        }
        setStatus("live")
      } catch (err) {
        if (cancelled) return
        setStatus("error")
        setErrorText(err instanceof Error ? err.message : "Failed to connect")
        retryTimerRef.current = window.setTimeout(connect, 3000)
      }
    }

    if (enabled) {
      connect()
    } else {
      setStatus("idle")
    }

    return () => {
      cancelled = true
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current)
      }
      stopWhepPlayback(session)
    }
  }, [path, baseUrl, enabled])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-dashed border-[#7a2d3d] bg-[#090203]">
      <video
        ref={videoRef}
        className={`h-full w-full object-cover ${enabled ? "block" : "hidden"}`}
      />

      {!enabled && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-[#8d6d75]">
          Camera disabled
        </div>
      )}

      {enabled && status !== "live" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#090203]/80 text-center text-sm text-[#d7b2ba]">
          <div>{status === "connecting" ? `Connecting to ${title}...` : "No signal"}</div>
          {errorText && <div className="mt-1 text-xs text-[#b78f98]">{errorText}</div>}
        </div>
      )}
    </div>
  )
}