import React, { useState, useEffect } from "react"
import { HeartPulseIcon, CloseIcon } from "../icons"
import { getPrescriptionPdfUrl, sendPrescriptionWhatsApp } from "../../services/api"
import { getValidAccessToken } from "../../services/auth"

export function PrescriptionPreview({
  prescriptionId,
  patientName = "Patient",
  patientFile = "",
  doctorName = "Doctor",
  dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  onClose,
}: {
  prescriptionId?: number | string
  patientName?: string
  patientFile?: string
  doctorName?: string
  dateStr?: string
  onClose: () => void
}) {
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false)
  const [whatsAppMsg, setWhatsAppMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [isLoadingPdf, setIsLoadingPdf] = useState(true)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const rawPdfUrl = prescriptionId ? getPrescriptionPdfUrl(prescriptionId) : ""

  // Fetch prescription PDF with Bearer Token into an authenticated Blob URL
  useEffect(() => {
    let active = true
    let currentBlobUrl: string | null = null

    if (!prescriptionId) {
      setIsLoadingPdf(false)
      return
    }

    setIsLoadingPdf(true)
    setPdfError(null)

    getValidAccessToken()
      .then(token => {
        return fetch(rawPdfUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
      })
      .then(async res => {
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}))
          throw new Error(errJson.detail || errJson.error || `HTTP ${res.status}: Failed to generate/load PDF.`)
        }
        return res.blob()
      })
      .then(blob => {
        if (!active) return
        currentBlobUrl = URL.createObjectURL(blob)
        setPdfBlobUrl(currentBlobUrl)
        setIsLoadingPdf(false)
      })
      .catch(err => {
        if (!active) return
        console.error("Prescription PDF fetch error:", err)
        setPdfError(err.message || "Failed to load prescription document.")
        setIsLoadingPdf(false)
      })

    return () => {
      active = false
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl)
      }
    }
  }, [prescriptionId, rawPdfUrl, reloadKey])

  const handleSendWhatsApp = async () => {
    if (!prescriptionId) {
      setWhatsAppMsg({ type: "error", text: "No prescription ID found to dispatch." })
      return
    }

    setIsSendingWhatsApp(true)
    setWhatsAppMsg(null)

    try {
      const res = await sendPrescriptionWhatsApp(prescriptionId)
      setIsSendingWhatsApp(false)
      if (res.ok) {
        setWhatsAppMsg({ type: "success", text: "Prescription PDF dispatched to patient's WhatsApp successfully!" })
      } else {
        setWhatsAppMsg({ type: "error", text: res.error || "Failed to dispatch WhatsApp message." })
      }
    } catch (err: any) {
      setIsSendingWhatsApp(false)
      setWhatsAppMsg({ type: "error", text: err.message || "Error sending WhatsApp message." })
    }
  }

  const handleDownloadPdf = () => {
    if (pdfBlobUrl) {
      const a = document.createElement("a")
      a.href = pdfBlobUrl
      a.download = `Prescription_${patientName.replace(/\s+/g, "_")}_${prescriptionId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else if (rawPdfUrl) {
      window.open(rawPdfUrl, "_blank")
    }
  }

  const handleOpenNewTab = () => {
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, "_blank")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-7xl w-[98vw] h-[94vh] max-h-[94vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Clinical details sidebar (collapsible for maximum PDF width) */}
        <div
          className={`${
            isSidebarCollapsed ? "w-0 p-0 overflow-hidden md:w-16 md:p-3" : "w-full md:w-72 p-5"
          } bg-slate-900 text-white flex flex-col justify-between flex-shrink-0 transition-all duration-200 z-10 border-r border-slate-800`}
        >
          {!isSidebarCollapsed ? (
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-sm">
                    <HeartPulseIcon />
                  </div>
                  <div>
                    <span className="font-800 text-teal-400 text-base leading-tight block">RheumaLink</span>
                    <span className="text-[9px] text-slate-400 font-600 uppercase tracking-wider block">Rx Generation Engine</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  title="Collapse sidebar for wide view"
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ◀
                </button>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 space-y-2.5">
                <div>
                  <p className="text-slate-400 text-[10px] font-800 uppercase tracking-wider mb-0.5">Patient Details</p>
                  <p className="font-800 text-white text-sm">{patientName}</p>
                  {patientFile && <p className="text-teal-400 text-xs font-600 mt-0.5">📁 {patientFile}</p>}
                </div>

                <div className="border-t border-slate-700/60 pt-2">
                  <p className="text-slate-400 text-[10px] font-800 uppercase tracking-wider mb-0.5">Consulting Doctor</p>
                  <p className="font-700 text-slate-200 text-xs">{doctorName}</p>
                </div>

                <div className="border-t border-slate-700/60 pt-2">
                  <p className="text-slate-400 text-[10px] font-800 uppercase tracking-wider mb-0.5">Consultation Date</p>
                  <p className="font-700 text-slate-200 text-xs">{dateStr}</p>
                </div>
              </div>

              {whatsAppMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-700 border ${
                    whatsAppMsg.type === "success"
                      ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300"
                      : "bg-red-950/70 border-red-500/50 text-red-300"
                  }`}
                >
                  {whatsAppMsg.type === "success" ? "✓ " : "⚠️ "}
                  {whatsAppMsg.text}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between h-full py-2">
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                title="Expand details sidebar"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-white transition-colors cursor-pointer"
              >
                ▶
              </button>
            </div>
          )}

          {!isSidebarCollapsed && (
            <div className="pt-4 space-y-2">
              <button
                onClick={handleSendWhatsApp}
                disabled={isSendingWhatsApp || !prescriptionId}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-700 rounded-xl transition-all text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>📱</span>
                {isSendingWhatsApp ? "Dispatching..." : "Send via WhatsApp"}
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={!pdfBlobUrl && !rawPdfUrl}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-sky-600 hover:bg-sky-500 active:scale-98 text-white font-700 rounded-xl transition-all text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>📄</span> Download PDF
              </button>
            </div>
          )}
        </div>

        {/* PDF Viewer & Header Controls area */}
        <div className="flex-1 p-3 sm:p-5 overflow-hidden flex flex-col bg-slate-100/80">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              {isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-teal-400 hover:bg-slate-700 text-xs font-700 cursor-pointer flex items-center gap-1"
                >
                  <span>📋</span> Details
                </button>
              )}
              <h3 className="font-800 text-slate-800 text-base sm:text-lg flex items-center gap-2">
                <span>Official Prescription Document</span>
                {prescriptionId && (
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-800">
                    Rx #{prescriptionId}
                  </span>
                )}
              </h3>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-2">
              {pdfBlobUrl && (
                <button
                  onClick={handleOpenNewTab}
                  title="Open in full tab"
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>↗</span> Full Tab
                </button>
              )}

              <button
                onClick={onClose}
                title="Close Viewer"
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Full Width PDF Iframe with #navpanes=0&view=FitH */}
          <div className="flex-1 w-full bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden flex flex-col items-center justify-center">
            {isLoadingPdf ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-700 font-700 text-sm">Rendering official prescription PDF...</p>
                <p className="text-slate-400 text-xs font-500">Converting clinical notes &amp; Rx with Gotenberg engine</p>
              </div>
            ) : pdfError ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center max-w-md">
                <span className="text-3xl">⚠️</span>
                <p className="text-red-600 font-700 text-sm">{pdfError}</p>
                <button
                  onClick={() => setReloadKey(k => k + 1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-700 cursor-pointer transition-all"
                >
                  🔄 Retry Rendering PDF
                </button>
              </div>
            ) : pdfBlobUrl ? (
              <iframe
                src={`${pdfBlobUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                title="Prescription PDF Preview"
                className="w-full h-full border-0"
              />
            ) : (
              <div className="h-full flex items-center justify-center p-10 text-slate-400 font-600 text-sm italic">
                Prescription PDF will be rendered once consultation is saved.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
