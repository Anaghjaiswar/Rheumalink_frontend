import React from "react"
import { ChevronIcon } from "../icons"

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all appearance-none pr-10"
      >
        {children}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <ChevronIcon />
      </span>
    </div>
  )
}
