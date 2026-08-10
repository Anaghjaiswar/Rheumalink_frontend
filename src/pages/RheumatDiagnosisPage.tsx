import React, { useState } from "react"
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

const INITIAL_STATE: RheumatDiagnosisFormState = {
  msm: {
    years: "1",
    months: "6",
    days: "0",
    activeMSM: true,
    symmetricity: true,
    jointInvolvement: { hand_right: true, hand_left: true, wrist_right: true, wrist_left: true, knee_right: true },
    limitationMovement: { wrist_right: true, wrist_left: true },
    patternAdditive: true,
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
  dermatological: { raynauds: true, dry_mouth: true },
  ophthalmological: { dry_eyes: true },
  constitutional: { weightLoss: true, weightGain: false, fever: false },
  allergy: { active: false, drugsDescription: "", otherDescription: "" },
  systems: { cardiorespiratory: "", gastrointestinal: "", cns: "", respiratory: "" },
  pastHistory: { dm: false, htn: true },
  obstetricHistory: { active: false, description: "" },
  personalHistory: { appetite_normal: true, sleep_disturbed: true },
  spineExam: { active: false, restrictedMovement: false, description: "" },
  summaryNote: "",
  diseaseName: "Rheumatoid Arthritis",
  diseaseState: "Active",
}

export function RheumatDiagnosisPage({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  const [language, setLanguage] = useState("en-IN")
  const [form, setForm] = useState<RheumatDiagnosisFormState>(INITIAL_STATE)
  const [openAccordion, setOpenAccordion] = useState<number | null>(0) // Open category 0 by default
  const [isGenerating, setIsGenerating] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

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

  // Simulated AI Summary Note Streaming Generation
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
      .map(k => DERMATOLOGICAL_ITEMS.find(d => d.id === k)?.label)
      .filter(Boolean)
      .join(", ")

    const generatedText = `PATIENT CLINICAL SUMMARY NOTE:
Patient presents with active Musculoskeletal Manifestations of 1 yr 6 mo duration.
Symmetric joint involvement noted in: ${activeJoints || "Hands and Wrists"}.
Pattern: Additive. Limitation of Movement observed in Bilateral Wrists.
Associated Dermatological Findings: ${activeDerm || "Raynaud's Phenomenon, Dry Mouth"}.
Ophthalmological: Dry Eyes noted. Constitutional: Weight Loss reported.
Assessment indicates Active Rheumatoid Arthritis with moderate inflammatory activity.`

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
            <p className="text-slate-500 font-500 text-sm mt-1">
              Document patient manifestations and generate AI clinical notes instantly.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-700 text-sm hover:border-teal-300 hover:bg-teal-50 transition-all self-start sm:self-auto"
          >
            ⬅️ Back to Dashboard
          </button>
        </div>

        {/* Patient Summary Header Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-600">
          <div>
            <span className="text-slate-400 block font-500">Patient Name</span>
            <span className="text-slate-800 font-800 text-sm">Alpa Jaiswar</span>
          </div>
          <div>
            <span className="text-slate-400 block font-500">Sex / Age</span>
            <span className="text-slate-800 font-800 text-sm">Female / 42 Yrs.</span>
          </div>
          <div>
            <span className="text-slate-400 block font-500">Appointment</span>
            <span className="text-teal-700 font-800 text-sm">Token 1 (RL-26-00011)</span>
          </div>
          <div>
            <span className="text-slate-400 block font-500">Consulting Doctor</span>
            <span className="text-slate-800 font-800 text-sm">Dr. Shweta Gupta</span>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-700 text-sm shadow-md flex items-center justify-between animate-fadeIn">
            <span>✓ Rheumat Diagnosis record and AI summary saved successfully! Redirecting…</span>
            <span className="text-xs bg-emerald-600 px-2.5 py-1 rounded-lg">Saved</span>
          </div>
        )}

        {/* 12 Accordion Categories */}
        <div className="space-y-3">

          {/* 1. Musculoskeletal Manifestations */}
          <CategoryAccordion
            title="Musculoskeletal Manifestations"
            icon="🦴"
            isOpen={openAccordion === 0}
            onToggle={() => toggleAccordion(0)}
            activeCount={msmCount}
          >
            {/* Duration inputs */}
            <div className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-4">
              <div>
                <Label>Duration Years</Label>
                <Input
                  type="number"
                  noMic
                  value={form.msm.years}
                  onChange={e => setForm(p => ({ ...p, msm: { ...p.msm, years: e.target.value } }))}
                />
              </div>
              <div>
                <Label>Duration Months</Label>
                <Input
                  type="number"
                  noMic
                  value={form.msm.months}
                  onChange={e => setForm(p => ({ ...p, msm: { ...p.msm, months: e.target.value } }))}
                />
              </div>
              <div>
                <Label>Duration Days</Label>
                <Input
                  type="number"
                  noMic
                  value={form.msm.days}
                  onChange={e => setForm(p => ({ ...p, msm: { ...p.msm, days: e.target.value } }))}
                />
              </div>
            </div>

            {/* Main checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-700 text-slate-800">
                <input
                  type="checkbox"
                  checked={form.msm.activeMSM}
                  onChange={e => setForm(p => ({ ...p, msm: { ...p.msm, activeMSM: e.target.checked } }))}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-400"
                />
                Active Musculoskeletal Manifestation
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-700 text-slate-800">
                <input
                  type="checkbox"
                  checked={form.msm.symmetricity}
                  onChange={e => setForm(p => ({ ...p, msm: { ...p.msm, symmetricity: e.target.checked } }))}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-400"
                />
                Symmetric Involvement
              </label>
            </div>

            {/* Joint Involvement Grid */}
            <div>
              <h4 className="font-800 text-slate-500 text-xs uppercase tracking-wide mb-2">Joint Involvement (JI)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {JOINTS_LIST.map(j => (
                  <label key={j.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-600 text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!form.msm.jointInvolvement[j.id]}
                      onChange={e => setForm(p => ({
                        ...p,
                        msm: {
                          ...p.msm,
                          jointInvolvement: { ...p.msm.jointInvolvement, [j.id]: e.target.checked },
                        },
                      }))}
                      className="w-4 h-4 rounded text-teal-600"
                    />
                    <span>{j.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Limitation of Movement Grid */}
            <div>
              <h4 className="font-800 text-slate-500 text-xs uppercase tracking-wide mb-2">Limitation of Movement (LOM)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {JOINTS_LIST.map(j => (
                  <label key={`lom_${j.id}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-600 text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!form.msm.limitationMovement[j.id]}
                      onChange={e => setForm(p => ({
                        ...p,
                        msm: {
                          ...p.msm,
                          limitationMovement: { ...p.msm.limitationMovement, [j.id]: e.target.checked },
                        },
                      }))}
                      className="w-4 h-4 rounded text-teal-600"
                    />
                    <span>{j.label} LOM</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pattern */}
            <div>
              <h4 className="font-800 text-slate-500 text-xs uppercase tracking-wide mb-2">Pattern</h4>
              <div className="flex gap-6">
                {[
                  { id: "patternAdditive", label: "Additive Pattern" },
                  { id: "patternRelapsing", label: "Relapsing" },
                  { id: "patternEpisodic", label: "Episodic" },
                ].map(p => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(form.msm[p.id as keyof typeof form.msm])}
                      onChange={e => setForm(prev => ({
                        ...prev,
                        msm: { ...prev.msm, [p.id]: e.target.checked },
                      }))}
                      className="w-4 h-4 rounded text-teal-600"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CategoryAccordion>

          {/* 2. Back Ache */}
          <CategoryAccordion title="Back Ache" icon="🧍" isOpen={openAccordion === 1} onToggle={() => toggleAccordion(1)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-800">
                <input
                  type="checkbox"
                  checked={form.backAche.activeBA}
                  onChange={e => setForm(p => ({ ...p, backAche: { ...p.backAche, activeBA: e.target.checked } }))}
                  className="w-4 h-4 rounded text-teal-600"
                />
                Back Ache
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-800">
                <input
                  type="checkbox"
                  checked={form.backAche.earlyMorningStiffness}
                  onChange={e => setForm(p => ({ ...p, backAche: { ...p.backAche, earlyMorningStiffness: e.target.checked } }))}
                  className="w-4 h-4 rounded text-teal-600"
                />
                Early Morning Stiffness
              </label>
            </div>
          </CategoryAccordion>

          {/* 3. Weakness */}
          <CategoryAccordion title="Weakness" icon="⚡" isOpen={openAccordion === 2} onToggle={() => toggleAccordion(2)}>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-800">
                <input
                  type="checkbox"
                  checked={form.weakness.active}
                  onChange={e => setForm(p => ({ ...p, weakness: { ...p.weakness, active: e.target.checked } }))}
                  className="w-4 h-4 rounded text-teal-600"
                />
                Weakness Condition
              </label>
              <Input
                placeholder="Description of muscle or grip weakness…"
                value={form.weakness.description}
                onChange={e => setForm(p => ({ ...p, weakness: { ...p.weakness, description: e.target.value } }))}
              />
            </div>
          </CategoryAccordion>

          {/* 4. Dermatological */}
          <CategoryAccordion title="Dermatological" icon="🧴" isOpen={openAccordion === 3} onToggle={() => toggleAccordion(3)} activeCount={derCount}>
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
          <CategoryAccordion title="Ophthalmological" icon="👁️" isOpen={openAccordion === 4} onToggle={() => toggleAccordion(4)} activeCount={opthCount}>
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
          <CategoryAccordion title="Constitutional" icon="🌡️" isOpen={openAccordion === 5} onToggle={() => toggleAccordion(5)} activeCount={consCount}>
            <div className="flex gap-6">
              {[
                { id: "weightLoss", label: "Weight Loss" },
                { id: "weightGain", label: "Weight Gain" },
                { id: "fever", label: "Fever" },
              ].map(item => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer text-xs font-700 text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(form.constitutional[item.id as keyof typeof form.constitutional])}
                    onChange={e => setForm(p => ({
                      ...p,
                      constitutional: { ...p.constitutional, [item.id]: e.target.checked },
                    }))}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </CategoryAccordion>

          {/* 7. Allergy */}
          <CategoryAccordion title="Allergy" icon="⚠️" isOpen={openAccordion === 6} onToggle={() => toggleAccordion(6)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Drugs Allergy Description</Label>
                <Textarea
                  rows={2}
                  value={form.allergy.drugsDescription}
                  onChange={e => setForm(p => ({ ...p, allergy: { ...p.allergy, drugsDescription: e.target.value } }))}
                  placeholder="e.g. Penicillin, NSAIDs"
                />
              </div>
              <div>
                <Label>Other Allergy Description</Label>
                <Textarea
                  rows={2}
                  value={form.allergy.otherDescription}
                  onChange={e => setForm(p => ({ ...p, allergy: { ...p.allergy, otherDescription: e.target.value } }))}
                  placeholder="e.g. Dust, Pollen, Certain Foods"
                />
              </div>
            </div>
          </CategoryAccordion>

          {/* 8. Systems */}
          <CategoryAccordion title="Systems Manifestations" icon="🫀" isOpen={openAccordion === 7} onToggle={() => toggleAccordion(7)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Cardiorespiratory Description</Label>
                <Input
                  value={form.systems.cardiorespiratory}
                  onChange={e => setForm(p => ({ ...p, systems: { ...p.systems, cardiorespiratory: e.target.value } }))}
                />
              </div>
              <div>
                <Label>Gastrointestinal Description</Label>
                <Input
                  value={form.systems.gastrointestinal}
                  onChange={e => setForm(p => ({ ...p, systems: { ...p.systems, gastrointestinal: e.target.value } }))}
                />
              </div>
              <div>
                <Label>CNS Description</Label>
                <Input
                  value={form.systems.cns}
                  onChange={e => setForm(p => ({ ...p, systems: { ...p.systems, cns: e.target.value } }))}
                />
              </div>
              <div>
                <Label>Respiratory (RS) Description</Label>
                <Input
                  value={form.systems.respiratory}
                  onChange={e => setForm(p => ({ ...p, systems: { ...p.systems, respiratory: e.target.value } }))}
                />
              </div>
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
          <CategoryAccordion title="Obstetric History" icon="👶" isOpen={openAccordion === 9} onToggle={() => toggleAccordion(9)}>
            <Textarea
              rows={2}
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
