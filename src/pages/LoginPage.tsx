import React, { useState, useEffect } from "react"
import { loginWithCredentials, UserProfile, clearDoctorAuthSession, clearCompounderAuthSession } from "../services/auth"
import { fetchClinicSettings } from "../services/api"

export function LoginPage({
  portalRole,
  onLoginSuccess,
  onBackToHome,
}: {
  portalRole: "DOCTOR" | "COMPOUNDER"
  onLoginSuccess: (user: UserProfile) => void
  onBackToHome?: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg("Please enter your registered email and password.")
      return
    }

    setLoading(true)
    setErrorMsg("")

    const res = await loginWithCredentials(email, password)
    setLoading(false)

    if (res.ok && res.user) {
      // Strict Portal Role Check Enforcement
      if (portalRole === "DOCTOR" && res.user.role !== "DOCTOR") {
        clearDoctorAuthSession()
        clearCompounderAuthSession()
        setErrorMsg("Access Denied: Only Doctor accounts can log in through the Doctor Desk. If you are a compounder, please log in via the Compounder Portal.")
        return
      }

      if (portalRole === "COMPOUNDER" && res.user.role !== "COMPOUNDER") {
        clearDoctorAuthSession()
        clearCompounderAuthSession()
        setErrorMsg("Access Denied: Only Compounder accounts can log in through the Compounder Desk. If you are a doctor, please log in via the Doctor Portal.")
        return
      }

      onLoginSuccess(res.user)
    } else {
      setErrorMsg(res.error || "Invalid email or password. Please try again.")
    }
  }

  const isDoctorPortal = portalRole === "DOCTOR"

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* Soft background ambient glows */}
      <div className={`absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDoctorPortal ? "bg-teal-400/10" : "bg-sky-400/10"}`} />
      <div className={`absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDoctorPortal ? "bg-teal-400/10" : "bg-sky-400/10"}`} />

      {/* Dead-centered login container card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">

        {/* Back to Home Link */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="text-xs font-700 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            ← Back to Home
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white text-2xl shadow-md mb-1 ${isDoctorPortal ? "bg-teal-600 shadow-teal-600/20" : "bg-sky-600 shadow-sky-600/20"}`}>
            {isDoctorPortal ? "🩺" : "📋"}
          </div>
          <h1 className="text-2xl font-800 text-slate-800 tracking-tight">
            {clinicName || "Rheumatology Care"}
          </h1>
          <p className="text-slate-500 font-600 text-sm">
            {isDoctorPortal ? "🩺 Doctor Desk Login Portal" : "📋 Compounder Desk Login Portal"}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-600 text-xs flex items-center gap-2 animate-fadeIn">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-800 text-slate-600 uppercase tracking-wide mb-1.5">
              Registered Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={isDoctorPortal ? "shweta78@gmail.com" : "compounder1@gmail.com"}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-sm font-600 focus:outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-800 text-slate-600 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-sm font-600 focus:outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-700 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-6 rounded-xl text-white font-800 text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2 ${isDoctorPortal ? "bg-teal-600 hover:bg-teal-700 shadow-teal-600/20" : "bg-sky-600 hover:bg-sky-700 shadow-sky-600/20"}`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating…
              </>
            ) : (
              <>
                Sign In to {isDoctorPortal ? "Doctor Desk" : "Compounder Desk"} ➔
              </>
            )}
          </button>
        </form>

        {/* Dynamic Footer with Clinic Name and Address */}
        <p className="text-center text-xs font-500 text-slate-400 pt-2 border-t border-slate-100">
          {clinicName || "Clinical Management System"} {clinicAddress ? `· ${clinicAddress}` : ""}
        </p>
      </div>
    </div>
  )
}
