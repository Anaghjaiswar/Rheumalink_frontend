import React, { useState } from "react"
import { BLOOD_GROUPS, COMORBIDITIES } from "../../data/compounderData"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons"
import { Toggle } from "../ui/Toggle"
import { ClipboardIcon, MicIcon } from "../icons"

export function MedicalHistoryForm() {
  const [bloodGroup, setBloodGroup] = useState("")
  const [familyHistory, setFamilyHistory] = useState("")
  const [allergies, setAllergies] = useState("")
  const [smokes, setSmokes] = useState(false)
  const [alcoholic, setAlcoholic] = useState(false)
  const [comorbidities, setComorbidities] = useState<string[]>([])
  const [customComorbidity, setCustomComorbidity] = useState("")
  const [saved, setSaved] = useState(false)

  const toggleComorbidity = (c: string) =>
    setComorbidities(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 space-y-7">
      <div>
        <Label>Blood Group</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {BLOOD_GROUPS.map(bg => (
            <button
              key={bg}
              type="button"
              onClick={() => setBloodGroup(bg)}
              className={`px-4 py-2.5 rounded-xl border-2 font-800 text-sm transition-all min-w-[52px] ${bloodGroup === bg ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"}`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Family History 🎙️</Label>
          <Textarea
            placeholder="e.g. Father had diabetes, mother had hypertension…"
            value={familyHistory}
            onChange={e => setFamilyHistory(e.target.value)}
            micButton
          />
        </div>
        <div>
          <Label>Known Allergies 🎙️</Label>
          <Textarea
            placeholder="e.g. Penicillin, sulfa drugs, shellfish…"
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
            micButton
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border-2 border-slate-200">
          <span className="font-700 text-slate-700 text-base">🚬 Smokes</span>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-700 ${smokes ? "text-teal-600" : "text-slate-400"}`}>{smokes ? "Yes" : "No"}</span>
            <Toggle checked={smokes} onChange={setSmokes} />
          </div>
        </div>
        <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border-2 border-slate-200">
          <span className="font-700 text-slate-700 text-base">🍷 Alcoholic</span>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-700 ${alcoholic ? "text-teal-600" : "text-slate-400"}`}>{alcoholic ? "Yes" : "No"}</span>
            <Toggle checked={alcoholic} onChange={setAlcoholic} />
          </div>
        </div>
      </div>

      <div>
        <Label>Comorbidities</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
          {COMORBIDITIES.map(c => {
            const checked = comorbidities.includes(c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleComorbidity(c)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-left font-600 text-sm transition-all ${checked ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-slate-50"}`}
              >
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? "border-teal-500 bg-teal-500" : "border-slate-300 bg-white"}`}>
                  {checked && <svg width="12" height="12" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>}
                </span>
                {c}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <Label>Other / Custom Comorbidity 🎙️</Label>
        <div className="relative">
          <Input
            placeholder="Type any other condition…"
            value={customComorbidity}
            onChange={e => setCustomComorbidity(e.target.value)}
          />
          <button
            type="button"
            title="Voice to text"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
          >
            <MicIcon />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
        {saved ? (
          <span className="text-emerald-600 font-700 text-base">✓ Medical history saved! All set.</span>
        ) : <span />}
        <div className="flex gap-3 ml-auto">
          <SecondaryBtn onClick={() => {}}>Cancel</SecondaryBtn>
          <PrimaryBtn onClick={handleSave}>
            <ClipboardIcon /> Save Medical History
          </PrimaryBtn>
        </div>
      </div>
    </div>
  )
}
