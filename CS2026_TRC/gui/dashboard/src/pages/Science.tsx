
import { useState, useEffect } from "react"
import { Camera, LineChart as LineChartIcon, MapPinned, Thermometer } from "lucide-react"
import * as ROSLIB from 'roslib' // ★ 追加：通信用ライブラリ

import ScienceCameraPanel from "@/components/science/ScienceCameraPanel"
import ScienceDataCard from "@/components/science/ScienceDataCard"
import ScienceMissionBar from "@/components/science/ScienceMissionBar"
import SciencePanoramaPanel from "@/components/science/SciencePanoramaPanel"
import ScienceTelemetryRow from "@/components/science/ScienceTelemetryRow"
import SensorsTab from "@/components/science/SensorsTab"
import { scienceCameras } from "@/data/science_cameras"
import { useTelemetryStore } from "@/store/useTelemetryStore"
import logoWhite from "@/assets/logo-white.png"

type ActiveTab = "cameras" | "sensors"

export default function SciencePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("cameras")

  const [cameraStates, setCameraStates] = useState<Record<string, boolean>>(
    Object.fromEntries(
      scienceCameras.map((camera) => [camera.id, camera.enabledByDefault])
    )
  )

  const [lastPanoramaTime, setLastPanoramaTime] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false) // ★ 撮影中フラグを追加

  const sensors = useTelemetryStore((s) => s.science.current)
  const ros = useTelemetryStore((s) => s.ros) // ★ ストアからROSを取り出す
  const isConnected = useTelemetryStore((s) => s.isConnected) // ★ 接続状態

  const toggleCamera = (cameraId: string) => {
    setCameraStates((prev) => ({ ...prev, [cameraId]: !prev[cameraId] }))
  }

  // ★ 撮影ボタンが押された時の「本当の」処理
  const handleCapturePanorama = () => {
    console.log("パノラマボタンが押されました")

    if (isCapturing) return

    // 接続チェック：センサーが「—」のときはここを通りません
    if (!ros || !isConnected) {
      console.error("ROSが接続されていません")
      alert("センサーの数値が動いてから（ROS接続完了後に）押してください。")
      return
    }

    setIsCapturing(true)

    // サービス（/capture_panorama）の作成
    const panoramaService = new ROSLIB.Service({
      ros: ros,
      name: '/capture_panorama',
      serviceType: 'std_srvs/Trigger'
    })

    const request = {} as any;

    console.log("ラズパイへサービス要請を送信中...")

    panoramaService.callService(request, (result: { success: boolean; message: string }) => {
      setIsCapturing(false)
      if (result.success) {
        console.log("撮影成功:", result.message)
        // タイムスタンプを更新して、パネルに最新画像を表示させる
        setLastPanoramaTime(new Date().getTime().toString())
      } else {
        alert("ラズパイ側でエラーが発生しました: " + result.message)
      }
    }, (error) => {
      setIsCapturing(false)
      console.error("通信エラー:", error)
      alert("ラズパイとの通信に失敗しました。rosbridgeが動いているか確認してください。")
    })
  }

  const [multispectrumCam, closeupCam] = scienceCameras

  const formatSensor = (v: number | null, unit: string, digits = 1) =>
    v === null ? "—" : `${v.toFixed(digits)} ${unit}`

  return (
    <div className="min-h-screen bg-[#140608] text-[#f8edef]">
      <div className="mx-auto w-full max-w-[1750px] px-4 py-4">
        <div className="flex flex-col gap-3">
          {/* Top row: tab switcher + panorama + mission bar */}
          <section className="grid grid-cols-12 gap-3">
            <div className="col-span-12 xl:col-span-9">
              <div className="flex h-[195px] flex-col gap-2 xl:h-[210px]">
                <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />
                <div className="min-h-0 flex-1">
                  {activeTab === "cameras" ? (
                    <SciencePanoramaPanel lastCapturedAt={lastPanoramaTime} />
                  ) : (
                    <PanoramaPlaceholder />
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-3">
              <div className="h-[195px] xl:h-[210px]">
                <ScienceMissionBar
                  onCapturePanorama={handleCapturePanorama}
                  showPanoramaButton={activeTab === "cameras"}
                  isCapturing={isCapturing}
                />
              </div>
            </div>
          </section>

          {/* Main content: swaps based on active tab */}
          {activeTab === "cameras" ? (
            <CamerasView
              multispectrumCam={multispectrumCam}
              closeupCam={closeupCam}
              cameraStates={cameraStates}
              toggleCamera={toggleCamera}
              sensors={sensors}
              formatSensor={formatSensor}
            />
          ) : (
            <div className="h-[700px] xl:h-[760px]">
              <SensorsTab />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- Tab switcher ----------

type TabSwitcherProps = {
  activeTab: ActiveTab
  onChange: (tab: ActiveTab) => void
}

function TabSwitcher({ activeTab, onChange }: TabSwitcherProps) {
  const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { key: "cameras", label: "Cameras", icon: <Camera className="h-3.5 w-3.5" /> },
    { key: "sensors", label: "Sensors", icon: <LineChartIcon className="h-3.5 w-3.5" /> },
  ]

  return (
    <div className="flex shrink-0 items-center gap-1.5 rounded-[18px] border border-[#6a1f2d] bg-[#1a080b] px-2 py-1.5">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
              isActive
                ? "bg-[#8b2740] text-white"
                : "text-[#d4c7ca] hover:bg-[#241014]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// ---------- Placeholder shown on Sensors tab where panorama would be ----------

function PanoramaPlaceholder() {
  const missionIsRunning = useTelemetryStore((s) => s.mission.isRunning)
  const isConnected = useTelemetryStore((s) => s.isConnected)

  return (
    <section className="flex h-full min-h-0 items-center justify-center rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] px-6 shadow-2xl">
      <div className="flex items-center gap-6 text-sm text-[#d4c7ca]">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isConnected ? "bg-[#34d399]" : "bg-[#f87171]"
            }`}
          />
          <span>ROS {isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              missionIsRunning ? "bg-[#34d399] animate-pulse" : "bg-[#6a5c60]"
            }`}
          />
          <span>{missionIsRunning ? "Mission Running" : "Mission Idle"}</span>
        </div>
      </div>
    </section>
  )
}

// ---------- Cameras view ----------

type CamerasViewProps = {
  multispectrumCam: (typeof scienceCameras)[number]
  closeupCam: (typeof scienceCameras)[number]
  cameraStates: Record<string, boolean>
  toggleCamera: (id: string) => void
  sensors: any
  formatSensor: (v: number | null, unit: string, digits?: number) => string
}

function CamerasView({
  multispectrumCam,
  closeupCam,
  cameraStates,
  toggleCamera,
  sensors,
  formatSensor,
}: CamerasViewProps) {
  return (
    <section className="grid grid-cols-12 gap-3">
      <div className="col-span-12 xl:col-span-7">
        <div className="flex flex-col gap-3">
          <div className="h-[420px] xl:h-[460px]">
            <ScienceCameraPanel
              title={"Front Camera"}
              path={multispectrumCam.path}
              baseUrl={multispectrumCam.baseUrl}
              enabled={cameraStates[multispectrumCam.id]}
              onToggle={() => toggleCamera(multispectrumCam.id)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="h-[240px] xl:h-[250px]">
              <ScienceDataCard
                eyebrow="GNSS"
                title="Position Data"
                icon={<MapPinned className="h-4 w-4" />}
              >
                <ScienceTelemetryRow label="Latitude" value="30.6210° N" />
                <ScienceTelemetryRow label="Longitude" value="96.3404° W" />
                <ScienceTelemetryRow label="Altitude" value={formatSensor(sensors.altitude, "m", 0)} />
                <ScienceTelemetryRow label="Accuracy" value="±1.8 m" />
              </ScienceDataCard>
            </div>

            <div className="h-[240px] xl:h-[250px]">
              <ScienceDataCard
                eyebrow="Sensors"
                title="Sensor Data"
                icon={<Thermometer className="h-4 w-4" />}
              >
                <ScienceTelemetryRow label="UV" value={formatSensor(sensors.uv, "mW", 1)} />
                <ScienceTelemetryRow label="Air Temp" value={formatSensor(sensors.temperature, "°C", 1)} />
                <ScienceTelemetryRow label="Humidity" value={formatSensor(sensors.humidity, "%", 0)} />
                <ScienceTelemetryRow label="Pressure" value={formatSensor(sensors.pressure, "hPa", 0)} />
              </ScienceDataCard>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-5">
        <div className="flex flex-col gap-3">
          <div className="h-[420px] xl:h-[460px]">
            <ScienceCameraPanel
              title={closeupCam.title}
              path={closeupCam.path}
              baseUrl={closeupCam.baseUrl}
              enabled={cameraStates[closeupCam.id]}
              onToggle={() => toggleCamera(closeupCam.id)}
            />
          </div>

          <div className="flex h-[240px] items-center justify-center xl:h-[250px]">
          <img
            src={logoWhite}
            alt="Karura"
            className="max-h-full w-auto object-contain opacity-90"
          />
        </div>
        </div>
      </div>
    </section>
  )
}
