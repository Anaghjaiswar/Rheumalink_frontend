import React, { useState, useEffect } from "react"
import { DoctorTab, PatientSummary } from "../types/doctor"
import { ATTENDING, ATTENDED } from "../data/doctorData"
import { DoctorTopNav } from "../components/doctor/DoctorTopNav"
import { PatientSummaryPanel } from "../components/doctor/PatientSummaryPanel"
import { PatientTable } from "../components/doctor/PatientTable"
import { ConsultationForm } from "../components/doctor/ConsultationForm"
import { DiagnosisBookForm } from "../components/doctor/DiagnosisBookForm"
import {
  UploadIcon, SearchIcon, ClockIcon, StethoscopeIcon, CheckCircleIcon, CalendarIcon
} from "../components/icons"
import { fetchDoctorDashboard } from "../services/api"

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xl">{icon}</span>
      <h2 className="font-800 text-slate-800 text-lg">{title}</h2>
    </div>
  )
}

export function DoctorDeskPage({
  onSwitchCompounder,
  onOpenJointChart,
  onOpenUploadLabReport,
  onOpenRheumDiagnosis,
  onLogout,
}: {
  onSwitchCompounder: () => void
  onOpenJointChart?: () => void
  onOpenUploadLabReport?: () => void
  onOpenRheumDiagnosis?: () => void
  onLogout?: () => void
}) {
  const [language, setLanguage] = useState("English")
  const [activeTab, setActiveTab] = useState<DoctorTab>("consultation")
  const [slideOver, setSlideOver] = useState<PatientSummary | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [attendingList, setAttendingList] = useState<PatientSummary[]>(ATTENDING)
  const [attendedList, setAttendedList] = useState<PatientSummary[]>(ATTENDED)
  const [counts, setCounts] = useState({ waiting: 5, attending: 1, attended: 2, total_today: 8 })

  useEffect(() => {
    fetchDoctorDashboard()
      .then(res => {
        if (res.ok) {
          if (res.attending) setAttendingList(res.attending)
          if (res.attended) setAttendedList(res.attended)
          if (res.counts) setCounts(res.counts)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      {slideOver && <PatientSummaryPanel patient={slideOver} onClose={() => setSlideOver(null)} />}

      <DoctorTopNav
        language={language}
        setLanguage={setLanguage}
        onSwitchCompounder={onSwitchCompounder}
        onLogout={onLogout}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-800 text-slate-800">🩺 Doctor Desk</h1>
            <p className="text-slate-500 font-500 text-sm mt-0.5">Consultations, prescriptions, and patient management</p>
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

        {/* ── TODAY'S SUMMARY STATS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Waiting", value: counts.waiting, icon: <ClockIcon />, bg: "bg-slate-100", text: "text-slate-600", iconBg: "bg-slate-200" },
            { label: "Attending", value: counts.attending, icon: <StethoscopeIcon />, bg: "bg-amber-50", text: "text-amber-700", iconBg: "bg-amber-100" },
            { label: "Attended", value: counts.attended, icon: <CheckCircleIcon />, bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-emerald-100" },
            { label: "Total Today", value: counts.total_today, icon: <CalendarIcon />, bg: "bg-sky-50", text: "text-sky-700", iconBg: "bg-sky-100" },
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

        {/* ── ATTENDING & ATTENDED TABLES SIDE BY SIDE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatientTable
            title="Attending Patients"
            patients={attendingList}
            attending={true}
            onAction={p => setSlideOver(p)}
          />

          <PatientTable
            title="Attended Patients"
            patients={attendedList}
            attending={false}
            onAction={p => setSlideOver(p)}
          />
        </div>

        {/* ── MAIN FORMS SECTION ── */}
        <div>
          <SectionTitle icon="⚡" title="Quick Actions" />

          {/* Tab bar & Quick Launchers */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setActiveTab("consultation")}
              className={`px-5 py-3 rounded-xl font-700 text-sm transition-all border-2 ${activeTab === "consultation" ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50"}`}
            >
              📋 Consultation &amp; Prescription
            </button>
            <button
              onClick={() => setActiveTab("diagnosis")}
              className={`px-5 py-3 rounded-xl font-700 text-sm transition-all border-2 ${activeTab === "diagnosis" ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50"}`}
            >
              📖 Diagnosis Book
            </button>

            {/* Direct Quick Launch Buttons */}
            <button
              onClick={onOpenRheumDiagnosis}
              className="px-4 py-3 rounded-xl font-700 text-sm transition-all border-2 bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>📖</span> Open Rheum Diagnosis
            </button>
            <button
              onClick={onOpenJointChart}
              className="px-4 py-3 rounded-xl font-700 text-sm transition-all border-2 bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>🦴</span> Open Joint Chart
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-sky-50">
              <h3 className="font-800 text-teal-800 text-lg">
                {activeTab === "consultation" ? "📋 Consultation & Prescription" : "📖 Diagnosis Book"}
              </h3>
            </div>
            {activeTab === "consultation" ? (
              <ConsultationForm />
            ) : (
              <DiagnosisBookForm
                onOpenJointChart={onOpenJointChart}
                onOpenRheumDiagnosis={onOpenRheumDiagnosis}
              />
            )}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
