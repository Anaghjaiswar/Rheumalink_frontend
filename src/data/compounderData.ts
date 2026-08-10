import { AppStatus } from "../types/compounder"

export const samplePatients = [
  { name: "Alpa Jaiswar", contact: "+91 98201 44321", internalFile: "RL-26-00011", externalFile: "EXT-0001", type: "Regular" },
  { name: "Ramesh Shetty", contact: "+91 97654 32100", internalFile: "RL-26-00012", externalFile: "—", type: "Free" },
  { name: "Meena Kulkarni", contact: "+91 90001 23456", internalFile: "RL-26-00013", externalFile: "EXT-0042", type: "Regular" },
  { name: "Jayesh Patel", contact: "+91 91234 56789", internalFile: "RL-26-00014", externalFile: "—", type: "Free" },
]

export const ATTENDING_TODAY = [
  { token: "Token 1", name: "Alpa Jaiswar", file: "RL-26-00011", status: "In Consultation" },
]

export const ATTENDED_TODAY = [
  { token: "Token 2", name: "Ramesh Shetty", file: "RL-26-00012", status: "Attended" },
  { token: "Token 3", name: "Meena Kulkarni", file: "RL-26-00013", status: "Attended" },
]

export const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"]

export const COMORBIDITIES = [
  "Diabetes Mellitus (Sugar)",
  "Hypertension (High BP)",
  "Dyslipidemia (High Cholesterol)",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Osteoporosis (Weak Bones)",
  "Osteoarthritis",
  "Bronchial Asthma",
  "ILD (Interstitial Lung Disease)",
  "CAD (Heart Disease)",
  "CKD (Kidney Disease)",
  "Tuberculosis (TB)",
  "Hepatitis B/C",
  "Anemia",
  "Obesity",
  "PUD (Peptic Ulcer)",
]

export const VOICE_LANGUAGES = [
  { code: "en-IN", label: "English (India) / Hinglish" },
  { code: "en-US", label: "English (US)" },
  { code: "hi-IN", label: "Hindi (हिन्दी)" },
  { code: "mr-IN", label: "Marathi (મરાઠી)" },
  { code: "gu-IN", label: "Gujarati (ગુજરાતી)" },
  { code: "ta-IN", label: "Tamil (தமிழ்)" },
]

export const DOCTORS = ["Dr. Shweta Gupta", "Dr. Arvind Mehta", "Dr. Priya Nair"]

export const STATUS_OPTS: { value: AppStatus; label: string; color: string }[] = [
  { value: "to-be-attended", label: "To Be Attended", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "attended", label: "Attended", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700 border-red-300" },
  { value: "no-show", label: "No Show / Absent", color: "bg-slate-100 text-slate-600 border-slate-300" },
]
