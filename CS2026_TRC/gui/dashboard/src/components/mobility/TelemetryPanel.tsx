import type { TelemetryState } from "@/lib/telemetry"
import ImuCard from "@/components/mobility/ImuCard"
import SteeringCard from "@/components/mobility/SteeringCard"
import WheelSpeedCard from "@/components/mobility/WheelSpeedCard"

type TelemetryPanelProps = {
  telemetry: TelemetryState
}

export default function TelemetryPanel({ telemetry }: TelemetryPanelProps) {
  return (
    <aside className="grid min-h-0 grid-rows-[1fr_1fr_1fr] gap-3">
      <ImuCard pitch={telemetry.pitch} roll={telemetry.roll} />
      <SteeringCard wheelAngles={telemetry.wheelAngles} />
      <WheelSpeedCard wheelSpeeds={telemetry.wheelSpeeds} />
    </aside>
  )
}