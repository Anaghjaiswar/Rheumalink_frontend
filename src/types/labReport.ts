export interface LabTestRow {
  id: string
  name: string
  value: string
  unit: string
  ref: string
}

export interface AppointmentOption {
  id: string
  date: string
  doctor: string
}

export interface PatientSearchResult {
  id: string
  name: string
  internalFile: string
  externalFile: string
  phone: string
}
