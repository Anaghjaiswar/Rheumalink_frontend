export type ActiveTab = "register" | "appointment" | "medical"
export type AppStatus = "to-be-attended" | "attended" | "cancelled" | "no-show"

export interface VitalsState {
  weight: string
  height: string
  sysBP: string
  diaBP: string
  pulse: string
  spo2: string
  temp: string
  pain: string
}

export interface PatientItem {
  name: string
  contact: string
  internalFile: string
  externalFile: string
  type: string
}
