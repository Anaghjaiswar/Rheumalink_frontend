export type CompounderTab = "register" | "appointment" | "vitals" | "medical"
export type ActiveTab = CompounderTab
export type AppStatus = "T" | "I" | "A" | "C" | "N" | "to-be-attended" | "attended" | "cancelled" | "no-show"

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
