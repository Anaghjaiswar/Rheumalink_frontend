import React from "react"
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-x-auto">
      {/* Header */}
      <div className="mb-5 text-center">
        <h3 className="font-800 text-slate-800 text-xl">Swollen Joint Count (44 Joints)</h3>
        <p className="text-slate-500 font-500 text-sm mt-1">
          Click a joint area to cycle through swelling and tenderness states.
        </p>
      </div>

      {/* Fixed 725px x 1100px Stage matching hd_hglt.gif natural size */}
      <div className="relative w-[725px] h-[1100px] mx-auto text-left flex-shrink-0 select-none">
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
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3.5 shadow-md w-56">
            <h4 className="font-800 text-slate-800 text-sm mb-2">Color Descriptions:</h4>
            <div className="space-y-1.5 text-xs font-600">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block" />
                <span>Swollen</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 inline-block" />
                <span>Tender</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" />
                <span>Both Swollen and Tender</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-700 inline-block" />
                <span>No Pain</span>
              </div>
            </div>
          </div>
        </div>

        {/* 44 Absolute Positioned Joint Hotspots with Perfect Center Alignment */}
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
  )
}
