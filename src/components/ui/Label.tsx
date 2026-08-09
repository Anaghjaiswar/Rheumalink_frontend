import React from "react"

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-700 text-slate-600 mb-1.5">{children}</label>
}
