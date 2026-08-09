import { useState } from 'react'
import DoctorDashboard from './DoctorDashboard'

// ─── Icons ───────────────────────────────────────────────────────────────────
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

const UserPlusIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
)

const CalendarPlusIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="12" y1="14" x2="12" y2="18" />
    <line x1="10" y1="16" x2="14" y2="16" />
  </svg>
)

const ClipboardIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
)

const GlobeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const MicIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const HeartPulseIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

// ─── Types ────────────────────────────────────────────────────────────────────
type ActiveTab = "register" | "appointment" | "medical"
type AppStatus = "to-be-attended" | "attended" | "cancelled" | "no-show"

interface VitalsState {
  weight: string
  height: string
  sysBP: string
  diaBP: string
  pulse: string
  spo2: string
  temp: string
  pain: string
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const samplePatients = [
  { name: "Alpa Jaiswar", contact: "+91 98201 44321", internalFile: "RL-26-00011", externalFile: "EXT-0001", type: "Regular" },
  { name: "Ramesh Shetty", contact: "+91 97654 32100", internalFile: "RL-26-00012", externalFile: "—", type: "Free" },
  { name: "Meena Kulkarni", contact: "+91 90001 23456", internalFile: "RL-26-00013", externalFile: "EXT-0042", type: "Regular" },
  { name: "Jayesh Patel", contact: "+91 91234 56789", internalFile: "RL-26-00014", externalFile: "—", type: "Free" },
]

const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"]

const COMORBIDITIES = [
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

const LANGUAGES = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada"]
const DOCTORS = ["Dr. Shweta Gupta", "Dr. Arvind Mehta", "Dr. Priya Nair"]

const STATUS_OPTS: { value: AppStatus; label: string; color: string }[] = [
  { value: "to-be-attended", label: "To Be Attended", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "attended", label: "Attended", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700 border-red-300" },
  { value: "no-show", label: "No Show / Absent", color: "bg-slate-100 text-slate-600 border-slate-300" },
]

// ─── Subcomponents ────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-700 text-slate-600 mb-1.5">{children}</label>
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400"
    />
  )
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
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

function Textarea({ micButton = false, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { micButton?: boolean }) {
  return (
    <div className="relative">
      <textarea
        {...props}
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400 resize-none pr-12"
        rows={3}
      />
      {micButton && (
        <button
          type="button"
          title="Voice to text"
          className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
        >
          <MicIcon />
        </button>
      )}
    </div>
  )
}

function PrimaryBtn({ children, onClick, type = "button", className = "" }: {
  children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-700 text-base rounded-xl shadow-sm transition-all ${className}`}
    >
      {children}
    </button>
  )
}

function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 font-700 text-base rounded-xl border-2 border-slate-200 transition-all"
    >
      {children}
    </button>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors ${checked ? "bg-teal-500" : "bg-slate-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-7" : "translate-x-1"}`}
      />
    </button>
  )
}

function StatusPill({ status }: { status: AppStatus }) {
  const opt = STATUS_OPTS.find(o => o.value === status)!
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-700 border ${opt.color}`}>
      {opt.label}
    </span>
  )
}

// ─── Section: Register Patient ────────────────────────────────────────────────
function RegisterPatientForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", sex: "", contact: "", email: "",
    type: "Regular", externalFile: ""
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setForm({ firstName: "", lastName: "", dob: "", sex: "", contact: "", email: "", type: "Regular", externalFile: "" })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>First Name</Label>
          <Input placeholder="e.g. Alpa" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input placeholder="e.g. Jaiswar" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
        </div>
        <div>
          <Label>Sex</Label>
          <Select value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}>
            <option value="">Select…</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Select>
        </div>
        <div>
          <Label>Contact Number</Label>
          <Input type="tel" placeholder="+91 98XXX XXXXX" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
        </div>
        <div>
          <Label>Email Address</Label>
          <Input type="email" placeholder="patient@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <Label>Patient Type</Label>
          <div className="flex gap-3 mt-1">
            {["Regular", "Free"].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`flex-1 py-3 rounded-xl border-2 font-700 text-base transition-all ${form.type === t ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-500 hover:border-teal-300"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>External File Number <span className="text-slate-400 font-500">(Optional)</span></Label>
          <Input placeholder="e.g. EXT-0042" value={form.externalFile} onChange={e => setForm(f => ({ ...f, externalFile: e.target.value }))} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        {saved && (
          <span className="text-emerald-600 font-700 text-base flex items-center gap-2">
            ✓ All set! Patient registered successfully.
          </span>
        )}
        {!saved && <span />}
        <PrimaryBtn onClick={handleSave}>
          <UserPlusIcon /> Register Patient
        </PrimaryBtn>
      </div>
    </div>
  )
}

// ─── Section: Create Appointment ──────────────────────────────────────────────
function CreateAppointmentForm() {
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const nowTime = new Date().toTimeString().slice(0, 5)

  const [form, setForm] = useState({
    patient: "", doctor: "", date: today, time: nowTime, status: "to-be-attended" as AppStatus, reason: ""
  })
  const [saved, setSaved] = useState(false)

  const handleBook = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Patient</Label>
          <Select value={form.patient} onChange={e => setForm(f => ({ ...f, patient: e.target.value }))}>
            <option value="">Select patient…</option>
            {samplePatients.map(p => (
              <option key={p.internalFile}>{p.name} — {p.internalFile}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Doctor</Label>
          <Select value={form.doctor} onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))}>
            <option value="">Select doctor…</option>
            {DOCTORS.map(d => <option key={d}>{d}</option>)}
          </Select>
        </div>
        <div>
          <Label>Appointment Date</Label>
          <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <div className="flex gap-2 mt-2">
            {[{ label: "Today", value: today }, { label: "Tomorrow", value: tomorrow }, { label: "Now", value: today }].map(chip => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setForm(f => ({ ...f, date: chip.value, time: chip.label === "Now" ? nowTime : f.time }))}
                className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 font-700 text-sm border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Appointment Time</Label>
          <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {STATUS_OPTS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, status: opt.value }))}
                className={`px-4 py-2.5 rounded-xl border-2 font-700 text-sm transition-all ${form.status === opt.value ? opt.color + " border-current" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label>Reason for Visit</Label>
          <Textarea
            placeholder="e.g. Follow-up for joint pain management…"
            value={form.reason}
            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        {saved ? (
          <span className="text-emerald-600 font-700 text-base">✓ Appointment booked! All set.</span>
        ) : <span />}
        <PrimaryBtn onClick={handleBook}>
          <CalendarPlusIcon /> Book Appointment
        </PrimaryBtn>
      </div>
    </div>
  )
}

// ─── Section: Medical History ─────────────────────────────────────────────────
function MedicalHistoryForm() {
  const [bloodGroup, setBloodGroup] = useState("")
  const [familyHistory, setFamilyHistory] = useState("")
  const [allergies, setAllergies] = useState("")
  const [smokes, setSmokes] = useState(false)
  const [alcoholic, setAlcoholic] = useState(false)
  const [comorbidities, setComorbidities] = useState<string[]>([])
  const [customComorbidity, setCustomComorbidity] = useState("")
  const [saved, setSaved] = useState(false)

  const toggleComorbidity = (c: string) =>
    setComorbidities(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 space-y-7">
      <div>
        <Label>Blood Group</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {BLOOD_GROUPS.map(bg => (
            <button
              key={bg}
              type="button"
              onClick={() => setBloodGroup(bg)}
              className={`px-4 py-2.5 rounded-xl border-2 font-800 text-sm transition-all min-w-[52px] ${bloodGroup === bg ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"}`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Family History 🎙️</Label>
          <Textarea
            placeholder="e.g. Father had diabetes, mother had hypertension…"
            value={familyHistory}
            onChange={e => setFamilyHistory(e.target.value)}
            micButton
          />
        </div>
        <div>
          <Label>Known Allergies 🎙️</Label>
          <Textarea
            placeholder="e.g. Penicillin, sulfa drugs, shellfish…"
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
            micButton
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border-2 border-slate-200">
          <span className="font-700 text-slate-700 text-base">🚬 Smokes</span>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-700 ${smokes ? "text-teal-600" : "text-slate-400"}`}>{smokes ? "Yes" : "No"}</span>
            <Toggle checked={smokes} onChange={setSmokes} />
          </div>
        </div>
        <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border-2 border-slate-200">
          <span className="font-700 text-slate-700 text-base">🍷 Alcoholic</span>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-700 ${alcoholic ? "text-teal-600" : "text-slate-400"}`}>{alcoholic ? "Yes" : "No"}</span>
            <Toggle checked={alcoholic} onChange={setAlcoholic} />
          </div>
        </div>
      </div>

      <div>
        <Label>Comorbidities</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
          {COMORBIDITIES.map(c => {
            const checked = comorbidities.includes(c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleComorbidity(c)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-left font-600 text-sm transition-all ${checked ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-slate-50"}`}
              >
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? "border-teal-500 bg-teal-500" : "border-slate-300 bg-white"}`}>
                  {checked && <svg width="12" height="12" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>}
                </span>
                {c}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <Label>Other / Custom Comorbidity 🎙️</Label>
        <div className="relative">
          <Input
            placeholder="Type any other condition…"
            value={customComorbidity}
            onChange={e => setCustomComorbidity(e.target.value)}
          />
          <button
            type="button"
            title="Voice to text"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
          >
            <MicIcon />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
        {saved ? (
          <span className="text-emerald-600 font-700 text-base">✓ Medical history saved! All set.</span>
        ) : <span />}
        <div className="flex gap-3 ml-auto">
          <SecondaryBtn onClick={() => {}}>Cancel</SecondaryBtn>
          <PrimaryBtn onClick={handleSave}>
            <ClipboardIcon /> Save Medical History
          </PrimaryBtn>
        </div>
      </div>
    </div>
  )
}

// ─── Vitals Mini-Form ─────────────────────────────────────────────────────────
function VitalsMiniForm({ onSave }: { onSave: () => void }) {
  const [vitals, setVitals] = useState<VitalsState>({
    weight: "", height: "", sysBP: "", diaBP: "", pulse: "", spo2: "", temp: "", pain: ""
  })

  const fields: { key: keyof VitalsState; label: string; placeholder: string }[] = [
    { key: "weight", label: "Weight (kg)", placeholder: "65" },
    { key: "height", label: "Height (cm)", placeholder: "168" },
    { key: "sysBP", label: "Sys BP", placeholder: "120" },
    { key: "diaBP", label: "Dia BP", placeholder: "80" },
    { key: "pulse", label: "Pulse (/min)", placeholder: "72" },
    { key: "spo2", label: "SpO₂ (%)", placeholder: "98" },
    { key: "temp", label: "Temp (°C)", placeholder: "37.0" },
    { key: "pain", label: "Pain Scale (0–100)", placeholder: "0" },
  ]

  return (
    <div className="mt-3 p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-3">
      <p className="text-sm font-700 text-sky-700">📊 Record Vitals</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {fields.map(f => (
          <div key={f.key}>
            <p className="text-xs font-700 text-slate-500 mb-1">{f.label}</p>
            <input
              type="number"
              placeholder={f.placeholder}
              value={vitals[f.key]}
              onChange={e => setVitals(v => ({ ...v, [f.key]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border-2 border-sky-200 bg-white text-slate-800 text-sm font-600 focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <PrimaryBtn onClick={onSave} className="text-sm py-2 px-4">Save Vitals</PrimaryBtn>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<"compounder" | "doctor">("compounder")
  const [activeTab, setActiveTab] = useState<ActiveTab>("register")
  const [showVitals, setShowVitals] = useState(false)
  const [vitalsShownRow, setVitalsShownRow] = useState<number | null>(null)
  const [selectedPatients, setSelectedPatients] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [language, setLanguage] = useState("English")
  const [liveStatus, setLiveStatus] = useState<AppStatus>("to-be-attended")

  if (view === "doctor") return <DoctorDashboard onSwitch={() => setView("compounder")} />

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "register", label: "Register Patient", icon: <UserPlusIcon /> },
    { id: "appointment", label: "Create Appointment", icon: <CalendarPlusIcon /> },
    { id: "medical", label: "Patient Medical Info & History", icon: <ClipboardIcon /> },
  ]

  return (
    <div className="min-h-screen bg-sky-50 font-sans">

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
              <HeartPulseIcon />
            </div>
            <span className="font-800 text-teal-700 text-lg tracking-tight hidden sm:block">RheumaLink</span>
          </div>

          {/* Greeting */}
          <div className="flex-1 flex items-center justify-center sm:justify-start sm:ml-4">
            <p className="text-slate-700 font-600 text-base">
              Hello, <span className="text-teal-700 font-800">Sneha</span> 👋
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setView("doctor")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-teal-300 text-teal-700 font-700 text-sm hover:bg-teal-50 transition-colors"
            >
              Doctor Dashboard
            </button>
            {/* Language dropdown */}
            <div className="relative">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-200 text-slate-600 bg-white cursor-pointer hover:border-slate-300 transition-colors">
                <GlobeIcon />
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="appearance-none bg-transparent text-sm font-700 text-slate-600 focus:outline-none cursor-pointer pr-5"
                >
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
                <span className="text-slate-400 pointer-events-none"><ChevronIcon /></span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-800 text-slate-800">🖥️ Compounder Desk</h1>
            <p className="text-slate-500 font-500 text-sm mt-0.5">Manage patients, appointments, and records</p>
          </div>
          <PrimaryBtn>
            <UploadIcon /> <span className="hidden sm:inline">Upload Patient Lab Reports</span><span className="sm:hidden">Upload</span>
          </PrimaryBtn>
        </div>

        {/* ── OVERVIEW STATS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Today's Appointments */}
          <Card className="p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center flex-shrink-0">
              <CalendarPlusIcon />
            </div>
            <div>
              <p className="text-5xl font-800 text-teal-700 leading-none">8</p>
              <p className="text-slate-500 font-600 text-sm mt-1">appointments today</p>
              <p className="font-700 text-base text-slate-700 mt-0.5">Today's Appointments</p>
            </div>
          </Card>

          {/* Search */}
          <Card className="p-6 flex flex-col justify-center gap-3">
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
          </Card>
        </div>

        {/* ── RECENTLY REGISTERED PATIENTS ── */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg">👥</span>
            <h2 className="font-800 text-slate-800 text-lg">Recently Registered Patients</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Name", "Contact", "Internal File No.", "External File No.", "Type", "Action"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-800 text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {samplePatients.map((p, i) => (
                  <tr key={p.internalFile} className={`border-b border-slate-50 hover:bg-teal-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}>
                    <td className="px-5 py-4 font-700 text-slate-800 whitespace-nowrap">{p.name}</td>
                    <td className="px-5 py-4 text-slate-600 font-500 whitespace-nowrap">{p.contact}</td>
                    <td className="px-5 py-4 font-700 text-teal-700 whitespace-nowrap">{p.internalFile}</td>
                    <td className="px-5 py-4 text-slate-500 font-500 whitespace-nowrap">{p.externalFile}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-700 ${p.type === "Regular" ? "bg-sky-100 text-sky-700" : "bg-violet-100 text-violet-700"}`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPatients.has(i)}
                          onChange={() => {
                            const s = new Set(selectedPatients)
                            s.has(i) ? s.delete(i) : s.add(i)
                            setSelectedPatients(s)
                          }}
                          className="w-4 h-4 rounded accent-teal-500"
                        />
                        <button className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 font-700 text-xs border border-teal-200 hover:bg-teal-100 transition-colors whitespace-nowrap">
                          Select
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── THREE CORE TASKS ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⚡</span>
            <h2 className="font-800 text-slate-800 text-lg">Quick Actions</h2>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-700 text-sm transition-all border-2 ${activeTab === tab.id ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50"}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === "register" ? "Register" : tab.id === "appointment" ? "Appointment" : "Medical Info"}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-sky-50 flex items-center gap-2">
              <span className="text-teal-600">{tabs.find(t => t.id === activeTab)?.icon}</span>
              <h3 className="font-800 text-teal-800 text-lg">{tabs.find(t => t.id === activeTab)?.label}</h3>
            </div>
            {activeTab === "register" && <RegisterPatientForm />}
            {activeTab === "appointment" && <CreateAppointmentForm />}
            {activeTab === "medical" && (
              <>
                <div className="px-6 pt-5 pb-0">
                  <div className="flex items-center gap-2 mb-0">
                    <span className="text-xl">📋</span>
                    <h4 className="font-800 text-slate-700 text-base">Medical History</h4>
                  </div>
                </div>
                <MedicalHistoryForm />
              </>
            )}
          </Card>
        </div>

        {/* ── LIVE APPOINTMENT DESK ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🟢</span>
            <h2 className="font-800 text-slate-800 text-lg">Live Appointment Desk</h2>
            <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live
            </span>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Token", "Patient", "Doctor", "Status", "Vitals", "Update"].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left font-800 text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Sample row */}
                  <tr className="border-b border-slate-50 bg-white hover:bg-teal-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="w-9 h-9 rounded-xl bg-teal-600 text-white font-800 text-base flex items-center justify-center">1</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-800 text-slate-800 whitespace-nowrap">Alpa Jaiswar</p>
                      <p className="text-slate-400 font-500 text-xs mt-0.5">File: RL-26-00011 · Ext: EXT-0001</p>
                    </td>
                    <td className="px-5 py-4 font-600 text-slate-700 whitespace-nowrap">Dr. Shweta Gupta</td>
                    <td className="px-5 py-4">
                      <Select
                        value={liveStatus}
                        onChange={e => setLiveStatus(e.target.value as AppStatus)}
                      >
                        {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </Select>
                    </td>
                    <td className="px-5 py-4 min-w-[180px]">
                      <div>
                        <button
                          onClick={() => setVitalsShownRow(vitalsShownRow === 0 ? null : 0)}
                          className="px-3 py-2 rounded-lg bg-sky-50 text-sky-700 font-700 text-xs border border-sky-200 hover:bg-sky-100 transition-colors whitespace-nowrap"
                        >
                          {vitalsShownRow === 0 ? "Hide Vitals" : "Add / Edit Vitals"}
                        </button>
                        {vitalsShownRow === 0 && (
                          <VitalsMiniForm onSave={() => { setVitalsShownRow(null); setShowVitals(true); setTimeout(() => setShowVitals(false), 3000) }} />
                        )}
                        {showVitals && vitalsShownRow === null && (
                          <p className="text-emerald-600 font-700 text-xs mt-2">✓ Vitals saved!</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button className="px-3 py-2 rounded-lg bg-teal-50 text-teal-700 font-700 text-xs border border-teal-200 hover:bg-teal-100 transition-colors">
                        Update
                      </button>
                    </td>
                  </tr>

                  {/* Empty state hint */}
                  <tr className="border-b border-slate-50">
                    <td colSpan={6} className="px-5 py-5 text-center">
                      <p className="text-slate-400 italic text-sm font-500">No more appointments at this time. You're all caught up! 🎉</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  )
}
