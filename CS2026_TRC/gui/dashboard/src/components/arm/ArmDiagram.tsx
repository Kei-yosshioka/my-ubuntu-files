import armDiagram from "@/assets/arm.png"
import ArmJointCallout from "@/components/arm/ArmJointCallout"
import { armJointTelemetry } from "@/data/arm_diagram"

interface ArmDiagramProps {
  telemetry: Record<string, string | number>;
}

export default function ArmDiagram({ telemetry }: ArmDiagramProps) {
  return (
    <section className="relative min-h-0 rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] shadow-2xl overflow-visible z-20">
      <div className="border-b border-[#53202b] px-4 py-3">
        <h2 className="text-sm font-semibold leading-tight text-[#fff3f5]">
          Arm Telemetry Overview
        </h2>
      </div>

      <div className="relative h-[calc(100%-52px)] min-h-0 overflow-visible bg-[#120406] rounded-b-[22px]">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <img
            src={armDiagram}
            alt="Karura robotic arm"
            className="max-h-[82%] max-w-[82%] object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {armJointTelemetry.map((joint) => (
          <ArmJointCallout
            key={joint.id}
            label={joint.label}
            position={String(telemetry[joint.id] ?? joint.position)}            
            rpm={joint.rpm}
            temp={joint.temp}
            canOnline={joint.canOnline}
            x={joint.x}
            y={joint.y}
            align={joint.align}
            lineAngle={joint.lineAngle}
            lineLength={joint.lineLength}
          />
        ))}
      </div>
    </section>
  )
}