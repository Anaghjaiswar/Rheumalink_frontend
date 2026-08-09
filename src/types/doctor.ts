export type DoctorTab = "consultation" | "diagnosis"
export type EntryMode = "manual" | "dictation"

export interface MedRow {
  id: number
  medicine: string
  dosage: string
  duration: string
  instructions: string
}

export interface PatientSummary {
  name: string
  file: string
  ext: string
  bloodGroup: string
  allergies: string
  comorbidities: string[]
  familyHistory: string
  vitals: { label: string; value: string }[]
}
