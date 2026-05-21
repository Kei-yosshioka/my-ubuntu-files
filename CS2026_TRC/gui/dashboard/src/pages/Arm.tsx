import { useState } from "react"
import MissionBar from "@/components/shared/MissionBar"
import CameraPanel from "@/components/shared/CameraPanel"
import ArmDiagram from "@/components/arm/ArmDiagram"
import logoWhite from "@/assets/logo-white.png"
import { armCameras } from "@/data/arm_cameras"
import { useTelemetryStore } from "@/store/useTelemetryStore"

export default function ArmPage() {
  const armTelemetry = useTelemetryStore((state) => state.arm);
  const isConnected = useTelemetryStore((state) => state.isConnected);

  const [cameraStates, setCameraStates] = useState<Record<string, boolean>>(
    Object.fromEntries(armCameras.map((cam) => [cam.id, cam.enabledByDefault]))
  )

  const toggleCamera = (cameraId: string) => {
    setCameraStates((prev) => ({
      ...prev,
      [cameraId]: !prev[cameraId],
    }))
  }

  return (
    <div className="min-h-screen overflow-visible bg-[#140608] text-[#f8edef]">
      <div className="mx-auto flex h-screen w-full max-w-[1750px] flex-col gap-2 overflow-visible px-3 py-3 md:px-4">
        <main className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2 overflow-visible">
          {armCameras.map((camera, index) =>
            index < 3 ? (
              <CameraPanel
                key={camera.id}
                title={camera.title}
                path={camera.path}
                baseUrl={camera.baseUrl}
                enabled={cameraStates[camera.id]}
                onToggle={() => toggleCamera(camera.id)}
              />
            ) : null
          )}

          <ArmDiagram telemetry={armTelemetry} />
        </main>

        <div className="relative z-0 shrink-0">
          <div className="mx-auto flex w-fit items-stretch gap-3">
            <div className="flex items-center">
              <img
                src={logoWhite}
                alt="Karura"
                className="h-[84px] w-auto object-contain"
              />
            </div>

            <MissionBar rtspHealthy={isConnected} />
          </div>
        </div>
      </div>
    </div>
  )
}