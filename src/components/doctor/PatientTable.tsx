import React from "react"
import { PatientSummary } from "../../types/doctor"
import { Card } from "../ui/Card"

export function PatientTable({
  title, patients, attending, onAction,
}: {
  title: string; patients: PatientSummary[]; attending: boolean; onAction: (p: PatientSummary) => void
}) {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <span className="text-lg">{attending ? "🩺" : "✅"}</span>
        <h2 className="font-800 text-slate-800 text-lg">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Token", "Patient", "Joint Chart", attending ? "Status Update" : "Status", "Action"].map(h => (
                <th key={h} className="px-5 py-3.5 text-left font-800 text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400 italic font-500">
                  {attending ? "No patient currently in consultation." : "No attended patients yet."}
                </td>
              </tr>
            ) : patients.map((p, i) => (
              <tr key={p.file} className={`border-b border-slate-50 hover:bg-teal-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                <td className="px-5 py-4">
                  <span className={`w-9 h-9 rounded-xl font-800 text-base flex items-center justify-center ${attending ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="font-800 text-slate-800 whitespace-nowrap">{p.name}</p>
                  <p className="text-slate-400 text-xs font-500 mt-0.5">File: {p.file}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-700 border border-teal-200">
                    5 Swollen · 10 Tender
                  </span>
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
                  <button
                    onClick={() => onAction(p)}
                    className="px-3 py-2 rounded-lg bg-teal-50 text-teal-700 font-700 text-xs border border-teal-200 hover:bg-teal-100 transition-colors whitespace-nowrap"
                  >
                    {attending ? "View & Consult" : "View Summary"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
