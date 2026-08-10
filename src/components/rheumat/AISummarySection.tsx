import React from "react"
import { Textarea } from "../ui/Textarea"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { Label } from "../ui/Label"
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons"
import { DISEASE_STATES } from "../../data/rheumatDiagnosisData"

export function AISummarySection({
  summaryNote,
  setSummaryNote,
  diseaseName,
  setDiseaseName,
  diseaseState,
  setDiseaseState,
  isGenerating,
  onGenerateAI,
  onSave,
  onCancel,
}: {
  summaryNote: string
  setSummaryNote: (v: string) => void
  diseaseName: string
  setDiseaseName: (v: string) => void
  diseaseState: string
  setDiseaseState: (v: string) => void
  isGenerating: boolean
  onGenerateAI: () => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-teal-200 shadow-md p-6 space-y-6">
      {/* Header & AI Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-800 text-slate-800 text-lg flex items-center gap-2">
            <span>📋</span> Clinical Summary Note
          </h3>
          <p className="text-slate-500 font-500 text-xs mt-0.5">
            Select manifestations above, then click Generate AI Summary to automatically structure clinical notes.
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerateAI}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-800 text-xs shadow-md active:scale-95 disabled:opacity-50 transition-all cursor-pointer self-start sm:self-auto"
        >
          {isGenerating ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Symptoms…</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Generate AI Summary</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Note Textarea */}
      <div>
        <Textarea
          rows={5}
          value={summaryNote}
          onChange={e => setSummaryNote(e.target.value)}
          placeholder="Select symptoms above, then click 'Generate AI Summary' to create structured clinical notes. You can edit the generated text before saving."
          className="font-500 text-sm leading-relaxed"
        />
      </div>

      {/* Meta Grid: Disease Name & State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Disease Name</Label>
          <Input
            value={diseaseName}
            onChange={e => setDiseaseName(e.target.value)}
            placeholder="e.g. Rheumatoid Arthritis, SLE, Gout"
          />
        </div>
        <div>
          <Label>Disease State</Label>
          <Select value={diseaseState} onChange={e => setDiseaseState(e.target.value)}>
            {DISEASE_STATES.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
        <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        <PrimaryBtn onClick={onSave} className="min-w-[180px]">
          💾 Save Rumat Diagnosis
        </PrimaryBtn>
      </div>
    </div>
  )
}
