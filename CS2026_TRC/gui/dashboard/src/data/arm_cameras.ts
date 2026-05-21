const STREAM_ARM_BASE_URL = import.meta.env.VITE_STREAM_ARM_FRONT_URL

export type ArmCameraConfig = {
  id: string
  title: string
  path: string
  nativeResolution: string
  enabledByDefault: boolean
  baseUrl: string
}

export const armCameras: ArmCameraConfig[] = [
  {
    id: "arm-wheel",
    title: "Wheel View",
    path: "cam/wheel_cam",
    nativeResolution: "1280×720",
    enabledByDefault: true,
    baseUrl: STREAM_ARM_BASE_URL,
  },
  {
    id: "arm-side",
    title: "Camera 2",
    path: "cam/arm-side",
    nativeResolution: "1280×720",
    enabledByDefault: true,
    baseUrl: STREAM_ARM_BASE_URL,
  },
  {
    id: "arm-wrist",
    title: "Camera 3",
    path: "cam/arm-wrist",
    nativeResolution: "1280×720",
    enabledByDefault: true,
    baseUrl: STREAM_ARM_BASE_URL,
  },
]