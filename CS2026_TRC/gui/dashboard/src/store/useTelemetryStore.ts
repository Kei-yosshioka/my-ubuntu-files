import { create } from 'zustand'
import * as ROSLIB from 'roslib'
import { TelemetryState, emptyTelemetry } from '@/lib/telemetry'

/* Types */
export type SensorKey =
  | 'temperature' | 'humidity' | 'pressure' | 'altitude' | 'uv'
  | 'eco2' | 'tvoc' | 'hcho' | 'nh3_ppm' | 'hcn_ppm'

export type SensorSample = {
  t: number
  v: number
}

export type SensorState = {
  current: Record<SensorKey, number | null>
  history: Record<SensorKey, SensorSample[]>
}

export type MissionState = {
  isRunning: boolean
  startedAt: number | null
  accumulatedMs: number
  lastStartWallClock: number | null
}

export interface GlobalStore {
  // ★追加: ROSインスタンスを外部から触れるように保持する
  ros: ROSLIB.Ros | null 
  mobility: TelemetryState
  arm: Record<string, string | number>
  science: SensorState
  mission: MissionState
  isConnected: boolean

  connect: (url: string) => void
  startMission: () => void
  stopMission: () => void
  resetMission: () => void
  exportSensorCsv: () => void
}

/* Constants */
const SENSOR_KEYS: SensorKey[] = [
  'temperature', 'humidity', 'pressure', 'altitude', 'uv',
  'eco2', 'tvoc', 'hcho', 'nh3_ppm', 'hcn_ppm',
]

const SENSOR_TOPICS: Record<SensorKey, string> = {
  temperature: '/sensor/temperature',
  humidity:    '/sensor/humidity',
  pressure:    '/sensor/pressure',
  altitude:    '/sensor/altitude',
  uv:          '/sensor/uv',
  eco2:        '/sensor/eco2',
  tvoc:        '/sensor/tvoc',
  hcho:        '/sensor/hcho',
  nh3_ppm:     '/sensor/nh3_ppm',
  hcn_ppm:     '/sensor/hcn_ppm',
}

const emptySensors = (): SensorState => {
  const current = {} as Record<SensorKey, number | null>
  const history = {} as Record<SensorKey, SensorSample[]>
  for (const key of SENSOR_KEYS) {
    current[key] = null
    history[key] = []
  }
  return { current, history }
}

const emptyHistory = (): Record<SensorKey, SensorSample[]> => {
  const h = {} as Record<SensorKey, SensorSample[]>
  for (const key of SENSOR_KEYS) h[key] = []
  return h
}

const emptyMission = (): MissionState => ({
  isRunning: false,
  startedAt: null,
  accumulatedMs: 0,
  lastStartWallClock: null,
})

// Module Level (念のため保持するが基本はStore内で管理)
let missionStatePub: ROSLIB.Topic | null = null

// Helper Functions
function normalizeSteerAngle(deg: number): number {
  let a = ((deg + 180) % 360 + 360) % 360 - 180
  if (a > 90) a -= 180
  if (a <= -90) a += 180
  return a
}

function snapSmall(v: number, threshold: number): number {
  return Math.abs(v) < threshold ? 0 : v
}

function currentMissionMs(mission: MissionState, now: number): number | null {
  if (mission.startedAt === null) return null
  if (!mission.isRunning) return mission.accumulatedMs
  const lastStart = mission.lastStartWallClock ?? now
  return mission.accumulatedMs + (now - lastStart)
}

function publishMissionState(state: 'start' | 'stop' | 'reset') {
  if (!missionStatePub) return
  missionStatePub.publish({ data: state } as any)
}

/* Store 本体 */
export const useTelemetryStore = create<GlobalStore>((set, get) => ({
  // ★初期値は null
  ros: null,
  mobility: emptyTelemetry,
  arm: { joint1: 0, joint2: 0, joint3: 0, joint4: 0, joint5: 0, joint6: 0, hand: 0 },
  science: emptySensors(),
  mission: emptyMission(),
  isConnected: false,

  connect: (url: string) => {
    // 既に接続されているインスタンスがあれば一旦閉じる
    const currentRos = get().ros;
    if (currentRos) {
        currentRos.close();
    }

    console.log('connect() called, url:', url)
    const ros = new ROSLIB.Ros({ url })

    ros.on('connection', () => {
      console.log('Connected to ROS Bridge!')
      // ★接続されたROSインスタンスをStoreに保存する
      set({ isConnected: true, ros: ros })

      // Arm joint states
      const armTopic = new ROSLIB.Topic({
        ros,
        name: '/joint_states',
        messageType: 'sensor_msgs/JointState',
      })

      armTopic.subscribe((msg: any) => {
        set((state) => ({
          arm: {
            ...state.arm,
            joint1: msg.position[0]?.toFixed(2) || 0,
            joint2: msg.position[1]?.toFixed(2) || 0,
            joint3: msg.position[2]?.toFixed(2) || 0,
            joint4: msg.position[3]?.toFixed(2) || 0,
            joint5: msg.position[4]?.toFixed(2) || 0,
            joint6: msg.position[5]?.toFixed(2) || 0,
            hand:   msg.position[6]?.toFixed(2) || 0,
          },
        }))
      })

      // Mobility drive state
      const driveStateTopic = new ROSLIB.Topic({
        ros,
        name: '/rover/drive_state',
        messageType: 'std_msgs/Float64MultiArray',
      })

      driveStateTopic.subscribe((msg: any) => {
        const d = msg.data
        if (!Array.isArray(d) || d.length !== 8) return

        set((state) => ({
          mobility: {
            ...state.mobility,
            wheelSpeeds: {
              fl: snapSmall(d[0], 0.5),
              fr: snapSmall(d[2], 0.5),
              rl: snapSmall(d[4], 0.5),
              rr: snapSmall(d[6], 0.5),
            },
            wheelAngles: {
              fl: snapSmall(normalizeSteerAngle(d[1]), 0.5),
              fr: snapSmall(normalizeSteerAngle(d[3]), 0.5),
              rl: snapSmall(normalizeSteerAngle(d[5]), 0.5),
              rr: snapSmall(normalizeSteerAngle(d[7]), 0.5),
            },
            rtspHealthy: true,
          },
        }))
      })

      // Science sensors
      SENSOR_KEYS.forEach((key) => {
        const topic = new ROSLIB.Topic({
          ros,
          name: SENSOR_TOPICS[key],
          messageType: 'std_msgs/Float32',
        })

        topic.subscribe((msg: any) => {
          const value = typeof msg.data === 'number' ? msg.data : parseFloat(msg.data)
          if (!Number.isFinite(value)) return

          const now = Date.now()
          const { mission } = get()

          set((state) => {
            const updatedCurrent = { ...state.science.current, [key]: value }
            let updatedHistory = state.science.history
            if (mission.isRunning && mission.lastStartWallClock !== null) {
              const missionMs = mission.accumulatedMs + (now - mission.lastStartWallClock)
              const sample: SensorSample = { t: missionMs, v: value }
              updatedHistory = {
                ...state.science.history,
                [key]: [...state.science.history[key], sample],
              }
            }
            return {
              science: {
                current: updatedCurrent,
                history: updatedHistory,
              },
            }
          })
        })
      })

      // Mission-state publisher
      missionStatePub = new ROSLIB.Topic({
        ros,
        name: '/science/mission_state',
        messageType: 'std_msgs/String',
      })
      missionStatePub.advertise()
    })

    ros.on('close', () => {
      console.warn('ROS Bridge disconnected')
      // ★切断時は ros を null に戻す
      set({ isConnected: false, ros: null })
      missionStatePub = null
    })

    ros.on('error', (err) => {
      console.error('ROS Bridge error:', err)
      set({ isConnected: false, ros: null })
    })
  },

  startMission: () => {
    const now = Date.now()
    set((state) => {
      if (state.mission.isRunning) return {}
      return {
        mission: {
          ...state.mission,
          isRunning: true,
          startedAt: state.mission.startedAt ?? now,
          lastStartWallClock: now,
        },
      }
    })
    publishMissionState('start')
  },

  stopMission: () => {
    const now = Date.now()
    set((state) => {
      if (!state.mission.isRunning) return {}
      const lastStart = state.mission.lastStartWallClock ?? now
      return {
        mission: {
          ...state.mission,
          isRunning: false,
          accumulatedMs: state.mission.accumulatedMs + (now - lastStart),
          lastStartWallClock: null,
        },
      }
    })
    publishMissionState('stop')
  },

  resetMission: () => {
    const now = Date.now()
    set((state) => ({
      mission: {
        isRunning: state.mission.isRunning,
        startedAt: state.mission.isRunning ? now : null,
        accumulatedMs: 0,
        lastStartWallClock: state.mission.isRunning ? now : null,
      },
      science: {
        ...state.science,
        history: emptyHistory(),
      },
    }))
    publishMissionState('reset')
  },

  exportSensorCsv: () => {
    const { science, mission } = get()
    const now = Date.now()
    const missionMs = currentMissionMs(mission, now)

    const rows: string[] = ['mission_time_ms,sensor,value']
    for (const key of SENSOR_KEYS) {
      for (const sample of science.history[key]) {
        rows.push(`${sample.t},${key},${sample.v}`)
      }
    }

    const csv = rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    a.href = url
    a.download = `sensor_log_${stamp}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },
}))

if (typeof window !== 'undefined') (window as any).__store = useTelemetryStore
