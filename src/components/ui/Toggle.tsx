import React from "react"

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors ${checked ? "bg-teal-500" : "bg-slate-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-7" : "translate-x-1"}`}
      />
    </button>
  )
}
