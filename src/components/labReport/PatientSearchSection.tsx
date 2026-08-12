import React, { useState, useEffect } from "react"
import { PatientSearchResult } from "../../types/labReport"
import { Input } from "../ui/Input"
import { SearchIcon } from "../icons"
import { fetchCompounderDashboard } from "../../services/api"

export function PatientSearchSection({
  selectedPatient,
  onSelectPatient,
  onResetPatient,
}: {
  selectedPatient: PatientSearchResult | null
  onSelectPatient: (p: PatientSearchResult) => void
  onResetPatient?: () => void
  onClearPatient?: () => void
}) {
  const handleReset = onResetPatient || onClearPatient || (() => {})
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [dbPatients, setDbPatients] = useState<PatientSearchResult[]>([])

  useEffect(() => {
    if (query.trim().length > 0) {
      const timer = setTimeout(() => {
        fetchCompounderDashboard(query)
          .then(res => {
            if (res.ok && res.search_results) {
              setDbPatients(res.search_results.map((p: any) => ({
                id: String(p.id),
                name: p.name,
                internalFile: p.internal_file,
                externalFile: p.external_file || "-",
                phone: p.contact || "-",
              })))
            }
          })
          .catch(() => {})
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setDbPatients([])
    }
  }, [query])

  return (
    <div className="space-y-3">
      <label className="block text-sm font-700 text-slate-700">1. Search &amp; Select Patient (Database)</label>

      {!selectedPatient ? (
        <div className="relative">
          <div className="relative">
            <Input
              className="pl-10"
              placeholder="Type name, internal file number, or phone number to search…"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
              <SearchIcon />
            </span>
          </div>

          {/* Autocomplete Results Box */}
          {isOpen && query.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
              {dbPatients.length > 0 ? (
                dbPatients.map(pat => (
                  <div
                    key={pat.id}
                    onClick={() => {
                      onSelectPatient(pat)
                      setIsOpen(false)
                      setQuery("")
                    }}
                    className="p-3 hover:bg-teal-50 cursor-pointer border-b border-slate-100 flex items-center justify-between transition-colors"
                  >
                    <span className="font-800 text-slate-800 text-sm">{pat.name}</span>
                    <span className="text-xs text-slate-400 font-500">
                      File: {pat.internalFile} · {pat.phone}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-400 italic">No patients found in database</div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Selected Patient Card */
        <div className="bg-teal-50/80 border-2 border-teal-300 rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-800 text-teal-800 text-base">{selectedPatient.name}</h3>
            <p className="text-xs font-600 text-slate-600 mt-0.5">
              Internal File: <span className="font-700">{selectedPatient.internalFile}</span> · Ext: {selectedPatient.externalFile} · {selectedPatient.phone}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-teal-700 font-700 text-xs border border-teal-300 rounded-lg transition-colors"
          >
            Change Patient
          </button>
        </div>
      )}
    </div>
  )
}
