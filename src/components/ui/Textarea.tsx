import React from "react"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"
import { MicIcon } from "../icons"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  noMic?: boolean
  micButton?: boolean
  language?: string
}

export function Textarea({ noMic = false, micButton, language = "en-IN", value, onChange, className = "", ...props }: TextareaProps) {
  const currentValue = typeof value === "string" ? value : ""

  const handleSpeechUpdate = (newText: string) => {
    if (onChange) {
      const event = {
        target: { value: newText },
      } as React.ChangeEvent<HTMLTextAreaElement>
      onChange(event)
    }
  }

  const { isListening, toggleListening } = useSpeechRecognition(currentValue, handleSpeechUpdate, language)

  const showMic = !noMic && !props.disabled && !props.readOnly

  return (
    <div className="relative w-full">
      <textarea
        {...props}
        value={value}
        onChange={onChange}
        rows={props.rows || 3}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-colors placeholder:text-slate-400 resize-none ${
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
          className={`absolute right-3.5 bottom-3.5 p-1.5 rounded-lg transition-colors flex items-center justify-center ${
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
