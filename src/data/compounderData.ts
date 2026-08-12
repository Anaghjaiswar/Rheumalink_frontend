import { AppStatus } from "../types/compounder"

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

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
  { code: "mr-IN", label: "Marathi (मराठी)" },
  { code: "gu-IN", label: "Gujarati (ગુજરાતી)" },
  { code: "ta-IN", label: "Tamil (தமிழ்)" },
]

export const STATUS_OPTS: { value: AppStatus; label: string; color: string }[] = [
  { value: "T", label: "To Be Attended", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "A", label: "Attended", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "C", label: "Cancelled", color: "bg-red-100 text-red-700 border-red-300" },
  { value: "N", label: "No Show / Absent", color: "bg-slate-100 text-slate-600 border-slate-300" },
]
