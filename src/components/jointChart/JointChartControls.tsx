import React from "react"
import { JointChartRecord } from "../../types/jointChart"
import { Card } from "../ui/Card"
import { PrimaryBtn, SecondaryBtn, OutlineBtn } from "../ui/Buttons"

export function JointChartControls({
  noPainCount,
  tenderCount,
  swollenCount,
  recentCharts,
  onSave,
  onReset,
  onBack,
}: {
  noPainCount: number
  tenderCount: number
  swollenCount: number
  recentCharts: JointChartRecord[]
  onSave: () => void
  onReset: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-5 sticky top-20">
      {/* Assessment Controls Card */}
      <Card className="p-6 space-y-5">
        <div>
          <h3 className="font-800 text-slate-800 text-lg">Assessment Controls</h3>
          <p className="text-slate-500 font-500 text-xs mt-1 leading-relaxed">
            The chart stores each joint as a compact state. Click any joint area on the canvas to cycle states.
          </p>
        </div>

        {/* Real-time Counter Tiles */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
            <span className="text-xs font-700 text-slate-500 block">No Pain</span>
            <strong className="text-2xl font-800 text-slate-700 block mt-1">{noPainCount}</strong>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 text-center">
            <span className="text-xs font-700 text-blue-600 block">Tender</span>
            <strong className="text-2xl font-800 text-blue-600 block mt-1">{tenderCount}</strong>
          </div>
          <div className="bg-red-50 rounded-xl p-3 border border-red-200 text-center">
            <span className="text-xs font-700 text-red-600 block">Swollen</span>
            <strong className="text-2xl font-800 text-red-600 block mt-1">{swollenCount}</strong>
          </div>
        </div>

        {/* Quick Instructions */}
        <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-100 space-y-2">
          <h4 className="font-800 text-teal-800 text-xs uppercase tracking-wide">💡 Quick Tips:</h4>
          <ul className="text-xs text-slate-600 font-600 space-y-1 list-disc pl-4">
            <li>Click a joint circle to cycle: No Pain → Tender → Swollen → Both.</li>
            <li>Review recent assessment history below.</li>
            <li>Click Save to record joint chart entries for this consultation.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <PrimaryBtn onClick={onSave} fullWidth>
            💾 Save Joint Chart
          </PrimaryBtn>
          <div className="flex gap-2">
            <OutlineBtn onClick={onReset} className="flex-1 justify-center">
              🔄 Reset
            </OutlineBtn>
            <SecondaryBtn onClick={onBack}>
              ⬅️ Back
            </SecondaryBtn>
          </div>
        </div>
      </Card>

      {/* Recent Joint Charts History Card */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h4 className="font-800 text-slate-800 text-sm">📜 Recent Joint Charts</h4>
          <span className="text-xs font-700 text-slate-400">History</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100/60 border-b border-slate-100">
                <th className="px-4 py-2.5 text-left font-800 text-slate-500 uppercase">Recorded At</th>
                <th className="px-4 py-2.5 text-center font-800 text-red-600 uppercase">Swollen</th>
                <th className="px-4 py-2.5 text-center font-800 text-blue-600 uppercase">Tender</th>
              </tr>
            </thead>
            <tbody>
              {recentCharts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-400 italic font-500">
                    No previous chart records found.
                  </td>
                </tr>
              ) : (
                recentCharts.map(r => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-600 text-slate-700 whitespace-nowrap">{r.recordedAt}</td>
                    <td className="px-4 py-3 font-800 text-red-600 text-center">{r.swollen}</td>
                    <td className="px-4 py-3 font-800 text-blue-600 text-center">{r.tender}</td>
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
