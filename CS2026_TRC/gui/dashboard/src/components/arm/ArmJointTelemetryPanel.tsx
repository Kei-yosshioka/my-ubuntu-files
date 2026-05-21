import ArmJointTelemetryCard from "@/components/arm/ArmJointTelemetryCard"

export type ArmJointTelemetry = {
  hand: string | number
  joint6: string | number
  joint5: string | number
  joint4: string | number
  joint3: string | number
  joint2: string | number
  joint1: string | number
}

type ArmJointTelemetryPanelProps = {
  telemetry: ArmJointTelemetry
}

export default function ArmJointTelemetryPanel({
  telemetry,
}: ArmJointTelemetryPanelProps) {
  return (
    <section className="min-h-0 overflow-hidden rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] shadow-2xl">
      <div className="border-b border-[#53202b] px-4 py-3">
        <h2 className="text-sm font-semibold leading-tight text-[#fff3f5]">
          Arm Joint Telemetry
        </h2>
      </div>

      <div className="grid h-[calc(100%-52px)] min-h-0 grid-cols-1 gap-2 overflow-y-auto p-2">
        <ArmJointTelemetryCard label="Hand" value={telemetry.hand} />
        <ArmJointTelemetryCard label="Joint 6" value={telemetry.joint6} />
        <ArmJointTelemetryCard label="Joint 5" value={telemetry.joint5} />
        <ArmJointTelemetryCard label="Joint 4" value={telemetry.joint4} />
        <ArmJointTelemetryCard label="Joint 3" value={telemetry.joint3} />
        <ArmJointTelemetryCard label="Joint 2" value={telemetry.joint2} />
        <ArmJointTelemetryCard label="Joint 1" value={telemetry.joint1} />
      </div>
    </section>
  )
}