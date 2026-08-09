import { JointSpot, JointChartRecord } from "../types/jointChart"

export interface ExtendedJointSpot extends JointSpot {
  bgCover?: boolean
}

export const JOINT_SPOTS: ExtendedJointSpot[] = [
  { id: "2divacromioclavicularright", cbelId: "acromioclavicularright", prefix: 2, left: 278, top: 145, width: 44, height: 44, label: "Right Acromioclavicular" },
  { id: "2divacromioclavicularleft", cbelId: "acromioclavicularleft", prefix: 2, left: 418, top: 145, width: 44, height: 44, label: "Left Acromioclavicular" },
  { id: "2divsternoclavicularright", cbelId: "sternoclavicularright", prefix: 2, left: 324, top: 169, width: 44, height: 44, label: "Right Sternoclavicular" },
  { id: "2divsternoclavicularleft", cbelId: "sternoclavicularleft", prefix: 2, left: 372, top: 169, width: 44, height: 44, label: "Left Sternoclavicular" },
  { id: "3divshoulderright", cbelId: "shoulderright", prefix: 3, left: 234, top: 174, width: 58, height: 58, label: "Right Shoulder" },
  { id: "3divshoulderleft", cbelId: "shoulderleft", prefix: 3, left: 448, top: 174, width: 58, height: 58, label: "Left Shoulder" },
  { id: "4divelbowright", cbelId: "elbowright", prefix: 4, left: 227, top: 310, width: 66, height: 66, label: "Right Elbow" },
  { id: "4divelbowleft", cbelId: "elbowleft", prefix: 4, left: 447, top: 310, width: 66, height: 66, label: "Left Elbow" },
  { id: "4divwristright", cbelId: "wristright", prefix: 4, left: 194, top: 446, width: 66, height: 66, label: "Right Wrist" },
  { id: "4divwristleft", cbelId: "wristleft", prefix: 4, left: 479, top: 446, width: 66, height: 66, label: "Left Wrist" },

  // PIP & MCP Joints
  { id: "1divpip5right", cbelId: "pip5right", prefix: 1, left: 125, top: 487, width: 33, height: 34, label: "Right PIP 5" },
  { id: "1divpip5left", cbelId: "pip5left", prefix: 1, left: 581, top: 487, width: 33, height: 34, label: "Left PIP 5" },
  { id: "1divpip4right", cbelId: "pip4right", prefix: 1, left: 148, top: 518, width: 33, height: 34, label: "Right PIP 4" },
  { id: "1divpip4left", cbelId: "pip4left", prefix: 1, left: 558, top: 518, width: 33, height: 34, label: "Left PIP 4" },
  { id: "1divmcp5right", cbelId: "mcp5right", prefix: 1, left: 82, top: 522, width: 33, height: 34, label: "Right MCP 5" },
  { id: "1divmcp5left", cbelId: "mcp5left", prefix: 1, left: 622, top: 522, width: 33, height: 34, label: "Left MCP 5" },
  { id: "1divpip3right", cbelId: "pip3right", prefix: 1, left: 174, top: 544, width: 33, height: 34, label: "Right PIP 3" },
  { id: "1divpip3left", cbelId: "pip3left", prefix: 1, left: 533, top: 544, width: 33, height: 34, label: "Left PIP 3" },
  { id: "1divmcp4right", cbelId: "mcp4right", prefix: 1, left: 103, top: 567, width: 33, height: 34, label: "Right MCP 4" },
  { id: "1divmcp4left", cbelId: "mcp4left", prefix: 1, left: 604, top: 567, width: 33, height: 34, label: "Left MCP 4" },
  { id: "1divpip2right", cbelId: "pip2right", prefix: 1, left: 202, top: 571, width: 33, height: 34, label: "Right PIP 2" },
  { id: "1divpip2left", cbelId: "pip2left", prefix: 1, left: 507, top: 571, width: 33, height: 34, label: "Left PIP 2" },
  { id: "1divpip1right", cbelId: "pip1right", prefix: 1, left: 225, top: 598, width: 33, height: 34, label: "Right PIP 1" },
  { id: "1divpip1left", cbelId: "pip1left", prefix: 1, left: 483, top: 598, width: 33, height: 34, label: "Left PIP 1" },
  { id: "1divmcp3right", cbelId: "mcp3right", prefix: 1, left: 129, top: 598, width: 33, height: 34, label: "Right MCP 3" },
  { id: "1divmcp3left", cbelId: "mcp3left", prefix: 1, left: 577, top: 598, width: 33, height: 34, label: "Left MCP 3" },
  { id: "1divmcp2right", cbelId: "mcp2right", prefix: 1, left: 164, top: 620, width: 33, height: 34, label: "Right MCP 2" },
  { id: "1divmcp2left", cbelId: "mcp2left", prefix: 1, left: 542, top: 620, width: 33, height: 34, label: "Left MCP 2" },
  { id: "1divmcp1right", cbelId: "mcp1right", prefix: 1, left: 212, top: 640, width: 33, height: 34, label: "Right MCP 1" },
  { id: "1divmcp1left", cbelId: "mcp1left", prefix: 1, left: 495, top: 640, width: 33, height: 34, label: "Left MCP 1" },

  // Knees & Ankles
  { id: "4divkneeright", cbelId: "kneeright", prefix: 4, left: 276, top: 654, width: 71, height: 71, label: "Right Knee", bgCover: true },
  { id: "4divkneeleft", cbelId: "kneeleft", prefix: 4, left: 393, top: 654, width: 71, height: 71, label: "Left Knee", bgCover: true },
  { id: "3divankleright", cbelId: "ankleright", prefix: 3, left: 280, top: 823, width: 58, height: 58, label: "Right Ankle" },
  { id: "3divankleleft", cbelId: "ankleleft", prefix: 3, left: 403, top: 821, width: 58, height: 58, label: "Left Ankle" },

  // MTP Joints
  { id: "1divmtp5right", cbelId: "mtp5right", prefix: 1, left: 123, top: 950, width: 39, height: 39, label: "Right MTP 5", bgCover: true },
  { id: "1divmtp5left", cbelId: "mtp5left", prefix: 1, left: 579, top: 947, width: 39, height: 39, label: "Left MTP 5", bgCover: true },
  { id: "1divmtp4right", cbelId: "mtp4right", prefix: 1, left: 162, top: 971, width: 33, height: 34, label: "Right MTP 4" },
  { id: "1divmtp4left", cbelId: "mtp4left", prefix: 1, left: 544, top: 968, width: 33, height: 34, label: "Left MTP 4" },
  { id: "1divmtp3right", cbelId: "mtp3right", prefix: 1, left: 196, top: 988, width: 33, height: 34, label: "Right MTP 3" },
  { id: "1divmtp3left", cbelId: "mtp3left", prefix: 1, left: 511, top: 985, width: 33, height: 34, label: "Left MTP 3" },
  { id: "1divmtp2right", cbelId: "mtp2right", prefix: 1, left: 231, top: 995, width: 33, height: 34, label: "Right MTP 2" },
  { id: "1divmtp1right", cbelId: "mtp1right", prefix: 1, left: 266, top: 994, width: 33, height: 34, label: "Right MTP 1" },
  { id: "1divmtp1left", cbelId: "mtp1left", prefix: 1, left: 442, top: 991, width: 33, height: 34, label: "Left MTP 1" },
  { id: "1divmtp2left", cbelId: "mtp2left", prefix: 1, left: 477, top: 992, width: 33, height: 34, label: "Left MTP 2" },
]

export const CIRCLE_IMAGES = {
  red: (prefix: number) => `/images/joints/redcircle${prefix}.png`,
  blue: (prefix: number) => `/images/joints/bluecircle${prefix}.png`,
  orange: (prefix: number) => `/images/joints/orangecircle${prefix}.png`,
  nopain: `/images/joints/transparent.png`,
}

export const SAMPLE_RECENT_CHARTS: JointChartRecord[] = [
  { id: "1", recordedAt: "08 Aug 2026 10:30 AM", swollen: 5, tender: 10 },
  { id: "2", recordedAt: "12 Jul 2026 02:15 PM", swollen: 8, tender: 14 },
  { id: "3", recordedAt: "05 Jun 2026 11:00 AM", swollen: 3, tender: 6 },
]
