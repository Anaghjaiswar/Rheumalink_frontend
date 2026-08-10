import React, { useState } from "react"
import { CompounderTab } from "../types/compounder"
import { ATTENDING_TODAY, ATTENDED_TODAY } from "../data/compounderData"
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
}: {
  onSwitchDoctor: () => void
  onOpenUploadLabReport?: () => void
}) {
  const [language, setLanguage] = useState("en-IN")
  const [activeTab, setActiveTab] = useState<CompounderTab>("register")
  const [searchQuery, setSearchQuery] = useState("")
  const [slideOver, setSlideOver] = useState<PatientSummary | null>(null)

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      {slideOver && <PatientSummaryPanel patient={slideOver} onClose={() => setSlideOver(null)} />}

      <TopNav language={language} setLanguage={setLanguage} onSwitchDoctor={onSwitchDoctor} />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-800 text-slate-800">📋 Compounder Desk</h1>
            <p className="text-slate-500 font-500 text-sm mt-0.5">Register patients, manage appointments &amp; log vitals</p>
          </div>
          <button
            onClick={onOpenUploadLabReport}
            className="flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-700 text-sm rounded-xl shadow-sm transition-all cursor-pointer"
          >
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

        {/* Today's Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatTile label="Waiting" value={1} icon={<ClockIcon />} bg="bg-slate-100" text="text-slate-600" />
          <StatTile label="Attending" value={1} icon={<StethoscopeIcon />} bg="bg-amber-50" text="text-amber-700" />
          <StatTile label="Attended" value={2} icon={<CheckCircleIcon />} bg="bg-emerald-50" text="text-emerald-700" />
          <StatTile label="Total Today" value={4} icon={<CalendarIcon />} bg="bg-sky-50" text="text-sky-700" />
        </div>

        {/* Today's Patients Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSection title="🩺 Attending Today" count={ATTENDING_TODAY.length}>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <th className="p-3 text-left font-700">Token</th>
                  <th className="p-3 text-left font-700">Patient</th>
                  <th className="p-3 text-left font-700">File No.</th>
                  <th className="p-3 text-left font-700">Status</th>
                  <th className="p-3 text-left font-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {ATTENDING_TODAY.map((pat, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-3 font-800 text-teal-700">{pat.token}</td>
                    <td className="p-3 font-700 text-slate-800">{pat.name}</td>
                    <td className="p-3 text-slate-500 font-500">{pat.file}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-700 bg-amber-100 text-amber-700 border border-amber-200">
                        {pat.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSlideOver({
                          token: pat.token,
                          name: pat.name,
                          fileNumber: pat.file,
                          externalFileNumber: pat.file,
                          phone: "9876543210",
                          gender: "F",
                          age: 42,
                          status: pat.status,
                          doctor: "Dr. Shweta Gupta",
                          type: "Regular",
                          fee: 500,
                          paymentStatus: "Paid",
                          visitReason: "Follow up for Joint Stiffness",
                        })}
                        className="px-3 py-1 bg-white hover:bg-teal-50 text-teal-700 font-700 rounded-lg border border-teal-200 transition-colors"
                      >
                        View Summary
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>

          <TableSection title="✅ Attended Today" count={ATTENDED_TODAY.length}>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <th className="p-3 text-left font-700">Token</th>
                  <th className="p-3 text-left font-700">Patient</th>
                  <th className="p-3 text-left font-700">File No.</th>
                  <th className="p-3 text-left font-700">Status</th>
                  <th className="p-3 text-left font-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {ATTENDED_TODAY.map((pat, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-3 font-800 text-emerald-700">{pat.token}</td>
                    <td className="p-3 font-700 text-slate-800">{pat.name}</td>
                    <td className="p-3 text-slate-500 font-500">{pat.file}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-700 bg-emerald-100 text-emerald-700 border border-emerald-200">
                        {pat.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSlideOver({
                          token: pat.token,
                          name: pat.name,
                          fileNumber: pat.file,
                          externalFileNumber: pat.file,
                          phone: "9876543210",
                          gender: "M",
                          age: 50,
                          status: pat.status,
                          doctor: "Dr. Arvind Mehta",
                          type: "Regular",
                          fee: 500,
                          paymentStatus: "Paid",
                          visitReason: "Routine Blood Work Review",
                        })}
                        className="px-3 py-1 bg-white hover:bg-teal-50 text-teal-700 font-700 rounded-lg border border-teal-200 transition-colors"
                      >
                        View Summary
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>
        </div>

        {/* Tab Navigation Form Section */}
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { id: "register" as CompounderTab, label: "👤 Register New Patient", icon: <UserPlusIcon /> },
              { id: "appointment" as CompounderTab, label: "📅 Create Appointment" },
              { id: "history" as CompounderTab, label: "📜 Add Medical History" },
              { id: "vitals" as CompounderTab, label: "💓 Add Vitals" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl font-700 text-sm transition-all border-2 ${
                  activeTab === tab.id
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-sky-50">
              <h3 className="font-800 text-teal-800 text-lg">
                {activeTab === "register" && "👤 Register New Patient"}
                {activeTab === "appointment" && "📅 Create Appointment"}
                {activeTab === "history" && "📜 Add Medical History"}
                {activeTab === "vitals" && "💓 Add Vitals"}
              </h3>
            </div>
            {activeTab === "register" && <RegisterPatientForm />}
            {activeTab === "appointment" && <CreateAppointmentForm />}
            {activeTab === "history" && <MedicalHistoryForm />}
            {activeTab === "vitals" && <VitalsMiniForm />}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
