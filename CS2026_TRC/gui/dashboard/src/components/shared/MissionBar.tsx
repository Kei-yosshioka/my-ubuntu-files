import { useEffect, useRef, useState } from "react"
import { Play, RotateCcw, Square } from "lucide-react"

type MissionBarProps = {
  rtspHealthy: boolean | null
}

export default function MissionBar({ rtspHealthy }: MissionBarProps) {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const startedAtRef = useRef<number | null>(null)
  const accumulatedRef = useRef(0)

  useEffect(() => {
    if (!isRunning) return

    const interval = window.setInterval(() => {
      const now = Date.now()
      const startedAt = startedAtRef.current ?? now
      setElapsedMs(accumulatedRef.current + (now - startedAt))
    }, 200)

    return () => window.clearInterval(interval)
  }, [isRunning])

  const handleStart = () => {
    if (isRunning) return
    startedAtRef.current = Date.now()
    setIsRunning(true)
  }

  const handleStop = () => {
    if (!isRunning) return
    const now = Date.now()
    const startedAt = startedAtRef.current ?? now
    accumulatedRef.current += now - startedAt
    setElapsedMs(accumulatedRef.current)
    startedAtRef.current = null
    setIsRunning(false)
  }

  const handleReset = () => {
    startedAtRef.current = isRunning ? Date.now() : null
    accumulatedRef.current = 0
    setElapsedMs(0)
  }

  const statusText =
    rtspHealthy === null ? "N/A" : rtspHealthy ? "Healthy" : "Down"

  const dotClass =
    rtspHealthy === null
      ? "bg-slate-500"
      : rtspHealthy
      ? "bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.75)]"
      : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.75)]"

  return (
    <footer className="shrink-0">
      <div className="w-[860px] rounded-[22px] border border-[#6a1f2d] bg-[#1d0a0d] px-4 py-2.5 shadow-2xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#c9a3ab]">
                Mission Time
              </p>

              <div className="flex items-center gap-2 rounded-full border border-[#5a1a26] bg-[#16080a] px-2.5 py-1">
                <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
                <span className="text-[11px] text-[#d8bcc1]">
                  RTSP {statusText}
                </span>
              </div>
            </div>

            <div className="mt-1 font-mono text-4xl font-bold tracking-tight text-[#fff7f8] md:text-5xl">
              {formatElapsed(elapsedMs)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#8b2740] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#a22f4b] disabled:cursor-not-allowed disabled:bg-[#4a1b25] disabled:text-[#cfb0b8]"
            >
              <Play className="h-3.5 w-3.5" />
              Start
            </button>

            <button
              onClick={handleStop}
              disabled={!isRunning}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#3a252a] px-3.5 py-2 text-xs font-semibold text-[#f8edef] transition hover:bg-[#4a2c32] disabled:cursor-not-allowed disabled:bg-[#2a1d20] disabled:text-[#9f868c]"
            >
              <Square className="h-3.5 w-3.5" />
              Stop
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#6a1f2d] bg-[#16080a] px-3.5 py-2 text-xs font-semibold text-[#f8edef] transition hover:bg-[#241014]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function formatElapsed(elapsedMs: number) {
  const totalSeconds = Math.floor(elapsedMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":")
}