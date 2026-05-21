export type ArmJointTelemetry = {
  id: string
  label: string
  position: string
  rpm: string
  temp: string
  canOnline: boolean
  x: string
  y: string
  align?: "left" | "right"
  lineAngle?: number
  lineLength?: number
}

export const armJointTelemetry: ArmJointTelemetry[] = [
  {
    id: "joint6",
    label: "Joint 6",
    position: "52.1°",
    rpm: "0 RPM",
    temp: "38°C",
    canOnline: true,
    x: "71%",
    y: "50%",
    align: "left",
    lineAngle: 20,
    lineLength: 15,
  },
  {
    id: "joint5",
    label: "Joint 5",
    position: "31.7°",
    rpm: "0 RPM",
    temp: "36°C",
    canOnline: true,
    x: "70%",
    y: "13%",
    align: "left",
    lineAngle: 100,
    lineLength: 44,
  },
  {
    id: "joint4",
    label: "Joint 4",
    position: "65.3°",
    rpm: "0 RPM",
    temp: "41°C",
    canOnline: true,
    x: "28%",
    y: "30%",
    align: "right",
    lineAngle: 14,
    lineLength: 10,
  },
//  {
//     id: "joint3",
//     label: "Joint 3",
//     position: "84.8°",
//     rpm: "0 RPM",
//     temp: "43°C",
//     canOnline: true,
//     x: "43%",
//     y: "66%",
//     align: "left",
//     lineAngle: 0,
//     lineLength: 40,
//   },
  {
    id: "joint2",
    label: "Joint 2",
    position: "19.6°",
    rpm: "7 RPM",
    temp: "39°C",
    canOnline: true,
    x: "35%",
    y: "74%",
    align: "right",
    lineAngle: 8,
    lineLength: 14,
  },
  {
    id: "joint1",
    label: "Joint 1",
    position: "101.2°",
    rpm: "5 RPM",
    temp: "44°C",
    canOnline: true,
    x: "67%",
    y: "83%",
    align: "left",
    lineAngle: 18,
    lineLength: 10,
  },
]