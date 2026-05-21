export type WheelKey = "fl" | "fr" | "rl" | "rr"

export type WheelAngles = Record<WheelKey, number | null>
export type WheelSpeeds = Record<WheelKey, number | null>

export type TelemetryState = {
  pitch: number | null
  roll: number | null
  wheelAngles: WheelAngles
  wheelSpeeds: WheelSpeeds
  rtspHealthy: boolean | null
}

export const emptyTelemetry: TelemetryState = {
  pitch: null,
  roll: null,
  wheelAngles: {
    fl: null,
    fr: null,
    rl: null,
    rr: null,
  },
  wheelSpeeds: {
    fl: null,
    fr: null,
    rl: null,
    rr: null,
  },
  rtspHealthy: null,
}