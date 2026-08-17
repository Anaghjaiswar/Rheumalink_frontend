import React, { useState, useEffect } from "react"
import { CompounderTab } from "../types/compounder"
import { TopNav } from "../components/compounder/TopNav"
import { RegisterPatientForm } from "../components/compounder/RegisterPatientForm"
import { CreateAppointmentForm } from "../components/compounder/CreateAppointmentForm"
import { MedicalHistoryForm } from "../components/compounder/MedicalHistoryForm"
import { VitalsMiniForm } from "../components/compounder/VitalsMiniForm"
import { PatientSummaryPanel } from "../components/doctor/PatientSummaryPanel"
import {
  UserPlusIcon, SearchIcon, UploadIcon, StethoscopeIcon, ClockIcon, CheckCircleIcon, CalendarIcon
} from "../components/icons"
import { fetchCompounderDashboard, updateAppointmentStatus } from "../services/api"
import { useLiveQueueSync } from "../hooks/useLiveQueueSync"


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
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [recentPatientsList, setRecentPatientsList] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // SlideOver drawer state for Medical Summary
  const [slideOverPatient, setSlideOverPatient] = useState<any | null>(null)
  
  // Active selected patient across forms
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)

  const [waitingList, setWaitingList] = useState<any[]>([])
  const [attendingList, setAttendingList] = useState<any[]>([])
  const [attendedList, setAttendedList] = useState<any[]>([])
  const [counts, setCounts] = useState({ waiting: 0, attending: 0, attended: 0, total_today: 0 })

  const loadDashboard = (q?: string) => {
    if (!q || !q.trim()) {
      setSearchResults([])
    }
    setIsSearching(true)
    fetchCompounderDashboard(q)
      .then(res => {
        setIsSearching(false)
        if (res.ok) {
          if (res.counts) setCounts(res.counts)
          if (res.recent_patients) {
            setRecentPatientsList(res.recent_patients)
          }
          if (q && q.trim() && res.search_results) {
            setSearchResults(res.search_results)
          }
          if (res.today_appointments) {
            const waiting = res.today_appointments.filter((a: any) => a.status !== 'I' && a.status_code !== 'I' && a.status !== 'A' && a.status_code !== 'A')
            const attending = res.today_appointments.filter((a: any) => a.status === 'I' || a.status_code === 'I')
            const attended = res.today_appointments.filter((a: any) => a.status === 'A' || a.status_code === 'A')
            setWaitingList(waiting)
            setAttendingList(attending)
            setAttendedList(attended)
          }
        }
      })
      .catch(() => setIsSearching(false))
  }

  // Live Real-Time Queue Synchronization via WebSocket & Polling Fallback
  const { isConnected: isLiveConnected } = useLiveQueueSync({
    onQueueChange: () => {
      loadDashboard(searchQuery)
    },
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  // Live debounced search as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(() => {
      loadDashboard(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      loadDashboard(searchQuery)
    }
  }

  const handleSelectPatientForAction = (patient: any, targetTab: CompounderTab = "appointment") => {
    setSelectedPatient(patient)
    setActiveTab(targetTab)
    const el = document.getElementById("quick-actions-panel")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  const [pendingStatuses, setPendingStatuses] = useState<Record<number | string, string>>({})
  const [updatingApptId, setUpdatingApptId] = useState<number | string | null>(null)

  const handlePendingStatusChange = (appointmentId: number | string, status: string) => {
    setPendingStatuses(prev => ({ ...prev, [appointmentId]: status }))
  }

  const handleConfirmSaveStatus = (appointmentId: number | string) => {
    const targetStatus = pendingStatuses[appointmentId]
    if (!targetStatus) return

    setUpdatingApptId(appointmentId)
    updateAppointmentStatus(appointmentId, { status: targetStatus })
      .then(res => {
        setUpdatingApptId(null)
        if (res.ok) {
          setPendingStatuses(prev => {
            const next = { ...prev }
            delete next[appointmentId]
            return next
          })
          loadDashboard()
        }
      })
      .catch(() => setUpdatingApptId(null))
  }

  const displayList = searchQuery.trim() !== "" ? searchResults : recentPatientsList
  const displayTitle = searchQuery.trim() !== "" ? `Search Results (${searchResults.length})` : `🕒 Recently Registered Patients (${recentPatientsList.length})`

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      {slideOverPatient && (
        <PatientSummaryPanel
          patientId={slideOverPatient.id}
          patientName={slideOverPatient.name}
          fileNumber={slideOverPatient.internal_file}
          externalFile={slideOverPatient.external_file}
          onClose={() => setSlideOverPatient(null)}
        />
      )}

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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-800 text-slate-800">📋 Compounder Desk</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-700 ${isLiveConnected ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                <span className={`w-2 h-2 rounded-full ${isLiveConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                {isLiveConnected ? "🟢 Live Queue Synced" : "⚪ Polling Active"}
              </span>
            </div>
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

        {/* ── SEARCH PANEL ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4">
          <p className="font-800 text-slate-700 text-base">🔍 Patient &amp; File Search</p>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by patient name (e.g. Anagh), contact number, or file number…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
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
          {selectedPatient && (
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-700 flex items-center justify-between">
              <span>🎯 Active Patient Selected for Actions: <strong>{selectedPatient.name}</strong> ({selectedPatient.internal_file})</span>
              <button onClick={() => setSelectedPatient(null)} className="text-teal-600 hover:underline cursor-pointer">
                Clear Selection
              </button>
            </div>
          )}

          {/* Render Recent / Search Patients Cards */}
          {displayList.length > 0 && (
            <div className="mt-2 border-t border-slate-100 pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-700 text-slate-500 uppercase tracking-wide">
                <span>{displayTitle}</span>
                {searchQuery.trim() !== "" && (
                  <button onClick={() => setSearchQuery("")} className="text-teal-600 hover:underline cursor-pointer">
                    Clear Search
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayList.map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition-all flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <p className="font-800 text-slate-800 text-sm">{p.name}</p>
                      <p className="text-xs text-slate-500 font-600 mt-0.5">📞 {p.contact || "No Contact"}</p>
                      <p className="text-xs text-teal-700 font-700 mt-1">📁 File: {p.internal_file}</p>
                    </div>
                    
                    {/* Dual Action Buttons */}
                    <div className="flex gap-2 pt-1 border-t border-slate-200/60">
                      <button
                        onClick={() => setSlideOverPatient(p)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-700 hover:bg-slate-100 transition-colors cursor-pointer text-center"
                      >
                        Medical Summary
                      </button>
                      <button
                        onClick={() => handleSelectPatientForAction(p, "appointment")}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-teal-600 text-white text-xs font-700 hover:bg-teal-700 transition-colors cursor-pointer text-center"
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
          <StatTile label="Waiting Queue" value={counts.waiting} icon={<UserPlusIcon />} bg="bg-amber-50" text="text-amber-700" />
          <StatTile label="Attending Now" value={counts.attending} icon={<StethoscopeIcon />} bg="bg-sky-50" text="text-sky-700" />
          <StatTile label="Attended Today" value={counts.attended} icon={<CheckCircleIcon />} bg="bg-emerald-50" text="text-emerald-700" />
          <StatTile label="Total Visits Today" value={counts.total_today} icon={<CalendarIcon />} bg="bg-teal-50" text="text-teal-700" />
        </div>

        {/* ── QUEUE TABLES ── */}
        <div className="space-y-6">
          {/* OPD / Waiting Queue Section */}
          <TableSection title="⏳ OPD / Live Appointment Desk (To Be Attended)" count={waitingList.length}>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-700 bg-slate-50/50">
                  <th className="px-5 py-3">Token</th>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">File No.</th>
                  <th className="px-5 py-3">Doctor</th>
                  <th className="px-5 py-3">Status Update</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-600">
                {waitingList.length > 0 ? (
                  waitingList.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-amber-700 font-800">{a.token || `Token ${a.token_number}`}</td>
                      <td className="px-5 py-3.5 text-slate-800 font-700">{a.patient_name}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-600">{a.file}</td>
                      <td className="px-5 py-3.5 text-slate-600">{a.doctor_name || a.doctor || 'Unassigned'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1.5 items-start">
                          <select
                            value={pendingStatuses[a.id] !== undefined ? pendingStatuses[a.id] : (a.status || 'T')}
                            onChange={e => handlePendingStatusChange(a.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-700 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-amber-400"
                          >
                            <option value="T">⏳ Waiting</option>
                            <option value="I">🩺 Attending</option>
                            <option value="A">✅ Attended</option>
                            <option value="C">❌ Cancelled</option>
                            <option value="N">🚫 No Show</option>
                          </select>
                          {pendingStatuses[a.id] !== undefined && pendingStatuses[a.id] !== a.status && (
                            <button
                              onClick={() => handleConfirmSaveStatus(a.id)}
                              disabled={updatingApptId === a.id}
                              className="w-full py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-700 text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {updatingApptId === a.id ? "Saving…" : "Save Status"}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => handleSelectPatientForAction({ id: a.patient_id, name: a.patient_name, internal_file: a.file }, "vitals")}
                            className="w-full px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-700 transition-colors cursor-pointer text-center"
                          >
                            🩺 Capture Vitals
                          </button>
                          <button
                            onClick={() => setSlideOverPatient({ id: a.patient_id, name: a.patient_name, internal_file: a.file })}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-700 transition-colors cursor-pointer text-center"
                          >
                            Medical Summary
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-slate-400 font-500">
                      No patients currently waiting in OPD queue
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TableSection title="🩺 Currently Attending Patients" count={attendingList.length}>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-700 bg-slate-50/50">
                    <th className="px-5 py-3">Token</th>
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">File No.</th>
                    <th className="px-5 py-3">Doctor</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-600">
                  {attendingList.length > 0 ? (
                    attendingList.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 text-teal-700 font-800">{a.token || `Token ${a.token_number}`}</td>
                        <td className="px-5 py-3.5 text-slate-800 font-700">{a.patient_name}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-600">{a.file}</td>
                        <td className="px-5 py-3.5 text-slate-600">{a.doctor_name || a.doctor || 'Unassigned'}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-1.5 items-start">
                            <select
                              value={pendingStatuses[a.id] !== undefined ? pendingStatuses[a.id] : (a.status || 'I')}
                              onChange={e => handlePendingStatusChange(a.id, e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-700 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-teal-400"
                            >
                              <option value="T">⏳ Waiting</option>
                              <option value="I">🩺 Attending</option>
                              <option value="A">✅ Attended</option>
                              <option value="C">❌ Cancelled</option>
                              <option value="N">🚫 No Show</option>
                            </select>
                            {pendingStatuses[a.id] !== undefined && pendingStatuses[a.id] !== a.status && (
                              <button
                                onClick={() => handleConfirmSaveStatus(a.id)}
                                disabled={updatingApptId === a.id}
                                className="w-full py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-700 text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                {updatingApptId === a.id ? "Saving…" : "Save Status"}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => handleSelectPatientForAction({ id: a.patient_id, name: a.patient_name, internal_file: a.file }, "vitals")}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-700 transition-colors cursor-pointer text-center"
                            >
                              🩺 Capture Vitals
                            </button>
                            <button
                              onClick={() => setSlideOverPatient({ id: a.patient_id, name: a.patient_name, internal_file: a.file })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-700 transition-colors cursor-pointer text-center"
                            >
                              Medical Summary
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-6 text-center text-slate-400 font-500">
                        No patients currently attending
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TableSection>

            <TableSection title="✅ Attended Today" count={attendedList.length}>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-700 bg-slate-50/50">
                    <th className="px-5 py-3">Token</th>
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">File No.</th>
                    <th className="px-5 py-3">Doctor</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-600">
                  {attendedList.length > 0 ? (
                    attendedList.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 text-emerald-700 font-800">{a.token || `Token ${a.token_number}`}</td>
                        <td className="px-5 py-3.5 text-slate-800 font-700">{a.patient_name}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-600">{a.file}</td>
                        <td className="px-5 py-3.5 text-slate-600">{a.doctor_name || a.doctor || 'Unassigned'}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-1.5 items-start">
                            <select
                              value={pendingStatuses[a.id] !== undefined ? pendingStatuses[a.id] : (a.status || 'A')}
                              onChange={e => handlePendingStatusChange(a.id, e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-700 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-emerald-400"
                            >
                              <option value="T">⏳ Waiting</option>
                              <option value="I">🩺 Attending</option>
                              <option value="A">✅ Attended</option>
                              <option value="C">❌ Cancelled</option>
                              <option value="N">🚫 No Show</option>
                            </select>
                            {pendingStatuses[a.id] !== undefined && pendingStatuses[a.id] !== a.status && (
                              <button
                                onClick={() => handleConfirmSaveStatus(a.id)}
                                disabled={updatingApptId === a.id}
                                className="w-full py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-700 text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                {updatingApptId === a.id ? "Saving…" : "Save Status"}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => setSlideOverPatient({ id: a.patient_id, name: a.patient_name, internal_file: a.file })}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-700 transition-colors cursor-pointer"
                          >
                            👁️ Summary
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-6 text-center text-slate-400 font-500">
                        No attended patients yet today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TableSection>
          </div>
        </div>

        {/* ── QUICK ACTIONS PANEL ── */}
        <div id="quick-actions-panel" className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="font-800 text-slate-800 text-base">⚡ Quick Actions &amp; Patient Records</h2>
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
            {activeTab === "register" && <RegisterPatientForm onPatientRegistered={() => loadDashboard()} />}
            {activeTab === "appointment" && <CreateAppointmentForm selectedPatient={selectedPatient} onAppointmentCreated={() => loadDashboard()} />}
            {activeTab === "vitals" && <VitalsMiniForm selectedPatient={selectedPatient} />}
            {activeTab === "medical" && <MedicalHistoryForm selectedPatient={selectedPatient} />}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
