const STREAM_BASE_URL = import.meta.env.VITE_STREAM_BASE_URL

export type CameraConfig = {
  id: string
  title: string
  path: string
  nativeResolution: string
  enabledByDefault: boolean
  baseUrl: string
}

export const cameras: CameraConfig[] = [
  {
    id: "front",
    title: "Front View",
    path: "cam/front",
    nativeResolution: "1280×720",
    enabledByDefault: true,
    baseUrl: STREAM_BASE_URL,
  },
  {
    id: "under",
    title: "Under View",
    path: "cam/under",
    nativeResolution: "1280×720",
    enabledByDefault: true,
    baseUrl: STREAM_BASE_URL,
  },
  {
    id: "rear",
    title: "Rear View",
    path: "cam/rear",
    nativeResolution: "640×480",
    enabledByDefault: true,
    baseUrl: STREAM_BASE_URL,
  },
  {
    id: "back-wheels",
    title: "Back Wheels",
    path: "cam/back-wheels",
    nativeResolution: "640×480",
    enabledByDefault: true,
    baseUrl: STREAM_BASE_URL,
  },
]