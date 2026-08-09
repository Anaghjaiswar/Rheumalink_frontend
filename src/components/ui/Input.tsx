import React from "react"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"
import { MicIcon } from "../icons"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  micButton?: boolean
  language?: string
}

export function Input({ micButton = false, language = "en-IN", value, onChange, ...props }: InputProps) {
  const currentValue = typeof value === "string" ? value : ""

  const handleSpeechUpdate = (newText: string) => {
    if (onChange) {
      const event = {
        target: { value: newText },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(event)
    }
  }

  const { isListening, toggleListening } = useSpeechRecognition(currentValue, handleSpeechUpdate, language)

  if (!micButton) {
    return (
      <input
        {...props}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400"
      />
    )
  }

  return (
    <div className="relative flex items-center">
      <input
        {...props}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400 pr-12 ${
          isListening ? "border-red-500 bg-red-50/20 animate-pulse" : "border-slate-200"
        }`}
      />
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? "Listening... Click to stop" : "Click to dictate"}
        className={`absolute right-3 p-2 rounded-lg transition-colors ${
          isListening
            ? "bg-red-500 text-white animate-bounce shadow-md shadow-red-500/40"
            : "bg-teal-50 text-teal-600 hover:bg-teal-100"
        }`}
      >
        <MicIcon size={16} />
      </button>
    </div>
  )
}
