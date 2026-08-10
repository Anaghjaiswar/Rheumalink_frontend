import React, { useRef } from "react"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { PrimaryBtn } from "../ui/Buttons"

export function UploadDropzone({
  reportName,
  setReportName,
  testDate,
  setTestDate,
  selectedFile,
  onFileSelect,
  onSubmit,
}: {
  reportName: string
  setReportName: (v: string) => void
  testDate: string
  setTestDate: (v: string) => void
  selectedFile: File | null
  onFileSelect: (f: File) => void
  onSubmit: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        alert("Please select a valid PDF file.")
        return
      }
      onFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        alert("Please select a valid PDF file.")
        return
      }
      onFileSelect(file)
    }
  }

  return (
    <div className="space-y-5">
      <label className="block text-sm font-700 text-slate-700">3. Lab Report Metadata &amp; File</label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Report Name</Label>
          <Input
            placeholder="e.g. CBC, Lipid Profile, LFT"
            value={reportName}
            onChange={e => setReportName(e.target.value)}
          />
        </div>
        <div>
          <Label>Test Conducted Date</Label>
          <Input
            type="date"
            noMic
            value={testDate}
            onChange={e => setTestDate(e.target.value)}
          />
        </div>
      </div>

      {/* Drag & Drop Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-300 hover:border-teal-400 bg-slate-50/60 hover:bg-teal-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-2"
      >
        <div className="text-3xl">📄</div>
        <p className="font-800 text-slate-800 text-base">Drag &amp; Drop Lab PDF here</p>
        <p className="text-slate-500 font-500 text-xs">or click to browse local files</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {selectedFile && (
          <div className="mt-3 inline-block px-4 py-2 bg-teal-100/80 text-teal-800 font-800 text-xs rounded-xl border border-teal-300">
            ✓ Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
          </div>
        )}

        <p className="text-[11px] font-700 text-amber-700 mt-2">
          ⚠️ Digital (word-based) PDFs supported for optimal AI parsing.
        </p>
      </div>

      <PrimaryBtn
        onClick={onSubmit}
        fullWidth
        className={!selectedFile || !reportName ? "opacity-50 cursor-not-allowed" : ""}
      >
        🚀 Upload &amp; Trigger AI Extraction
      </PrimaryBtn>
    </div>
  )
}
