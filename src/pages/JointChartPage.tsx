import React, { useState, useMemo, useEffect } from "react"
import { JointState, JointChartRecord } from "../types/jointChart"
import { JOINT_SPOTS } from "../data/jointChartData"
import { DoctorTopNav } from "../components/doctor/DoctorTopNav"
import { JointChartCanvas } from "../components/jointChart/JointChartCanvas"
import { JointChartControls } from "../components/jointChart/JointChartControls"
import { PatientSearchSection } from "../components/labReport/PatientSearchSection"
import { PatientSearchResult } from "../types/labReport"
import { fetchDoctorDashboard, fetchJointChart, saveJointChart } from "../services/api"

export function JointChartPage({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  const [language, setLanguage] = useState("en-IN")
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // State map storing joint states by cbelId (e.g. { "shoulderright": "blue", "kneeleft": "red" })
  const [jointStates, setJointStates] = useState<Record<string, JointState>>(() => {
    const initial: Record<string, JointState> = {}
    JOINT_SPOTS.forEach(spot => {
      initial[spot.cbelId] = "nopain"
    })
    return initial
  })

  // Recent charts history state
  const [recentCharts, setRecentCharts] = useState<JointChartRecord[]>([])

  // Auto-fetch active patient from doctor queue on mount if none selected
  useEffect(() => {
    if (!selectedPatient) {
      fetchDoctorDashboard()
        .then(res => {
          if (res.ok) {
            const queue = [...(res.attending || []), ...(res.waiting || []), ...(res.attended || [])]
            if (queue.length > 0) {
              const first = queue[0]
              setSelectedPatient({
                id: first.patient_id || first.id,
                name: first.patient_name || first.name,
                internal_file: first.file || first.internal_file,
                contact_no: first.contact || "",
              } as any)
            }
          }
        })
        .catch(() => {})
    }
  }, [])

  // Fetch backend data when a patient is selected
  useEffect(() => {
    if (selectedPatient && selectedPatient.id) {
      fetchJointChart(selectedPatient.id)
        .then(res => {
          if (res.ok) {
            if (res.joint_states && Object.keys(res.joint_states).length > 0) {
              setJointStates(prev => ({ ...prev, ...res.joint_states }))
            }
            if (res.recent_charts) {
              setRecentCharts(res.recent_charts.map((rc: any) => ({
                id: String(rc.id),
                recordedAt: rc.recorded_at,
                swollen: rc.swollen,
                tender: rc.tender,
              })))
            }
          }
        })
        .catch(() => {})
    }
  }, [selectedPatient])

  // Count active swollen & tender joints
  const counts = useMemo(() => {
    let swollen = 0
    let tender = 0
    Object.values(jointStates).forEach(st => {
      if (st === "red") swollen++
      else if (st === "blue") tender++
      else if (st === "orange") {
        swollen++
        tender++
      }
    })
    return { swollen, tender }
  }, [jointStates])

  // Bulk set all joints to a state
  const handleBulkAction = (action: "allnopain" | "allswollen" | "alltender") => {
    const next: Record<string, JointState> = {}
    const targetState: JointState = action === "allswollen" ? "red" : action === "alltender" ? "blue" : "nopain"
    JOINT_SPOTS.forEach(spot => {
      next[spot.cbelId] = targetState
    })
    setJointStates(next)
  }

  // Toggle single joint state on click
  const handleJointClick = (cbelId: string) => {
    setJointStates(prev => {
      const current = prev[cbelId] || "nopain"
      let next: JointState = "nopain"
      if (current === "nopain") next = "blue"
      else if (current === "blue") next = "red"
      else if (current === "red") next = "orange"
      else if (current === "orange") next = "nopain"
      return { ...prev, [cbelId]: next }
    })
  }

  // Save assessment to backend
  const handleSaveAssessment = async () => {
    if (!selectedPatient) {
      setErrorMsg("Please select a patient before saving the joint chart.")
      return
    }

    setErrorMsg("")
    setSavedSuccess(false)

    try {
      const res = await saveJointChart(selectedPatient.id, jointStates)
      if (res.ok) {
        setSavedSuccess(true)
        setTimeout(() => {
          setSavedSuccess(false)
          onBackToDashboard()
        }, 2000)
      } else {
        setErrorMsg("Failed to save joint assessment.")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error saving joint assessment.")
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans flex flex-col">
      <DoctorTopNav language={language} setLanguage={setLanguage} onSwitchCompounder={onBackToDashboard} />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1 w-full">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦴</span>
              <h1 className="text-2xl font-800 text-slate-800">44-Joint Assessment Chart</h1>
            </div>
            <p className="text-slate-500 font-500 text-sm mt-1">
              Interactive Homunculus Joint Pain &amp; Swelling Assessment
            </p>
          </div>

          <div className="flex gap-2 self-start sm:self-auto">
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-700 text-sm hover:border-teal-300 hover:bg-teal-50 transition-all"
            >
              ⬅️ Back to Dashboard
            </button>
          </div>
        </div>

        {/* Patient Selection Bar */}
        <PatientSearchSection
          selectedPatient={selectedPatient}
          onSelectPatient={p => setSelectedPatient(p)}
          onClearPatient={() => setSelectedPatient(null)}
        />

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-700 text-sm shadow-md flex items-center justify-between animate-fadeIn">
            <span>✓ 44-Joint Assessment Chart saved successfully to backend! Redirecting…</span>
            <span className="text-xs bg-emerald-600 px-2.5 py-1 rounded-lg">Saved</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500 text-white font-700 text-sm shadow-md">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Main Grid: Homunculus Canvas & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 44-Joint Canvas */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center">
            <JointChartCanvas
              jointStates={jointStates}
              onJointClick={handleJointClick}
            />
          </div>

          {/* Right: Controls & Assessment Summary */}
          <div className="lg:col-span-5 space-y-6">
            <JointChartControls
              counts={counts}
              recentCharts={recentCharts}
              onBulkAction={handleBulkAction}
              onSaveAssessment={handleSaveAssessment}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
