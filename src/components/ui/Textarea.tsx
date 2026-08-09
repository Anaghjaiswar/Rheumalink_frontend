import React from "react"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"
import { MicIcon } from "../icons"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  micButton?: boolean
  language?: string
}

export function Textarea({ micButton = false, language = "en-IN", value, onChange, ...props }: TextareaProps) {
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

  return (
    <div className="relative">
      <textarea
        {...props}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 text-slate-800 text-base font-500 focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-slate-400 resize-none pr-12 ${
          isListening ? "border-red-500 bg-red-50/20 animate-pulse" : "border-slate-200"
        }`}
        rows={props.rows || 3}
      />
      {micButton && (
        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? "Listening... Click to stop" : "Click to dictate"}
          className={`absolute right-3 bottom-3 p-2 rounded-lg transition-colors ${
            isListening
              ? "bg-red-500 text-white animate-bounce shadow-md shadow-red-500/40"
              : "bg-teal-50 text-teal-600 hover:bg-teal-100"
          }`}
        >
          <MicIcon size={16} />
        </button>
      )}
    </div>
  )
}
