import React, { useState } from "react"
import { VitalsState } from "../../types/compounder"
import { PrimaryBtn } from "../ui/Buttons"

export function VitalsMiniForm({ onSave }: { onSave: () => void }) {
  const [vitals, setVitals] = useState<VitalsState>({
    weight: "", height: "", sysBP: "", diaBP: "", pulse: "", spo2: "", temp: "", pain: ""
  })

  const fields: { key: keyof VitalsState; label: string; placeholder: string }[] = [
    { key: "weight", label: "Weight (kg)", placeholder: "65" },
    { key: "height", label: "Height (cm)", placeholder: "168" },
    { key: "sysBP", label: "Sys BP", placeholder: "120" },
    { key: "diaBP", label: "Dia BP", placeholder: "80" },
    { key: "pulse", label: "Pulse (/min)", placeholder: "72" },
    { key: "spo2", label: "SpO₂ (%)", placeholder: "98" },
    { key: "temp", label: "Temp (°C)", placeholder: "37.0" },
    { key: "pain", label: "Pain Scale (0–100)", placeholder: "0" },
  ]

  return (
    <div className="mt-3 p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-3">
      <p className="text-sm font-700 text-sky-700">📊 Record Vitals</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {fields.map(f => (
          <div key={f.key}>
            <p className="text-xs font-700 text-slate-500 mb-1">{f.label}</p>
            <input
              type="number"
              placeholder={f.placeholder}
              value={vitals[f.key]}
              onChange={e => setVitals(v => ({ ...v, [f.key]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border-2 border-sky-200 bg-white text-slate-800 text-sm font-600 focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <PrimaryBtn onClick={onSave} className="text-sm py-2 px-4">Save Vitals</PrimaryBtn>
      </div>
    </div>
  )
}
