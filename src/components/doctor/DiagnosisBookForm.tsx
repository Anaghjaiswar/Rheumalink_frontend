import React, { useState } from "react"
import { APPOINTMENTS } from "../../data/doctorData"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { Select } from "../ui/Select"
import { PrimaryBtn, OutlineBtn } from "../ui/Buttons"
import { Card } from "../ui/Card"

export function DiagnosisBookForm() {
  const [appointment, setAppointment] = useState("")
  const [disease, setDisease] = useState("")
  const [stage, setStage] = useState("")
  const [versionNote, setVersionNote] = useState("")
  const [das28, setDas28] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  return (
    <div className="p-6 space-y-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>📅 Appointment</Label>
          <Select value={appointment} onChange={e => setAppointment(e.target.value)}>
            <option value="">Select appointment…</option>
            {APPOINTMENTS.map(a => <option key={a}>{a}</option>)}
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
        {/* Joint Chart Entry */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-800 text-slate-800">🦴 Joint Chart Entry</p>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-700 border border-emerald-200">✅ Completed (5 Swollen, 10 Tender)</span>
            </div>
            <p className="text-slate-500 text-sm font-600">Joint chart is managed on a separate page. Create or view before saving diagnosis.</p>
          </div>
          <OutlineBtn className="flex-shrink-0">Open Joint Chart Page</OutlineBtn>
        </Card>

        {/* Rheumatoid Symptoms */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-800 text-slate-800">📋 Rheumatoid Symptoms Checklist (AI Summary)</p>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-700 border border-emerald-200">✅ Completed</span>
            </div>
            <p className="text-slate-500 text-sm font-600">Fill detailed symptoms checklist and generate professional clinical notes using AI on a separate page.</p>
          </div>
          <OutlineBtn className="flex-shrink-0">Open Rheum Diagnosis Page</OutlineBtn>
        </Card>

        {/* DAS28 */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-800 text-slate-800 mb-1">📐 Fast DAS28 Score</p>
            {das28 ? (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl font-800 text-teal-700">{das28}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-700 border ${parseFloat(das28) < 2.6 ? "bg-emerald-100 text-emerald-700 border-emerald-200" : parseFloat(das28) < 3.2 ? "bg-yellow-100 text-yellow-700 border-yellow-200" : parseFloat(das28) < 5.1 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                  {parseFloat(das28) < 2.6 ? "Remission" : parseFloat(das28) < 3.2 ? "Low Activity" : parseFloat(das28) < 5.1 ? "Moderate Activity" : "High Activity"}
                </span>
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-600">Score will appear here after calculation.</p>
            )}
          </div>
          <PrimaryBtn onClick={() => setDas28("4.2")} className="flex-shrink-0 text-sm py-2.5 px-4">
            Calculate for Selected Appointment
          </PrimaryBtn>
        </Card>
      </div>

      <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
        {saved && <span className="text-emerald-600 font-700">✓ Diagnosis saved! All set.</span>}
        {!saved && <span />}
        <PrimaryBtn onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000) }} className="sm:min-w-[180px]" fullWidth={false}>
          💾 Save Diagnosis
        </PrimaryBtn>
      </div>
    </div>
  )
}
