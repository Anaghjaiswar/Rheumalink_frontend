import React from "react"
import { AppointmentOption } from "../../types/labReport"

export function AppointmentTimeline({
  appointments,
  selectedApptId,
  onSelectAppt,
}: {
  appointments: AppointmentOption[]
  selectedApptId: string | null
  onSelectAppt: (id: string | null) => void
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-700 text-slate-700">2. Select Associated Appointment</label>

      <div className="flex gap-4 overflow-x-auto p-4 border border-slate-200 bg-slate-50/60 rounded-xl">
        {/* Latest / General Option */}
        <div
          onClick={() => onSelectAppt(null)}
          className={`flex flex-col items-center min-w-[130px] p-3 rounded-xl cursor-pointer border-2 transition-all ${
            selectedApptId === null
              ? "border-teal-500 bg-white shadow-sm"
              : "border-slate-200 bg-white/60 hover:border-teal-300"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-800 text-sm mb-1.5 transition-colors ${
              selectedApptId === null ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
            }`}
          >
            ★
          </div>
          <span className="font-800 text-slate-800 text-xs">Latest</span>
          <span className="text-[11px] text-slate-400 font-500 mt-0.5">Or General Upload</span>
        </div>

        {/* Individual Appointments */}
        {appointments.map((appt, idx) => {
          const isSelected = selectedApptId === appt.id
          return (
            <div
              key={appt.id}
              onClick={() => onSelectAppt(appt.id)}
              className={`flex flex-col items-center min-w-[140px] p-3 rounded-xl cursor-pointer border-2 transition-all ${
                isSelected
                  ? "border-teal-500 bg-white shadow-sm"
                  : "border-slate-200 bg-white/60 hover:border-teal-300"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-800 text-sm mb-1.5 transition-colors ${
                  isSelected ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                {idx + 1}
              </div>
              <span className="font-800 text-slate-800 text-xs">{appt.date}</span>
              <span className="text-[11px] text-slate-400 font-500 mt-0.5">{appt.doctor}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
