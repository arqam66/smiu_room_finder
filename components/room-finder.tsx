"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Building, Layers, X, Github, ChevronRight } from "lucide-react"
import CampusMap from "./campus-map"
import RoomList from "./room-list"
import { roomData } from "@/lib/room-data"
import { Input } from "@/components/ui/input"
import RoomDetailModal from "./room-detail-modal"
// Import the Room type
import type { Room } from "@/types/room"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function RoomFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Room[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Get unique buildings
  const buildings = [...new Set(roomData.map((room) => room.building))]

  // Filter rooms based on building selection
  const filteredRooms = roomData.filter((room) => {
    return selectedBuilding === "" || room.building === selectedBuilding
  })

  // Update search results whenever search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = roomData.filter(
      (room) =>
        room.id.toLowerCase().includes(query) ||
        room.building.toLowerCase().includes(query) ||
        room.type.toLowerCase().includes(query) ||
        room.floor.toLowerCase().includes(query),
    )

    setSearchResults(results)
  }, [searchQuery])

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const handleBuildingSelect = (building: string) => {
    setSelectedBuilding(building === selectedBuilding ? "" : building)
  }

  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#05070a] text-gray-100 selection:bg-purple-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Header with futuristic overlay */}
      <div className="relative w-full h-[40vh] min-h-[300px] overflow-hidden">
        <Image 
          src="/images/university-building.png" 
          alt="University Building" 
          fill 
          className="object-cover scale-110 blur-[2px] opacity-60" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
          <div className="space-y-4 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-4">
              Campus Intelligence v2.0
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none">
              SMIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-teal-300 to-purple-500 animate-gradient-x">FINDER</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
              Navigate the infrastructure with precision. Real-time classroom telemetry and spatial mapping.
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 -mt-20 relative z-20 pb-20">
        {/* Futuristic Search Command Bar */}
        <div className="max-w-3xl mx-auto mb-12 group">
          <div className="relative glass-effect p-2 rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 group-focus-within:border-purple-500/50 group-focus-within:shadow-purple-500/20 group-focus-within:scale-[1.02]">
            <div ref={searchRef} className="relative flex items-center">
              <Search className="absolute left-4 h-6 w-6 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <Input
                type="text"
                placeholder="Search coordinates (e.g. LAB-01, IT TOWER...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchResults(true)
                }}
                className="bg-transparent border-none text-white h-16 pl-14 pr-10 text-xl font-bold placeholder:text-gray-600 focus-visible:ring-0"
                onFocus={() => setShowSearchResults(true)}
              />
              <div className="absolute right-4 px-2 py-1 rounded-md bg-gray-800 text-[10px] font-black text-gray-500 border border-gray-700">
                ESC
              </div>
            </div>

            {/* Futuristic Search Results Dropdown */}
            {showSearchResults && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-4 glass-effect rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-top-4 duration-300 z-[100]">
                {searchResults.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <div className="text-lg font-bold mb-1">No matches in sector</div>
                    <div className="text-xs">Verify your search query</div>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                    {searchResults.map((room) => (
                      <button
                        key={room.id}
                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/10"
                        onClick={() => handleRoomSelect(room)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gray-900 group-hover/item:bg-purple-600 transition-colors">
                            <Layers className="h-5 w-5 text-purple-400 group-hover/item:text-white" />
                          </div>
                          <div className="text-left">
                            <div className="text-lg font-black text-white">{room.id}</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{room.building} • {room.floor}</div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-700 group-hover/item:text-purple-400 group-hover/item:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid: Sticky Sidebar + Large Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <div className="glass-effect rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Building className="h-20 w-20" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                  <span className="h-8 w-1.5 bg-teal-500 rounded-full" />
                  Inventory
                </h2>
                <RoomList rooms={filteredRooms} onRoomSelect={handleRoomSelect} selectedBuilding={selectedBuilding} />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="glass-effect rounded-[2rem] p-8 border border-white/5 shadow-2xl">
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <span className="h-8 w-1.5 bg-purple-500 rounded-full" />
                Spatial Mapping
              </h2>
              <CampusMap
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                onBuildingSelect={handleBuildingSelect}
                filteredRooms={filteredRooms}
              />
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-auto py-12 px-6 glass-effect border-t border-white/5">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-2xl font-black text-white mb-2 tracking-tight">SMIT ROOM FINDER</div>
            <p className="text-gray-500 text-sm font-medium">Empowering students with spatial awareness.</p>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/arqam66" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-gray-900 border border-white/5 hover:border-purple-500/50 transition-all text-gray-400 hover:text-purple-400 shadow-xl">
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>

      {isModalOpen && selectedRoom && (
        <RoomDetailModal room={selectedRoom} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}

