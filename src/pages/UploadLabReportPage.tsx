import React, { useState, useEffect } from "react"
import { PatientSearchResult, AppointmentOption, LabTestRow } from "../types/labReport"
import { DoctorTopNav } from "../components/doctor/DoctorTopNav"
import { PatientSearchSection } from "../components/labReport/PatientSearchSection"
import { AppointmentTimeline } from "../components/labReport/AppointmentTimeline"
import { UploadDropzone } from "../components/labReport/UploadDropzone"
import { ExtractedResultsTable } from "../components/labReport/ExtractedResultsTable"
import { Card } from "../components/ui/Card"
import { fetchDoctorDashboard, uploadLabReportTemp, pollLabReportTask, saveExtractedLabData } from "../services/api"

export function UploadLabReportPage({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  const [language, setLanguage] = useState("en-IN")
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null)
  const [dbAppointments, setDbAppointments] = useState<AppointmentOption[]>([])
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null)

  const [reportName, setReportName] = useState("CBC & Inflammatory Markers")
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [isProcessing, setIsProcessing] = useState(false)
  const [showSplitScreen, setShowSplitScreen] = useState(false)
  const [testRows, setTestRows] = useState<LabTestRow[]>([])
  const [reportId, setReportId] = useState<number | null>(null)

  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Fetch real appointments when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      fetchDoctorDashboard()
        .then(res => {
          if (res.ok) {
            const list = [...(res.attending || []), ...(res.attended || []), ...(res.waiting || [])]
            const apptOptions: AppointmentOption[] = list.map((a: any) => ({
              id: String(a.id),
              date: a.appointment_date || "Today",
              doctor: a.doctor || "Unassigned Doctor",
            }))
            setDbAppointments(apptOptions)
          }
        })
        .catch(() => {})
    } else {
      setDbAppointments([])
    }
  }, [selectedPatient])

  const handleResetPatient = () => {
    setSelectedPatient(null)
    setSelectedApptId(null)
    setSelectedFile(null)
    setShowSplitScreen(false)
    setTestRows([])
    setReportId(null)
    setErrorMsg("")
  }

  const handleTriggerAI = async () => {
    if (!selectedFile || !selectedPatient) {
      setErrorMsg("Please select a patient and upload a valid PDF file.")
      return
    }

    setShowSplitScreen(true)
    setIsProcessing(true)
    setErrorMsg("")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("patient_id", selectedPatient.id)
      if (selectedApptId) {
        formData.append("appointment_id", selectedApptId)
      }
      formData.append("report_name", reportName)
      formData.append("test_date", testDate)

      const uploadRes = await uploadLabReportTemp(formData)

      if (uploadRes.status === "success" && uploadRes.task_id) {
        setReportId(uploadRes.report_id)
        
        // Poll background Celery task
        const interval = setInterval(async () => {
          const statusRes = await pollLabReportTask(uploadRes.task_id)
          if (statusRes.state === "SUCCESS") {
            clearInterval(interval)
            setIsProcessing(false)
            if (statusRes.result && statusRes.result.test_data) {
              const rows: LabTestRow[] = statusRes.result.test_data.map((td: any, idx: number) => ({
                id: String(idx + 1),
                name: td.test_name || td.name || "",
                value: td.value || "",
                unit: td.unit || "",
                ref: td.reference_range || td.ref || "",
              }))
              setTestRows(rows)
            }
          } else if (statusRes.state === "FAILURE") {
            clearInterval(interval)
            setIsProcessing(false)
            setErrorMsg("AI extraction failed: " + (statusRes.error || "Processing error"))
          }
        }, 2000)
      } else {
        setIsProcessing(false)
        setErrorMsg(uploadRes.error || "Failed to trigger lab report upload.")
      }
    } catch (err: any) {
      setIsProcessing(false)
      setErrorMsg(err.message || "Error uploading lab report.")
    }
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

  const handleSaveVerified = async () => {
    if (!reportId) {
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        onBackToDashboard()
      }, 2000)
      return
    }

    try {
      const res = await saveExtractedLabData(reportId, testRows)
      if (res.status === "success") {
        setSaveSuccess(true)
        setTimeout(() => {
          setSaveSuccess(false)
          onBackToDashboard()
        }, 2000)
      } else {
        setErrorMsg("Failed to save verified lab report.")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error saving lab report.")
    }
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

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-700 text-xs flex items-center gap-2 animate-fadeIn">
            <span>⚠️</span> {errorMsg}
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
              appointments={dbAppointments}
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
