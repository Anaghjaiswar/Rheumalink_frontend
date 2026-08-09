import React, { useState } from "react"
import { AppStatus } from "../../types/compounder"
import { samplePatients, DOCTORS, STATUS_OPTS } from "../../data/compounderData"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { Textarea } from "../ui/Textarea"
import { PrimaryBtn } from "../ui/Buttons"
import { CalendarPlusIcon } from "../icons"

export function CreateAppointmentForm() {
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const nowTime = new Date().toTimeString().slice(0, 5)

  const [form, setForm] = useState({
    patient: "", doctor: "", date: today, time: nowTime, status: "to-be-attended" as AppStatus, reason: ""
  })
  const [saved, setSaved] = useState(false)

  const handleBook = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Patient</Label>
          <Select value={form.patient} onChange={e => setForm(f => ({ ...f, patient: e.target.value }))}>
            <option value="">Select patient…</option>
            {samplePatients.map(p => (
              <option key={p.internalFile}>{p.name} — {p.internalFile}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Doctor</Label>
          <Select value={form.doctor} onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))}>
            <option value="">Select doctor…</option>
            {DOCTORS.map(d => <option key={d}>{d}</option>)}
          </Select>
        </div>
        <div>
          <Label>Appointment Date</Label>
          <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <div className="flex gap-2 mt-2">
            {[{ label: "Today", value: today }, { label: "Tomorrow", value: tomorrow }, { label: "Now", value: today }].map(chip => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setForm(f => ({ ...f, date: chip.value, time: chip.label === "Now" ? nowTime : f.time }))}
                className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 font-700 text-sm border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Appointment Time</Label>
          <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {STATUS_OPTS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, status: opt.value }))}
                className={`px-4 py-2.5 rounded-xl border-2 font-700 text-sm transition-all ${form.status === opt.value ? opt.color + " border-current" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label>Reason for Visit</Label>
          <Textarea
            placeholder="e.g. Follow-up for joint pain management…"
            value={form.reason}
            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        {saved ? (
          <span className="text-emerald-600 font-700 text-base">✓ Appointment booked! All set.</span>
        ) : <span />}
        <PrimaryBtn onClick={handleBook}>
          <CalendarPlusIcon /> Book Appointment
        </PrimaryBtn>
      </div>
    </div>
  )
}
