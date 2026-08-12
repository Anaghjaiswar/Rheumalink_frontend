import React, { useState, useEffect } from "react"
import { CloseIcon } from "../icons"
import { fetchMedicalInfo, fetchPatientAppointments, fetchVitals } from "../../services/api"

export function PatientSummaryPanel({
  patientId,
  appointmentId,
  patientName,
  fileNumber,
  externalFile,
  onClose,
}: {
  patientId: number | string
  appointmentId?: number | string
  patientName: string
  fileNumber: string
  externalFile?: string
  onClose: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [medicalInfo, setMedicalInfo] = useState<any>(null)
  const [vitalsData, setVitalsData] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    fetchMedicalInfo(patientId)
      .then(medRes => {
        if (medRes) setMedicalInfo(medRes)
      })
      .catch(() => {})

    const loadVitals = async () => {
      let apptIdToUse = appointmentId
      if (!apptIdToUse) {
        const apptRes = await fetchPatientAppointments(patientId).catch(() => null)
        if (apptRes && apptRes.ok && apptRes.appointments && apptRes.appointments.length > 0) {
          apptIdToUse = apptRes.appointments[0].id
        }
      }
      if (apptIdToUse) {
        const vitRes = await fetchVitals(apptIdToUse).catch(() => null)
        if (vitRes) setVitalsData(vitRes)
      }
      setLoading(false)
    }

    loadVitals()
  }, [patientId, appointmentId])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="font-800 text-slate-800 text-lg">Patient Medical Summary</h3>
            <p className="text-slate-500 text-sm font-600">{patientName} · File: {fileNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer">
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Internal File", value: fileNumber },
                  { label: "External File", value: externalFile || "-" },
                  { label: "Blood Group", value: medicalInfo?.blood_group || "Not recorded" },
                  { label: "Known Allergies", value: medicalInfo?.known_allergies || "None recorded" },
                ].map(f => (
                  <div key={f.label} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                    <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-1">{f.label}</p>
                    <p className="font-700 text-slate-800 text-sm">{f.value}</p>
                  </div>
                ))}
              </div>

              {/* Family history */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-1.5">Family History</p>
                <p className="text-slate-700 font-600 text-sm leading-relaxed">{medicalInfo?.family_history || "No family history on record"}</p>
              </div>

              {/* Habits */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-1">Smoking</p>
                  <p className="font-700 text-slate-800 text-sm">{medicalInfo?.smokes ? "Yes" : "No"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-1">Alcoholic</p>
                  <p className="font-700 text-slate-800 text-sm">{medicalInfo?.alcoholic ? "Yes" : "No"}</p>
                </div>
              </div>

              {/* Comorbidities */}
              <div>
                <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-2">Comorbidities</p>
                <div className="flex flex-wrap gap-2">
                  {medicalInfo?.comorbidity_names && medicalInfo.comorbidity_names.length > 0 ? (
                    medicalInfo.comorbidity_names.map((c: string) => (
                      <span key={c} className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-700 border border-red-200">{c}</span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm font-600">None on record</span>
                  )}
                </div>
              </div>

              {/* Vitals */}
              <div>
                <p className="text-xs font-700 text-slate-400 uppercase tracking-wide mb-3">Recorded Vitals</p>
                {vitalsData && vitalsData.exists ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Weight", value: vitalsData.weight ? `${vitalsData.weight} kg` : "-" },
                      { label: "Height", value: vitalsData.height ? `${vitalsData.height} cm` : "-" },
                      { label: "Blood Pressure", value: vitalsData.bp_systolic ? `${vitalsData.bp_systolic}/${vitalsData.bp_diastolic} mmHg` : "-" },
                      { label: "Pulse Rate", value: vitalsData.pulse_rate ? `${vitalsData.pulse_rate} bpm` : "-" },
                      { label: "SpO2", value: vitalsData.spo2 ? `${vitalsData.spo2} %` : "-" },
                      { label: "Pain Scale", value: vitalsData.pain_scale ? `${vitalsData.pain_scale} / 10` : "-" },
                    ].map(v => (
                      <div key={v.label} className="bg-sky-50 rounded-xl p-3 border border-sky-100">
                        <p className="text-xs font-700 text-sky-600 mb-0.5">{v.label}</p>
                        <p className="font-800 text-slate-800 text-sm">{v.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm font-600">No vitals recorded for this appointment yet</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
