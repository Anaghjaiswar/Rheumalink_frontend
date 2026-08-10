import React, { useState, useEffect } from "react"
import { CompounderTab } from "../types/compounder"
import { TopNav } from "../components/compounder/TopNav"
import { RegisterPatientForm } from "../components/compounder/RegisterPatientForm"
import { CreateAppointmentForm } from "../components/compounder/CreateAppointmentForm"
import { MedicalHistoryForm } from "../components/compounder/MedicalHistoryForm"
import { VitalsMiniForm } from "../components/compounder/VitalsMiniForm"
import { PatientSummaryPanel } from "../components/doctor/PatientSummaryPanel"
import { PatientSummary } from "../types/doctor"
import {
  UserPlusIcon, SearchIcon, ClockIcon, StethoscopeIcon, CheckCircleIcon, CalendarIcon, UploadIcon
} from "../components/icons"
import { fetchCompounderDashboard } from "../services/api"

function TableSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h2 className="font-800 text-slate-800 text-base">{title}</h2>
        <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-700">{count} Today</span>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

function StatTile({ label, value, icon, bg, text }: { label: string; value: number; icon: React.ReactNode; bg: string; text: string }) {
  return (
    <div className={`${bg} rounded-2xl p-5 border border-white/80 shadow-sm flex flex-col justify-between`}>
      <div className="w-10 h-10 bg-white/70 rounded-xl flex items-center justify-center text-slate-700 mb-3 shadow-xs">
        {icon}
      </div>
      <div>
        <p className={`text-4xl font-800 ${text} leading-none`}>{value}</p>
        <p className="text-slate-500 font-600 text-sm mt-1">{label}</p>
      </div>
    </div>
  )
}

export function CompounderDeskPage({
  onSwitchDoctor,
  onOpenUploadLabReport,
  onLogout,
}: {
  onSwitchDoctor: () => void
  onOpenUploadLabReport?: () => void
  onLogout?: () => void
}) {
  const [language, setLanguage] = useState("en-IN")
  const [activeTab, setActiveTab] = useState<CompounderTab>("register")
  const [searchQuery, setSearchQuery] = useState("")
  const [slideOver, setSlideOver] = useState<PatientSummary | null>(null)

  const [attendingList, setAttendingList] = useState<any[]>([])
  const [attendedList, setAttendedList] = useState<any[]>([])
  const [counts, setCounts] = useState({ waiting: 0, attending: 0, attended: 0, total_today: 0 })

  useEffect(() => {
    fetchCompounderDashboard()
      .then(res => {
        if (res.ok) {
          if (res.counts) setCounts(res.counts)
          if (res.today_appointments) {
            const attending = res.today_appointments.filter((a: any) => a.status_code === 'I')
            const attended = res.today_appointments.filter((a: any) => a.status_code === 'A')
            setAttendingList(attending)
            setAttendedList(attended)
          }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      {slideOver && <PatientSummaryPanel patient={slideOver} onClose={() => setSlideOver(null)} />}

      <TopNav
        language={language}
        setLanguage={setLanguage}
        onSwitchDoctor={onSwitchDoctor}
        onLogout={onLogout}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-800 text-slate-800">📋 Compounder Desk</h1>
            <p className="text-slate-500 font-500 text-sm mt-0.5">Registration, Vitals, Medical History &amp; Queue Management</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onOpenUploadLabReport}
              className="flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-700 text-sm rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <UploadIcon /> <span className="hidden sm:inline">Upload Patient Lab Reports</span><span className="sm:hidden">Upload</span>
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className="flex items-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-700 text-sm rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <UserPlusIcon /> <span className="hidden sm:inline">Register Patient</span><span className="sm:hidden">Register</span>
            </button>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
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
            <button className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-700 transition-colors flex items-center gap-2">
              <SearchIcon /> Search
            </button>
          </div>
        </div>

        {/* ── STATS TILES ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatTile label="Waiting Queue" value={counts.waiting} icon={<ClockIcon />} bg="bg-slate-100" text="text-slate-700" />
          <StatTile label="Attending Now" value={counts.attending} icon={<StethoscopeIcon />} bg="bg-amber-50" text="text-amber-700" />
          <StatTile label="Attended Today" value={counts.attended} icon={<CheckCircleIcon />} bg="bg-emerald-50" text="text-emerald-700" />
          <StatTile label="Total Today" value={counts.total_today} icon={<CalendarIcon />} bg="bg-sky-50" text="text-sky-700" />
        </div>

        {/* ── ATTENDING & ATTENDED TABLES (SIDE BY SIDE) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSection title="🩺 Attending Patients" count={attendingList.length}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-800 text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Patient Name</th>
                  <th className="px-4 py-3">Internal File</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-600 text-slate-700">
                {attendingList.length > 0 ? (
                  attendingList.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap font-800 text-amber-600">{row.token}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-700 text-slate-900">{row.patient_name || row.name}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">{row.file}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">{row.doctor}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          onClick={() => setSlideOver({
                            name: row.patient_name || row.name,
                            file: row.file,
                            ext: "-",
                            bloodGroup: "-",
                            allergies: "None recorded",
                            familyHistory: "None on record",
                            comorbidities: [],
                            vitals: [],
                          })}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 font-700 text-xs hover:bg-teal-100 transition-colors"
                        >
                          View Summary
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-600 text-xs">
                      No attending patients in queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableSection>

          <TableSection title="✅ Attended Patients" count={attendedList.length}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-800 text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Patient Name</th>
                  <th className="px-4 py-3">Internal File</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-600 text-slate-700">
                {attendedList.length > 0 ? (
                  attendedList.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap font-800 text-emerald-600">{row.token}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-700 text-slate-900">{row.patient_name || row.name}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">{row.file}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">{row.doctor}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          onClick={() => setSlideOver({
                            name: row.patient_name || row.name,
                            file: row.file,
                            ext: "-",
                            bloodGroup: "-",
                            allergies: "None recorded",
                            familyHistory: "None on record",
                            comorbidities: [],
                            vitals: [],
                          })}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-700 text-xs hover:bg-slate-200 transition-colors"
                        >
                          View Summary
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-600 text-xs">
                      No attended patients recorded today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableSection>
        </div>

        {/* ── COMPOUNDER ACTIONS TAB PANELS ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-teal-50 to-sky-50">
            <h2 className="font-800 text-slate-800 text-lg">⚡ Compounder Quick Actions</h2>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "register" as CompounderTab, label: "👤 Register Patient" },
                { id: "appointment" as CompounderTab, label: "📅 Create Appointment" },
                { id: "vitals" as CompounderTab, label: "🩺 Capture Vitals" },
                { id: "medical" as CompounderTab, label: "📜 Patient History" },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-700 transition-all ${activeTab === t.id ? "bg-teal-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "register" && <RegisterPatientForm />}
            {activeTab === "appointment" && <CreateAppointmentForm />}
            {activeTab === "vitals" && <VitalsMiniForm />}
            {activeTab === "medical" && <MedicalHistoryForm />}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
