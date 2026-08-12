import React from "react"
import { AppStatus } from "../../types/compounder"
import { STATUS_OPTS } from "../../data/compounderData"

export function StatusPill({ status }: { status: AppStatus | string }) {
  const opt = STATUS_OPTS.find(o => o.value === status || (status === "to-be-attended" && o.value === "T") || (status === "attended" && o.value === "A") || (status === "cancelled" && o.value === "C") || (status === "no-show" && o.value === "N")) || STATUS_OPTS[0]
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-700 border ${opt.color}`}>
      {opt.label}
    </span>
  )
}
