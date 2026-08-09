import React, { useState } from "react"
import { EntryMode, MedRow } from "../../types/doctor"
import { LAB_TESTS, FOLLOW_UP_OPTIONS } from "../../data/doctorData"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { PrimaryBtn } from "../ui/Buttons"
import { MicIcon, TrashIcon, PlusIcon, CalendarIcon } from "../icons"
import { PrescriptionPreview } from "./PrescriptionPreview"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"

export function ConsultationForm() {
  const [mode, setMode] = useState<EntryMode>("manual")
  const [chiefComplaints, setChiefComplaints] = useState("")
  const [clinicalFindings, setClinicalFindings] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [meds, setMeds] = useState<MedRow[]>([
    { id: 1, medicine: "Tab. Methotrexate", dosage: "15 mg", duration: "4 weeks", instructions: "Once weekly, after food" }
  ])
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [testSearch, setTestSearch] = useState("")
  const [followUp, setFollowUp] = useState("1 Month")
  const [postStatus, setPostStatus] = useState("Attended")
  const [showPreview, setShowPreview] = useState(false)

  // Smart dictation hook for the central MedASR panel
  const handleDictationResult = (text: string) => {
    setChiefComplaints(text)
  }
  const { isListening: recording, toggleListening: toggleRecording } = useSpeechRecognition(chiefComplaints, handleDictationResult)

  const addMed = () => setMeds(m => [...m, { id: Date.now(), medicine: "", dosage: "", duration: "", instructions: "" }])
  const removeMed = (id: number) => setMeds(m => m.filter(r => r.id !== id))
  const updateMed = (id: number, key: keyof MedRow, val: string) =>
    setMeds(m => m.map(r => r.id === id ? { ...r, [key]: val } : r))

  const toggleTest = (t: string) =>
    setSelectedTests(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  return (
    <>
      {showPreview && <PrescriptionPreview onClose={() => setShowPreview(false)} />}
      <div className="p-6 space-y-8">

        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          {(["manual", "dictation"] as EntryMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2.5 rounded-lg font-700 text-sm transition-all capitalize ${mode === m ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {m === "manual" ? "✏️ Manual Entry" : "🎙️ Dictation Mode"}
            </button>
          ))}
        </div>

        {/* Dictation panel */}
        {mode === "dictation" && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <h3 className="font-800 text-white text-lg">🎙️ AI Smart Dictation (MedASR)</h3>
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-700 ${recording ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${recording ? "bg-red-400 animate-ping" : "bg-emerald-400"}`} />
                {recording ? "Listening..." : "Ready"}
              </span>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${recording ? "bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/40 animate-pulse" : "bg-teal-500 hover:bg-teal-400 shadow-teal-500/40"}`}
              >
                <MicIcon size={36} />
              </button>
            </div>
            {recording && (
              <p className="text-center text-red-400 font-700 text-sm animate-pulse">● Dictating live... Speak clearly</p>
            )}
            <div className="bg-amber-50/10 border border-amber-400/30 rounded-xl p-4">
              <p className="text-amber-300 text-sm font-600 leading-relaxed">
                <span className="font-800">💡 Dictation Tip:</span> For best results, dictate in this order:
                Chief Complaints → Clinical Findings → Provisional Diagnosis → Prescribed Medications
                (with Dosage, Duration &amp; Instructions) → Lab Tests → Follow-up Timeline.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Consultation Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">1</span>
            <h3 className="font-800 text-slate-700 text-base">Consultation Notes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>📋 Chief Complaints</Label>
              <Textarea placeholder="e.g. Pain and swelling in both hand joints for 3 months…" value={chiefComplaints} onChange={e => setChiefComplaints(e.target.value)} />
            </div>
            <div>
              <Label>🔍 Clinical Findings</Label>
              <Textarea placeholder="e.g. Bilateral symmetric synovitis, MCP and PIP joints…" value={clinicalFindings} onChange={e => setClinicalFindings(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>📌 Provisional Diagnosis</Label>
              <Textarea placeholder="e.g. Seropositive Rheumatoid Arthritis — Moderate Activity" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={2} />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Step 2: Medications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">2</span>
            <h3 className="font-800 text-slate-700 text-base">Prescribed Medications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Medicine Name", "Dosage", "Duration", "Instructions", ""].map((h, i) => (
                    <th key={i} className="px-3 py-3 text-left font-800 text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meds.map((row, i) => (
                  <tr key={row.id} className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    {(["medicine", "dosage", "duration", "instructions"] as const).map(key => (
                      <td key={key} className="px-2 py-2">
                        <Input
                          value={row[key]}
                          onChange={e => updateMed(row.id, key, e.target.value)}
                          placeholder={{ medicine: "Tab. Methotrexate", dosage: "15 mg", duration: "4 weeks", instructions: "Once weekly, after food" }[key]}
                        />
                      </td>
                    ))}
                    <td className="px-2 py-2">
                      <button onClick={() => removeMed(row.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addMed} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-teal-300 text-teal-600 font-700 text-sm hover:bg-teal-50 transition-colors">
            <PlusIcon /> Add Medicine
          </button>
        </div>

        <div className="border-t border-slate-100" />

        {/* Step 3: Lab Tests */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">3</span>
            <h3 className="font-800 text-slate-700 text-base">🧪 Prescribe Lab Tests</h3>
          </div>
          <div>
            <p className="text-sm font-700 text-slate-500 mb-2">Common Tests:</p>
            <div className="flex flex-wrap gap-2">
              {LAB_TESTS.map(t => {
                const active = selectedTests.includes(t)
                return (
                  <button
                    key={t}
                    onClick={() => toggleTest(t)}
                    className={`px-3 py-2 rounded-xl border-2 text-xs font-700 transition-all ${active ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"}`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="text-sm font-700 text-slate-500 mb-2">Search &amp; Add Other Tests:</p>
            <div className="max-w-sm">
              <Input
                placeholder="Search tests…"
                value={testSearch}
                onChange={e => setTestSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Step 4: Follow-up */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">4</span>
            <h3 className="font-800 text-slate-700 text-base">📅 Follow-up Timeline</h3>
          </div>
          <Label>Next Follow-up Date:</Label>
          <div className="flex flex-wrap gap-2">
            {FOLLOW_UP_OPTIONS.map(o => (
              <button
                key={o}
                onClick={() => setFollowUp(o)}
                className={`px-4 py-2.5 rounded-xl border-2 font-700 text-sm transition-all ${followUp === o ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-500 hover:border-teal-300"}`}
              >
                {o}
              </button>
            ))}
            <button className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-500 hover:border-teal-300 font-700 text-sm flex items-center gap-1.5 transition-all">
              <CalendarIcon /> Custom
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Step 5: Post Consultation Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">5</span>
            <h3 className="font-800 text-slate-700 text-base">Post Consultation Status</h3>
          </div>
          <div className="flex gap-3">
            {["Attended", "Follow-up Required"].map(s => (
              <button
                key={s}
                onClick={() => setPostStatus(s)}
                className={`px-5 py-3 rounded-xl border-2 font-700 text-sm transition-all ${postStatus === s ? (s === "Attended" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-amber-500 bg-amber-50 text-amber-700") : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="pt-2">
          <PrimaryBtn onClick={() => setShowPreview(true)} fullWidth>
            📄 Save Consultation &amp; Generate PDF
          </PrimaryBtn>
        </div>
      </div>
    </>
  )
}
