"use client"

import { useState } from "react"
import { DoorOpenIcon as Door, ChevronRight, Search, Building, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

// Import the Room type and RoomListProps interface
import type { Room, RoomListProps } from "@/types/room"

export default function RoomList({ rooms, onRoomSelect, selectedBuilding }: RoomListProps) {
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(selectedBuilding || null)

  const groupedRooms = rooms.reduce((acc: Record<string, Record<string, Room[]>>, room) => {
    if (!acc[room.building]) acc[room.building] = {}
    if (!acc[room.building][room.floor]) acc[room.building][room.floor] = []
    acc[room.building][room.floor].push(room)
    return acc
  }, {})

  if (selectedBuilding && selectedBuilding !== expandedBuilding) {
    setExpandedBuilding(selectedBuilding)
  }

  const toggleBuilding = (building: string) => {
    setExpandedBuilding(expandedBuilding === building ? null : building)
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in zoom-in-95 duration-700">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-full" />
          <Search className="h-20 w-20 text-purple-500/40 relative z-10" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">System Empty</h3>
        <p className="text-gray-500 text-sm max-w-[240px] mx-auto leading-relaxed">
          No coordinates match your current spectral scan. Try adjusting your parameters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-y-auto max-h-[650px] pr-2 custom-scrollbar scroll-smooth p-1">
      {/* Dynamic Summary Bento */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-16 w-16 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all" />
          <div className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-black mb-1">Active Rooms</div>
          <div className="text-3xl font-black text-white tracking-tighter">{rooms.length}</div>
        </div>
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-16 w-16 bg-teal-600/10 rounded-full blur-2xl group-hover:bg-teal-600/20 transition-all" />
          <div className="text-[10px] uppercase tracking-[0.2em] text-teal-400 font-black mb-1">Zones</div>
          <div className="text-3xl font-black text-white tracking-tighter">{Object.keys(groupedRooms).length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {Object.keys(groupedRooms).map((building, index) => {
          const isExpanded = expandedBuilding === building
          const totalRooms = Object.values(groupedRooms[building]).flat().length

          return (
            <div
              key={building}
              className={cn(
                "relative group transition-all duration-500 rounded-[2rem] overflow-hidden border-2",
                isExpanded
                  ? "bg-gray-900/90 border-purple-500/40 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                  : "bg-gray-900/40 border-gray-800/80 hover:border-purple-500/30",
              )}
            >
              {isExpanded && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              )}

              <button
                className={cn(
                  "w-full flex items-center justify-between p-6 text-left transition-all",
                  isExpanded ? "bg-purple-900/10" : "hover:bg-purple-900/5",
                )}
                onClick={() => toggleBuilding(building)}
              >
                <div className="flex items-center gap-5">
                  <div
                    className={cn(
                      "flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 shadow-2xl",
                      isExpanded
                        ? "bg-gradient-to-br from-purple-500 to-purple-700 text-white rotate-[10deg] scale-110"
                        : "bg-gray-800 text-gray-400 group-hover:rotate-6",
                    )}
                  >
                    <Building className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-gray-100 tracking-tight leading-none mb-1">{building}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-1.5 w-1.5 rounded-full bg-teal-500 border border-gray-900" />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {totalRooms} Access Points
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500",
                    isExpanded ? "bg-purple-500 text-white rotate-90" : "bg-gray-800/50 text-gray-600 group-hover:text-gray-300",
                  )}
                >
                  <ChevronRight className="h-6 w-6" />
                </div>
              </button>

              {isExpanded && (
                <div className="p-6 pt-0 space-y-8 animate-in slide-in-from-top-4 duration-500">
                  {Object.keys(groupedRooms[building])
                    .sort()
                    .map((floor) => (
                      <div key={floor} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/30 text-[10px] font-black text-teal-400 uppercase tracking-widest">
                            {floor}
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-gray-800 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {groupedRooms[building][floor].map((room) => (
                            <button
                              key={room.id}
                              className="group/room relative flex items-center p-4 rounded-2xl bg-gray-950/50 border border-gray-800/80 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl text-left overflow-hidden"
                              onClick={() => onRoomSelect(room)}
                            >
                              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/room:opacity-100 transition-opacity">
                                <ChevronRight className="h-3 w-3 text-purple-400" />
                              </div>
                              <div className="flex items-center gap-4 w-full">
                                <div className="p-2.5 rounded-xl bg-gray-900 group-hover/room:bg-purple-600/20 transition-all">
                                  <Door className="h-5 w-5 text-amber-400 group-hover/room:text-purple-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-black text-lg text-white group-hover/room:text-purple-100 transition-colors">
                                    {room.id}
                                  </div>
                                  <div className="text-[10px] text-gray-500 group-hover/room:text-purple-400/70 font-bold uppercase tracking-tight">
                                    {room.type}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


