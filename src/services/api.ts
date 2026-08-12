import { getStoredToken } from "./auth"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  const token = getStoredToken()

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
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP Error ${response.status}`)
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
export async function uploadLabReportTemp(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  const token = getStoredToken()
  const response = await fetch(`${BASE_URL}/api/lab-report/upload-temp/`, {
    method: "POST",
    headers: token ? { "Authorization": `Bearer ${token}` } : {},
    body: formData,
  })
  return response.json()
}

export async function pollLabReportTask(taskId: string) {
  return request<any>(`/api/lab-report/task-status/${taskId}/`)
}

export async function saveExtractedLabData(reportId: number | string, payload: any) {
  return request<any>(`/api/lab-report/save/${reportId}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
