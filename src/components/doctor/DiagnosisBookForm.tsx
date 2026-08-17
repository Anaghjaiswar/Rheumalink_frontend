import React, { useState, useEffect } from "react"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { Select } from "../ui/Select"
import { PrimaryBtn, OutlineBtn } from "../ui/Buttons"
import { Card } from "../ui/Card"
import { fetchDoctorDashboard, saveDiagnosis, calculateDAS28Score, fetchDiagnosisStatus } from "../../services/api"

export function DiagnosisBookForm({
  onOpenJointChart,
  onOpenRheumDiagnosis,
}: {
  onOpenJointChart?: () => void
  onOpenRheumDiagnosis?: () => void
}) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedApptId, setSelectedApptId] = useState("")
  const [disease, setDisease] = useState("")
  const [stage, setStage] = useState("")
  const [versionNote, setVersionNote] = useState("")
  const [das28, setDas28] = useState<string | null>(null)
  const [das28Data, setDas28Data] = useState<any | null>(null)
  const [isCalculatingDas28, setIsCalculatingDas28] = useState(false)
  const [diagnosisStatus, setDiagnosisStatus] = useState<{ joint_chart?: boolean; rumat_diagnosis?: boolean } | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [savedMsg, setSavedMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetchDoctorDashboard()
      .then(res => {
        if (res.ok) {
          const list = [...(res.attending || []), ...(res.attended || []), ...(res.waiting || [])]
          setAppointments(list)
          if (list.length > 0 && !selectedApptId) {
            setSelectedApptId(String(list[0].id))
          }
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedApptId) {
      fetchDiagnosisStatus(selectedApptId)
        .then(res => {
          if (res) setDiagnosisStatus(res)
        })
        .catch(() => {})
    }
  }, [selectedApptId])

  const handleCalculateDAS28 = async () => {
    if (!selectedApptId) {
      setErrorMsg("Please select an appointment first.")
      return
    }

    setIsCalculatingDas28(true)
    setErrorMsg("")

    try {
      const res = await calculateDAS28Score(selectedApptId)
      setIsCalculatingDas28(false)
      if (res.ok && res.das28_score !== undefined) {
        setDas28(String(res.das28_score))
        setDas28Data(res)
      } else {
        setErrorMsg(res.error || "Unable to calculate DAS28. Ensure joint chart and vitals (ESR/CRP) are recorded.")
      }
    } catch (err: any) {
      setIsCalculatingDas28(false)
      setErrorMsg(err.message || "Error calculating DAS28 score.")
    }
  }

  const handleSave = async () => {
    if (!selectedApptId) {
      setErrorMsg("Please select an appointment.")
      return
    }

    setLoading(true)
    setErrorMsg("")
    setSavedMsg("")

    try {
      const payload = {
        disease_name: disease,
        stage: stage,
        version_note: versionNote,
      }

      const res = await saveDiagnosis(selectedApptId, payload)
      setLoading(false)

      if (res.ok) {
        setSavedMsg(res.message || "Diagnosis record saved successfully!")
        setTimeout(() => setSavedMsg(""), 3500)
      } else {
        setErrorMsg("Failed to save diagnosis record.")
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || "Error saving diagnosis record.")
    }
  }

  return (
    <div className="p-6 space-y-7">
      {savedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-700 text-sm">
          ✓ {savedMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-700 text-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>📅 Select Appointment (From Database)</Label>
          <Select value={selectedApptId} onChange={e => setSelectedApptId(e.target.value)}>
            <option value="">Select appointment…</option>
            {appointments.length > 0 ? (
              appointments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.patient_name} — {a.token || `Token ${a.token_number}`} ({a.status || a.status_code})
                </option>
              ))
            ) : (
              <option value="" disabled>No appointments found in DB for today</option>
            )}
          </Select>
        </div>
        <div>
          <Label>🏥 Disease Name</Label>
          <Input placeholder="e.g. Rheumatoid Arthritis" value={disease} onChange={e => setDisease(e.target.value)} />
        </div>
        <div>
          <Label>📊 Stage</Label>
          <Input placeholder="e.g. Moderate, Early, Late" value={stage} onChange={e => setStage(e.target.value)} />
        </div>
        <div>
          <Label>📝 Version Note</Label>
          <Textarea placeholder="e.g. Increased disease activity since last visit…" value={versionNote} onChange={e => setVersionNote(e.target.value)} />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-4">
        {/* Rheumatoid Symptoms Checklist Card */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-teal-200 bg-teal-50/40 shadow-xs">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-800 text-slate-800 text-base">📖 Rheumatoid Symptoms Checklist &amp; AI Notes</p>
              <span className={`px-2.5 py-1 rounded-full text-xs font-700 border ${diagnosisStatus?.rumat_diagnosis ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-teal-100 text-teal-800 border-teal-200"}`}>
                {diagnosisStatus?.rumat_diagnosis ? "✅ Filled for Appt" : "12 Categories"}
              </span>
            </div>
            <p className="text-slate-600 text-sm font-500">Fill detailed 12-category symptoms checklist and generate professional clinical summary notes using AI.</p>
          </div>
          <PrimaryBtn onClick={onOpenRheumDiagnosis} className="flex-shrink-0 text-sm py-2.5 px-5 shadow-md">
            Open Rheum Diagnosis Page ➔
          </PrimaryBtn>
        </Card>

        {/* Joint Chart Entry Card */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-800 text-slate-800">🦴 Joint Chart Entry (44 Joints)</p>
              <span className={`px-2.5 py-1 rounded-full text-xs font-700 border ${diagnosisStatus?.joint_chart ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                {diagnosisStatus?.joint_chart ? "✅ Recorded" : "44 Joints"}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-600">Joint chart homunculus is managed on a dedicated interactive 725x1100 canvas.</p>
          </div>
          <OutlineBtn onClick={onOpenJointChart} className="flex-shrink-0">Open Joint Chart Page</OutlineBtn>
        </Card>

        {/* DAS28 */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-800 text-slate-800 mb-1">📐 Fast DAS28 Score Calculation</p>
            {das28 ? (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl font-800 text-teal-700">{das28}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-700 border ${parseFloat(das28) < 2.6 ? "bg-emerald-100 text-emerald-700 border-emerald-200" : parseFloat(das28) < 3.2 ? "bg-yellow-100 text-yellow-700 border-yellow-200" : parseFloat(das28) < 5.1 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                  {parseFloat(das28) < 2.6 ? "Remission" : parseFloat(das28) < 3.2 ? "Low Activity" : parseFloat(das28) < 5.1 ? "Moderate Activity" : "High Activity"}
                </span>
                {das28Data && (
                  <span className="text-xs text-slate-500 font-600">
                    (Tender: {das28Data.tender_count ?? "-"}, Swollen: {das28Data.swollen_count ?? "-"}, ESR: {das28Data.esr ?? "-"})
                  </span>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-600">Score will appear here after calculation.</p>
            )}
          </div>
          <PrimaryBtn
            onClick={handleCalculateDAS28}
            disabled={isCalculatingDas28 || !selectedApptId}
            className="flex-shrink-0 text-sm py-2.5 px-4"
          >
            {isCalculatingDas28 ? "Calculating…" : "Calculate for Selected Appointment"}
          </PrimaryBtn>
        </Card>
      </div>

      <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
        <div className="flex gap-3 ml-auto">
          <PrimaryBtn onClick={handleSave} disabled={loading} className="sm:min-w-[180px]">
            💾 {loading ? "Saving…" : "Save Diagnosis"}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  )
}
