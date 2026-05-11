"use client"

import { MapPin, Info, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Import the Room type and RoomDetailModalProps interface
import type { RoomDetailModalProps } from "@/types/room"

// Update the component definition with proper typing
export default function RoomDetailModal({ room, isOpen, onClose }: RoomDetailModalProps) {
  if (!room) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg sm:max-w-xl animate-in zoom-in-95 duration-500">
        <div className="relative group overflow-hidden rounded-[2.5rem] glass-effect border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
          {/* Animated Scan Line */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent h-1/2 -translate-y-full animate-scan pointer-events-none" />
          
          <div className="relative z-10 p-8 sm:p-12">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Sector Identified</div>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">{room.id}</h2>
              </div>
              <Button
                variant="ghost"
                className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-gray-900/60 border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Navigation</span>
                </div>
                <div>
                  <div className="text-xl font-black text-white">{room.building}</div>
                  <div className="text-sm font-bold text-gray-400 opacity-60 uppercase">{room.floor}</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gray-900/60 border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-600/20 text-teal-400">
                    <Info className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Classification</span>
                </div>
                <div>
                  <div className="text-xl font-black text-white">{room.type}</div>
                  <div className="text-sm font-bold text-gray-400 opacity-60 uppercase">Protocol: Active</div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-8 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-purple-900/20 transition-all active:scale-95"
              onClick={onClose}
            >
              Close Transmission
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

