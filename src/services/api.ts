import { getStoredToken, refreshAuthToken, getValidAccessToken, clearAllAuthSessions } from "./auth"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

async function request<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  const token = await getValidAccessToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    // Auto-intercept 401 Unauthorized, perform refresh, and replay request seamlessly
    if (response.status === 401 && !isRetry) {
      const newToken = await refreshAuthToken()
      if (newToken) {
        return request<T>(endpoint, options, true)
      } else {
        clearAllAuthSessions()
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"))
        }
      }
    }

    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.detail || `HTTP Error ${response.status}`)
  }

  return response.json()
}

// ── CLINIC SETTINGS & DOCTORS LIST API ──
export async function fetchClinicSettings() {
  return request<{ ok: boolean; name: string; contact_email: string; contact_number: string; address: string; logo_url: string | null }>("/api/v1/clinic/settings/")
}

export async function fetchDoctorsList() {
  return request<{ ok: boolean; doctors: any[] }>("/api/v1/doctors/")
}

// ── COMPOUNDER API ──
export async function fetchCompounderDashboard(searchQ?: string) {
  const query = searchQ ? `?search_q=${encodeURIComponent(searchQ)}` : ""
  return request<any>(`/api/v1/compounder/dashboard/${query}`)
}

export async function registerPatient(payload: any) {
  return request<any>("/api/v1/compounder/patient/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function createAppointment(payload: any) {
  return request<any>("/api/v1/compounder/appointment/create/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateAppointmentStatus(appointmentId: number | string, payload: { status?: string; doctor_id?: number | string }) {
  return request<any>(`/api/v1/compounder/appointment/${appointmentId}/update/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ── DOCTOR API ──
export async function fetchDoctorDashboard(doctorId?: number) {
  const query = doctorId ? `?doctor_id=${doctorId}` : ""
  return request<any>(`/api/v1/doctor/dashboard/${query}`)
}

export async function saveConsultation(appointmentId: number | string, payload: any) {
  return request<any>(`/api/v1/doctor/consultation/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function saveDiagnosis(appointmentId: number | string, payload: any) {
  return request<any>(`/api/v1/doctor/diagnosis/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ── JOINT CHART API ──
export async function fetchJointChart(appointmentId: number | string) {
  return request<any>(`/api/v1/joint-chart/${appointmentId}/`)
}

export async function saveJointChart(appointmentId: number | string, jointStates: Record<string, string>) {
  return request<any>(`/api/v1/joint-chart/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify({ joint_states: jointStates }),
  })
}

// ── RHEUMAT DIAGNOSIS API ──
export async function fetchRumatDiagnosis(appointmentId: number | string) {
  return request<any>(`/api/v1/rumat-diagnosis/${appointmentId}/`)
}

export async function saveRumatDiagnosis(appointmentId: number | string, payload: any) {
  return request<any>(`/api/v1/rumat-diagnosis/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ── VITALS & MEDICAL INFO API ──
export async function fetchPatientAppointments(patientId: number | string) {
  return request<any>(`/api/v1/patient/${patientId}/appointments/`)
}

export async function fetchVitals(appointmentId: number | string) {
  return request<any>(`/api/v1/vitals/${appointmentId}/`)
}

export async function saveVitals(appointmentId: number | string, payload: any) {
  return request<any>(`/api/v1/vitals/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function fetchMedicalInfo(patientId: number | string) {
  return request<any>(`/api/v1/medical-info/${patientId}/`)
}

export async function saveMedicalInfo(patientId: number | string, payload: any) {
  return request<any>(`/api/v1/medical-info/${patientId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ── LAB REPORT UPLOADER API ──
export async function uploadLabReportTemp(input: FormData | File) {
  const formData = input instanceof FormData ? input : new FormData()
  if (input instanceof File) {
    formData.append("file", input)
  }
  const token = getStoredToken()
  const response = await fetch(`${BASE_URL}/api/lab-report/upload-temp/`, {
    method: "POST",
    headers: token ? { "Authorization": `Bearer ${token}` } : {},
    body: formData,
  })
  return response.json()
}

export async function pollLabReportTask(taskId: string) {
  return request<{ status: string; result?: any; error?: string }>(`/api/lab-report/task-status/${taskId}/`)
}

export async function saveExtractedLabData(reportId: number | string, testData: any) {
  const payload = testData?.test_data ? testData : { test_data: testData }
  return request<{ ok: boolean; error?: string }>(`/api/lab-report/save/${reportId}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ── REAL-TIME QUEUE & WEBSOCKET SYNC ──
export function getQueueWebSocketUrl(doctorId?: number | string): string {
  const wsProtocol = BASE_URL.startsWith("https") ? "wss" : "ws"
  const cleanHost = BASE_URL.replace(/^https?:\/\//, "")
  return doctorId
    ? `${wsProtocol}://${cleanHost}/ws/doctor-queue/${doctorId}/`
    : `${wsProtocol}://${cleanHost}/ws/doctor-queue/`
}

export async function fetchLiveQueueStats(doctorId?: number | string) {
  const query = doctorId ? `?doctor=${doctorId}` : ""
  return request<{
    counts: { waiting: number; attending: number; attended: number; total: number }
    waiting: any[]
    attending: any[]
    attended: any[]
  }>(`/api/queue/${query}`)
}

// ── AUTOSUGGEST & CLINICAL ANALYTICS ──
export async function fetchMedicineAutosuggest(query: string) {
  if (!query || query.trim().length < 2) return { results: [] }
  return request<{ results: any[] }>(`/api/v1/autosuggest/medicine/?q=${encodeURIComponent(query.trim())}`)
}

export async function fetchLabTestAutosuggest(query: string) {
  if (!query || query.trim().length < 2) return { results: [] }
  return request<{ results: any[] }>(`/api/v1/autosuggest/labtest/?q=${encodeURIComponent(query.trim())}`)
}

export async function calculateDAS28Score(appointmentId: number | string) {
  return request<any>(`/api/v1/das28/${appointmentId}/`)
}

export async function fetchDiagnosisStatus(appointmentId: number | string) {
  return request<any>(`/api/diagnosis-status/${appointmentId}/`)
}

// ── PRESCRIPTION & NOTIFICATIONS ──
export function getPrescriptionPdfUrl(prescriptionId: number | string): string {
  return `${BASE_URL}/api/v1/prescription/${prescriptionId}/pdf/`
}

export async function sendPrescriptionWhatsApp(prescriptionId: number | string) {
  return request<any>(`/api/v1/prescription/${prescriptionId}/send/`, {
    method: "POST",
  })
}

export async function fetchDoctorNotifications(role: "DOCTOR" | "COMPOUNDER" = "DOCTOR") {
  return request<{ status: string; unread_count: number; notifications: any[] }>(`/notifications/api/list/?role=${role}`)
}

export async function markNotificationRead(notificationId: number | string) {
  return request<any>(`/notifications/api/${notificationId}/read/`, {
    method: "POST",
  })
}

// ── MEDASR AI VOICE DICTATION & STRUCTURING ──
export async function correctTranscription(text: string) {
  return request<{ ok: boolean; corrected_text?: string; error?: string }>("/api/proxy-correct-transcription/", {
    method: "POST",
    body: JSON.stringify({ text }),
  })
}

export async function structureClinicalNote(text: string) {
  return request<{ ok: boolean; data?: any; error?: string }>("/api/proxy-structure-clinical-note/", {
    method: "POST",
    body: JSON.stringify({ text }),
  })
}

