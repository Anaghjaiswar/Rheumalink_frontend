import React from "react"
import { HeartPulseIcon, GlobeIcon, ChevronIcon } from "../icons"
import { LANGUAGES } from "../../data/compounderData"

export function TopNav({
  language,
  setLanguage,
  onSwitchDoctor,
}: {
  language: string
  setLanguage: (lang: string) => void
  onSwitchDoctor: () => void
}) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
            <HeartPulseIcon />
          </div>
          <span className="font-800 text-teal-700 text-lg tracking-tight hidden sm:block">RheumaLink</span>
        </div>

        {/* Greeting */}
        <div className="flex-1 flex items-center justify-center sm:justify-start sm:ml-4">
          <p className="text-slate-700 font-600 text-base">
            Hello, <span className="text-teal-700 font-800">Sneha</span> 👋
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onSwitchDoctor}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-teal-300 text-teal-700 font-700 text-sm hover:bg-teal-50 transition-colors"
          >
            Doctor Dashboard
          </button>
          {/* Language dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-200 text-slate-600 bg-white cursor-pointer hover:border-slate-300 transition-colors">
              <GlobeIcon />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="appearance-none bg-transparent text-sm font-700 text-slate-600 focus:outline-none cursor-pointer pr-5"
              >
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <span className="text-slate-400 pointer-events-none"><ChevronIcon /></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
