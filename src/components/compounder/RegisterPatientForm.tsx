import React, { useState } from "react"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { PrimaryBtn } from "../ui/Buttons"
import { UserPlusIcon } from "../icons"
import { registerPatient } from "../../services/api"

export function RegisterPatientForm({ onPatientRegistered }: { onPatientRegistered?: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    sex: "F",
    contact: "",
    email: "",
    type: "Regular",
    externalFile: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setErrorMsg("First Name and Last Name are required.")
      return
    }

    setLoading(true)
    setErrorMsg("")
    setMsg("")

    // Map sex selection to single character code expected by Django choice field ('M', 'F', 'O')
    let sexCode = "F"
    if (form.sex.toLowerCase().startsWith("m")) sexCode = "M"
    else if (form.sex.toLowerCase().startsWith("o")) sexCode = "O"

    // Map type to Title Case expected by Django choice field ('Regular', 'Free')
    const typeVal = form.type === "Free" ? "Free" : "Regular"

    const payload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      date_of_birth: form.dob || null,
      sex: sexCode,
      contact_no: form.contact.trim(),
      email: form.email.trim() || null,
      type: typeVal,
      external_file_number: form.externalFile.trim() || null,
    }

    try {
      const res = await registerPatient(payload)
      setLoading(false)

      if (res.ok) {
        setMsg(res.message || `Patient '${form.firstName} ${form.lastName}' registered successfully!`)
        setForm({
          firstName: "",
          lastName: "",
          dob: "",
          sex: "F",
          contact: "",
          email: "",
          type: "Regular",
          externalFile: ""
        })
        if (onPatientRegistered) onPatientRegistered()
        setTimeout(() => setMsg(""), 4000)
      } else {
        if (res.errors) {
          const formatted = Object.entries(res.errors)
            .map(([field, errs]: [string, any]) => `${field.replace('_', ' ').toUpperCase()}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
            .join(' | ')
          setErrorMsg(formatted)
        } else {
          setErrorMsg(res.message || "Registration failed.")
        }
      }
    } catch (err: any) {
      setLoading(false)
      if (err.response && err.response.data && err.response.data.errors) {
        const formatted = Object.entries(err.response.data.errors)
          .map(([field, errs]: [string, any]) => `${field.replace('_', ' ').toUpperCase()}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
          .join(' | ')
        setErrorMsg(formatted)
      } else {
        setErrorMsg(err.message || "Error registering patient.")
      }
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>First Name <span className="text-red-500">*</span></Label>
          <Input placeholder="e.g. Aditya" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        </div>
        <div>
          <Label>Last Name <span className="text-red-500">*</span></Label>
          <Input placeholder="e.g. Singh" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
        </div>
        <div>
          <Label>Sex</Label>
          <Select value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}>
            <option value="F">Female</option>
            <option value="M">Male</option>
            <option value="O">Other</option>
          </Select>
        </div>
        <div>
          <Label>Contact Number</Label>
          <Input type="tel" placeholder="+91 98XXX XXXXX" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
        </div>
        <div>
          <Label>Email Address <span className="text-slate-400 font-500">(Optional)</span></Label>
          <Input type="email" placeholder="patient@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <Label>Patient Type</Label>
          <div className="flex gap-3 mt-1">
            {["Regular", "Free"].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`flex-1 py-3 rounded-xl border-2 font-700 text-base transition-all cursor-pointer ${form.type === t ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-500 hover:border-teal-300"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>External File Number <span className="text-slate-400 font-500">(Optional)</span></Label>
          <Input placeholder="e.g. EXT-0042" value={form.externalFile} onChange={e => setForm(f => ({ ...f, externalFile: e.target.value }))} />
        </div>
      </div>
      <div className="flex items-center justify-end pt-2">
        <PrimaryBtn onClick={handleSave} disabled={loading}>
          <UserPlusIcon /> {loading ? "Registering…" : "Register Patient"}
        </PrimaryBtn>
      </div>
    </div>
  )
}
