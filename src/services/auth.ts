const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

export interface UserProfile {
  id: number
  email: string
  role: string
  full_name: string
}

const DOCTOR_TOKEN_KEY = "rheumalink_doctor_token"
const DOCTOR_REFRESH_KEY = "rheumalink_doctor_refresh"
const DOCTOR_USER_KEY = "rheumalink_doctor_user"

const COMPOUNDER_TOKEN_KEY = "rheumalink_compounder_token"
const COMPOUNDER_REFRESH_KEY = "rheumalink_compounder_refresh"
const COMPOUNDER_USER_KEY = "rheumalink_compounder_user"

const ACTIVE_TOKEN_KEY = "rheumalink_active_token"
const ACTIVE_REFRESH_KEY = "rheumalink_active_refresh"

/**
 * Decode JWT token client-side Base64 payload to extract user_id, role, and exp safely.
 */
export function decodeJwtClaims(token: string | null | undefined): { user_id?: number; role?: string; exp?: number } | null {
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

/**
 * Checks if a JWT token is expired or within 10 seconds of expiry.
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true
  const claims = decodeJwtClaims(token)
  if (!claims || !claims.exp) return false
  return claims.exp * 1000 < Date.now() + 10000
}

// ── DOCTOR SESSION STORAGE ──
export function getStoredDoctorToken(): string | null {
  return localStorage.getItem(DOCTOR_TOKEN_KEY) || localStorage.getItem(ACTIVE_TOKEN_KEY)
}

export function getStoredDoctorRefreshToken(): string | null {
  return localStorage.getItem(DOCTOR_REFRESH_KEY) || localStorage.getItem(ACTIVE_REFRESH_KEY)
}

export function getStoredDoctorUser(): UserProfile | null {
  const data = localStorage.getItem(DOCTOR_USER_KEY)
  if (!data) return null
  try { return JSON.parse(data) } catch { return null }
}

export function saveDoctorAuthSession(accessToken: string, refreshToken: string | null | undefined, user: UserProfile) {
  localStorage.setItem(DOCTOR_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(DOCTOR_REFRESH_KEY, refreshToken)
  localStorage.setItem(DOCTOR_USER_KEY, JSON.stringify(user))

  localStorage.setItem(ACTIVE_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(ACTIVE_REFRESH_KEY, refreshToken)
}

export function clearDoctorAuthSession() {
  localStorage.removeItem(DOCTOR_TOKEN_KEY)
  localStorage.removeItem(DOCTOR_REFRESH_KEY)
  localStorage.removeItem(DOCTOR_USER_KEY)
  localStorage.removeItem(ACTIVE_TOKEN_KEY)
  localStorage.removeItem(ACTIVE_REFRESH_KEY)
}

// ── COMPOUNDER SESSION STORAGE ──
export function getStoredCompounderToken(): string | null {
  return localStorage.getItem(COMPOUNDER_TOKEN_KEY) || localStorage.getItem(ACTIVE_TOKEN_KEY)
}

export function getStoredCompounderRefreshToken(): string | null {
  return localStorage.getItem(COMPOUNDER_REFRESH_KEY) || localStorage.getItem(ACTIVE_REFRESH_KEY)
}

export function getStoredCompounderUser(): UserProfile | null {
  const data = localStorage.getItem(COMPOUNDER_USER_KEY)
  if (!data) return null
  try { return JSON.parse(data) } catch { return null }
}

export function saveCompounderAuthSession(accessToken: string, refreshToken: string | null | undefined, user: UserProfile) {
  localStorage.setItem(COMPOUNDER_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(COMPOUNDER_REFRESH_KEY, refreshToken)
  localStorage.setItem(COMPOUNDER_USER_KEY, JSON.stringify(user))

  localStorage.setItem(ACTIVE_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(ACTIVE_REFRESH_KEY, refreshToken)
}

export function clearCompounderAuthSession() {
  localStorage.removeItem(COMPOUNDER_TOKEN_KEY)
  localStorage.removeItem(COMPOUNDER_REFRESH_KEY)
  localStorage.removeItem(COMPOUNDER_USER_KEY)
  localStorage.removeItem(ACTIVE_TOKEN_KEY)
  localStorage.removeItem(ACTIVE_REFRESH_KEY)
}

// ── GLOBAL ACTIVE TOKEN HELPERS ──
export function getStoredToken(): string | null {
  return (
    localStorage.getItem(ACTIVE_TOKEN_KEY) ||
    localStorage.getItem(DOCTOR_TOKEN_KEY) ||
    localStorage.getItem(COMPOUNDER_TOKEN_KEY)
  )
}

export function getStoredRefreshToken(): string | null {
  return (
    localStorage.getItem(ACTIVE_REFRESH_KEY) ||
    localStorage.getItem(DOCTOR_REFRESH_KEY) ||
    localStorage.getItem(COMPOUNDER_REFRESH_KEY)
  )
}

export function clearAllAuthSessions() {
  clearDoctorAuthSession()
  clearCompounderAuthSession()
}

// Mutex / in-flight promise to handle multiple concurrent 401 token refresh calls safely
let activeRefreshPromise: Promise<string | null> | null = null

/**
 * Automatically calls /api/token/refresh/ to exchange the stored refresh token for a fresh access token.
 * Prevents race conditions by reusing the in-flight promise for concurrent requests.
 */
export async function refreshAuthToken(): Promise<string | null> {
  if (activeRefreshPromise) {
    return activeRefreshPromise
  }

  const refreshToken = getStoredRefreshToken()
  if (!refreshToken) {
    clearAllAuthSessions()
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:logout"))
    }
    return null
  }

  activeRefreshPromise = (async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!response.ok) {
        // Refresh token itself has expired or is invalid
        clearAllAuthSessions()
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"))
        }
        return null
      }

      const data = await response.json()
      const newAccessToken = data.access
      const newRefreshToken = data.refresh || refreshToken

      if (!newAccessToken) {
        clearAllAuthSessions()
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"))
        }
        return null
      }

      // Extract user/role from claims or response
      const claims = decodeJwtClaims(newAccessToken)
      const role = claims?.role || (localStorage.getItem(DOCTOR_TOKEN_KEY) ? "DOCTOR" : "COMPOUNDER")
      const currentUser = data.user || (role === "COMPOUNDER" ? getStoredCompounderUser() : getStoredDoctorUser())

      if (currentUser) {
        if (currentUser.role === "COMPOUNDER" || role === "COMPOUNDER") {
          saveCompounderAuthSession(newAccessToken, newRefreshToken, currentUser)
        } else {
          saveDoctorAuthSession(newAccessToken, newRefreshToken, currentUser)
        }
      } else {
        localStorage.setItem(ACTIVE_TOKEN_KEY, newAccessToken)
        localStorage.setItem(ACTIVE_REFRESH_KEY, newRefreshToken)
      }

      return newAccessToken
    } catch {
      return null
    } finally {
      activeRefreshPromise = null
    }
  })()

  return activeRefreshPromise
}

/**
 * Gets a valid access token, automatically refreshing if expired.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const token = getStoredToken()
  if (!token) return null

  if (isTokenExpired(token)) {
    return refreshAuthToken()
  }

  return token
}

/**
 * Direct REST JWT Authentication using email & password.
 */
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<{ ok: boolean; user?: UserProfile; error?: string; access?: string; refresh?: string }> {
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
        saveCompounderAuthSession(jwtData.access, jwtData.refresh, userObj)
      } else {
        saveDoctorAuthSession(jwtData.access, jwtData.refresh, userObj)
      }

      return { ok: true, user: userObj, access: jwtData.access, refresh: jwtData.refresh }
    }

    const errData = await jwtResponse.json().catch(() => null)
    const errMessage = errData?.detail || errData?.non_field_errors?.[0] || "Invalid email or password. Authentication failed."
    return { ok: false, error: errMessage }
  } catch (err: any) {
    return { ok: false, error: "Unable to connect to authentication server. Please check network connection." }
  }
}
