import React from "react"
import { HeartPulseIcon, GlobeIcon, ChevronIcon, LogoutIcon } from "../icons"
import { LANGUAGES } from "../../data/doctorData"

export function DoctorTopNav({
  language,
  setLanguage,
  onSwitchCompounder,
}: {
  language: string
  setLanguage: (lang: string) => void
  onSwitchCompounder: () => void
}) {
  return (
    <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center">
            <HeartPulseIcon />
          </div>
          <span className="font-800 text-teal-400 text-lg tracking-tight hidden sm:block">RheumaLink</span>
        </div>

        {/* Greeting */}
        <div className="flex-1 flex items-center sm:ml-4">
          <p className="text-slate-300 font-600 text-base">
            Hello, <span className="text-teal-400 font-800">Dr. Shweta Gupta</span> 👋
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Compounder switch */}
          <button
            onClick={onSwitchCompounder}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-teal-500/40 text-teal-400 font-700 text-sm hover:bg-teal-500/10 transition-colors"
          >
            Compounder Dashboard
          </button>

          {/* Language */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-700 bg-slate-800 cursor-pointer hover:border-slate-600 transition-colors">
            <GlobeIcon />
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="appearance-none bg-transparent text-sm font-700 text-slate-300 focus:outline-none cursor-pointer pr-4"
            >
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
            <span className="text-slate-500 pointer-events-none"><ChevronIcon /></span>
          </div>

          {/* Logout */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-600 text-slate-300 font-700 text-sm hover:bg-slate-800 hover:border-slate-500 transition-colors">
            <LogoutIcon /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
