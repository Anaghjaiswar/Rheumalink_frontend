import React, { useState, useEffect, useMemo } from "react"
import { AppStatus } from "../../types/compounder"
import { STATUS_OPTS } from "../../data/compounderData"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { Textarea } from "../ui/Textarea"
import { PrimaryBtn } from "../ui/Buttons"
import { CalendarPlusIcon } from "../icons"
import { fetchCompounderDashboard, fetchDoctorsList, createAppointment } from "../../services/api"

export function CreateAppointmentForm({ selectedPatient, onAppointmentCreated }: { selectedPatient?: any; onAppointmentCreated?: () => void }) {
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const nowTime = new Date().toTimeString().slice(0, 5)

  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])

  const [form, setForm] = useState({
    patient_id: selectedPatient?.id ? String(selectedPatient.id) : "",
    doctor_id: "",
    date: today,
    time: nowTime,
    status: "T" as AppStatus,
    reason: ""
  })

  // Ensure selectedPatient is always included in patient options
  const patientOptions = useMemo(() => {
    if (selectedPatient && selectedPatient.id) {
      const exists = patients.some(p => String(p.id) === String(selectedPatient.id))
      if (!exists) {
        return [selectedPatient, ...patients]
      }
    }
    return patients
  }, [selectedPatient, patients])

  useEffect(() => {
    if (selectedPatient?.id) {
      setForm(f => ({ ...f, patient_id: String(selectedPatient.id) }))
    }
  }, [selectedPatient])

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetchCompounderDashboard()
      .then(res => {
        if (res.ok && res.recent_patients) {
          setPatients(res.recent_patients)
          if (!form.patient_id && res.recent_patients.length > 0) {
            setForm(f => ({ ...f, patient_id: String(res.recent_patients[0].id) }))
          }
        }
      })
      .catch(() => {})

    fetchDoctorsList()
      .then(res => {
        if (res.ok && res.doctors) {
          setDoctors(res.doctors)
          if (res.doctors.length > 0 && !form.doctor_id) {
            setForm(f => ({ ...f, doctor_id: String(res.doctors[0].id) }))
          }
        }
      })
      .catch(() => {})
  }, [])

  const handleBook = async () => {
    const activePatientId = form.patient_id || selectedPatient?.id
    if (!activePatientId || !form.doctor_id) {
      setErrorMsg("Please select both a patient and a doctor.")
      return
    }

    setLoading(true)
    setErrorMsg("")
    setMsg("")

    try {
      const payload = {
        patient: Number(activePatientId),
        doctor: Number(form.doctor_id),
        appointment_date: form.date,
        appointment_time: form.time || nowTime,
        reason_for_visit: form.reason,
        status: form.status,
      }
      const res = await createAppointment(payload)
      setLoading(false)

      if (res.ok) {
        setMsg(res.message || "Appointment created successfully!")
        if (onAppointmentCreated) {
          onAppointmentCreated()
        }
        setTimeout(() => setMsg(""), 3500)
      } else {
        if (res.errors) {
          const errList = Object.entries(res.errors)
            .map(([field, msgs]: [string, any]) => `${field.toUpperCase()}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
            .join(" | ")
          setErrorMsg(errList)
        } else {
          setErrorMsg(res.error || "Failed to create appointment.")
        }
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || "Error creating appointment.")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-700 text-sm">
          ✓ {msg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-700 text-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      {selectedPatient && (
        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-sm font-700">
          🎯 Selected Patient: <strong>{selectedPatient.name}</strong> ({selectedPatient.internal_file})
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Select Registered Patient Profile</Label>
          <Select value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))}>
            <option value="">Select registered patient…</option>
            {patientOptions.length > 0 ? (
              patientOptions.map(p => (
                <option key={p.id} value={p.id}>{p.name} — File: {p.internal_file}</option>
              ))
            ) : (
              <option value="" disabled>No registered patients found</option>
            )}
          </Select>
        </div>
        <div>
          <Label>Select Attending Doctor</Label>
          <Select value={form.doctor_id} onChange={e => setForm(f => ({ ...f, doctor_id: e.target.value }))}>
            <option value="">Select doctor…</option>
            {doctors.length > 0 ? (
              doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
            ) : (
              <option value="" disabled>No doctors found in database</option>
            )}
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
      <div className="flex items-center justify-end pt-2">
        <PrimaryBtn onClick={handleBook} disabled={loading}>
          <CalendarPlusIcon /> {loading ? "Booking…" : "Book Appointment"}
        </PrimaryBtn>
      </div>
    </div>
  )
}
