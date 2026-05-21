import { useEffect, useState } from "react"
import { AlertTriangle, Camera, Play, RotateCcw, Square } from "lucide-react"
import { useTelemetryStore } from "@/store/useTelemetryStore"

type ScienceMissionBarProps = {
  onCapturePanorama: () => void
  showPanoramaButton?: boolean
  isCapturing?: boolean // ★ 撮影中の状態を受け取るために追加
}

export default function ScienceMissionBar({
  onCapturePanorama,
  showPanoramaButton = true,
  isCapturing = false, // ★ デフォルトは「撮影中ではない」
}: ScienceMissionBarProps) {
  const mission = useTelemetryStore((s) => s.mission)
  const startMission = useTelemetryStore((s) => s.startMission)
  const stopMission = useTelemetryStore((s) => s.stopMission)
  const resetMission = useTelemetryStore((s) => s.resetMission)

  const [confirmReset, setConfirmReset] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  // ミッションタイマーの更新処理
  useEffect(() => {
    if (!mission.isRunning) return
    const interval = window.setInterval(() => setNow(Date.now()), 200)
    return () => window.clearInterval(interval)
  }, [mission.isRunning])

  const elapsedMs =
    mission.isRunning && mission.lastStartWallClock !== null
      ? mission.accumulatedMs + (now - mission.lastStartWallClock)
      : mission.accumulatedMs

  return (
    <div
      className={`grid h-full gap-3 ${
        showPanoramaButton ? "grid-cols-[1.7fr_1fr]" : "grid-cols-1"
      }`}
    >
      {/* 左側：ミッションタイムと制御ボタン */}
      <section className="flex h-full min-h-0 flex-col justify-between rounded-[22px] border border-[#6a1f2d] bg-[#1d0a0d] px-4 py-3 shadow-2xl">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#c9a3ab]">
            Mission Time
          </p>
          <div className="mt-2 font-mono text-3xl font-bold tracking-tight text-[#fff7f8] xl:text-4xl">
            {formatElapsed(elapsedMs)}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={startMission}
            disabled={mission.isRunning}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b2740] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#a22f4b] disabled:cursor-not-allowed disabled:bg-[#4a1b25] disabled:text-[#cfb0b8]"
          >
            <Play className="h-3.5 w-3.5" />
            Start
          </button>

          <button
            onClick={stopMission}
            disabled={!mission.isRunning}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3a252a] px-3 py-1.5 text-xs font-semibold text-[#f8edef] transition hover:bg-[#4a2c32] disabled:cursor-not-allowed disabled:bg-[#2a1d20] disabled:text-[#9f868c]"
          >
            <Square className="h-3.5 w-3.5" />
            Stop
          </button>

          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#6a1f2d] bg-[#16080a] px-3 py-1.5 text-xs font-semibold text-[#f8edef] transition hover:bg-[#241014]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </section>

      {/* 右側：パノラマ撮影ボタン（isCapturingの状態によって見た目が変わる） */}
      {showPanoramaButton && (
        <button
          onClick={onCapturePanorama}
          disabled={isCapturing} // 撮影中は連打できないように無効化
          className={`flex h-full min-h-0 items-center justify-center rounded-[22px] border border-[#7a1c2a] bg-gradient-to-br px-4 text-center text-sm font-semibold text-white shadow-2xl transition-all duration-200 
            ${isCapturing 
              ? "from-[#4a1b25] to-[#2a0d12] cursor-wait" 
              : "from-[#8b1e2d] to-[#5a0f19] hover:bg-[#b3263c] hover:shadow-[0_0_14px_rgba(179,38,60,0.6)] active:scale-[0.98]"
            }`}
        >
          <div className="flex flex-col items-center gap-2 leading-tight">
            {isCapturing ? (
              <RotateCcw className="h-5 w-5 animate-spin" /> // 撮影中はアイコンを回転させる
            ) : (
              <Camera className="h-5 w-5" />
            )}
            <span>{isCapturing ? "Processing..." : "Capture Panorama"}</span>
          </div>
        </button>
      )}

      {/* リセット確認モーダル */}
      {confirmReset && (
        <ResetConfirmModal
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            resetMission()
            setConfirmReset(false)
          }}
        />
      )}
    </div>
  )
}

// ---------- 以下、補助用コンポーネントと関数 ----------

type ResetConfirmModalProps = {
  onCancel: () => void
  onConfirm: () => void
}

function ResetConfirmModal({ onCancel, onConfirm }: ResetConfirmModalProps) {
  const totalSamples = useTelemetryStore((s) =>
    Object.values(s.science.history).reduce((sum, arr) => sum + arr.length, 0)
  )
  const isRunning = useTelemetryStore((s) => s.mission.isRunning)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
      if (e.key === "Enter") onConfirm()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onCancel, onConfirm])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md rounded-2xl border border-[#7a1c2a] bg-[#1d0a0d] p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#8b1e2d] p-2">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#fff3f5]">Reset mission?</h3>
            <p className="mt-2 text-sm text-[#d4c7ca]">
              Logged samples: <span className="font-semibold text-[#fff3f5]">{totalSamples.toLocaleString()}</span>. Reset timer to 00:00:00?
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-xl border border-[#6a1f2d] bg-[#16080a] px-4 py-2 text-xs font-semibold text-[#f8edef]">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-[#8b2740] px-4 py-2 text-xs font-semibold text-white">Reset Mission</button>
        </div>
      </div>
    </div>
  )
}

function formatElapsed(elapsedMs: number) {
  const totalSeconds = Math.floor(elapsedMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((v) => v.toString().padStart(2, "0")).join(":")
}
