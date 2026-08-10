import React, { useState } from "react"
import { loginWithCredentials, UserProfile } from "../services/auth"

export function LoginPage({ onLoginSuccess }: { onLoginSuccess: (user: UserProfile) => void }) {
  const [email, setEmail] = useState("doctor@rheumalink.com")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"DOCTOR" | "COMPOUNDER">("DOCTOR")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleQuickDemo = (role: "DOCTOR" | "COMPOUNDER") => {
    setSelectedRole(role)
    if (role === "DOCTOR") {
      setEmail("doctor@rheumalink.com")
      setPassword("doctor123")
    } else {
      setEmail("compounder@rheumalink.com")
      setPassword("compounder123")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.")
      return
    }

    setLoading(true)
    setErrorMsg("")

    const res = await loginWithCredentials(email, password)
    setLoading(false)

    if (res.ok && res.user) {
      onLoginSuccess(res.user)
    } else {
      setErrorMsg(res.error || "Authentication failed. Please verify credentials.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* Decorative background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 space-y-7">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 text-white text-3xl shadow-lg shadow-teal-500/30 mb-1">
            🩺
          </div>
          <h1 className="text-3xl font-800 text-slate-800 tracking-tight">RheumaLink</h1>
          <p className="text-slate-500 font-500 text-sm">Clinical Rheumatology &amp; Patient Management Suite</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
          <button
            type="button"
            onClick={() => handleQuickDemo("DOCTOR")}
            className={`flex-1 py-2.5 rounded-xl font-700 text-sm transition-all flex items-center justify-center gap-2 ${selectedRole === "DOCTOR" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            <span>🩺</span> Doctor Access
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("COMPOUNDER")}
            className={`flex-1 py-2.5 rounded-xl font-700 text-sm transition-all flex items-center justify-center gap-2 ${selectedRole === "COMPOUNDER" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            <span>📋</span> Compounder Desk
          </button>
        </div>

        {/* Quick Demo Chips */}
        <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-3 text-xs font-600 text-teal-800 flex items-center justify-between">
          <span>💡 Quick Demo Account:</span>
          <button
            type="button"
            onClick={() => handleQuickDemo(selectedRole)}
            className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-700 hover:bg-teal-700 transition-colors"
          >
            Fill Demo {selectedRole}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-600 text-xs flex items-center gap-2 animate-shake">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-800 text-slate-600 uppercase tracking-wide mb-1.5">
              Account Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. doctor@rheumalink.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-sm font-600 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
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
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-sm font-600 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-800 text-base shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In…
              </>
            ) : (
              <>
                🔒 Sign In to {selectedRole === "DOCTOR" ? "Doctor Desk" : "Compounder Desk"} ➔
              </>
            )}
          </button>
        </form>

        {/* Footer Badges */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-600 text-slate-400">
          <span>🛡️ SimpleJWT Secured</span>
          <span>🎙️ MedASR AI Enabled</span>
          <span>📄 Gotenberg PDF</span>
        </div>
      </div>
    </div>
  )
}
