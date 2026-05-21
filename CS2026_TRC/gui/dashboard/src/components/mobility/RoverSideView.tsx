import roverSideView from "@/assets/side-view.png"

type RoverSideViewProps = {
  pitch: number | null
}

export default function RoverSideView({ pitch }: RoverSideViewProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 rounded-2xl bg-[#140608] px-2 py-1.5">
      <img
        src={roverSideView}
        alt="Rover side view"
        className="max-h-[64px] w-full object-contain transition duration-300"
        style={{
          transform: pitch === null ? "none" : `rotate(${pitch * -0.35}deg)`,
          opacity: pitch === null ? 0.8 : 1,
        }}
      />

      <div className="text-sm font-medium text-[#f4f4f4]">
        Pitch: {pitch === null ? "N/A" : `${pitch.toFixed(1)}°`}
      </div>
    </div>
  )
}