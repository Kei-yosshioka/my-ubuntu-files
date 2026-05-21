import { useEffect } from "react"
import CameraGrid from "@/components/shared/CameraGrid"
import MissionBar from "@/components/shared/MissionBar"
import TelemetryPanel from "@/components/mobility/TelemetryPanel"
import { useTelemetryStore } from "@/store/useTelemetryStore"
import logoWhite from "@/assets/logo-white.png"

export default function App() {
  const telemetry = useTelemetryStore((s) => s.mobility)
  const connect = useTelemetryStore((s) => s.connect)

  useEffect(() => {
    const url = import.meta.env.VITE_ROSBRIDGE_URL ?? "ws://localhost:9090"
    connect(url)
  }, [connect])

  return (
    <div className="min-h-screen overflow-hidden bg-[#140608] text-[#f8edef]">
      <div className="mx-auto flex h-screen w-full max-w-[1750px] flex-col gap-2 px-3 py-3 md:px-4">
        <main className="grid min-h-0 flex-1 gap-2 xl:grid-cols-[minmax(0,2.7fr)_250px]">
          <CameraGrid />
          <TelemetryPanel telemetry={telemetry} />
        </main>

        <div className="shrink-0">
          <div className="mx-auto flex w-fit items-stretch gap-3">
            <div className="flex items-center">
              <img
                src={logoWhite}
                alt="Karura"
                className="h-[84px] w-auto object-contain"
              />
            </div>
            <MissionBar rtspHealthy={telemetry.rtspHealthy} />
          </div>
        </div>
      </div>
    </div>
  )
}
