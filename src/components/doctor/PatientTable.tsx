import React from "react"
import { Card } from "../ui/Card"

export function PatientTable({
  title,
  patients,
  attending,
  onOpenSummary,
  onStartConsultation,
}: {
  title: string
  patients: any[]
  attending: boolean
  onOpenSummary: (p: any) => void
  onStartConsultation?: (p: any) => void
}) {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">{attending ? "🩺" : "✅"}</span>
          <h2 className="font-800 text-slate-800 text-lg">{title}</h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-700">{patients.length} Patients</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Token", "Patient", "Doctor", "Status", "Actions"].map(h => (
                <th key={h} className="px-5 py-3.5 text-left font-800 text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-600">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400 italic font-500">
                  {attending ? "No patients currently attending." : "No attended patients today yet."}
                </td>
              </tr>
            ) : patients.map((p, i) => (
              <tr key={p.id || i} className={`border-b border-slate-50 hover:bg-teal-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-xl font-800 text-xs ${attending ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {p.token || `Token ${p.token_number}`}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="font-800 text-slate-800 whitespace-nowrap">{p.patient_name || p.name}</p>
                  <p className="text-slate-400 text-xs font-500 mt-0.5">File: {p.file || p.internal_file}</p>
                </td>
                <td className="px-5 py-4 text-slate-600 text-xs">
                  {p.doctor || "Unassigned"}
                </td>
                <td className="px-5 py-4">
                  {attending ? (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-700 border border-amber-200">
                      In Consultation
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-700 border border-emerald-200">
                      Attended
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2 whitespace-nowrap">
                    <button
                      onClick={() => onOpenSummary(p)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-700 text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      👁️ Summary
                    </button>
                    {onStartConsultation && (
                      <button
                        onClick={() => onStartConsultation(p)}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-700 text-xs hover:bg-teal-700 transition-colors cursor-pointer shadow-2xs"
                      >
                        ⚡ Start Consultation
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
