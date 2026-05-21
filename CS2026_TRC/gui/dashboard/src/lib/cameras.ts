export type CameraConfig = {
  id: string
  title: string
  path: string
  nativeResolution: string
  enabledByDefault: boolean
}

export const cameras: CameraConfig[] = [
  {
    id: "front",
    title: "Front View",
    path: "cam/front",
    nativeResolution: "1280×720",
    enabledByDefault: true,
  },
  {
    id: "under",
    title: "Under View",
    path: "cam/under",
    nativeResolution: "1280×720",
    enabledByDefault: true,
  },
  {
    id: "rear",
    title: "Rear View",
    path: "cam/rear",
    nativeResolution: "640×480",
    enabledByDefault: true,
  },
  {
    id: "back-wheels",
    title: "Back Wheels View",
    path: "cam/back-wheels",
    nativeResolution: "640×480",
    enabledByDefault: true,
  },
]