import React, { useState } from "react"
import { Label } from "../ui/Label"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { PrimaryBtn } from "../ui/Buttons"
import { UserPlusIcon } from "../icons"

export function RegisterPatientForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", sex: "", contact: "", email: "",
    type: "Regular", externalFile: ""
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setForm({ firstName: "", lastName: "", dob: "", sex: "", contact: "", email: "", type: "Regular", externalFile: "" })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>First Name</Label>
          <Input placeholder="e.g. Alpa" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input placeholder="e.g. Jaiswar" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
        </div>
        <div>
          <Label>Sex</Label>
          <Select value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}>
            <option value="">Select…</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Select>
        </div>
        <div>
          <Label>Contact Number</Label>
          <Input type="tel" placeholder="+91 98XXX XXXXX" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
        </div>
        <div>
          <Label>Email Address</Label>
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
                className={`flex-1 py-3 rounded-xl border-2 font-700 text-base transition-all ${form.type === t ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-500 hover:border-teal-300"}`}
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
      <div className="flex items-center justify-between pt-2">
        {saved && (
          <span className="text-emerald-600 font-700 text-base flex items-center gap-2">
            ✓ All set! Patient registered successfully.
          </span>
        )}
        {!saved && <span />}
        <PrimaryBtn onClick={handleSave}>
          <UserPlusIcon /> Register Patient
        </PrimaryBtn>
      </div>
    </div>
  )
}
