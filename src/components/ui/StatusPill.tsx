import React from "react"
import { AppStatus } from "../../types/compounder"
import { STATUS_OPTS } from "../../data/compounderData"

export function StatusPill({ status }: { status: AppStatus }) {
  const opt = STATUS_OPTS.find(o => o.value === status)!
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-700 border ${opt.color}`}>
      {opt.label}
    </span>
  )
}
