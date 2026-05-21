import RoverBackView from "@/components/mobility/RoverBackView"
import RoverSideView from "@/components/mobility/RoverSideView"

type ImuCardProps = {
  pitch: number | null
  roll: number | null
}

export default function ImuCard({ pitch, roll }: ImuCardProps) {
  return (
    <section className="min-h-0 overflow-hidden rounded-[22px] border border-[#6a1f2d] bg-[#1a080b] shadow-xl">
      <div className="border-b border-[#53202b] bg-[#1d0a0d] px-3 py-1.5 text-center text-lg font-semibold tracking-tight text-[#f4f4f4]">
        IMU
      </div>

      <div className="grid h-[calc(100%-38px)] grid-rows-2 gap-2 p-2">
        {/* Pitch = side tilt */}
        <RoverSideView pitch={pitch} />

        {/* Roll = left/right tilt */}
        <RoverBackView roll={roll} />
      </div>
    </section>
  )
}