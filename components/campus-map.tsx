"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Import the CampusMapProps interface
import type { CampusMapProps } from "@/types/room"

const buildingPositions: Record<string, { top: string; left: string }> = {
  "Main Building": { top: "30%", left: "50%" },
  "Talpur House": { top: "60%", left: "30%" },
  "Auxiliary Building": { top: "40%", left: "70%" },
  "IT Tower": { top: "20%", left: "80%" },
}

// Update the component definition with proper typing
export default function CampusMap({ buildings, selectedBuilding, onBuildingSelect, filteredRooms }: CampusMapProps) {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null)

  // Count rooms per building from filtered rooms
  const roomCounts = filteredRooms.reduce((acc: Record<string, number>, room) => {
    acc[room.building] = (acc[room.building] || 0) + 1
    return acc
  }, {})

  return (
    <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] bg-gray-950/80 rounded-[2.5rem] overflow-hidden border border-gray-800/50 shadow-2xl transition-all duration-700">
      {/* Map background with animated grid lines */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={`col-${i}`} className="border-r border-teal-500/30 h-full"></div>
          ))}
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={`row-${i}`} className="border-b border-teal-500/30 w-full"></div>
          ))}
      </div>

      {/* Campus paths */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="opacity-40">
          <path d="M 250,150 L 400,200 L 550,300 L 650,250" stroke="#8B5CF6" strokeWidth="4" fill="none" />
          <path d="M 400,200 L 350,350 L 500,400" stroke="#8B5CF6" strokeWidth="4" fill="none" />
          <path d="M 550,300 L 650,400" stroke="#8B5CF6" strokeWidth="4" fill="none" />
        </svg>
      </div>

      {/* Buildings */}
      {buildings.map((building) => (
        <div
          key={building}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
            selectedBuilding === building ? "scale-110 z-10" : "scale-100",
            hoveredBuilding === building ? "scale-105" : "",
          )}
          style={{
            top: buildingPositions[building]?.top || "50%",
            left: buildingPositions[building]?.left || "50%",
          }}
          onMouseEnter={() => setHoveredBuilding(building)}
          onMouseLeave={() => setHoveredBuilding(null)}
        >
          <Button
            variant={selectedBuilding === building ? "default" : "outline"}
            className={cn(
              "flex flex-col items-center p-1 sm:p-2 h-auto min-w-[80px] sm:min-w-[120px] border-2 shadow-lg transition-all duration-300 text-xs sm:text-sm",
              selectedBuilding === building
                ? "bg-purple-900/80 border-purple-500/80 text-white"
                : "bg-gray-800/70 border-gray-700/50 text-gray-300 hover:bg-gray-700/70 hover:border-purple-500/50",
              hoveredBuilding === building ? "shadow-xl" : "",
            )}
            onClick={() => onBuildingSelect(building === selectedBuilding ? "all" : building)}
          >
            <div className="flex items-center mb-1">
              <div
                className={cn(
                  "p-1 rounded-full mr-1 sm:mr-1.5 transition-colors shadow-inner",
                  selectedBuilding === building ? "bg-purple-800" : "bg-gray-700",
                )}
              >
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-purple-300" />
              </div>
              <span className="text-xs font-bold">{building}</span>
            </div>
            {roomCounts[building] > 0 && (
              <span className="text-[10px] sm:text-xs bg-teal-900/70 px-1 sm:px-2 py-0.5 rounded-full shadow-inner">
                {roomCounts[building]} rooms
              </span>
            )}
          </Button>
        </div>
      ))}

      {/* Compass */}
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 glass-effect backdrop-blur-sm p-1 sm:p-2 rounded-full border border-gray-700/50 shadow-lg">
        <svg width="30" height="30" viewBox="0 0 40 40" className="sm:w-[40px] sm:h-[40px]">
          <circle cx="20" cy="20" r="18" fill="none" stroke="#6B7280" strokeWidth="1" />
          <path d="M20,2 L20,6" stroke="#F59E0B" strokeWidth="2" />
          <path d="M20,34 L20,38" stroke="#6B7280" strokeWidth="2" />
          <path d="M2,20 L6,20" stroke="#6B7280" strokeWidth="2" />
          <path d="M34,20 L38,20" stroke="#6B7280" strokeWidth="2" />
          <text x="20" y="10" textAnchor="middle" fill="#F59E0B" fontSize="8">
            N
          </text>
          <text x="20" y="36" textAnchor="middle" fill="#6B7280" fontSize="8">
            S
          </text>
          <text x="36" y="22" textAnchor="middle" fill="#6B7280" fontSize="8">
            E
          </text>
          <text x="4" y="22" textAnchor="middle" fill="#6B7280" fontSize="8">
            W
          </text>
        </svg>
      </div>

      {/* Map legend */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 glass-effect backdrop-blur-sm p-2 sm:p-3 rounded-lg border border-gray-700/50 text-[10px] sm:text-xs shadow-lg">
        <div className="font-semibold mb-1 sm:mb-2 text-gray-300">Legend</div>
        <div className="flex items-center text-gray-400 mb-1 sm:mb-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-900/80 border border-purple-500/80 rounded-sm mr-1 sm:mr-2"></div>
          <span>Selected Building</span>
        </div>
        <div className="flex items-center text-gray-400">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-800/70 border border-gray-700/50 rounded-sm mr-1 sm:mr-2"></div>
          <span>Building</span>
        </div>
      </div>
    </div>
  )
}

