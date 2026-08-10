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

// ── CLINIC SETTINGS API (CACHED FROM REDIS DB) ──
export async function fetchClinicSettings() {
  return request<{ ok: boolean; name: string; contact_email: string; contact_number: string; address: string; logo_url: string | null }>("/api/v1/clinic/settings/")
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

// ── DOCTOR API ──
export async function fetchDoctorDashboard(doctorId?: string) {
  const query = doctorId ? `?doctor_id=${encodeURIComponent(doctorId)}` : ""
  return request<any>(`/api/v1/doctor/dashboard/${query}`)
}

export async function saveConsultation(appointmentId: string | number, payload: any) {
  return request<any>(`/api/v1/doctor/consultation/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function saveDiagnosis(appointmentId: string | number, payload: any) {
  return request<any>(`/api/v1/doctor/diagnosis/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ── VITALS & MEDICAL INFO API ──
export async function fetchVitals(appointmentId: string | number) {
  return request<any>(`/api/v1/vitals/${appointmentId}/`)
}

export async function saveVitals(appointmentId: string | number, payload: any) {
  return request<any>(`/api/v1/vitals/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function fetchMedicalInfo(patientId: string | number) {
  return request<any>(`/api/v1/medical-info/${patientId}/`)
}

export async function saveMedicalInfo(patientId: string | number, payload: any) {
  return request<any>(`/api/v1/medical-info/${patientId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ── JOINT ASSESSMENT CHART API ──
export async function fetchJointChart(appointmentId: string | number) {
  return request<any>(`/api/v1/joint-chart/${appointmentId}/`)
}

export async function saveJointChart(appointmentId: string | number, jointStates: Record<string, string>) {
  return request<any>(`/api/v1/joint-chart/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify(jointStates),
  })
}

// ── RHEUMAT DIAGNOSIS & SYMPTOMS BOOK API ──
export async function fetchRumatDiagnosis(appointmentId: string | number) {
  return request<any>(`/api/v1/rumat-diagnosis/${appointmentId}/`)
}

export async function saveRumatDiagnosis(appointmentId: string | number, payload: any) {
  return request<any>(`/api/v1/rumat-diagnosis/${appointmentId}/save/`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ── ANALYTICS & AUTOCOMPLETE ──
export async function fetchDAS28Score(appointmentId: string | number) {
  return request<any>(`/api/v1/das28/${appointmentId}/`)
}

export async function autosuggestMedicine(query: string) {
  return request<any>(`/api/v1/autosuggest/medicine/?q=${encodeURIComponent(query)}`)
}

export async function autosuggestLabTest(query: string) {
  return request<any>(`/api/v1/autosuggest/labtest/?q=${encodeURIComponent(query)}`)
}

// ── LAB REPORT API ──
export async function uploadLabReportTemp(formData: FormData) {
  const url = `${BASE_URL}/api/lab-report/upload-temp/`
  const token = getStoredToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  })
  return response.json()
}

export async function pollLabReportTask(taskId: string) {
  return request<any>(`/api/lab-report/task-status/${taskId}/`)
}

export async function saveExtractedLabData(reportId: string | number, testData: any) {
  return request<any>(`/api/lab-report/save/${reportId}/`, {
    method: "POST",
    body: JSON.stringify({ test_data: testData }),
  })
}

export async function sendPrescriptionWhatsapp(prescriptionId: string | number) {
  return request<any>(`/api/v1/prescription/${prescriptionId}/send/`, {
    method: "POST",
  })
}
