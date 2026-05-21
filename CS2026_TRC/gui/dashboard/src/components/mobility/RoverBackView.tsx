import roverBackView from "@/assets/back-view.png"

type RoverBackViewProps = {
  roll: number | null
}

export default function RoverBackView({ roll }: RoverBackViewProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 rounded-2xl bg-[#140608] px-2 py-1.5">
      <img
        src={roverBackView}
        alt="Rover back view"
        className="max-h-[64px] w-full object-contain transition duration-300"
        style={{
          transform: roll === null ? "none" : `rotate(${roll * -0.35}deg)`,
          opacity: roll === null ? 0.8 : 1,
        }}
      />

      <div className="text-sm font-medium text-[#f4f4f4]">
        Roll: {roll === null ? "N/A" : `${roll.toFixed(1)}°`}
      </div>
    </div>
  )
}