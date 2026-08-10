import React from "react"

export function CategoryAccordion({
  title,
  icon,
  isOpen,
  onToggle,
  activeCount = 0,
  children,
}: {
  title: string
  icon: string
  isOpen: boolean
  onToggle: () => void
  activeCount?: number
  children: React.ReactNode
}) {
  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${
        isOpen ? "border-teal-500 shadow-md" : "border-slate-100 shadow-sm hover:border-teal-300"
      }`}
    >
      {/* Accordion Header */}
      <div
        onClick={onToggle}
        className="px-6 py-4 cursor-pointer select-none flex items-center justify-between bg-slate-50/80 hover:bg-teal-50/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h2 className="font-800 text-slate-800 text-base">{title}</h2>
          {activeCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-800 text-xs shadow-xs">
              {activeCount} selected
            </span>
          )}
        </div>
        <span className={`text-slate-400 font-800 text-sm transition-transform duration-200 ${isOpen ? "rotate-180 text-teal-600" : ""}`}>
          ▼
        </span>
      </div>

      {/* Accordion Content Body */}
      {isOpen && (
        <div className="p-6 border-t border-slate-100 space-y-5 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  )
}
