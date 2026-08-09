import React from "react"

export function PrimaryBtn({ children, onClick, type = "button", className = "", fullWidth = false }: {
  children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; className?: string; fullWidth?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-700 text-base rounded-xl shadow-sm transition-all ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  )
}

export function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 font-700 text-base rounded-xl border-2 border-slate-200 transition-all"
    >
      {children}
    </button>
  )
}

export function OutlineBtn({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-teal-300 text-teal-700 font-700 text-sm hover:bg-teal-50 transition-all ${className}`}
    >
      {children}
    </button>
  )
}
