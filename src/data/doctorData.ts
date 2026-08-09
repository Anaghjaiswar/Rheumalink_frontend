import { PatientSummary } from "../types/doctor"

export const LANGUAGES = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada"]

export const LAB_TESTS = [
  "ANA (Antinuclear Antibody) by IFA",
  "Anti-CCP (Cyclic Citrullinated Peptide)",
  "Complete Blood Count (CBC)",
  "C-Reactive Protein (CRP)",
  "Erythrocyte Sedimentation Rate (ESR)",
  "HLA-B27 by PCR",
  "Rheumatoid Factor (RF) Quantitative",
  "Serum Uric Acid",
]

export const FOLLOW_UP_OPTIONS = ["1 Week", "2 Weeks", "1 Month", "2 Months", "3 Months"]

export const ATTENDING: PatientSummary[] = [
  {
    name: "Alpa Jaiswar",
    file: "RL-26-00011",
    ext: "EXT-0001",
    bloodGroup: "B+",
    allergies: "Penicillin, NSAIDs",
    comorbidities: ["Hypertension (High BP)", "Diabetes Mellitus (Sugar)"],
    familyHistory: "Father had rheumatoid arthritis, mother had hypertension.",
    vitals: [
      { label: "Weight", value: "62 kg" },
      { label: "Height", value: "158 cm" },
      { label: "Sys BP", value: "138 mmHg" },
      { label: "Dia BP", value: "88 mmHg" },
      { label: "Pulse", value: "78 /min" },
      { label: "SpO₂", value: "97%" },
      { label: "Temp", value: "37.1 °C" },
      { label: "Pain Scale", value: "52 / 100" },
    ],
  },
]

export const ATTENDED: PatientSummary[] = [
  {
    name: "Ramesh Shetty",
    file: "RL-26-00012",
    ext: "—",
    bloodGroup: "O+",
    allergies: "None known",
    comorbidities: ["Osteoarthritis"],
    familyHistory: "No significant family history.",
    vitals: [
      { label: "Weight", value: "78 kg" },
      { label: "Height", value: "172 cm" },
      { label: "Sys BP", value: "124 mmHg" },
      { label: "Dia BP", value: "80 mmHg" },
      { label: "Pulse", value: "70 /min" },
      { label: "SpO₂", value: "99%" },
      { label: "Temp", value: "36.8 °C" },
      { label: "Pain Scale", value: "30 / 100" },
    ],
  },
]

export const APPOINTMENTS = [
  "Alpa Jaiswar — RL-26-00011 (Token 1)",
  "Ramesh Shetty — RL-26-00012 (Token 2)",
]
