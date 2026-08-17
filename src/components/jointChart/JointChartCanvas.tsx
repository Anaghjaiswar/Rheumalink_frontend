import React, { useRef, useState, useEffect } from "react"
import { JointState } from "../../types/jointChart"
import { JOINT_SPOTS, CIRCLE_IMAGES } from "../../data/jointChartData"

export function JointChartCanvas({
  jointStates,
  onToggleJoint,
  onJointClick,
}: {
  jointStates: Record<string, JointState>
  onToggleJoint?: (cbelId: string, prefix: number) => void
  onJointClick?: (cbelId: string, prefix: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number>(0.75)

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        // Leave comfortable padding and cap at clean max width
        const availableWidth = Math.min(width - 24, 600)
        const computedScale = Math.max(Math.min(availableWidth / 725, 0.9), 0.42)
        setScale(computedScale)
      }
    }

    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [])

  const handleToggle = (cbelId: string, prefix: number) => {
    if (onToggleJoint) onToggleJoint(cbelId, prefix)
    else if (onJointClick) onJointClick(cbelId, prefix)
  }

  const getBackgroundImage = (cbelId: string, prefix: number) => {
    const state = jointStates[cbelId] || "nopain"
    if (state === "red") return CIRCLE_IMAGES.red(prefix)
    if (state === "blue") return CIRCLE_IMAGES.blue(prefix)
    if (state === "orange") return CIRCLE_IMAGES.orange(prefix)
    return CIRCLE_IMAGES.nopain
  }

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="mb-4 text-center">
        <h3 className="font-800 text-slate-800 text-lg sm:text-xl">Swollen Joint Count (44 Joints)</h3>
        <p className="text-slate-500 font-500 text-xs sm:text-sm mt-1">
          Click any joint circle to toggle pain &amp; swelling status.
        </p>
      </div>

      {/* Responsive Scaled Canvas Container */}
      <div
        className="relative select-none mx-auto overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/50 shadow-inner"
        style={{
          width: `${Math.round(725 * scale)}px`,
          height: `${Math.round(1100 * scale)}px`,
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: "725px",
            height: "1100px",
            transform: `scale(${scale})`,
          }}
        >
          {/* Main Skeleton Homunculus GIF at exact natural 725x1100 dimensions */}
          <img
            src="/images/joints/hd_hglt.gif"
            alt="homunculus"
            className="absolute left-0 top-0 w-[725px] h-[1100px] pointer-events-none"
          />

          {/* 'R' Right Side Marker */}
          <div className="absolute left-[80px] top-[65px] h-[55px] w-[55px] pointer-events-none z-0">
            <h1 className="text-[55px] leading-none font-bold text-slate-800 opacity-80 m-0">R</h1>
          </div>

          {/* Floating Color Legend Box */}
          <div className="absolute right-[10px] top-[15px] z-10 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-md w-52">
              <h4 className="font-800 text-slate-800 text-xs mb-2">Color Descriptions:</h4>
              <div className="space-y-1.5 text-[11px] font-700">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block shrink-0 shadow-2xs" />
                  <span>Swollen (Red)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shrink-0 shadow-2xs" />
                  <span>Tender (Blue)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shrink-0 shadow-2xs" />
                  <span>Both (Orange)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-white border border-slate-400 inline-block shrink-0" />
                  <span>No Pain</span>
                </div>
              </div>
            </div>
          </div>

          {/* 44 Absolute Positioned Joint Hotspots */}
          {JOINT_SPOTS.map(spot => {
            const bgImg = getBackgroundImage(spot.cbelId, spot.prefix)
            const state = jointStates[spot.cbelId] || "nopain"

            return (
              <div
                key={spot.id}
                id={spot.id}
                onClick={() => handleToggle(spot.cbelId, spot.prefix)}
                title={`${spot.label}: ${state}`}
                style={{
                  position: "absolute",
                  left: `${spot.left}px`,
                  top: `${spot.top}px`,
                  width: `${spot.width}px`,
                  height: `${spot.height}px`,
                  backgroundImage: state !== "nopain" ? `url('${bgImg}')` : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  cursor: "pointer",
                  zIndex: 5,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
