import React from "react"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"
import { MicIcon } from "../icons"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  noMic?: boolean
  language?: string
}

export function Input({ noMic = false, language = "en-IN", value, onChange, type = "text", className = "", ...props }: InputProps) {
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

  const isTextInputType = type === "text" || type === "search" || type === "tel" || type === "email" || !type
  const showMic = isTextInputType && !noMic && !props.disabled && !props.readOnly

  return (
    <div className="relative flex items-center w-full">
      <input
        {...props}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-colors placeholder:text-slate-400 ${
          showMic ? "pr-11" : ""
        } ${
          isListening ? "border-teal-500 bg-teal-50/30 ring-2 ring-teal-400/20" : "border-slate-200"
        } ${className}`}
      />
      {showMic && (
        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? "Listening... Click to stop" : "Click to dictate"}
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors flex items-center justify-center ${
            isListening
              ? "bg-red-500 text-white shadow-sm"
              : "text-slate-400 hover:text-teal-600 hover:bg-teal-50"
          }`}
        >
          {isListening ? (
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          ) : (
            <MicIcon size={16} />
          )}
        </button>
      )}
    </div>
  )
}
