import { useState } from "react"

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartPulseIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)
const GlobeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const ChevronIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const UploadIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)
const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const MicIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)
const ClockIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
const StethoscopeIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
)
const CheckCircleIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)
const CalendarIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const TrashIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)
const LogoutIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const PlusIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

// ─── Types ────────────────────────────────────────────────────────────────────
type DoctorTab = "consultation" | "diagnosis"
type EntryMode = "manual" | "dictation"

interface MedRow {
  id: number
  medicine: string
  dosage: string
  duration: string
  instructions: string
}

interface PatientSummary {
  name: string
  file: string
  ext: string
  bloodGroup: string
  allergies: string
  comorbidities: string[]
  familyHistory: string
  vitals: { label: string; value: string }[]
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const LANGUAGES = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada"]

const LAB_TESTS = [
  "ANA (Antinuclear Antibody) by IFA",
  "Anti-CCP (Cyclic Citrullinated Peptide)",
  "Complete Blood Count (CBC)",
  "C-Reactive Protein (CRP)",
  "Erythrocyte Sedimentation Rate (ESR)",
  "HLA-B27 by PCR",
  "Rheumatoid Factor (RF) Quantitative",
  "Serum Uric Acid",
]

const FOLLOW_UP_OPTIONS = ["1 Week", "2 Weeks", "1 Month", "2 Months", "3 Months"]

const ATTENDING: PatientSummary[] = [
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

const ATTENDED: PatientSummary[] = [
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

const APPOINTMENTS = [
  "Alpa Jaiswar — RL-26-00011 (Token 1)",
  "Ramesh Shetty — RL-26-00012 (Token 2)",
]

// ─── Subcomponents ─────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xl">{icon}</span>
      <h2 className="font-800 text-slate-800 text-lg">{title}</h2>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-700 text-slate-600 mb-1.5">{children}</label>
}

function FInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400"
    />
  )
}

function FSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all appearance-none pr-10"
      >
        {children}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <ChevronIcon />
      </span>
    </div>
  )
}

function FTextarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={3}
      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400 resize-none"
    />
  )
}

function PrimaryBtn({ children, onClick, className = "", fullWidth = false }: {
  children: React.ReactNode; onClick?: () => void; className?: string; fullWidth?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-700 text-base rounded-xl shadow-sm transition-all ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  )
}

function OutlineBtn({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-teal-300 text-teal-700 font-700 text-sm hover:bg-teal-50 transition-all ${className}`}
    >
      {children}
    </button>
  )
}

// ─── Patient Summary Slide-Over ───────────────────────────────────────────────
function PatientSummaryPanel({ patient, onClose }: { patient: PatientSummary; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="font-800 text-slate-800 text-lg">Patient Summary</h3>
            <p className="text-slate-500 text-sm font-600">{patient.name} · {patient.file}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Internal File", value: patient.file },
              { label: "External File", value: patient.ext },
              { label: "Blood Group", value: patient.bloodGroup },
              { label: "Allergies", value: patient.allergies },
            ].map(f => (
              <div key={f.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-1">{f.label}</p>
                <p className="font-700 text-slate-800 text-sm">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Family history */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-1.5">Family History</p>
            <p className="text-slate-700 font-600 text-sm leading-relaxed">{patient.familyHistory}</p>
          </div>

          {/* Comorbidities */}
          <div>
            <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-2">Comorbidities</p>
            <div className="flex flex-wrap gap-2">
              {patient.comorbidities.length > 0 ? patient.comorbidities.map(c => (
                <span key={c} className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-700 border border-red-200">{c}</span>
              )) : <span className="text-slate-400 text-sm font-600">None on record</span>}
            </div>
          </div>

          {/* Vitals */}
          <div>
            <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-3">Recorded Vitals</p>
            <div className="grid grid-cols-2 gap-2">
              {patient.vitals.map(v => (
                <div key={v.label} className="bg-sky-50 rounded-xl p-3 border border-sky-100">
                  <p className="text-xs font-700 text-sky-500 mb-0.5">{v.label}</p>
                  <p className="font-800 text-slate-800">{v.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Attending / Attended Tables ──────────────────────────────────────────────
function PatientTable({
  title, patients, attending, onAction,
}: {
  title: string; patients: PatientSummary[]; attending: boolean; onAction: (p: PatientSummary) => void
}) {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <span className="text-lg">{attending ? "🩺" : "✅"}</span>
        <h2 className="font-800 text-slate-800 text-lg">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Token", "Patient", "Joint Chart", attending ? "Status Update" : "Status", "Action"].map(h => (
                <th key={h} className="px-5 py-3.5 text-left font-800 text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400 italic font-500">
                  {attending ? "No patient currently in consultation." : "No attended patients yet."}
                </td>
              </tr>
            ) : patients.map((p, i) => (
              <tr key={p.file} className={`border-b border-slate-50 hover:bg-teal-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                <td className="px-5 py-4">
                  <span className={`w-9 h-9 rounded-xl font-800 text-base flex items-center justify-center ${attending ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="font-800 text-slate-800 whitespace-nowrap">{p.name}</p>
                  <p className="text-slate-400 text-xs font-500 mt-0.5">File: {p.file}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-700 border border-teal-200">
                    5 Swollen · 10 Tender
                  </span>
                </td>
                <td className="px-5 py-4">
                  {attending ? (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-700 border border-amber-200">
                      In Consultation
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-700 border border-emerald-200">
                      Attended
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onAction(p)}
                    className="px-3 py-2 rounded-lg bg-teal-50 text-teal-700 font-700 text-xs border border-teal-200 hover:bg-teal-100 transition-colors whitespace-nowrap"
                  >
                    {attending ? "View & Consult" : "View Summary"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ─── Prescription Preview ─────────────────────────────────────────────────────
function PrescriptionPreview({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl mx-auto my-6 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row">
        {/* Dark sidebar */}
        <div className="w-full sm:w-64 bg-slate-900 text-white p-6 flex flex-col gap-6 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                <HeartPulseIcon />
              </div>
              <span className="font-800 text-teal-400 text-lg">RheumaLink</span>
            </div>
            <p className="text-slate-400 text-xs font-700 uppercase tracking-wide mb-1">Patient</p>
            <p className="font-800 text-white text-base">Alpa Jaiswar</p>
            <p className="text-slate-400 text-sm font-600 mt-1">RL-26-00011</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-700 uppercase tracking-wide mb-1">Doctor</p>
            <p className="font-700 text-white">Dr. Shweta Gupta</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-700 uppercase tracking-wide mb-1">Date</p>
            <p className="font-700 text-white">09 Aug 2026</p>
          </div>
          <div className="mt-auto space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-700 rounded-xl transition-colors text-sm">
              <span>📱</span> Send via WhatsApp
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white font-700 rounded-xl transition-colors text-sm">
              <span>📄</span> Download PDF
            </button>
          </div>
        </div>

        {/* PDF preview */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-800 text-slate-800 text-lg">Prescription Preview</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
              <CloseIcon />
            </button>
          </div>
          <div className="border-2 border-slate-200 rounded-xl p-6 bg-slate-50 space-y-5">
            {/* Header */}
            <div className="border-b-2 border-teal-200 pb-4 flex items-start justify-between">
              <div>
                <h4 className="font-800 text-teal-700 text-xl">RheumaLink Clinic</h4>
                <p className="text-slate-500 text-sm font-600">Dr. Shweta Gupta — Rheumatologist</p>
                <p className="text-slate-400 text-xs font-500 mt-0.5">Mumbai, Maharashtra · +91 98000 00001</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-700">Rx</p>
                <p className="font-700 text-slate-600 text-sm">09/08/2026</p>
              </div>
            </div>

            {/* Patient */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 font-700 text-xs uppercase tracking-wide">Patient</p>
                <p className="font-800 text-slate-800">Alpa Jaiswar</p>
                <p className="text-slate-500 font-600">File: RL-26-00011</p>
              </div>
              <div>
                <p className="text-slate-400 font-700 text-xs uppercase tracking-wide">Blood Group</p>
                <p className="font-800 text-slate-800">B+</p>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <p className="font-800 text-slate-700 text-sm border-b border-slate-200 pb-1 mb-2">Diagnosis</p>
              <p className="text-slate-700 text-sm font-600">Rheumatoid Arthritis — Moderate Activity (DAS28: 4.2)</p>
            </div>

            {/* Medications */}
            <div>
              <p className="font-800 text-slate-700 text-sm border-b border-slate-200 pb-1 mb-2">Medications</p>
              {[
                { med: "Tab. Methotrexate", dose: "15 mg", dur: "4 weeks", instr: "Once weekly, after food" },
                { med: "Tab. Folic Acid", dose: "5 mg", dur: "4 weeks", instr: "Daily except MTX day" },
                { med: "Tab. Hydroxychloroquine", dose: "200 mg", dur: "4 weeks", instr: "Twice daily with meals" },
              ].map((m, i) => (
                <div key={i} className="flex gap-3 py-2 border-b border-slate-100 text-sm">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-800 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <p className="font-800 text-slate-800">{m.med} <span className="text-teal-600">{m.dose}</span></p>
                    <p className="text-slate-500 font-600 text-xs">{m.dur} · {m.instr}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lab tests */}
            <div>
              <p className="font-800 text-slate-700 text-sm border-b border-slate-200 pb-1 mb-2">🧪 Lab Investigations</p>
              <div className="flex flex-wrap gap-2">
                {["CBC", "CRP", "ESR", "RF Quantitative"].map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-700 border border-blue-200">{t}</span>
                ))}
              </div>
            </div>

            {/* Follow-up */}
            <div className="bg-teal-50 rounded-xl p-3 border border-teal-200">
              <p className="text-xs font-700 text-teal-600 uppercase tracking-wide">📅 Follow-up</p>
              <p className="font-800 text-slate-800 mt-0.5">In 1 Month — 09 September 2026</p>
            </div>

            <p className="text-slate-400 text-xs font-600 italic">This prescription is computer-generated and is valid without a physical signature.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Consultation Form ────────────────────────────────────────────────────────
function ConsultationForm() {
  const [mode, setMode] = useState<EntryMode>("manual")
  const [recording, setRecording] = useState(false)
  const [chiefComplaints, setChiefComplaints] = useState("")
  const [clinicalFindings, setClinicalFindings] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [meds, setMeds] = useState<MedRow[]>([
    { id: 1, medicine: "Tab. Methotrexate", dosage: "15 mg", duration: "4 weeks", instructions: "Once weekly, after food" }
  ])
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [testSearch, setTestSearch] = useState("")
  const [followUp, setFollowUp] = useState("1 Month")
  const [postStatus, setPostStatus] = useState("Attended")
  const [showPreview, setShowPreview] = useState(false)

  const addMed = () => setMeds(m => [...m, { id: Date.now(), medicine: "", dosage: "", duration: "", instructions: "" }])
  const removeMed = (id: number) => setMeds(m => m.filter(r => r.id !== id))
  const updateMed = (id: number, key: keyof MedRow, val: string) =>
    setMeds(m => m.map(r => r.id === id ? { ...r, [key]: val } : r))

  const toggleTest = (t: string) =>
    setSelectedTests(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  return (
    <>
      {showPreview && <PrescriptionPreview onClose={() => setShowPreview(false)} />}
      <div className="p-6 space-y-8">

        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          {(["manual", "dictation"] as EntryMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2.5 rounded-lg font-700 text-sm transition-all capitalize ${mode === m ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {m === "manual" ? "✏️ Manual Entry" : "🎙️ Dictation Mode"}
            </button>
          ))}
        </div>

        {/* Dictation panel */}
        {mode === "dictation" && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <h3 className="font-800 text-white text-lg">🎙️ AI Smart Dictation (MedASR)</h3>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Ready
              </span>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setRecording(r => !r)}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${recording ? "bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/40" : "bg-teal-500 hover:bg-teal-400 shadow-teal-500/40"}`}
              >
                <MicIcon size={36} />
              </button>
            </div>
            {recording && (
              <p className="text-center text-red-400 font-700 text-sm animate-pulse">● Recording… Speak clearly</p>
            )}
            <div className="bg-amber-50/10 border border-amber-400/30 rounded-xl p-4">
              <p className="text-amber-300 text-sm font-600 leading-relaxed">
                <span className="font-800">💡 Dictation Tip:</span> For best results, dictate in this order:
                Chief Complaints → Clinical Findings → Provisional Diagnosis → Prescribed Medications
                (with Dosage, Duration &amp; Instructions) → Lab Tests → Follow-up Timeline.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Consultation Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">1</span>
            <h3 className="font-800 text-slate-700 text-base">Consultation Notes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>📋 Chief Complaints</Label>
              <FTextarea placeholder="e.g. Pain and swelling in both hand joints for 3 months…" value={chiefComplaints} onChange={e => setChiefComplaints(e.target.value)} />
            </div>
            <div>
              <Label>🔍 Clinical Findings</Label>
              <FTextarea placeholder="e.g. Bilateral symmetric synovitis, MCP and PIP joints…" value={clinicalFindings} onChange={e => setClinicalFindings(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>📌 Provisional Diagnosis</Label>
              <FTextarea placeholder="e.g. Seropositive Rheumatoid Arthritis — Moderate Activity" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={2} />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Step 2: Medications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">2</span>
            <h3 className="font-800 text-slate-700 text-base">Prescribed Medications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Medicine Name", "Dosage", "Duration", "Instructions", ""].map((h, i) => (
                    <th key={i} className="px-3 py-3 text-left font-800 text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meds.map((row, i) => (
                  <tr key={row.id} className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    {(["medicine", "dosage", "duration", "instructions"] as const).map(key => (
                      <td key={key} className="px-2 py-2">
                        <input
                          value={row[key]}
                          onChange={e => updateMed(row.id, key, e.target.value)}
                          placeholder={{ medicine: "Tab. Methotrexate", dosage: "15 mg", duration: "4 weeks", instructions: "Once weekly, after food" }[key]}
                          className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-slate-800 text-sm font-500 focus:outline-none focus:border-teal-400 transition-all placeholder:text-slate-300"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-2">
                      <button onClick={() => removeMed(row.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addMed} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-teal-300 text-teal-600 font-700 text-sm hover:bg-teal-50 transition-colors">
            <PlusIcon /> Add Medicine
          </button>
        </div>

        <div className="border-t border-slate-100" />

        {/* Step 3: Lab Tests */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">3</span>
            <h3 className="font-800 text-slate-700 text-base">🧪 Prescribe Lab Tests</h3>
          </div>
          <div>
            <p className="text-sm font-700 text-slate-500 mb-2">Common Tests:</p>
            <div className="flex flex-wrap gap-2">
              {LAB_TESTS.map(t => {
                const active = selectedTests.includes(t)
                return (
                  <button
                    key={t}
                    onClick={() => toggleTest(t)}
                    className={`px-3 py-2 rounded-xl border-2 text-xs font-700 transition-all ${active ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"}`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="text-sm font-700 text-slate-500 mb-2">Search &amp; Add Other Tests:</p>
            <div className="relative max-w-sm">
              <FInput
                placeholder="Search tests…"
                value={testSearch}
                onChange={e => setTestSearch(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100">
                <MicIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Step 4: Follow-up */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">4</span>
            <h3 className="font-800 text-slate-700 text-base">📅 Follow-up Timeline</h3>
          </div>
          <Label>Next Follow-up Date:</Label>
          <div className="flex flex-wrap gap-2">
            {FOLLOW_UP_OPTIONS.map(o => (
              <button
                key={o}
                onClick={() => setFollowUp(o)}
                className={`px-4 py-2.5 rounded-xl border-2 font-700 text-sm transition-all ${followUp === o ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-500 hover:border-teal-300"}`}
              >
                {o}
              </button>
            ))}
            <button className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-500 hover:border-teal-300 font-700 text-sm flex items-center gap-1.5 transition-all">
              <CalendarIcon /> Custom
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Step 5: Post Consultation Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">5</span>
            <h3 className="font-800 text-slate-700 text-base">Post Consultation Status</h3>
          </div>
          <div className="flex gap-3">
            {["Attended", "Follow-up Required"].map(s => (
              <button
                key={s}
                onClick={() => setPostStatus(s)}
                className={`px-5 py-3 rounded-xl border-2 font-700 text-sm transition-all ${postStatus === s ? (s === "Attended" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-amber-500 bg-amber-50 text-amber-700") : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="pt-2">
          <PrimaryBtn onClick={() => setShowPreview(true)} fullWidth>
            📄 Save Consultation &amp; Generate PDF
          </PrimaryBtn>
        </div>
      </div>
    </>
  )
}

// ─── Diagnosis Book Form ──────────────────────────────────────────────────────
function DiagnosisBookForm() {
  const [appointment, setAppointment] = useState("")
  const [disease, setDisease] = useState("")
  const [stage, setStage] = useState("")
  const [versionNote, setVersionNote] = useState("")
  const [das28, setDas28] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  return (
    <div className="p-6 space-y-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>📅 Appointment</Label>
          <FSelect value={appointment} onChange={e => setAppointment(e.target.value)}>
            <option value="">Select appointment…</option>
            {APPOINTMENTS.map(a => <option key={a}>{a}</option>)}
          </FSelect>
        </div>
        <div>
          <Label>🏥 Disease Name</Label>
          <FInput placeholder="e.g. Rheumatoid Arthritis" value={disease} onChange={e => setDisease(e.target.value)} />
        </div>
        <div>
          <Label>📊 Stage</Label>
          <FInput placeholder="e.g. Moderate, Early, Late" value={stage} onChange={e => setStage(e.target.value)} />
        </div>
        <div>
          <Label>📝 Version Note</Label>
          <FTextarea placeholder="e.g. Increased disease activity since last visit…" value={versionNote} onChange={e => setVersionNote(e.target.value)} />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-4">
        {/* Joint Chart Entry */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-800 text-slate-800">🦴 Joint Chart Entry</p>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-700 border border-emerald-200">✅ Completed (5 Swollen, 10 Tender)</span>
            </div>
            <p className="text-slate-500 text-sm font-600">Joint chart is managed on a separate page. Create or view before saving diagnosis.</p>
          </div>
          <OutlineBtn className="flex-shrink-0">Open Joint Chart Page</OutlineBtn>
        </Card>

        {/* Rheumatoid Symptoms */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-800 text-slate-800">📋 Rheumatoid Symptoms Checklist (AI Summary)</p>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-700 border border-emerald-200">✅ Completed</span>
            </div>
            <p className="text-slate-500 text-sm font-600">Fill detailed symptoms checklist and generate professional clinical notes using AI on a separate page.</p>
          </div>
          <OutlineBtn className="flex-shrink-0">Open Rheum Diagnosis Page</OutlineBtn>
        </Card>

        {/* DAS28 */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-800 text-slate-800 mb-1">📐 Fast DAS28 Score</p>
            {das28 ? (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl font-800 text-teal-700">{das28}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-700 border ${parseFloat(das28) < 2.6 ? "bg-emerald-100 text-emerald-700 border-emerald-200" : parseFloat(das28) < 3.2 ? "bg-yellow-100 text-yellow-700 border-yellow-200" : parseFloat(das28) < 5.1 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                  {parseFloat(das28) < 2.6 ? "Remission" : parseFloat(das28) < 3.2 ? "Low Activity" : parseFloat(das28) < 5.1 ? "Moderate Activity" : "High Activity"}
                </span>
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-600">Score will appear here after calculation.</p>
            )}
          </div>
          <PrimaryBtn onClick={() => setDas28("4.2")} className="flex-shrink-0 text-sm py-2.5 px-4">
            Calculate for Selected Appointment
          </PrimaryBtn>
        </Card>
      </div>

      <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
        {saved && <span className="text-emerald-600 font-700">✓ Diagnosis saved! All set.</span>}
        {!saved && <span />}
        <PrimaryBtn onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000) }} className="sm:min-w-[180px]" fullWidth={false}>
          💾 Save Diagnosis
        </PrimaryBtn>
      </div>
    </div>
  )
}

// ─── Doctor Dashboard ─────────────────────────────────────────────────────────
export default function DoctorDashboard({ onSwitch }: { onSwitch: () => void }) {
  const [language, setLanguage] = useState("English")
  const [activeTab, setActiveTab] = useState<DoctorTab>("consultation")
  const [slideOver, setSlideOver] = useState<PatientSummary | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      {slideOver && <PatientSummaryPanel patient={slideOver} onClose={() => setSlideOver(null)} />}

      {/* ── DARK NAVY TOP NAV ── */}
      <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center">
              <HeartPulseIcon />
            </div>
            <span className="font-800 text-teal-400 text-lg tracking-tight hidden sm:block">RheumaLink</span>
          </div>

          {/* Greeting */}
          <div className="flex-1 flex items-center sm:ml-4">
            <p className="text-slate-300 font-600 text-base">
              Hello, <span className="text-teal-400 font-800">Dr. Shweta Gupta</span> 👋
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Compounder switch */}
            <button
              onClick={onSwitch}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-teal-500/40 text-teal-400 font-700 text-sm hover:bg-teal-500/10 transition-colors"
            >
              Compounder Dashboard
            </button>

            {/* Language */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-700 bg-slate-800 cursor-pointer hover:border-slate-600 transition-colors">
              <GlobeIcon />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="appearance-none bg-transparent text-sm font-700 text-slate-300 focus:outline-none cursor-pointer pr-4"
              >
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <span className="text-slate-500 pointer-events-none"><ChevronIcon /></span>
            </div>

            {/* Logout */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-600 text-slate-300 font-700 text-sm hover:bg-slate-800 hover:border-slate-500 transition-colors">
              <LogoutIcon /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-800 text-slate-800">🩺 Doctor Desk</h1>
            <p className="text-slate-500 font-500 text-sm mt-0.5">Consultations, prescriptions, and patient management</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-700 text-sm rounded-xl shadow-sm transition-all">
            <UploadIcon /> <span className="hidden sm:inline">Upload Patient Lab Reports</span><span className="sm:hidden">Upload</span>
          </button>
        </div>

        {/* ── SEARCH ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3">
          <p className="font-800 text-slate-700 text-base">🔍 Patient &amp; File Search</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, contact, or file number…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
            </div>
            <button className="px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors flex items-center">
              <SearchIcon />
            </button>
          </div>
        </div>

        {/* ── TODAY'S SUMMARY STATS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Waiting", value: 5, icon: <ClockIcon />, bg: "bg-slate-100", text: "text-slate-600", iconBg: "bg-slate-200" },
            { label: "Attending", value: 1, icon: <StethoscopeIcon />, bg: "bg-amber-50", text: "text-amber-700", iconBg: "bg-amber-100" },
            { label: "Attended", value: 2, icon: <CheckCircleIcon />, bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-emerald-100" },
            { label: "Total Today", value: 8, icon: <CalendarIcon />, bg: "bg-sky-50", text: "text-sky-700", iconBg: "bg-sky-100" },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-white/80 shadow-sm`}>
              <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center ${stat.text} mb-3`}>
                {stat.icon}
              </div>
              <p className={`text-4xl font-800 ${stat.text} leading-none`}>{stat.value}</p>
              <p className="text-slate-500 font-600 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── ATTENDING TABLE ── */}
        <PatientTable
          title="Attending Patients"
          patients={ATTENDING}
          attending={true}
          onAction={p => setSlideOver(p)}
        />

        {/* ── ATTENDED TABLE ── */}
        <PatientTable
          title="Attended Patients"
          patients={ATTENDED}
          attending={false}
          onAction={p => setSlideOver(p)}
        />

        {/* ── MAIN FORMS SECTION ── */}
        <div>
          <SectionTitle icon="⚡" title="Quick Actions" />

          {/* Tab bar */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {([
              { id: "consultation" as DoctorTab, label: "📋 Consultation & Prescription" },
              { id: "diagnosis" as DoctorTab, label: "📖 Diagnosis Book" },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl font-700 text-sm transition-all border-2 ${activeTab === tab.id ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-sky-50">
              <h3 className="font-800 text-teal-800 text-lg">
                {activeTab === "consultation" ? "📋 Consultation & Prescription" : "📖 Diagnosis Book"}
              </h3>
            </div>
            {activeTab === "consultation" ? <ConsultationForm /> : <DiagnosisBookForm />}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
