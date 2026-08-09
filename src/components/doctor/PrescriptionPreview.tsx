import React from "react"
import { HeartPulseIcon, CloseIcon } from "../icons"

export function PrescriptionPreview({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl mx-auto my-6 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row">
        {/* Dark sidebar */}
        <div className="w-full sm:w-64 bg-slate-900 text-white p-6 flex flex-col gap-6 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                <HeartPulseIcon />
              </div>
              <span className="font-800 text-teal-400 text-lg">RheumaLink</span>
            </div>
            <p className="text-slate-400 text-xs font-700 uppercase tracking-wide mb-1">Patient</p>
            <p className="font-800 text-white text-base">Alpa Jaiswar</p>
            <p className="text-slate-400 text-sm font-600 mt-1">RL-26-00011</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-700 uppercase tracking-wide mb-1">Doctor</p>
            <p className="font-700 text-white">Dr. Shweta Gupta</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-700 uppercase tracking-wide mb-1">Date</p>
            <p className="font-700 text-white">09 Aug 2026</p>
          </div>
          <div className="mt-auto space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-700 rounded-xl transition-colors text-sm">
              <span>📱</span> Send via WhatsApp
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white font-700 rounded-xl transition-colors text-sm">
              <span>📄</span> Download PDF
            </button>
          </div>
        </div>

        {/* PDF preview */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-800 text-slate-800 text-lg">Prescription Preview</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
              <CloseIcon />
            </button>
          </div>
          <div className="border-2 border-slate-200 rounded-xl p-6 bg-slate-50 space-y-5">
            {/* Header */}
            <div className="border-b-2 border-teal-200 pb-4 flex items-start justify-between">
              <div>
                <h4 className="font-800 text-teal-700 text-xl">RheumaLink Clinic</h4>
                <p className="text-slate-500 text-sm font-600">Dr. Shweta Gupta — Rheumatologist</p>
                <p className="text-slate-400 text-xs font-500 mt-0.5">Mumbai, Maharashtra · +91 98000 00001</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-700">Rx</p>
                <p className="font-700 text-slate-600 text-sm">09/08/2026</p>
              </div>
            </div>

            {/* Patient */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 font-700 text-xs uppercase tracking-wide">Patient</p>
                <p className="font-800 text-slate-800">Alpa Jaiswar</p>
                <p className="text-slate-500 font-600">File: RL-26-00011</p>
              </div>
              <div>
                <p className="text-slate-400 font-700 text-xs uppercase tracking-wide">Blood Group</p>
                <p className="font-800 text-slate-800">B+</p>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <p className="font-800 text-slate-700 text-sm border-b border-slate-200 pb-1 mb-2">Diagnosis</p>
              <p className="text-slate-700 text-sm font-600">Rheumatoid Arthritis — Moderate Activity (DAS28: 4.2)</p>
            </div>

            {/* Medications */}
            <div>
              <p className="font-800 text-slate-700 text-sm border-b border-slate-200 pb-1 mb-2">Medications</p>
              {[
                { med: "Tab. Methotrexate", dose: "15 mg", dur: "4 weeks", instr: "Once weekly, after food" },
                { med: "Tab. Folic Acid", dose: "5 mg", dur: "4 weeks", instr: "Daily except MTX day" },
                { med: "Tab. Hydroxychloroquine", dose: "200 mg", dur: "4 weeks", instr: "Twice daily with meals" },
              ].map((m, i) => (
                <div key={i} className="flex gap-3 py-2 border-b border-slate-100 text-sm">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-800 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <p className="font-800 text-slate-800">{m.med} <span className="text-teal-600">{m.dose}</span></p>
                    <p className="text-slate-500 font-600 text-xs">{m.dur} · {m.instr}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lab tests */}
            <div>
              <p className="font-800 text-slate-700 text-sm border-b border-slate-200 pb-1 mb-2">🧪 Lab Investigations</p>
              <div className="flex flex-wrap gap-2">
                {["CBC", "CRP", "ESR", "RF Quantitative"].map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-700 border border-blue-200">{t}</span>
                ))}
              </div>
            </div>

            {/* Follow-up */}
            <div className="bg-teal-50 rounded-xl p-3 border border-teal-200">
              <p className="text-xs font-700 text-teal-600 uppercase tracking-wide">📅 Follow-up</p>
              <p className="font-800 text-slate-800 mt-0.5">In 1 Month — 09 September 2026</p>
            </div>

            <p className="text-slate-400 text-xs font-600 italic">This prescription is computer-generated and is valid without a physical signature.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
