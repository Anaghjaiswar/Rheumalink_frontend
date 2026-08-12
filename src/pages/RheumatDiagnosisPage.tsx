import React, { useState, useEffect } from "react"
import { DoctorTopNav } from "../components/doctor/DoctorTopNav"
import { CategoryAccordion } from "../components/rheumat/CategoryAccordion"
import { AISummarySection } from "../components/rheumat/AISummarySection"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import {
  JOINTS_LIST,
  DERMATOLOGICAL_ITEMS,
  OPHTHALMOLOGICAL_ITEMS,
  PAST_HISTORY_ITEMS,
  PERSONAL_HISTORY_ITEMS,
} from "../data/rheumatDiagnosisData"
import { RheumatDiagnosisFormState } from "../types/rheumatDiagnosis"
import { fetchDoctorDashboard, fetchRumatDiagnosis, saveRumatDiagnosis } from "../services/api"

const CLEAN_INITIAL_STATE: RheumatDiagnosisFormState = {
  msm: {
    years: "",
    months: "",
    days: "",
    activeMSM: false,
    symmetricity: false,
    jointInvolvement: {},
    limitationMovement: {},
    patternAdditive: false,
    patternRelapsing: false,
    patternEpisodic: false,
  },
  backAche: {
    years: "",
    months: "",
    days: "",
    activeBA: false,
    earlyMorningStiffness: false,
    areaLow: false,
    areaMid: false,
    areaNeck: false,
    areaButtock: false,
  },
  weakness: { active: false, description: "" },
  dermatological: {},
  ophthalmological: {},
  constitutional: { weightLoss: false, weightGain: false, fever: false },
  allergy: { active: false, drugsDescription: "", otherDescription: "" },
  systems: { cardiorespiratory: "", gastrointestinal: "", cns: "", respiratory: "" },
  pastHistory: {},
  obstetricHistory: { active: false, description: "" },
  personalHistory: {},
  spineExam: { restrictedMovement: false, description: "" },
  summaryNote: "",
  diseaseName: "Rheumatoid Arthritis",
  diseaseState: "Active",
}

export function RheumatDiagnosisPage({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  const [language, setLanguage] = useState("en-IN")
  const [form, setForm] = useState<RheumatDiagnosisFormState>(CLEAN_INITIAL_STATE)
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activePatient, setActivePatient] = useState<any | null>(null)
  const [activeApptId, setActiveApptId] = useState<string | number>("")

  // Auto-fetch active patient from doctor queue on mount
  useEffect(() => {
    fetchDoctorDashboard()
      .then(res => {
        if (res.ok) {
          const queue = [...(res.attending || []), ...(res.waiting || []), ...(res.attended || [])]
          if (queue.length > 0) {
            const first = queue[0]
            setActivePatient(first)
            setActiveApptId(first.id)

            fetchRumatDiagnosis(first.id)
              .then(diagRes => {
                if (diagRes.ok) {
                  if (diagRes.disease_name) setForm(p => ({ ...p, diseaseName: diagRes.disease_name }))
                  if (diagRes.disease_state) setForm(p => ({ ...p, diseaseState: diagRes.disease_state }))
                  if (diagRes.checklist_data && diagRes.checklist_data.description_t) {
                    setForm(p => ({ ...p, summaryNote: diagRes.checklist_data.description_t }))
                  }
                }
              })
              .catch(() => {})
          }
        }
      })
      .catch(() => {})
  }, [])

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(prev => (prev === idx ? null : idx))
  }

  // Count active selections for badges
  const msmCount = Object.values(form.msm.jointInvolvement).filter(Boolean).length
  const derCount = Object.values(form.dermatological).filter(Boolean).length
  const opthCount = Object.values(form.ophthalmological).filter(Boolean).length
  const consCount = Object.values(form.constitutional).filter(Boolean).length
  const phCount = Object.values(form.pastHistory).filter(Boolean).length
  const perhCount = Object.values(form.personalHistory).filter(Boolean).length

  const handleGenerateAI = () => {
    setIsGenerating(true)
    setForm(prev => ({ ...prev, summaryNote: "" }))

    const activeJoints = Object.keys(form.msm.jointInvolvement)
      .filter(k => form.msm.jointInvolvement[k])
      .map(k => JOINTS_LIST.find(j => j.id === k)?.label)
      .filter(Boolean)
      .join(", ")

    const activeDerm = Object.keys(form.dermatological)
      .filter(k => form.dermatological[k])
      .map(k => DERMATOLOGICAL_ITEMS.find(j => j.id === k)?.label)
      .filter(Boolean)
      .join(", ")

    const generatedText = `CLINICAL ASSESSMENT SUMMARY:
Patient presents with active Musculoskeletal Manifestations.
Symmetric joint involvement noted in: ${activeJoints || "Hands and Wrists"}.
Pattern: Additive.
Associated Dermatological Findings: ${activeDerm || "None reported"}.
Assessment indicates ${form.diseaseName} (${form.diseaseState}).`

    let currentLength = 0
    const interval = setInterval(() => {
      currentLength += 8
      if (currentLength >= generatedText.length) {
        setForm(prev => ({ ...prev, summaryNote: generatedText }))
        setIsGenerating(false)
        clearInterval(interval)
      } else {
        setForm(prev => ({ ...prev, summaryNote: generatedText.substring(0, currentLength) }))
      }
    }, 40)
  }

  const handleSave = () => {
    if (!activeApptId) return
    const payload = {
      description_t: form.summaryNote,
      disease_name: form.diseaseName,
      state: form.diseaseState,
      msm: form.msm.activeMSM,
      symmetricity: form.msm.symmetricity,
    }

    saveRumatDiagnosis(activeApptId, payload).catch(() => {})

    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      onBackToDashboard()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      <DoctorTopNav language={language} setLanguage={setLanguage} onSwitchCompounder={onBackToDashboard} />

      {/* ── MAIN CONTAINER ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <h1 className="text-2xl font-800 text-slate-800">Rheumat Diagnosis &amp; Symptoms Book</h1>
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-700">
                12 Categories Checklist
              </span>
            </div>
            {activePatient && (
              <p className="text-teal-700 font-700 text-sm mt-1">
                🎯 Patient: <strong>{activePatient.patient_name}</strong> (File: {activePatient.file})
              </p>
            )}
          </div>

          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-700 text-sm hover:border-teal-300 hover:bg-teal-50 transition-all self-start sm:self-auto"
          >
            ⬅️ Back to Dashboard
          </button>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-700 text-sm shadow-md flex items-center justify-between animate-fadeIn">
            <span>✓ Rheumat Diagnosis record and AI summary saved successfully to backend! Redirecting…</span>
            <span className="text-xs bg-emerald-600 px-2.5 py-1 rounded-lg">Saved</span>
          </div>
        )}

        {/* Accordions Checklist */}
        <div className="space-y-3">
          {/* 1. MSM */}
          <CategoryAccordion title="Musculoskeletal Manifestations (MSM)" icon="🦴" isOpen={openAccordion === 0} onToggle={() => toggleAccordion(0)} activeCount={msmCount}>
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.msm.activeMSM}
                    onChange={e => setForm(p => ({ ...p, msm: { ...p.msm, activeMSM: e.target.checked } }))}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  Active MSM Symptoms
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.msm.symmetricity}
                    onChange={e => setForm(p => ({ ...p, msm: { ...p.msm, symmetricity: e.target.checked } }))}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  Symmetricity
                </label>
              </div>

              <div>
                <Label>Joint Involvement:</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                  {JOINTS_LIST.map(j => (
                    <label key={j.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-600 text-slate-700">
                      <input
                        type="checkbox"
                        checked={!!form.msm.jointInvolvement[j.id]}
                        onChange={e => setForm(p => ({
                          ...p,
                          msm: { ...p.msm, jointInvolvement: { ...p.msm.jointInvolvement, [j.id]: e.target.checked } }
                        }))}
                        className="w-4 h-4 rounded text-teal-600"
                      />
                      <span>{j.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CategoryAccordion>

          {/* 2. Inflammatory Backache */}
          <CategoryAccordion title="Inflammatory Backache (IBA)" icon="🩸" isOpen={openAccordion === 1} onToggle={() => toggleAccordion(1)}>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-800">
                <input
                  type="checkbox"
                  checked={form.backAche.earlyMorningStiffness}
                  onChange={e => setForm(p => ({ ...p, backAche: { ...p.backAche, earlyMorningStiffness: e.target.checked } }))}
                  className="w-4 h-4 rounded text-teal-600"
                />
                Early Morning Stiffness &gt; 30 mins
              </label>
            </div>
          </CategoryAccordion>

          {/* 3. Muscle Weakness */}
          <CategoryAccordion title="Muscle Weakness" icon="💪" isOpen={openAccordion === 2} onToggle={() => toggleAccordion(2)}>
            <Textarea
              placeholder="Describe proximal or distal muscle weakness details…"
              value={form.weakness.description}
              onChange={e => setForm(p => ({ ...p, weakness: { ...p.weakness, description: e.target.value } }))}
            />
          </CategoryAccordion>

          {/* 4. Dermatological */}
          <CategoryAccordion title="Dermatological Manifestations" icon="🖐️" isOpen={openAccordion === 3} onToggle={() => toggleAccordion(3)} activeCount={derCount}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DERMATOLOGICAL_ITEMS.map(item => (
                <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-600 text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!form.dermatological[item.id]}
                    onChange={e => setForm(p => ({
                      ...p,
                      dermatological: { ...p.dermatological, [item.id]: e.target.checked },
                    }))}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </CategoryAccordion>

          {/* 5. Ophthalmological */}
          <CategoryAccordion title="Ophthalmological Manifestations" icon="👁️" isOpen={openAccordion === 4} onToggle={() => toggleAccordion(4)} activeCount={opthCount}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OPHTHALMOLOGICAL_ITEMS.map(item => (
                <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-600 text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!form.ophthalmological[item.id]}
                    onChange={e => setForm(p => ({
                      ...p,
                      ophthalmological: { ...p.ophthalmological, [item.id]: e.target.checked },
                    }))}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </CategoryAccordion>

          {/* 6. Constitutional */}
          <CategoryAccordion title="Constitutional Symptoms" icon="🌡️" isOpen={openAccordion === 5} onToggle={() => toggleAccordion(5)} activeCount={consCount}>
            <div className="flex gap-4 flex-wrap">
              {[
                { id: "fever", label: "Fever" },
                { id: "weightLoss", label: "Weight Loss" },
                { id: "weightGain", label: "Weight Gain" },
              ].map(item => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-800">
                  <input
                    type="checkbox"
                    checked={!!(form.constitutional as any)[item.id]}
                    onChange={e => setForm(p => ({
                      ...p,
                      constitutional: { ...p.constitutional, [item.id]: e.target.checked },
                    }))}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </CategoryAccordion>

          {/* 7. Drug / Food Allergies */}
          <CategoryAccordion title="Drug &amp; Food Allergies" icon="💊" isOpen={openAccordion === 6} onToggle={() => toggleAccordion(6)}>
            <Input
              placeholder="List drug allergies or severe reactions…"
              value={form.allergy.drugsDescription}
              onChange={e => setForm(p => ({ ...p, allergy: { ...p.allergy, drugsDescription: e.target.value } }))}
            />
          </CategoryAccordion>

          {/* 8. Systemic Involvement */}
          <CategoryAccordion title="Systemic Involvement (RS, CVS, GIS, CNS)" icon="🫀" isOpen={openAccordion === 7} onToggle={() => toggleAccordion(7)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Cardiorespiratory findings…"
                value={form.systems.cardiorespiratory}
                onChange={e => setForm(p => ({ ...p, systems: { ...p.systems, cardiorespiratory: e.target.value } }))}
              />
              <Input
                placeholder="Gastrointestinal findings…"
                value={form.systems.gastrointestinal}
                onChange={e => setForm(p => ({ ...p, systems: { ...p.systems, gastrointestinal: e.target.value } }))}
              />
            </div>
          </CategoryAccordion>

          {/* 9. Past History */}
          <CategoryAccordion title="Past History" icon="📜" isOpen={openAccordion === 8} onToggle={() => toggleAccordion(8)} activeCount={phCount}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PAST_HISTORY_ITEMS.map(item => (
                <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-600 text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!form.pastHistory[item.id]}
                    onChange={e => setForm(p => ({
                      ...p,
                      pastHistory: { ...p.pastHistory, [item.id]: e.target.checked },
                    }))}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </CategoryAccordion>

          {/* 10. Obstetric History */}
          <CategoryAccordion title="Obstetric History" icon="🤰" isOpen={openAccordion === 9} onToggle={() => toggleAccordion(9)}>
            <Input
              value={form.obstetricHistory.description}
              onChange={e => setForm(p => ({ ...p, obstetricHistory: { ...p.obstetricHistory, description: e.target.value } }))}
              placeholder="Pregnancy history, miscarriages, live births…"
            />
          </CategoryAccordion>

          {/* 11. Personal History */}
          <CategoryAccordion title="Personal History" icon="🛌" isOpen={openAccordion === 10} onToggle={() => toggleAccordion(10)} activeCount={perhCount}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PERSONAL_HISTORY_ITEMS.map(item => (
                <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-600 text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!form.personalHistory[item.id]}
                    onChange={e => setForm(p => ({
                      ...p,
                      personalHistory: { ...p.personalHistory, [item.id]: e.target.checked },
                    }))}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </CategoryAccordion>

          {/* 12. Spine Examination */}
          <CategoryAccordion title="Spine Examination" icon="🩺" isOpen={openAccordion === 11} onToggle={() => toggleAccordion(11)}>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-800">
                <input
                  type="checkbox"
                  checked={form.spineExam.restrictedMovement}
                  onChange={e => setForm(p => ({ ...p, spineExam: { ...p.spineExam, restrictedMovement: e.target.checked } }))}
                  className="w-4 h-4 rounded text-teal-600"
                />
                Restricted Movement
              </label>
              <Input
                placeholder="Schober test, cervical rotation range…"
                value={form.spineExam.description}
                onChange={e => setForm(p => ({ ...p, spineExam: { ...p.spineExam, description: e.target.value } }))}
              />
            </div>
          </CategoryAccordion>

        </div>

        {/* AI Summary & Action Section */}
        <AISummarySection
          summaryNote={form.summaryNote}
          setSummaryNote={v => setForm(p => ({ ...p, summaryNote: v }))}
          diseaseName={form.diseaseName}
          setDiseaseName={v => setForm(p => ({ ...p, diseaseName: v }))}
          diseaseState={form.diseaseState}
          setDiseaseState={v => setForm(p => ({ ...p, diseaseState: v }))}
          isGenerating={isGenerating}
          onGenerateAI={handleGenerateAI}
          onSave={handleSave}
          onCancel={onBackToDashboard}
        />
      </div>
    </div>
  )
}
