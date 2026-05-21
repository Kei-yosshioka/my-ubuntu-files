type ArmStatusLedProps = {
  online: boolean
}

export default function ArmStatusLed({ online }: ArmStatusLedProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full shadow-[0_0_10px_currentColor] ${
          online ? "bg-emerald-400 text-emerald-400" : "bg-red-400 text-red-400"
        }`}
      />
      <span className="text-xs font-medium text-[#f3d9df]">
        {online ? "Online" : "Offline"}
      </span>
    </span>
  )
}