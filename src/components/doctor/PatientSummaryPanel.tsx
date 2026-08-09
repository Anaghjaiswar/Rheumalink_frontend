import React from "react"
import { PatientSummary } from "../../types/doctor"
import { CloseIcon } from "../icons"

export function PatientSummaryPanel({ patient, onClose }: { patient: PatientSummary; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="font-800 text-slate-800 text-lg">Patient Summary</h3>
            <p className="text-slate-500 text-sm font-600">{patient.name} · {patient.file}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Internal File", value: patient.file },
              { label: "External File", value: patient.ext },
              { label: "Blood Group", value: patient.bloodGroup },
              { label: "Allergies", value: patient.allergies },
            ].map(f => (
              <div key={f.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-1">{f.label}</p>
                <p className="font-700 text-slate-800 text-sm">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Family history */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-1.5">Family History</p>
            <p className="text-slate-700 font-600 text-sm leading-relaxed">{patient.familyHistory}</p>
          </div>

          {/* Comorbidities */}
          <div>
            <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-2">Comorbidities</p>
            <div className="flex flex-wrap gap-2">
              {patient.comorbidities.length > 0 ? patient.comorbidities.map(c => (
                <span key={c} className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-700 border border-red-200">{c}</span>
              )) : <span className="text-slate-400 text-sm font-600">None on record</span>}
            </div>
          </div>

          {/* Vitals */}
          <div>
            <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-3">Recorded Vitals</p>
            <div className="grid grid-cols-2 gap-2">
              {patient.vitals.map(v => (
                <div key={v.label} className="bg-sky-50 rounded-xl p-3 border border-sky-100">
                  <p className="text-xs font-700 text-sky-500 mb-0.5">{v.label}</p>
                  <p className="font-800 text-slate-800">{v.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
