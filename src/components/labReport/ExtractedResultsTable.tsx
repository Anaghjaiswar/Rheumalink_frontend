import React from "react"
import { LabTestRow } from "../../types/labReport"
import { Input } from "../ui/Input"
import { PrimaryBtn, SecondaryBtn } from "../ui/Buttons"

export function ExtractedResultsTable({
  pdfFile,
  isLoading,
  testRows,
  onUpdateRow,
  onAddRow,
  onDeleteRow,
  onSaveVerified,
}: {
  pdfFile: File | null
  isLoading: boolean
  testRows: LabTestRow[]
  onUpdateRow: (id: string, field: keyof LabTestRow, val: string) => void
  onAddRow: () => void
  onDeleteRow: (id: string) => void
  onSaveVerified: () => void
}) {
  const pdfUrl = pdfFile ? URL.createObjectURL(pdfFile) : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t-2 border-slate-200 pt-6 min-h-[600px]">
      {/* Left Pane: PDF Document Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="px-5 py-3.5 bg-slate-900 text-white font-800 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">📄 Document Viewer</span>
          <span className="text-xs text-slate-400 font-500">{pdfFile?.name || "No File Loaded"}</span>
        </div>
        <div className="flex-1 bg-slate-100 flex items-center justify-center">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Lab Report PDF Preview"
              className="w-full h-full min-h-[550px] border-none"
            />
          ) : (
            <div className="text-center p-8 text-slate-400 font-600 text-sm">
              <span className="text-4xl block mb-2">📑</span>
              PDF preview will load here upon selection.
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: AI Extracted Clinical Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
        <div>
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-800 text-slate-800 text-lg flex items-center gap-2">
              🔬 Extracted Laboratory Data
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-700">
              AI Structured
            </span>
          </div>

          {/* AI Loader Spinner */}
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
              <h4 className="font-800 text-slate-800 text-base">AI Extraction in Progress</h4>
              <p className="text-xs text-slate-500 font-500 max-w-xs leading-relaxed">
                Docling is converting PDF tables and Groq/Gemini is structuring clinical data… (takes 3-5s)
              </p>
            </div>
          ) : (
            /* Results Table */
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="px-3 py-3 text-left font-800 uppercase">Test Name</th>
                    <th className="px-3 py-3 text-left font-800 uppercase">Result Value</th>
                    <th className="px-3 py-3 text-left font-800 uppercase">Unit</th>
                    <th className="px-3 py-3 text-left font-800 uppercase">Reference Interval</th>
                    <th className="px-3 py-3 text-center font-800 uppercase w-12">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {testRows.map(row => (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-1.5">
                        <Input
                          value={row.name}
                          onChange={e => onUpdateRow(row.id, "name", e.target.value)}
                          placeholder="e.g. Hemoglobin"
                          className="py-1.5 text-xs"
                        />
                      </td>
                      <td className="p-1.5">
                        <Input
                          value={row.value}
                          onChange={e => onUpdateRow(row.id, "value", e.target.value)}
                          placeholder="e.g. 14.2"
                          className="py-1.5 text-xs font-800 text-teal-700"
                        />
                      </td>
                      <td className="p-1.5">
                        <Input
                          value={row.unit}
                          onChange={e => onUpdateRow(row.id, "unit", e.target.value)}
                          placeholder="g/dL"
                          className="py-1.5 text-xs"
                        />
                      </td>
                      <td className="p-1.5">
                        <Input
                          value={row.ref}
                          onChange={e => onUpdateRow(row.id, "ref", e.target.value)}
                          placeholder="12.0 - 15.5"
                          className="py-1.5 text-xs"
                        />
                      </td>
                      <td className="p-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => onDeleteRow(row.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Controls */}
        {!isLoading && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
            <SecondaryBtn onClick={onAddRow}>
              ➕ Add Row
            </SecondaryBtn>
            <PrimaryBtn onClick={onSaveVerified}>
              💾 Save &amp; Verify Results
            </PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  )
}
