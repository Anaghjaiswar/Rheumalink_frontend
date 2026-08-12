import React, { useState, useEffect } from "react"
import { DoctorTab } from "../types/doctor"
import { DoctorTopNav } from "../components/doctor/DoctorTopNav"
import { PatientSummaryPanel } from "../components/doctor/PatientSummaryPanel"
import { PatientTable } from "../components/doctor/PatientTable"
import { ConsultationForm } from "../components/doctor/ConsultationForm"
import { DiagnosisBookForm } from "../components/doctor/DiagnosisBookForm"
import {
  UploadIcon, SearchIcon, ClockIcon, StethoscopeIcon, CheckCircleIcon, CalendarIcon
} from "../components/icons"
import { fetchDoctorDashboard, fetchCompounderDashboard } from "../services/api"

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
  
  // Live SlideOver drawer state for Medical Summary
  const [slideOverPatient, setSlideOverPatient] = useState<any | null>(null)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Active selected patient & appointment across doctor forms
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)

  const [attendingList, setAttendingList] = useState<any[]>([])
  const [attendedList, setAttendedList] = useState<any[]>([])
  const [waitingList, setWaitingList] = useState<any[]>([])
  const [counts, setCounts] = useState({ waiting: 0, attending: 0, attended: 0, total_today: 0 })

  useEffect(() => {
    fetchDoctorDashboard()
      .then(res => {
        if (res.ok) {
          if (res.attending) setAttendingList(res.attending)
          if (res.attended) setAttendedList(res.attended)
          if (res.waiting) setWaitingList(res.waiting)
          if (res.counts) setCounts(res.counts)
        }
      })
      .catch(() => {})
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    fetchCompounderDashboard(searchQuery)
      .then(res => {
        setIsSearching(false)
        if (res.ok && res.search_results) {
          setSearchResults(res.search_results)
        }
      })
      .catch(() => setIsSearching(false))
  }

  const handleStartConsultation = (p: any) => {
    setSelectedAppointment(p)
    setSelectedPatient({ id: p.patient_id || p.id, name: p.patient_name || p.name, internal_file: p.file || p.internal_file })
    setActiveTab("consultation")
    const el = document.getElementById("doctor-quick-actions")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      {slideOverPatient && (
        <PatientSummaryPanel
          patientId={slideOverPatient.patient_id || slideOverPatient.id}
          appointmentId={slideOverPatient.id}
          patientName={slideOverPatient.patient_name || slideOverPatient.name}
          fileNumber={slideOverPatient.file || slideOverPatient.internal_file}
          externalFile={slideOverPatient.external_file}
          onClose={() => setSlideOverPatient(null)}
        />
      )}

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

        {/* ── SEARCH BAR & SEARCH RESULTS ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4">
          <p className="font-800 text-slate-700 text-base">🔍 Patient &amp; File Search</p>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by patient name, contact number, or file number…"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  if (!e.target.value.trim()) setSearchResults([])
                }}
                className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSearching ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SearchIcon />}
              Search
            </button>
          </form>

          {/* Active Selected Patient Banner */}
          {(selectedPatient || selectedAppointment) && (
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-700 flex items-center justify-between">
              <span>🎯 Active Patient Selected: <strong>{selectedPatient?.name || selectedAppointment?.patient_name}</strong> ({selectedPatient?.internal_file || selectedAppointment?.file})</span>
              <button onClick={() => { setSelectedPatient(null); setSelectedAppointment(null); }} className="text-teal-600 hover:underline cursor-pointer">
                Clear Selection
              </button>
            </div>
          )}

          {/* Render Search Results List with Dual Buttons */}
          {searchResults.length > 0 && (
            <div className="mt-2 border-t border-slate-100 pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-700 text-slate-500 uppercase tracking-wide">
                <span>Matching Patients ({searchResults.length})</span>
                <button onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="text-teal-600 hover:underline cursor-pointer">
                  Clear
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition-all flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <p className="font-800 text-slate-800 text-sm">{p.name}</p>
                      <p className="text-xs text-slate-500 font-600 mt-0.5">📞 {p.contact || "No Contact"}</p>
                      <p className="text-xs text-teal-700 font-700 mt-1">📁 File: {p.internal_file}</p>
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-slate-200/60">
                      <button
                        onClick={() => setSlideOverPatient(p)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-700 hover:bg-slate-100 transition-colors cursor-pointer text-center"
                      >
                        Medical Summary
                      </button>
                      <button
                        onClick={() => handleStartConsultation(p)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-teal-600 text-white text-xs font-700 hover:bg-teal-700 transition-colors cursor-pointer text-center shadow-2xs"
                      >
                        ⚡ Select Patient
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── STAT TILES ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Waiting Queue", value: counts.waiting, icon: <ClockIcon />, bg: "bg-slate-100", text: "text-slate-600", iconBg: "bg-slate-200" },
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
            onOpenSummary={p => setSlideOverPatient(p)}
            onStartConsultation={p => handleStartConsultation(p)}
          />

          <PatientTable
            title="Attended Patients"
            patients={attendedList}
            attending={false}
            onOpenSummary={p => setSlideOverPatient(p)}
            onStartConsultation={p => handleStartConsultation(p)}
          />
        </div>

        {/* ── MAIN FORMS SECTION ── */}
        <div id="doctor-quick-actions">
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
              <ConsultationForm
                selectedPatient={selectedPatient}
                selectedAppointment={selectedAppointment}
              />
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
