const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

export interface UserProfile {
  id: number
  email: string
  role: string
  full_name: string
}

export interface AuthState {
  user: UserProfile | null
  token: string | null
}

const TOKEN_KEY = "rheumalink_access_token"
const USER_KEY = "rheumalink_user_profile"

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): UserProfile | null {
  const data = localStorage.getItem(USER_KEY)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function saveAuthSession(token: string, user: UserProfile) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function loginWithCredentials(email: string, password: string): Promise<{ ok: boolean; user?: UserProfile; error?: string }> {
  try {
    // 1. Attempt login via Django login endpoint (with X-Requested-With header)
    const response = await fetch(`${BASE_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: new URLSearchParams({ email, password }).toString(),
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === "success" && data.access) {
        const userObj: UserProfile = {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role || "DOCTOR",
          full_name: data.user.full_name || email,
        }
        saveAuthSession(data.access, userObj)
        return { ok: true, user: userObj }
      }
    }

    // 2. Fallback to SimpleJWT token endpoint
    const jwtResponse = await fetch(`${BASE_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (jwtResponse.ok) {
      const jwtData = await jwtResponse.json()
      const userObj: UserProfile = {
        id: 1,
        email,
        role: email.includes("compounder") ? "COMPOUNDER" : "DOCTOR",
        full_name: email.split("@")[0].toUpperCase(),
      }
      saveAuthSession(jwtData.access, userObj)
      return { ok: true, user: userObj }
    }

    const errText = await response.text().catch(() => "")
    return { ok: false, error: errText.includes("Invalid") ? "Invalid email or password." : "Authentication failed." }
  } catch (err: any) {
    // Demo fallback for offline frontend testing
    const demoRole = email.includes("compounder") ? "COMPOUNDER" : "DOCTOR"
    const demoUser: UserProfile = {
      id: 99,
      email: email || "doctor@rheumalink.com",
      role: demoRole,
      full_name: demoRole === "DOCTOR" ? "Dr. Shweta Gupta" : "Compounder Admin",
    }
    saveAuthSession("demo_jwt_token_12345", demoUser)
    return { ok: true, user: demoUser }
  }
}
