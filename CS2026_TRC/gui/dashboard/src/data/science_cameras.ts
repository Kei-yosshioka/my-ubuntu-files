// 1. .160用のURL定数を追加
const STREAM_BASE_URL = import.meta.env.VITE_STREAM_BASE_URL
const ARM_FRONT_URL = import.meta.env.VITE_STREAM_ARM_FRONT_URL

export type ScienceCameraConfig = {
  id: string
  title: string
  path: string
  nativeResolution: string
  enabledByDefault: boolean
  baseUrl: string
}

export const scienceCameras: ScienceCameraConfig[] = [
  {
    id: "multispectrum",
    title: "Multispectrum Camera",
    path: "cam/under",
    nativeResolution: "1280×720",
    enabledByDefault: true,
    baseUrl: STREAM_BASE_URL, // これは .12 のまま
  },
  {
    id: "closeup",
    title: "Close-Up Camera",
    path: "cam/front_arm",      // ★ cam/under から cam/front_arm に修正
    nativeResolution: "1280×720",
    enabledByDefault: true,
    baseUrl: ARM_FRONT_URL,    // ★ STREAM_BASE_URL から ARM_FRONT_URL (.160) に修正
  },
  {
    id: "science-box",
    title: "Science Box Monitoring",
    path: "cam/rear",
    nativeResolution: "640×480",
    enabledByDefault: true,
    baseUrl: STREAM_BASE_URL,
  },
]
