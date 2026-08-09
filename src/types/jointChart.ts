export type JointState = "nopain" | "blue" | "red" | "orange"

export interface JointSpot {
  id: string
  cbelId: string
  prefix: number
  left: number
  top: number
  width: number
  height: number
  label: string
}

export interface JointChartRecord {
  id: string
  recordedAt: string
  swollen: number
  tender: number
}
