import React, { useState } from "react"
import { PatientSearchResult, AppointmentOption, LabTestRow } from "../types/labReport"
import { DoctorTopNav } from "../components/doctor/DoctorTopNav"
import { PatientSearchSection } from "../components/labReport/PatientSearchSection"
import { AppointmentTimeline } from "../components/labReport/AppointmentTimeline"
import { UploadDropzone } from "../components/labReport/UploadDropzone"
import { ExtractedResultsTable } from "../components/labReport/ExtractedResultsTable"
import { Card } from "../components/ui/Card"

const MOCK_APPOINTMENTS: AppointmentOption[] = [
  { id: "101", date: "08 Aug 2026", doctor: "Dr. Shweta Gupta" },
  { id: "102", date: "12 Jul 2026", doctor: "Dr. Arvind Mehta" },
]

const DEFAULT_EXTRACTED_DATA: LabTestRow[] = [
  { id: "1", name: "Hemoglobin (Hb)", value: "12.8", unit: "g/dL", ref: "12.0 - 15.5" },
  { id: "2", name: "ESR (Erythrocyte Sedimentation Rate)", value: "42", unit: "mm/hr", ref: "0 - 20" },
  { id: "3", name: "C-Reactive Protein (CRP)", value: "18.5", unit: "mg/L", ref: "0 - 5.0" },
  { id: "4", name: "Rheumatoid Factor (RF) Quant", value: "65.4", unit: "IU/mL", ref: "0 - 14.0" },
]

export function UploadLabReportPage({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  const [language, setLanguage] = useState("en-IN")
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null)
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null)

  const [reportName, setReportName] = useState("CBC & Inflammatory Markers")
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [isProcessing, setIsProcessing] = useState(false)
  const [showSplitScreen, setShowSplitScreen] = useState(false)
  const [testRows, setTestRows] = useState<LabTestRow[]>(DEFAULT_EXTRACTED_DATA)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleResetPatient = () => {
    setSelectedPatient(null)
    setSelectedApptId(null)
    setSelectedFile(null)
    setShowSplitScreen(false)
  }

  const handleTriggerAI = () => {
    if (!selectedFile || !selectedPatient) {
      alert("Please select a patient and upload a valid PDF file.")
      return
    }

    setShowSplitScreen(true)
    setIsProcessing(true)

    // Simulate Docling / Groq AI Extraction processing delay
    setTimeout(() => {
      setIsProcessing(false)
    }, 2500)
  }

  const handleUpdateRow = (id: string, field: keyof LabTestRow, val: string) => {
    setTestRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: val } : r)))
  }

  const handleAddRow = () => {
    const newRow: LabTestRow = { id: Date.now().toString(), name: "", value: "", unit: "", ref: "" }
    setTestRows(prev => [...prev, newRow])
  }

  const handleDeleteRow = (id: string) => {
    setTestRows(prev => prev.filter(r => r.id !== id))
  }

  const handleSaveVerified = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔬</span>
              <h1 className="text-2xl font-800 text-slate-800">Lab Report AI Pipeline</h1>
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-700">
                Docling &amp; Groq AI
              </span>
            </div>
            <p className="text-slate-500 font-500 text-sm mt-1">
              Upload digital PDF lab reports to automatically extract structured clinical test values.
            </p>
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
            <span>✓ Lab report clinical results saved and verified successfully! Redirecting…</span>
            <span className="text-xs bg-emerald-600 px-2.5 py-1 rounded-lg">Verified</span>
          </div>
        )}

        {/* Main Upload Wizard Form */}
        <Card className="p-6 space-y-7">
          {/* Step 1: Patient Search */}
          <PatientSearchSection
            selectedPatient={selectedPatient}
            onSelectPatient={p => setSelectedPatient(p)}
            onResetPatient={handleResetPatient}
          />

          {/* Step 2: Appointment Timeline */}
          {selectedPatient && (
            <AppointmentTimeline
              appointments={MOCK_APPOINTMENTS}
              selectedApptId={selectedApptId}
              onSelectAppt={id => setSelectedApptId(id)}
            />
          )}

          {/* Step 3: Metadata & File Upload */}
          {selectedPatient && (
            <UploadDropzone
              reportName={reportName}
              setReportName={setReportName}
              testDate={testDate}
              setTestDate={setTestDate}
              selectedFile={selectedFile}
              onFileSelect={f => setSelectedFile(f)}
              onSubmit={handleTriggerAI}
            />
          )}

          {/* Step 4: Split-Screen Extracted Results Table */}
          {showSplitScreen && (
            <ExtractedResultsTable
              pdfFile={selectedFile}
              isLoading={isProcessing}
              testRows={testRows}
              onUpdateRow={handleUpdateRow}
              onAddRow={handleAddRow}
              onDeleteRow={handleDeleteRow}
              onSaveVerified={handleSaveVerified}
            />
          )}
        </Card>
      </div>
    </div>
  )
}
