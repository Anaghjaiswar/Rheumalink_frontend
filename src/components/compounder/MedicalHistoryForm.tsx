import React, { useState, useEffect, useMemo } from "react"
import { BLOOD_GROUPS, COMORBIDITIES } from "../../data/compounderData"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { Textarea } from "../ui/Textarea"
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons"
import { Toggle } from "../ui/Toggle"
import { ClipboardIcon, MicIcon } from "../icons"
import { fetchCompounderDashboard, fetchMedicalInfo, saveMedicalInfo } from "../../services/api"

export function MedicalHistoryForm({ selectedPatient }: { selectedPatient?: any }) {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState(selectedPatient?.id ? String(selectedPatient.id) : "")

  const [bloodGroup, setBloodGroup] = useState("")
  const [familyHistory, setFamilyHistory] = useState("")
  const [allergies, setAllergies] = useState("")
  const [smokes, setSmokes] = useState(false)
  const [alcoholic, setAlcoholic] = useState(false)
  
  // Database comorbidities list [{id, name}] and selected IDs
  const [dbComorbidities, setDbComorbidities] = useState<{ id: number; name: string }[]>([])
  const [selectedComorbidityIds, setSelectedComorbidityIds] = useState<number[]>([])
  const [selectedComorbidityNames, setSelectedComorbidityNames] = useState<string[]>([])
  const [customComorbidity, setCustomComorbidity] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const patientOptions = useMemo(() => {
    if (selectedPatient && selectedPatient.id) {
      const exists = patients.some(p => String(p.id) === String(selectedPatient.id))
      if (!exists) {
        return [selectedPatient, ...patients]
      }
    }
    return patients
  }, [selectedPatient, patients])

  useEffect(() => {
    if (selectedPatient?.id) {
      setSelectedPatientId(String(selectedPatient.id))
    } else {
      setSelectedPatientId("")
    }
  }, [selectedPatient])

  useEffect(() => {
    fetchCompounderDashboard()
      .then(res => {
        if (res.ok && res.recent_patients) {
          setPatients(res.recent_patients)
        }
      })
      .catch(() => {})
  }, [])

  // Fetch existing patient medical info and all DB comorbidities whenever selected patient changes
  useEffect(() => {
    if (!selectedPatientId) {
      setSelectedComorbidityIds([])
      setSelectedComorbidityNames([])
      setBloodGroup("")
      setFamilyHistory("")
      setAllergies("")
      setSmokes(false)
      setAlcoholic(false)
      return
    }

    fetchMedicalInfo(selectedPatientId)
      .then(res => {
        if (res.all_comorbidities) {
          setDbComorbidities(res.all_comorbidities)
        }
        if (res.exists) {
          setBloodGroup(res.blood_group || "")
          setFamilyHistory(res.family_history || "")
          setAllergies(res.known_allergies || "")
          setSmokes(Boolean(res.smokes))
          setAlcoholic(Boolean(res.alcoholic))
          setSelectedComorbidityIds(res.comorbidities || [])
          setSelectedComorbidityNames(res.comorbidity_names || [])
        } else {
          setSelectedComorbidityIds([])
          setSelectedComorbidityNames([])
          setBloodGroup("")
          setFamilyHistory("")
          setAllergies("")
          setSmokes(false)
          setAlcoholic(false)
        }
      })
      .catch(() => {})
  }, [selectedPatientId])

  const toggleComorbidity = (labelName: string) => {
    // Find matching comorbidity in DB list by name
    const match = dbComorbidities.find(
      c => c.name.toLowerCase().trim() === labelName.toLowerCase().trim()
    )

    if (match) {
      const id = match.id
      setSelectedComorbidityIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      )
      setSelectedComorbidityNames(prev =>
        prev.includes(match.name) ? prev.filter(x => x !== match.name) : [...prev, match.name]
      )
    } else {
      // Toggle by name if not yet mapped to ID
      setSelectedComorbidityNames(prev =>
        prev.includes(labelName) ? prev.filter(x => x !== labelName) : [...prev, labelName]
      )
    }
  }

  const isComorbiditySelected = (labelName: string) => {
    const match = dbComorbidities.find(
      c => c.name.toLowerCase().trim() === labelName.toLowerCase().trim()
    )
    if (match) {
      return selectedComorbidityIds.includes(match.id) || selectedComorbidityNames.includes(match.name)
    }
    return selectedComorbidityNames.includes(labelName)
  }

  const handleSave = async () => {
    if (!selectedPatientId) {
      setErrorMsg("Please select a patient before saving medical history.")
      return
    }

    setLoading(true)
    setErrorMsg("")
    setMsg("")

    try {
      const payload = {
        blood_group: bloodGroup,
        family_history: familyHistory,
        allergies: allergies,
        smokes: smokes,
        alcoholic: alcoholic,
        comorbidities: selectedComorbidityIds,
        custom_comorbidity: customComorbidity,
      }

      const res = await saveMedicalInfo(selectedPatientId, payload)
      setLoading(false)

      if (res.ok) {
        setMsg(res.message || "Medical history saved as new record version!")
        setTimeout(() => setMsg(""), 3500)
      } else {
        const errs = res.errors ? Object.values(res.errors).flat().join(" ") : "Failed to save medical history."
        setErrorMsg(errs)
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || "Error saving medical history.")
    }
  }

  return (
    <div className="p-6 space-y-7">
      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-700 text-sm">
          ✓ {msg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-700 text-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      {selectedPatient && (
        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-sm font-700">
          🎯 Selected Patient: <strong>{selectedPatient.name}</strong> ({selectedPatient.internal_file})
        </div>
      )}

      <div>
        <Label>Select Patient (From Database)</Label>
        <Select value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)}>
          <option value="">Select registered patient…</option>
          {patientOptions.length > 0 ? (
            patientOptions.map(p => (
              <option key={p.id} value={p.id}>{p.name} — File: {p.internal_file}</option>
            ))
          ) : (
            <option value="" disabled>No registered patients found in DB</option>
          )}
        </Select>
      </div>

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
            const checked = isComorbiditySelected(c)
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
        <div className="flex gap-3 ml-auto">
          <SecondaryBtn onClick={() => {}}>Cancel</SecondaryBtn>
          <PrimaryBtn onClick={handleSave} disabled={loading}>
            <ClipboardIcon /> {loading ? "Saving…" : "Save Medical History"}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  )
}
