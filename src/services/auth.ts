const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

export interface UserProfile {
  id: number
  email: string
  role: string
  full_name: string
}

const DOCTOR_TOKEN_KEY = "rheumalink_doctor_token"
const DOCTOR_USER_KEY = "rheumalink_doctor_user"

const COMPOUNDER_TOKEN_KEY = "rheumalink_compounder_token"
const COMPOUNDER_USER_KEY = "rheumalink_compounder_user"
const ACTIVE_TOKEN_KEY = "rheumalink_active_token"

/**
 * Decode JWT token client-side Base64 payload to extract user_id and role safely.
 */
export function decodeJwtClaims(token: string | null | undefined): { user_id?: number; role?: string } | null {
  if (!token || typeof token !== "string") return null
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

// ── DOCTOR SESSION STORAGE ──
export function getStoredDoctorToken(): string | null {
  return localStorage.getItem(DOCTOR_TOKEN_KEY) || localStorage.getItem(ACTIVE_TOKEN_KEY)
}

export function getStoredDoctorUser(): UserProfile | null {
  const data = localStorage.getItem(DOCTOR_USER_KEY)
  if (!data) return null
  try { return JSON.parse(data) } catch { return null }
}

export function saveDoctorAuthSession(token: string, user: UserProfile) {
  localStorage.setItem(DOCTOR_TOKEN_KEY, token)
  localStorage.setItem(DOCTOR_USER_KEY, JSON.stringify(user))
  localStorage.setItem(ACTIVE_TOKEN_KEY, token)
}

export function clearDoctorAuthSession() {
  localStorage.removeItem(DOCTOR_TOKEN_KEY)
  localStorage.removeItem(DOCTOR_USER_KEY)
  localStorage.removeItem(ACTIVE_TOKEN_KEY)
}

// ── COMPOUNDER SESSION STORAGE ──
export function getStoredCompounderToken(): string | null {
  return localStorage.getItem(COMPOUNDER_TOKEN_KEY) || localStorage.getItem(ACTIVE_TOKEN_KEY)
}

export function getStoredCompounderUser(): UserProfile | null {
  const data = localStorage.getItem(COMPOUNDER_USER_KEY)
  if (!data) return null
  try { return JSON.parse(data) } catch { return null }
}

export function saveCompounderAuthSession(token: string, user: UserProfile) {
  localStorage.setItem(COMPOUNDER_TOKEN_KEY, token)
  localStorage.setItem(COMPOUNDER_USER_KEY, JSON.stringify(user))
  localStorage.setItem(ACTIVE_TOKEN_KEY, token)
}

export function clearCompounderAuthSession() {
  localStorage.removeItem(COMPOUNDER_TOKEN_KEY)
  localStorage.removeItem(COMPOUNDER_USER_KEY)
  localStorage.removeItem(ACTIVE_TOKEN_KEY)
}

// Global active token helper for REST API requests
export function getStoredToken(): string | null {
  return (
    localStorage.getItem(ACTIVE_TOKEN_KEY) ||
    localStorage.getItem(DOCTOR_TOKEN_KEY) ||
    localStorage.getItem(COMPOUNDER_TOKEN_KEY)
  )
}

/**
 * Direct REST JWT Authentication using minimal claims (user_id and role strictly).
 */
export async function loginWithCredentials(email: string, password: string): Promise<{ ok: boolean; user?: UserProfile; error?: string; access?: string }> {
  try {
    const jwtResponse = await fetch(`${BASE_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    })

    if (jwtResponse.ok) {
      const jwtData = await jwtResponse.json()
      const claims = decodeJwtClaims(jwtData.access)
      const userObj: UserProfile = jwtData.user || {
        id: claims?.user_id || 1,
        role: claims?.role || "DOCTOR",
        email: email.trim().toLowerCase(),
        full_name: "",
      }

      if (userObj.role === "COMPOUNDER") {
        saveCompounderAuthSession(jwtData.access, userObj)
      } else {
        saveDoctorAuthSession(jwtData.access, userObj)
      }

      return { ok: true, user: userObj, access: jwtData.access }
    }

    const errData = await jwtResponse.json().catch(() => null)
    const errMessage = errData?.detail || errData?.non_field_errors?.[0] || "Invalid email or password. Authentication failed."
    return { ok: false, error: errMessage }
  } catch (err: any) {
    return { ok: false, error: "Unable to connect to authentication server. Please check network connection." }
  }
}
