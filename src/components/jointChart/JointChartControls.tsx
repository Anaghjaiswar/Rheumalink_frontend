import React from "react"
import { JointChartRecord } from "../../types/jointChart"
import { Card } from "../ui/Card"
import { PrimaryBtn, SecondaryBtn, OutlineBtn } from "../ui/Buttons"

export function JointChartControls({
  noPainCount = 0,
  tenderCount = 0,
  swollenCount = 0,
  counts,
  recentCharts = [],
  onSave,
  onSaveAssessment,
  onReset,
  onBack,
  onBulkAction,
}: {
  noPainCount?: number
  tenderCount?: number
  swollenCount?: number
  counts?: { swollen: number; tender: number; noPain?: number }
  recentCharts?: JointChartRecord[]
  onSave?: () => void
  onSaveAssessment?: () => void
  onReset?: () => void
  onBack?: () => void
  onBulkAction?: (action: "allnopain" | "allswollen" | "alltender") => void
}) {
  const finalSwollen = counts ? counts.swollen : swollenCount
  const finalTender = counts ? counts.tender : tenderCount
  const finalNoPain = counts && counts.noPain !== undefined ? counts.noPain : Math.max(0, 44 - finalSwollen - finalTender)
  const handleSaveClick = onSaveAssessment || onSave || (() => {})

  return (
    <div className="space-y-5 lg:sticky lg:top-6">
      {/* Assessment Controls Card */}
      <Card className="p-5 space-y-4">
        <div>
          <h3 className="font-800 text-slate-800 text-base sm:text-lg">Assessment Controls</h3>
          <p className="text-slate-500 font-500 text-xs mt-0.5 leading-relaxed">
            Click any joint circle on the homunculus to toggle its pain state.
          </p>
        </div>

        {/* Real-time Counter Tiles */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
            <span className="text-[11px] font-700 text-slate-500 block">No Pain</span>
            <strong className="text-2xl font-800 text-slate-700 block mt-0.5">{finalNoPain}</strong>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 text-center">
            <span className="text-[11px] font-700 text-blue-600 block">Tender</span>
            <strong className="text-2xl font-800 text-blue-600 block mt-0.5">{finalTender}</strong>
          </div>
          <div className="bg-red-50 rounded-xl p-3 border border-red-200 text-center">
            <span className="text-[11px] font-700 text-red-600 block">Swollen</span>
            <strong className="text-2xl font-800 text-red-600 block mt-0.5">{finalSwollen}</strong>
          </div>
        </div>

        {/* Quick Bulk Shortcuts */}
        {onBulkAction && (
          <div className="pt-1">
            <span className="text-[11px] font-700 text-slate-400 uppercase tracking-wide block mb-1.5">
              ⚡ Quick Set All 44 Joints:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onBulkAction("allnopain")}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-700 text-xs rounded-lg transition-colors cursor-pointer"
              >
                ⚪ Clear All
              </button>
              <button
                type="button"
                onClick={() => onBulkAction("alltender")}
                className="py-1.5 px-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-700 text-xs rounded-lg transition-colors cursor-pointer"
              >
                🔵 All Tender
              </button>
              <button
                type="button"
                onClick={() => onBulkAction("allswollen")}
                className="py-1.5 px-2 bg-red-100 hover:bg-red-200 text-red-700 font-700 text-xs rounded-lg transition-colors cursor-pointer"
              >
                🔴 All Swollen
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <PrimaryBtn onClick={handleSaveClick} fullWidth className="py-3 shadow-md text-sm">
            💾 Save Joint Assessment (DAS28)
          </PrimaryBtn>
          <div className="flex gap-2">
            <OutlineBtn
              onClick={onReset || (() => onBulkAction && onBulkAction("allnopain"))}
              className="flex-1 justify-center text-xs py-2"
            >
              🔄 Reset Joints
            </OutlineBtn>
            {onBack && (
              <SecondaryBtn onClick={onBack} className="text-xs py-2">
                ⬅️ Back
              </SecondaryBtn>
            )}
          </div>
        </div>
      </Card>

      {/* Recent Joint Charts History Card */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h4 className="font-800 text-slate-800 text-xs sm:text-sm">📜 Previous Assessment History</h4>
          <span className="text-[11px] font-700 text-slate-400">Timeline</span>
        </div>
        <div className="overflow-x-auto max-h-56 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100/60 border-b border-slate-100">
                <th className="px-3.5 py-2 text-left font-800 text-slate-500 uppercase">Recorded At</th>
                <th className="px-3 py-2 text-center font-800 text-red-600 uppercase">Swollen</th>
                <th className="px-3 py-2 text-center font-800 text-blue-600 uppercase">Tender</th>
              </tr>
            </thead>
            <tbody>
              {recentCharts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-5 text-center text-slate-400 italic font-500 text-xs">
                    No previous chart records found for this patient.
                  </td>
                </tr>
              ) : (
                recentCharts.map(r => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-3.5 py-2.5 font-600 text-slate-700 whitespace-nowrap">{r.recordedAt}</td>
                    <td className="px-3 py-2.5 font-800 text-red-600 text-center">{r.swollen}</td>
                    <td className="px-3 py-2.5 font-800 text-blue-600 text-center">{r.tender}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
