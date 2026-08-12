import { useState, useEffect } from "react"
import { fetchClinicSettings } from "../services/api"

export function LandingPage({
  onSelectDoctorPortal,
  onSelectCompounderPortal,
}: {
  onSelectDoctorPortal: () => void
  onSelectCompounderPortal: () => void
}) {
  const [clinicName, setClinicName] = useState("")
  const [clinicAddress, setClinicAddress] = useState("")

  useEffect(() => {
    fetchClinicSettings()
      .then(res => {
        if (res.ok && res.name) {
          setClinicName(res.name)
          if (res.address) setClinicAddress(res.address)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col justify-between p-6 font-sans relative overflow-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white text-2xl flex items-center justify-center shadow-md shadow-teal-600/20">
            🩺
          </div>
          <div>
            <h1 className="font-800 text-xl text-slate-800 tracking-tight">{clinicName || "RheumaLink Clinic"}</h1>
            <p className="text-xs text-slate-500 font-500">{clinicAddress || "Clinical Management Portal"}</p>
          </div>
        </div>
      </header>

      {/* Main Hero & Portal Cards */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12 text-center space-y-10 relative z-10">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 font-700 text-xs inline-block">
            Sandhi Rheuma Care &amp; Clinical Management System
          </span>
          <h2 className="text-3xl sm:text-5xl font-800 text-slate-800 tracking-tight leading-tight">
            Welcome to <span className="text-teal-700">{clinicName || "Clinical Portal"}</span>
          </h2>
          <p className="text-slate-500 font-500 text-base">
            Select your clinical role to access your dedicated workstation dashboard.
          </p>
        </div>

        {/* 2 Independent Portal Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
          
          {/* Doctor Portal Card */}
          <div
            onClick={onSelectDoctorPortal}
            className="bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-teal-400 shadow-xl hover:shadow-2xl transition-all cursor-pointer text-left space-y-4 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 text-3xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-xs">
              🩺
            </div>
            <div>
              <h3 className="text-xl font-800 text-slate-800">Doctor Desk Portal</h3>
              <p className="text-slate-500 font-500 text-xs mt-1">
                Consultation notes, prescriptions, joint charts, and Rheumat diagnosis checklists.
              </p>
            </div>
            <div className="pt-2 flex items-center text-teal-700 font-800 text-sm group-hover:translate-x-1 transition-transform">
              Access Doctor Portal ➔
            </div>
          </div>

          {/* Compounder Portal Card */}
          <div
            onClick={onSelectCompounderPortal}
            className="bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-sky-400 shadow-xl hover:shadow-2xl transition-all cursor-pointer text-left space-y-4 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 text-3xl flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-xs">
              📋
            </div>
            <div>
              <h3 className="text-xl font-800 text-slate-800">Compounder Desk Portal</h3>
              <p className="text-slate-500 font-500 text-xs mt-1">
                Patient registration, appointments, vitals capture, and medical history records.
              </p>
            </div>
            <div className="pt-2 flex items-center text-sky-700 font-800 text-sm group-hover:translate-x-1 transition-transform">
              Access Compounder Portal ➔
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs font-500 text-slate-400 py-4 border-t border-slate-200/60">
        {clinicName} {clinicAddress ? `· ${clinicAddress}` : "· Clinical Portal System"}
      </footer>
    </div>
  )
}
