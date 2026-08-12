import React, { useState, useEffect } from "react"
import { VitalsState } from "../../types/compounder"
import { Label } from "../ui/Label"
import { Select } from "../ui/Select"
import { PrimaryBtn } from "../ui/Buttons"
import { fetchCompounderDashboard, fetchPatientAppointments, saveVitals } from "../../services/api"

export function VitalsMiniForm({
  selectedPatient,
  initialAppointmentId,
  onSave,
}: {
  selectedPatient?: any
  initialAppointmentId?: number | string
  onSave?: () => void
}) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedApptId, setSelectedApptId] = useState(initialAppointmentId ? String(initialAppointmentId) : "")

  const [vitals, setVitals] = useState<VitalsState>({
    weight: "", height: "", sysBP: "", diaBP: "", pulse: "", spo2: "", temp: "", pain: ""
  })

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (initialAppointmentId) {
      setSelectedApptId(String(initialAppointmentId))
    }
  }, [initialAppointmentId])

  useEffect(() => {
    if (selectedPatient && selectedPatient.id) {
      fetchPatientAppointments(selectedPatient.id)
        .then(res => {
          if (res.ok && res.appointments && res.appointments.length > 0) {
            setAppointments(res.appointments)
            if (!initialAppointmentId) {
              setSelectedApptId(String(res.appointments[0].id))
            }
          } else {
            // Fallback to today appointments if patient has no specific historical appt
            fetchCompounderDashboard()
              .then(dashRes => {
                if (dashRes.ok && dashRes.today_appointments) {
                  setAppointments(dashRes.today_appointments)
                }
              })
              .catch(() => {})
          }
        })
        .catch(() => {})
    } else {
      fetchCompounderDashboard()
        .then(res => {
          if (res.ok && res.today_appointments) {
            setAppointments(res.today_appointments)
            if (!selectedApptId && res.today_appointments.length > 0) {
              setSelectedApptId(String(res.today_appointments[0].id))
            }
          }
        })
        .catch(() => {})
    }
  }, [selectedPatient])

  const fields: { key: keyof VitalsState; label: string; placeholder: string; apiField: string }[] = [
    { key: "weight", label: "Weight (kg)", placeholder: "65", apiField: "weight" },
    { key: "height", label: "Height (cm)", placeholder: "168", apiField: "height" },
    { key: "sysBP", label: "Sys BP (mmHg)", placeholder: "120", apiField: "blood_pressure_systolic" },
    { key: "diaBP", label: "Dia BP (mmHg)", placeholder: "80", apiField: "blood_pressure_diastolic" },
    { key: "pulse", label: "Pulse (/min)", placeholder: "72", apiField: "pulse_rate" },
    { key: "spo2", label: "SpO₂ (%)", placeholder: "98", apiField: "spo2" },
    { key: "temp", label: "Temp (°C)", placeholder: "37.0", apiField: "temperature" },
    { key: "pain", label: "Pain Scale (0–10)", placeholder: "0", apiField: "pain_scale" },
  ]

  const handleSaveVitals = async () => {
    if (!selectedApptId) {
      setErrorMsg("Please select an appointment.")
      return
    }

    setLoading(true)
    setErrorMsg("")
    setMsg("")

    try {
      const payload = {
        appointment_id: selectedApptId,
        weight: vitals.weight || null,
        height: vitals.height || null,
        blood_pressure_systolic: vitals.sysBP || null,
        blood_pressure_diastolic: vitals.diaBP || null,
        pulse_rate: vitals.pulse || null,
        spo2: vitals.spo2 || null,
        temperature: vitals.temp || null,
        pain_scale: vitals.pain || null,
      }

      const res = await saveVitals(selectedApptId, payload)
      setLoading(false)

      if (res.ok) {
        setMsg("Vitals saved successfully to database!")
        if (onSave) onSave()
        setTimeout(() => setMsg(""), 3500)
      } else {
        setErrorMsg("Failed to save vitals.")
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || "Error saving vitals.")
    }
  }

  return (
    <div className="mt-3 p-5 bg-sky-50/80 rounded-2xl border border-sky-200 space-y-4">
      {msg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-700 text-xs">
          ✓ {msg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-700 text-xs">
          ⚠️ {errorMsg}
        </div>
      )}

      {selectedPatient && (
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-700">
          🎯 Selected Patient: <strong>{selectedPatient.name}</strong> ({selectedPatient.internal_file})
        </div>
      )}

      <div>
        <Label>Select Appointment for Vitals (From Database)</Label>
        <Select value={selectedApptId} onChange={e => setSelectedApptId(e.target.value)}>
          <option value="">Select appointment…</option>
          {appointments.length > 0 ? (
            appointments.map(a => (
              <option key={a.id} value={a.id}>
                {a.patient_name || selectedPatient?.name} — {a.token || `Token ${a.token_number || a.id}`} ({a.appointment_date || a.status})
              </option>
            ))
          ) : (
            <option value="" disabled>No appointments found in database</option>
          )}
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {fields.map(f => (
          <div key={f.key}>
            <p className="text-xs font-700 text-slate-600 mb-1">{f.label}</p>
            <input
              type="number"
              placeholder={f.placeholder}
              value={vitals[f.key]}
              onChange={e => setVitals(v => ({ ...v, [f.key]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border-2 border-sky-200 bg-white text-slate-800 text-sm font-600 focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <PrimaryBtn onClick={handleSaveVitals} disabled={loading} className="text-sm py-2 px-5">
          {loading ? "Saving…" : "Save Vitals"}
        </PrimaryBtn>
      </div>
    </div>
  )
}
