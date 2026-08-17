import React, { useState, useEffect, useRef } from "react"
import { EntryMode, MedRow } from "../../types/doctor"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { Textarea } from "../ui/Textarea"
import { PrimaryBtn } from "../ui/Buttons"
import { MicIcon, TrashIcon, PlusIcon, CloseIcon } from "../icons"
import { PrescriptionPreview } from "./PrescriptionPreview"
import { useMedASRStream } from "../../hooks/useMedASRStream"
import {
  fetchDoctorDashboard,
  saveConsultation,
  correctTranscription,
  structureClinicalNote,
  fetchMedicineAutosuggest,
  fetchLabTestAutosuggest,
} from "../../services/api"

export function ConsultationForm({
  selectedPatient,
  selectedAppointment,
}: {
  selectedPatient?: any
  selectedAppointment?: any
}) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [activeApptId, setActiveApptId] = useState<string>(selectedAppointment?.id ? String(selectedAppointment.id) : "")

  const [mode, setMode] = useState<EntryMode>("manual")
  const [chiefComplaints, setChiefComplaints] = useState("")
  const [clinicalFindings, setClinicalFindings] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [adviceNotes, setAdviceNotes] = useState("")
  const [otherLabNotes, setOtherLabNotes] = useState("")
  const [nextFollowupDate, setNextFollowupDate] = useState("")

  const [meds, setMeds] = useState<MedRow[]>([
    { id: 1, medicine: "", dosage: "", duration: "", instructions: "" },
  ])

  // Active medicine autocomplete suggestions per row
  const [medSuggestions, setMedSuggestions] = useState<Record<number, any[]>>({})
  const [activeMedRowFocus, setActiveMedRowFocus] = useState<number | null>(null)

  const [commonTests, setCommonTests] = useState<any[]>([])
  const [selectedTests, setSelectedTests] = useState<number[]>([])
  const [customTests, setCustomTests] = useState<{ id?: number; name: string }[]>([])
  const [testSearch, setTestSearch] = useState("")
  const [testSuggestions, setTestSuggestions] = useState<any[]>([])
  const [isSearchingTests, setIsSearchingTests] = useState(false)

  const [postStatus, setPostStatus] = useState("A")
  const [showPreview, setShowPreview] = useState(false)
  const [savedPrescriptionId, setSavedPrescriptionId] = useState<number | string | null>(null)

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // MedASR Voice Dictation State & Multi-Step Processing Pipeline
  const [dictatedRawText, setDictatedRawText] = useState("")
  const [pipelineStep, setPipelineStep] = useState<"idle" | "listening" | "transcribing" | "polishing" | "structuring" | "done">("idle")
  const [pipelineError, setPipelineError] = useState<string | null>(null)
  const [highlightFields, setHighlightFields] = useState(false)

  const handleSpeechTextUpdate = (text: string) => {
    setDictatedRawText(text)
  }

  const {
    isRecording,
    audioLevel,
    startRecording,
    stopRecording,
    toggleRecording,
    error: asrError,
  } = useMedASRStream({
    token: "rc_live_jrmEVRrDg1QxJ_Ei5ou7jEXH6-zTyOeA",
    aiServicePort: 8001,
    currentValue: dictatedRawText,
    onTranscriptUpdate: handleSpeechTextUpdate,
    onRecordingStart: () => {
      setPipelineStep("listening")
      setPipelineError(null)
    },
  })

  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null)

  const handleClearTranscript = () => {
    if (isRecording) {
      stopRecording()
    }
    setDictatedRawText("")
    setPipelineStep("idle")
    setPipelineError(null)
    if (activeApptId) {
      try {
        const key = `rheumalink_draft_consult_${activeApptId}`
        const existing = localStorage.getItem(key)
        if (existing) {
          const parsed = JSON.parse(existing)
          parsed.dictatedRawText = ""
          localStorage.setItem(key, JSON.stringify(parsed))
        }
      } catch {}
    }
  }

  // 1. Restore draft for active appointment
  useEffect(() => {
    if (!activeApptId) return
    try {
      const key = `rheumalink_draft_consult_${activeApptId}`
      const savedRaw = localStorage.getItem(key)
      if (savedRaw) {
        const draft = JSON.parse(savedRaw)
        if (draft.dictatedRawText) setDictatedRawText(draft.dictatedRawText)
        if (draft.chiefComplaints) setChiefComplaints(draft.chiefComplaints)
        if (draft.clinicalFindings) setClinicalFindings(draft.clinicalFindings)
        if (draft.diagnosis) setDiagnosis(draft.diagnosis)
        if (draft.adviceNotes) setAdviceNotes(draft.adviceNotes)
        if (draft.otherLabNotes) setOtherLabNotes(draft.otherLabNotes)
        if (draft.nextFollowupDate) setNextFollowupDate(draft.nextFollowupDate)
        if (draft.meds && Array.isArray(draft.meds) && draft.meds.length > 0) setMeds(draft.meds)
        if (draft.selectedTests && Array.isArray(draft.selectedTests)) setSelectedTests(draft.selectedTests)
        if (draft.customTests && Array.isArray(draft.customTests)) setCustomTests(draft.customTests)
        setDraftSavedAt("Restored from auto-saved draft")
      }
    } catch {}
  }, [activeApptId])

  // 2. Auto-persist draft to localStorage on any modification
  useEffect(() => {
    if (!activeApptId) return
    const hasData =
      dictatedRawText.trim() ||
      chiefComplaints.trim() ||
      clinicalFindings.trim() ||
      diagnosis.trim() ||
      adviceNotes.trim() ||
      otherLabNotes.trim() ||
      selectedTests.length > 0 ||
      customTests.length > 0 ||
      meds.some(m => m.medicine.trim() || m.dosage.trim())

    if (hasData) {
      const draftData = {
        dictatedRawText,
        chiefComplaints,
        clinicalFindings,
        diagnosis,
        adviceNotes,
        otherLabNotes,
        nextFollowupDate,
        meds,
        selectedTests,
        customTests,
        savedAt: new Date().toISOString(),
      }
      try {
        const key = `rheumalink_draft_consult_${activeApptId}`
        localStorage.setItem(key, JSON.stringify(draftData))
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        setDraftSavedAt(`Draft auto-saved locally at ${timeStr}`)
      } catch {}
    }
  }, [
    activeApptId,
    dictatedRawText,
    chiefComplaints,
    clinicalFindings,
    diagnosis,
    adviceNotes,
    otherLabNotes,
    nextFollowupDate,
    meds,
    selectedTests,
    customTests,
  ])

  useEffect(() => {
    if (asrError) {
      setPipelineError(asrError)
    }
  }, [asrError])

  useEffect(() => {
    if (selectedAppointment?.id) {
      setActiveApptId(String(selectedAppointment.id))
    }
  }, [selectedAppointment])

  useEffect(() => {
    fetchDoctorDashboard()
      .then(res => {
        if (res.ok) {
          if (res.common_tests) setCommonTests(res.common_tests)

          const allAppts = [
            ...(res.attending || []),
            ...(res.waiting || []),
            ...(res.attended || []),
          ]
          setAppointments(allAppts)

          if (!activeApptId && allAppts.length > 0) {
            if (selectedPatient) {
              const matched = allAppts.find((a: any) => a.patient_id === selectedPatient.id)
              if (matched) setActiveApptId(String(matched.id))
            } else {
              setActiveApptId(String(allAppts[0].id))
            }
          }
        }
      })
      .catch(() => {})
  }, [selectedPatient])

  // Process voice note through the 3-step AI pipeline
  const handleProcessVoiceNote = async () => {
    if (isRecording) {
      await stopRecording()
    }

    const textToProcess = dictatedRawText.trim()
    if (!textToProcess) {
      setPipelineError("No speech detected. Please speak clearly into the microphone.")
      setPipelineStep("idle")
      return
    }

    try {
      // Step 1: Finalize Text
      setPipelineStep("transcribing")
      await new Promise(r => setTimeout(r, 400))

      // Step 2: Correct Spelling & Polish Pronunciation (Groq Llama / MedASR Bridge)
      setPipelineStep("polishing")
      let polishedText = textToProcess
      try {
        const correctRes = await correctTranscription(textToProcess)
        if (correctRes.ok && correctRes.corrected_text) {
          polishedText = correctRes.corrected_text
          setDictatedRawText(polishedText)
        }
      } catch (err) {
        console.warn("Spelling correction skipped/fallback to raw text:", err)
      }

      // Step 3: Extract Structured Clinical Entities
      setPipelineStep("structuring")
      const structureRes = await structureClinicalNote(polishedText)

      if (structureRes.ok && structureRes.data) {
        const d = structureRes.data

        if (d.chief_complaints) setChiefComplaints(d.chief_complaints)
        if (d.clinical_findings) setClinicalFindings(d.clinical_findings)
        if (d.provisional_diagnosis) setDiagnosis(d.provisional_diagnosis)
        if (d.general_advice) setAdviceNotes(d.general_advice)
        if (d.other_lab_notes) setOtherLabNotes(d.other_lab_notes)
        if (d.next_followup_date) setNextFollowupDate(d.next_followup_date)

        // Map prescribed tests
        if (Array.isArray(d.prescribed_tests) && d.prescribed_tests.length > 0) {
          const newSelectedIds: number[] = [...selectedTests]
          const newCustomTests: { id?: number; name: string }[] = [...customTests]

          d.prescribed_tests.forEach((testItem: any) => {
            const testName = typeof testItem === "string" ? testItem : testItem.name
            const testId = typeof testItem === "object" ? testItem.id : undefined

            // Check if test exists in commonTests
            const matchCommon = commonTests.find(
              ct => ct.name.toLowerCase() === testName.toLowerCase()
            )
            if (matchCommon) {
              if (!newSelectedIds.includes(matchCommon.id)) {
                newSelectedIds.push(matchCommon.id)
              }
            } else if (testId) {
              if (!newSelectedIds.includes(testId)) {
                newSelectedIds.push(testId)
              }
              if (!newCustomTests.some(ct => ct.name.toLowerCase() === testName.toLowerCase())) {
                newCustomTests.push({ id: testId, name: testName })
              }
            } else {
              if (!newCustomTests.some(ct => ct.name.toLowerCase() === testName.toLowerCase())) {
                newCustomTests.push({ name: testName })
              }
            }
          })

          setSelectedTests(newSelectedIds)
          setCustomTests(newCustomTests)
        }

        // Map medicines dictionary
        if (d.medicines && typeof d.medicines === "object") {
          const newMeds: MedRow[] = []
          Object.entries(d.medicines).forEach(([medName, medDetails]: [string, any], idx) => {
            newMeds.push({
              id: Date.now() + idx,
              medicine: medDetails?.medicine_name || medName,
              dosage: medDetails?.dosage || "",
              duration: medDetails?.duration || "",
              instructions: medDetails?.instructions || "",
            })
          })

          if (newMeds.length > 0) {
            setMeds(newMeds)
          }
        }

        // Highlight populated fields visually
        setHighlightFields(true)
        setTimeout(() => setHighlightFields(false), 3000)
        setPipelineStep("done")
      } else {
        setPipelineError(structureRes.error || "Failed to extract structured fields.")
        setPipelineStep("idle")
      }
    } catch (err: any) {
      setPipelineError(err.message || "An error occurred during AI processing.")
      setPipelineStep("idle")
    }
  }

  // Medicine Autosuggest logic
  const handleMedNameChange = (id: number, val: string) => {
    updateMed(id, "medicine", val)
    if (val.trim().length >= 2) {
      fetchMedicineAutosuggest(val).then(res => {
        if (res.results) {
          setMedSuggestions(prev => ({ ...prev, [id]: res.results }))
        }
      })
    } else {
      setMedSuggestions(prev => ({ ...prev, [id]: [] }))
    }
  }

  const selectMedSuggestion = (id: number, suggestion: any) => {
    const medName = suggestion.medicine_name || suggestion.name || ""
    updateMed(id, "medicine", medName)
    setMedSuggestions(prev => ({ ...prev, [id]: [] }))
    setActiveMedRowFocus(null)
  }

  // Lab Test Autosuggest logic
  const handleTestSearchChange = (val: string) => {
    setTestSearch(val)
    if (val.trim().length >= 2) {
      setIsSearchingTests(true)
      fetchLabTestAutosuggest(val)
        .then(res => {
          setIsSearchingTests(false)
          if (res.results) setTestSuggestions(res.results)
        })
        .catch(() => setIsSearchingTests(false))
    } else {
      setTestSuggestions([])
    }
  }

  const handleAddCustomTest = (test: any) => {
    const testId = test.id
    const testName = test.name || testSearch.trim()

    if (testId && !selectedTests.includes(testId)) {
      setSelectedTests(prev => [...prev, testId])
    }
    if (!customTests.some(t => t.name.toLowerCase() === testName.toLowerCase())) {
      setCustomTests(prev => [...prev, { id: testId, name: testName }])
    }

    setTestSearch("")
    setTestSuggestions([])
  }

  const removeCustomTest = (name: string, id?: number) => {
    setCustomTests(prev => prev.filter(t => t.name !== name))
    if (id) {
      setSelectedTests(prev => prev.filter(x => x !== id))
    }
  }

  const addMed = () =>
    setMeds(m => [...m, { id: Date.now(), medicine: "", dosage: "", duration: "", instructions: "" }])
  const removeMed = (id: number) => setMeds(m => m.filter(r => r.id !== id))
  const updateMed = (id: number, key: keyof MedRow, val: string) =>
    setMeds(m => m.map(r => (r.id === id ? { ...r, [key]: val } : r)))

  const toggleTest = (id: number) =>
    setSelectedTests(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))

  // Quick Follow-up Shortcuts (+1W, +2W, +1M, +2M, +3M)
  const applyFollowupShortcut = (days: number) => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + days)
    const formatted = targetDate.toISOString().split("T")[0]
    setNextFollowupDate(formatted)
  }

  const handleSaveConsultation = async () => {
    if (!activeApptId) {
      setErrorMsg("Please select an active appointment for consultation.")
      return
    }

    setLoading(true)
    setErrorMsg("")
    setMsg("")

    try {
      const payload = {
        chief_complaints: chiefComplaints,
        clinical_findings: clinicalFindings,
        diagnosis: diagnosis,
        general_advice: adviceNotes,
        other_lab_notes: otherLabNotes,
        next_followup_date: nextFollowupDate,
        prescribed_tests: selectedTests,
        items: meds.filter(m => m.medicine.trim() !== ""),
        post_consult_status: postStatus,
      }
      const res = await saveConsultation(activeApptId, payload)
      setLoading(false)

      if (res.ok) {
        try {
          localStorage.removeItem(`rheumalink_draft_consult_${activeApptId}`)
        } catch {}
        setDraftSavedAt(null)
        setMsg("Consultation and prescription saved successfully to database!")
        setSavedPrescriptionId(res.prescription_id || null)
        setShowPreview(true)
      } else {
        setErrorMsg(res.errors ? JSON.stringify(res.errors) : "Failed to save consultation.")
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || "Error saving consultation.")
    }
  }

  const activeApptObj = appointments.find(a => String(a.id) === String(activeApptId))

  return (
    <>
      {showPreview && (
        <PrescriptionPreview
          prescriptionId={savedPrescriptionId || undefined}
          patientName={activeApptObj?.patient_name || selectedPatient?.name}
          patientFile={activeApptObj?.file || selectedPatient?.internal_file}
          doctorName={activeApptObj?.doctor_name || "Dr. Shweta Gupta"}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="p-6 space-y-8">
        {msg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-700 text-sm flex items-center justify-between">
            <span>✓ {msg}</span>
            {savedPrescriptionId && (
              <button
                onClick={() => setShowPreview(true)}
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-800 cursor-pointer"
              >
                View Prescription PDF
              </button>
            )}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-700 text-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {(selectedPatient || selectedAppointment) && (
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-sm font-700 flex items-center justify-between">
            <div>
              🎯 Active Patient: <strong>{selectedPatient?.name || selectedAppointment?.patient_name}</strong> (
              {selectedPatient?.internal_file || selectedAppointment?.file})
            </div>
            {selectedAppointment?.token && (
              <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-xs font-800">
                {selectedAppointment.token}
              </span>
            )}
          </div>
        )}

        <div>
          <Label>Select Appointment for Consultation (Today's Live Queue)</Label>
          <Select value={activeApptId} onChange={e => setActiveApptId(e.target.value)}>
            <option value="">Select appointment…</option>
            {appointments.length > 0 ? (
              appointments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.patient_name} — {a.token || `Token ${a.token_number}`} ({a.status || a.status_code})
                </option>
              ))
            ) : (
              <option value="" disabled>
                No today appointments found in DB
              </option>
            )}
          </Select>
        </div>

        {/* Entry Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          {(["manual", "dictation"] as EntryMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2.5 rounded-lg font-700 text-sm transition-all cursor-pointer ${
                mode === m ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {m === "manual" ? "✏️ Manual Entry" : "🎙️ AI Smart Dictation"}
            </button>
          ))}
        </div>

        {/* ── MEDASR SMART DICTATION WIDGET ── */}
        {mode === "dictation" && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 text-white space-y-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-800 text-teal-400 text-base flex items-center gap-2">
                🎙️ AI Smart Voice Dictation (MedASR + Groq)
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-700 ${
                    isRecording
                      ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                      : pipelineStep === "transcribing" || pipelineStep === "polishing" || pipelineStep === "structuring"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  }`}
                >
                  {isRecording
                    ? "🔴 Recording Live..."
                    : pipelineStep === "polishing"
                    ? "⚙️ Polishing Medical Terms..."
                    : pipelineStep === "structuring"
                    ? "🧠 Extracting Clinical Fields..."
                    : pipelineStep === "done"
                    ? "✅ Fields Populated"
                    : "Ready"}
                </span>
              </div>
            </div>

            {/* Dictation Tip */}
            <div className="bg-teal-950/60 border border-teal-500/40 rounded-xl p-3 text-xs text-teal-200 leading-relaxed">
              💡 <strong>Dictation Order Tip:</strong> Dictate in natural clinical order:{" "}
              <em>
                "Chief Complaints &rarr; Clinical Findings &rarr; Diagnosis &rarr; Prescribed Medications (Dosage,
                Duration, Instructions) &rarr; Lab Tests &rarr; Follow-up Timeline"
              </em>
              .
            </div>

            {/* Mic Controls & Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-3.5 py-2">
              <div className="flex items-center gap-2.5 w-full flex-wrap justify-center">
                {/* 1. Record / Pause Toggle Button */}
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPipelineError(null)
                      startRecording(dictatedRawText)
                    }}
                    className="py-3 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-800 text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                  >
                    <MicIcon size={20} />
                    {dictatedRawText.trim() ? "🎙️ Resume Dictation" : "🎙️ Start MedASR Dictation"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      await stopRecording()
                      setPipelineStep("idle")
                    }}
                    className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-800 text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-98 animate-pulse"
                  >
                    <span className="w-3.5 h-3.5 rounded-xs bg-slate-950 inline-block" />
                    ⏹️ Stop / Pause Recording
                  </button>
                )}

                {/* 2. Dedicated Process & Auto-Fill Form Button */}
                <button
                  type="button"
                  disabled={!dictatedRawText.trim() || pipelineStep === "polishing" || pipelineStep === "structuring"}
                  onClick={handleProcessVoiceNote}
                  className={`py-3 px-5 rounded-xl font-800 text-sm flex items-center gap-2 shadow-md transition-all ${
                    dictatedRawText.trim()
                      ? "bg-teal-600 hover:bg-teal-500 text-white cursor-pointer active:scale-98"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  ⚡ Process &amp; Auto-Fill Form
                </button>

                {/* 3. Dedicated Reset / Clear Transcript Button */}
                <button
                  type="button"
                  disabled={!dictatedRawText.trim() && !isRecording}
                  onClick={handleClearTranscript}
                  className={`py-3 px-4 rounded-xl font-700 text-xs flex items-center gap-1.5 border transition-all ${
                    dictatedRawText.trim() || isRecording
                      ? "border-red-500/40 bg-red-950/40 text-red-300 hover:bg-red-900/60 cursor-pointer"
                      : "border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed opacity-50"
                  }`}
                >
                  🗑️ Clear / Reset
                </button>
              </div>

              {/* Dynamic Sound Waveform Bars during 16kHz PCM streaming */}
              {isRecording && (
                <div className="flex items-center gap-1 h-8 px-4 py-1 bg-slate-950/80 rounded-full border border-teal-500/40 w-full max-w-xs justify-center animate-fadeIn">
                  {[12, 20, 8, 26, 16, 28, 14, 24, 10, 22, 18, 30, 14, 26, 8, 20, 12].map((baseHeight, idx) => {
                    const dynamicHeight = Math.max(3, Math.min(30, baseHeight * (0.4 + audioLevel * 1.6)))
                    return (
                      <span
                        key={idx}
                        className="w-1 bg-teal-400 rounded-full transition-all duration-75"
                        style={{
                          height: `${dynamicHeight}px`,
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </div>

            {/* Editable Live Transcript Box */}
            <div className="space-y-1.5">
              <div className="relative">
                <textarea
                  value={dictatedRawText}
                  onChange={e => setDictatedRawText(e.target.value)}
                  placeholder='Live transcript will stream here as you speak. You can also type or edit text directly here...'
                  rows={3}
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-200 font-500 leading-relaxed focus:outline-hidden focus:border-teal-500 transition-colors resize-y"
                />
                {dictatedRawText && (
                  <span className="absolute bottom-2.5 right-3 text-[11px] text-slate-500 font-600 pointer-events-none">
                    {dictatedRawText.split(/\s+/).filter(Boolean).length} words · Click "Process" to fill form
                  </span>
                )}
              </div>

              {/* Draft status indicator */}
              {draftSavedAt && (
                <div className="flex items-center justify-between text-[11px] text-teal-400/90 font-600 px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse inline-block" />
                    💾 {draftSavedAt}
                  </span>
                  <span className="text-slate-500">Persistent across browser reloads &amp; network drops</span>
                </div>
              )}
            </div>

            {/* 3-Step AI Pipeline Status Indicator */}
            {(pipelineStep !== "idle" || pipelineError) && (
              <div className="bg-slate-950/90 border border-slate-700/80 rounded-xl p-4 space-y-2 text-xs">
                <p className="font-800 text-teal-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <span>⚙️</span> MedASR AI Processing Pipeline
                </p>

                <div className="flex items-center gap-2">
                  <span>
                    {pipelineStep === "transcribing"
                      ? "⏳"
                      : pipelineStep === "polishing" || pipelineStep === "structuring" || pipelineStep === "done"
                      ? "✅"
                      : "⚪"}
                  </span>
                  <span
                    className={
                      pipelineStep === "transcribing"
                        ? "text-teal-300 font-700"
                        : pipelineStep === "polishing" || pipelineStep === "structuring" || pipelineStep === "done"
                        ? "text-slate-300 font-600"
                        : "text-slate-500"
                    }
                  >
                    1. Finalizing speech transcription text...
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span>
                    {pipelineStep === "polishing"
                      ? "⏳"
                      : pipelineStep === "structuring" || pipelineStep === "done"
                      ? "✅"
                      : "⚪"}
                  </span>
                  <span
                    className={
                      pipelineStep === "polishing"
                        ? "text-teal-300 font-700"
                        : pipelineStep === "structuring" || pipelineStep === "done"
                        ? "text-slate-300 font-600"
                        : "text-slate-500"
                    }
                  >
                    2. Polishing pronunciation, dosage notation &amp; medical spelling...
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span>{pipelineStep === "structuring" ? "⏳" : pipelineStep === "done" ? "✅" : "⚪"}</span>
                  <span
                    className={
                      pipelineStep === "structuring"
                        ? "text-teal-300 font-700"
                        : pipelineStep === "done"
                        ? "text-slate-300 font-600"
                        : "text-slate-500"
                    }
                  >
                    3. Extracting clinical fields (Complaints, Findings, Diagnosis, Advice, Labs, Medicines)...
                  </span>
                </div>

                {pipelineError && <p className="text-red-400 font-700 pt-1">⚠️ {pipelineError}</p>}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1: CONSULTATION NOTES ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">
                1
              </span>
              <h3 className="font-800 text-slate-800 text-base">Consultation Notes</h3>
            </div>
            {highlightFields && (
              <span className="text-xs font-800 text-teal-700 bg-teal-100 px-3 py-1 rounded-full animate-bounce">
                ✨ Auto-Populated by MedASR
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>📋 Chief Complaints</Label>
              <Textarea
                placeholder="e.g. Pain and swelling in both hand joints for 3 months…"
                value={chiefComplaints}
                onChange={e => setChiefComplaints(e.target.value)}
                className={`transition-colors ${highlightFields ? "border-teal-500 bg-teal-50/30" : ""}`}
              />
            </div>
            <div>
              <Label>🔍 Clinical Findings</Label>
              <Textarea
                placeholder="e.g. Bilateral symmetric synovitis, MCP and PIP joints, morning stiffness…"
                value={clinicalFindings}
                onChange={e => setClinicalFindings(e.target.value)}
                className={`transition-colors ${highlightFields ? "border-teal-500 bg-teal-50/30" : ""}`}
              />
            </div>
            <div>
              <Label>📌 Provisional Diagnosis</Label>
              <Textarea
                placeholder="e.g. Seropositive Rheumatoid Arthritis — Moderate Activity"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                rows={2}
                className={`transition-colors ${highlightFields ? "border-teal-500 bg-teal-50/30" : ""}`}
              />
            </div>
            <div>
              <Label>💡 General Advice &amp; Patient Notes</Label>
              <Textarea
                placeholder="e.g. Avoid cold water exposure, regular joint mobilization exercises…"
                value={adviceNotes}
                onChange={e => setAdviceNotes(e.target.value)}
                rows={2}
                className={`transition-colors ${highlightFields ? "border-teal-500 bg-teal-50/30" : ""}`}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* ── STEP 2: PRESCRIBED MEDICATIONS ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">
              2
            </span>
            <h3 className="font-800 text-slate-800 text-base">Prescribed Medications</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Medicine Name (Autosuggest)", "Dosage", "Duration", "Instructions", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-3 py-3 text-left font-800 text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meds.map((row, i) => (
                  <tr key={row.id} className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    {/* Medicine Name with Autocomplete Dropdown */}
                    <td className="px-2 py-2 min-w-[200px] relative">
                      <Input
                        value={row.medicine}
                        onChange={e => handleMedNameChange(row.id, e.target.value)}
                        onFocus={() => setActiveMedRowFocus(row.id)}
                        placeholder="e.g. Tab. Methotrexate"
                      />
                      {activeMedRowFocus === row.id &&
                        medSuggestions[row.id] &&
                        medSuggestions[row.id].length > 0 && (
                          <div className="absolute left-2 right-2 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-100">
                            {medSuggestions[row.id].map((s, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => selectMedSuggestion(row.id, s)}
                                className="w-full px-3 py-2 text-left hover:bg-teal-50 transition-colors flex flex-col cursor-pointer"
                              >
                                <span className="font-700 text-slate-800 text-xs">
                                  {s.medicine_name || s.name}
                                </span>
                                {s.generic_name && (
                                  <span className="text-[10px] text-slate-400 font-500">
                                    Generic: {s.generic_name}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                    </td>

                    {/* Dosage */}
                    <td className="px-2 py-2 min-w-[120px]">
                      <Input
                        value={row.dosage}
                        onChange={e => updateMed(row.id, "dosage", e.target.value)}
                        placeholder="e.g. 15 mg or 1-0-1"
                      />
                    </td>

                    {/* Duration */}
                    <td className="px-2 py-2 min-w-[120px]">
                      <Input
                        value={row.duration}
                        onChange={e => updateMed(row.id, "duration", e.target.value)}
                        placeholder="e.g. 4 weeks"
                      />
                    </td>

                    {/* Instructions */}
                    <td className="px-2 py-2 min-w-[180px]">
                      <Input
                        value={row.instructions}
                        onChange={e => updateMed(row.id, "instructions", e.target.value)}
                        placeholder="e.g. Once weekly after meals"
                      />
                    </td>

                    {/* Remove Row */}
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => removeMed(row.id)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addMed}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-teal-300 text-teal-700 font-700 text-sm hover:bg-teal-50 transition-colors cursor-pointer"
          >
            <PlusIcon /> Add Medicine Row
          </button>
        </div>

        <div className="border-t border-slate-100" />

        {/* ── STEP 3: LAB TESTS & INVESTIGATIONS ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">
              3
            </span>
            <h3 className="font-800 text-slate-800 text-base">🧪 Prescribe Lab Tests &amp; Investigations</h3>
          </div>

          {/* Common Tests */}
          <div>
            <p className="text-xs font-700 text-slate-500 uppercase tracking-wider mb-2">Common Blood Tests:</p>
            <div className="flex flex-wrap gap-2">
              {commonTests.length > 0 ? (
                commonTests.map(t => {
                  const active = selectedTests.includes(t.id)
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTest(t.id)}
                      className={`px-3 py-2 rounded-xl border-2 text-xs font-700 transition-all cursor-pointer ${
                        active
                          ? "border-teal-600 bg-teal-50 text-teal-800 shadow-2xs"
                          : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"
                      }`}
                    >
                      {active ? "✓ " : "+ "}
                      {t.name}
                    </button>
                  )
                })
              ) : (
                <span className="text-slate-400 font-600 text-xs">Loading common tests from database…</span>
              )}
            </div>
          </div>

          {/* Custom Lab Test Autocomplete Search */}
          <div className="relative max-w-md pt-2">
            <p className="text-xs font-700 text-slate-500 uppercase tracking-wider mb-1">
              Add Other / Specialized Lab Test:
            </p>
            <div className="flex gap-2">
              <Input
                value={testSearch}
                onChange={e => handleTestSearchChange(e.target.value)}
                placeholder="Search lab test (e.g. Anti-CCP, HLA-B27)…"
              />
              {testSearch.trim() && (
                <button
                  type="button"
                  onClick={() => handleAddCustomTest({ name: testSearch.trim() })}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-700 text-xs rounded-xl cursor-pointer"
                >
                  Add
                </button>
              )}
            </div>

            {testSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto divide-y divide-slate-100">
                {testSuggestions.map((st, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddCustomTest(st)}
                    className="w-full px-3 py-2 text-left hover:bg-teal-50 transition-colors text-xs font-700 text-slate-700 cursor-pointer"
                  >
                    + {st.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Custom Tests Badges */}
          {customTests.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-700 text-slate-500 uppercase tracking-wider mb-1.5">Prescribed Tests:</p>
              <div className="flex flex-wrap gap-2">
                {customTests.map((ct, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-100 text-teal-800 text-xs font-700 border border-teal-300"
                  >
                    <span>🧪</span> {ct.name}
                    <button
                      type="button"
                      onClick={() => removeCustomTest(ct.name, ct.id)}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Other / Imaging Notes */}
          <div className="pt-2">
            <Label>Imaging &amp; Special Lab Notes (Optional)</Label>
            <Textarea
              placeholder="e.g. Baseline Chest X-Ray (PA View), Pelvic MRI, Dual-energy X-ray absorptiometry…"
              value={otherLabNotes}
              onChange={e => setOtherLabNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* ── STEP 4: FOLLOW-UP & POST-CONSULT STATUS ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-800 flex items-center justify-center">
              4
            </span>
            <h3 className="font-800 text-slate-800 text-base">📅 Follow-Up &amp; Consultation Status</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Follow-up date & shortcuts */}
            <div>
              <Label>Next Follow-Up Date</Label>
              <Input
                type="date"
                value={nextFollowupDate}
                onChange={e => setNextFollowupDate(e.target.value)}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: "+1 Week", days: 7 },
                  { label: "+2 Weeks", days: 14 },
                  { label: "+1 Month", days: 30 },
                  { label: "+2 Months", days: 60 },
                  { label: "+3 Months", days: 90 },
                ].map(sc => (
                  <button
                    key={sc.label}
                    type="button"
                    onClick={() => applyFollowupShortcut(sc.days)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 font-700 text-xs transition-colors cursor-pointer"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Post consultation status */}
            <div>
              <Label>Post Consultation Patient Queue Status</Label>
              <div className="flex gap-3">
                {[
                  { label: "✅ Attended", code: "A" },
                  { label: "⏳ Follow-up Required", code: "I" },
                ].map(s => (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => setPostStatus(s.code)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-700 text-sm transition-all cursor-pointer ${
                      postStatus === s.code
                        ? s.code === "A"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs"
                          : "border-amber-500 bg-amber-50 text-amber-800 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save & Generate PDF */}
        <div className="pt-4">
          <PrimaryBtn onClick={handleSaveConsultation} disabled={loading} fullWidth>
            📄 {loading ? "Saving Consultation & Rendering PDF…" : "Save Consultation & Generate PDF"}
          </PrimaryBtn>
        </div>
      </div>
    </>
  )
}
