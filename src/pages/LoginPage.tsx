import React, { useState, useEffect } from "react"
import { loginWithCredentials, UserProfile } from "../services/auth"
import { fetchClinicSettings } from "../services/api"

export function LoginPage({ onLoginSuccess }: { onLoginSuccess: (user: UserProfile) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"DOCTOR" | "COMPOUNDER">("DOCTOR")
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
      onLoginSuccess(res.user)
    } else {
      setErrorMsg(res.error || "Invalid email or password. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* Soft background ambient glows matching app theme */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dead-centered login container card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">

        {/* Brand Header with dynamic clinic name directly from DB / Redis cache */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white text-2xl shadow-md shadow-teal-600/20 mb-1">
            🩺
          </div>
          <h1 className="text-2xl font-800 text-slate-800 tracking-tight">
            {clinicName || "Rheumatology Care"}
          </h1>
          <p className="text-slate-500 font-500 text-sm">Clinical Portal Authentication</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
          <button
            type="button"
            onClick={() => setSelectedRole("DOCTOR")}
            className={`flex-1 py-2.5 rounded-xl font-700 text-sm transition-all flex items-center justify-center gap-2 ${selectedRole === "DOCTOR" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <span>🩺</span> Doctor Desk
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("COMPOUNDER")}
            className={`flex-1 py-2.5 rounded-xl font-700 text-sm transition-all flex items-center justify-center gap-2 ${selectedRole === "COMPOUNDER" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <span>📋</span> Compounder Desk
          </button>
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
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={selectedRole === "DOCTOR" ? "doctor@rheumalink.com" : "compounder@rheumalink.com"}
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
            className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-800 text-base shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating…
              </>
            ) : (
              <>
                Sign In ➔
              </>
            )}
          </button>
        </form>

        {/* Dynamic Footer with Clinic Name and Address directly from DB / Cache */}
        <p className="text-center text-xs font-500 text-slate-400 pt-2 border-t border-slate-100">
          {clinicName || "Clinical Management System"} {clinicAddress ? `· ${clinicAddress}` : ""}
        </p>
      </div>
    </div>
  )
}
