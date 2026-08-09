import React from "react"
import { MicIcon } from "../icons"

export function Textarea({ micButton = false, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { micButton?: boolean }) {
  return (
    <div className="relative">
      <textarea
        {...props}
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400 resize-none pr-12"
        rows={3}
      />
      {micButton && (
        <button
          type="button"
          title="Voice to text"
          className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
        >
          <MicIcon />
        </button>
      )}
    </div>
  )
}
