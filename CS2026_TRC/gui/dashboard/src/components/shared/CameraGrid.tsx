import CameraPanel from "@/components/shared/CameraPanel"
import { cameras } from "@/data/cameras"
import { useState } from "react"

export default function CameraGrid() {
  const [cameraStates, setCameraStates] = useState<Record<string, boolean>>(
    Object.fromEntries(cameras.map((cam) => [cam.id, cam.enabledByDefault]))
  )

  const toggleCamera = (cameraId: string) => {
    setCameraStates((prev) => ({
      ...prev,
      [cameraId]: !prev[cameraId],
    }))
  }

  return (
    <section className="grid min-h-0 grid-cols-2 grid-rows-2 gap-2">
      {cameras.map((camera) => (
        <CameraPanel
          key={camera.id}
          title={camera.title}
          path={camera.path}
          baseUrl={camera.baseUrl}
          enabled={cameraStates[camera.id]}
          onToggle={() => toggleCamera(camera.id)}
        />
      ))}
    </section>
  )
}