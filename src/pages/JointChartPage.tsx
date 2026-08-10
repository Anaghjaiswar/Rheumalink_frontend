import React, { useState, useMemo, useEffect } from "react"
import { JointState, JointChartRecord } from "../types/jointChart"
import { JOINT_SPOTS } from "../data/jointChartData"
import { DoctorTopNav } from "../components/doctor/DoctorTopNav"
import { JointChartCanvas } from "../components/jointChart/JointChartCanvas"
import { JointChartControls } from "../components/jointChart/JointChartControls"
import { fetchJointChart, saveJointChart } from "../services/api"

export function JointChartPage({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  const [language, setLanguage] = useState("en-IN")
  const [savedSuccess, setSavedSuccess] = useState(false)

  // State map storing joint states by cbelId (e.g. { "shoulderright": "blue", "kneeleft": "red" })
  const [jointStates, setJointStates] = useState<Record<string, JointState>>(() => {
    const initial: Record<string, JointState> = {}
    JOINT_SPOTS.forEach(spot => {
      initial[spot.cbelId] = "nopain"
    })
    return initial
  })

  // Recent charts history state (starts empty, populated ONLY by DB API)
  const [recentCharts, setRecentCharts] = useState<JointChartRecord[]>([])

  // Fetch initial API data on mount
  useEffect(() => {
    fetchJointChart(1)
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
  }, [])

  // Toggle state cycle: nopain -> blue (tender) -> red (swollen) -> orange (both) -> nopain
  const handleToggleJoint = (cbelId: string) => {
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

  // Calculate real-time counts
  const counts = useMemo(() => {
    let noPain = 0
    let tender = 0
    let swollen = 0

    Object.values(jointStates).forEach(val => {
      if (val === "red") swollen++
      else if (val === "blue") tender++
      else if (val === "orange") {
        swollen++
        tender++
      } else {
        noPain++
      }
    })

    return { noPain, tender, swollen }
  }, [jointStates])

  const handleReset = () => {
    const resetState: Record<string, JointState> = {}
    JOINT_SPOTS.forEach(spot => {
      resetState[spot.cbelId] = "nopain"
    })
    setJointStates(resetState)
  }

  const handleSave = () => {
    const nowStr = new Date().toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    const newRecord: JointChartRecord = {
      id: Date.now().toString(),
      recordedAt: nowStr,
      swollen: counts.swollen,
      tender: counts.tender,
    }

    // Call API backend
    saveJointChart(1, jointStates).catch(() => {})

    setRecentCharts(prev => [newRecord, ...prev])
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3500)
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      <DoctorTopNav language={language} setLanguage={setLanguage} onSwitchCompounder={onBackToDashboard} />

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦴</span>
              <h1 className="text-2xl font-800 text-slate-800">Joint Assessment Chart</h1>
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-700">
                44 Joints Homunculus
              </span>
            </div>
            <p className="text-slate-500 font-600 text-sm mt-1">
              Select joint hotspots to record Swollen and Tender joint counts.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-700 text-sm hover:border-teal-300 hover:bg-teal-50 transition-all self-start sm:self-auto"
          >
            ⬅️ Back to Doctor Desk
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-700 text-sm shadow-md flex items-center justify-between animate-fadeIn">
            <span>✓ Joint Assessment Chart saved successfully to backend! Total: {counts.swollen} Swollen, {counts.tender} Tender.</span>
            <span className="text-xs bg-emerald-600 px-2.5 py-1 rounded-lg">Saved</span>
          </div>
        )}

        {/* Grid layout: Canvas (Left) & Controls (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Canvas (8 cols) */}
          <div className="lg:col-span-8">
            <JointChartCanvas jointStates={jointStates} onToggleJoint={handleToggleJoint} />
          </div>

          {/* Side Panel Controls (4 cols) */}
          <div className="lg:col-span-4">
            <JointChartControls
              noPainCount={counts.noPain}
              tenderCount={counts.tender}
              swollenCount={counts.swollen}
              recentCharts={recentCharts}
              onSave={handleSave}
              onReset={handleReset}
              onBack={onBackToDashboard}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
