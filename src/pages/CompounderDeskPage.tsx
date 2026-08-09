import React, { useState } from "react"
import { ActiveTab, AppStatus } from "../types/compounder"
import { samplePatients, STATUS_OPTS } from "../data/compounderData"
import { TopNav } from "../components/compounder/TopNav"
import { RegisterPatientForm } from "../components/compounder/RegisterPatientForm"
import { CreateAppointmentForm } from "../components/compounder/CreateAppointmentForm"
import { MedicalHistoryForm } from "../components/compounder/MedicalHistoryForm"
import { VitalsMiniForm } from "../components/compounder/VitalsMiniForm"
import { Card } from "../components/ui/Card"
import { PrimaryBtn } from "../components/ui/Buttons"
import { Select } from "../components/ui/Select"
import {
  UserPlusIcon, CalendarPlusIcon, ClipboardIcon, UploadIcon, SearchIcon
} from "../components/icons"

export function CompounderDeskPage({ onSwitchDoctor }: { onSwitchDoctor: () => void }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("register")
  const [showVitals, setShowVitals] = useState(false)
  const [vitalsShownRow, setVitalsShownRow] = useState<number | null>(null)
  const [selectedPatients, setSelectedPatients] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [language, setLanguage] = useState("English")
  const [liveStatus, setLiveStatus] = useState<AppStatus>("to-be-attended")

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "register", label: "Register Patient", icon: <UserPlusIcon /> },
    { id: "appointment", label: "Create Appointment", icon: <CalendarPlusIcon /> },
    { id: "medical", label: "Patient Medical Info & History", icon: <ClipboardIcon /> },
  ]

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      <TopNav language={language} setLanguage={setLanguage} onSwitchDoctor={onSwitchDoctor} />

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
