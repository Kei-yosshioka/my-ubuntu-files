import { useState } from "react"
import CameraPanel from "@/components/shared/CameraPanel"
import { armCameras } from "@/data/arm_cameras"

export default function ArmCameraLayout() {
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
    <section className="grid min-h-0 grid-cols-2 grid-rows-2 gap-2">
      <CameraPanel
        title={armCameras[0].title}
        path={armCameras[0].path}
        enabled={cameraStates[armCameras[0].id]}
        onToggle={() => toggleCamera(armCameras[0].id)}
      />

      <CameraPanel
        title={armCameras[1].title}
        path={armCameras[1].path}
        enabled={cameraStates[armCameras[1].id]}
        onToggle={() => toggleCamera(armCameras[1].id)}
      />

      <CameraPanel
        title={armCameras[2].title}
        path={armCameras[2].path}
        enabled={cameraStates[armCameras[2].id]}
        onToggle={() => toggleCamera(armCameras[2].id)}
      />
    </section>
  )
}