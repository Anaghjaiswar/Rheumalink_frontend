export interface MusculoskeletalState {
  years: string
  months: string
  days: string
  activeMSM: boolean
  symmetricity: boolean
  jointInvolvement: Record<string, boolean>
  limitationMovement: Record<string, boolean>
  patternAdditive: boolean
  patternRelapsing: boolean
  patternEpisodic: boolean
}

export interface BackAcheState {
  years: string
  months: string
  days: string
  activeBA: boolean
  earlyMorningStiffness: boolean
  areaLow: boolean
  areaMid: boolean
  areaNeck: boolean
  areaButtock: boolean
}

export interface RheumatDiagnosisFormState {
  msm: MusculoskeletalState
  backAche: BackAcheState
  weakness: { active: boolean; description: string }
  dermatological: Record<string, boolean>
  ophthalmological: Record<string, boolean>
  constitutional: { weightLoss: boolean; weightGain: boolean; fever: boolean }
  allergy: { active: boolean; drugsDescription: string; otherDescription: string }
  systems: { cardiorespiratory: string; gastrointestinal: string; cns: string; respiratory: string }
  pastHistory: Record<string, boolean>
  obstetricHistory: { active: boolean; description: string }
  personalHistory: Record<string, boolean>
  spineExam: { active: boolean; restrictedMovement: boolean; description: string }
  summaryNote: string
  diseaseName: string
  diseaseState: string
}
