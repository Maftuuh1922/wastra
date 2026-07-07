'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, X, Map as MapIcon, ChevronRight } from 'lucide-react'
import { mapPinsData, MapPin as MapPinType } from '@/lib/map-pins'

export function InteractiveBatikMap() {
  const [selectedPin, setSelectedPin] = useState<MapPinType | null>(null)

  return (
    <section className="relative w-full py-16 bg-card overflow-hidden border-y border-border">
      
      <div className="w-full max-w-7xl mx-auto px-5 md:px-8">
        
        {/* Header section */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal/10 text-teal rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <MapIcon className="w-4 h-4" />
            Eksplorasi Geografis
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground drop-shadow-sm">
            Peta Wastra Nusantara
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl font-medium mx-auto md:mx-0">
            Jelajahi kekayaan motif wastra dari seluruh penjuru Nusantara. Klik pada pin lokasi di peta untuk mempelajari motif khas daerah tersebut.
          </p>
        </div>

        {/* Map & Pins Container - Unified Coordinate System */}
        <div className="relative w-full max-w-5xl mx-auto mt-12 select-none pointer-events-auto">
          
          {/* Base Map Image - Establishes height naturally */}
          <Image 
            src="/images/peta.png"
            alt="Peta Indonesia"
            width={3009}
            height={1135}
            className="w-full h-auto opacity-70 dark:opacity-50"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />

          {/* Overlay for Pins - EXACTLY matching the image dimensions */}
          <div className="absolute inset-0 z-10">
            {mapPinsData.map((pin) => (
              <button
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                className="absolute w-6 h-6 md:w-8 md:h-8 -ml-3 -mt-3 md:-ml-4 md:-mt-4 rounded-full bg-teal/20 flex items-center justify-center cursor-pointer group hover:bg-teal transition-all duration-300"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                aria-label={`Lihat wastra dari ${pin.region}`}
              >
                <div className="w-2 h-2 md:w-3 md:h-3 bg-teal rounded-full group-hover:bg-card transition-all shadow-md" />
                
                {/* Tooltip on hover */}
                <div className="absolute top-8 md:top-10 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 md:px-3 py-1 md:py-1.5 rounded md:rounded-lg text-[10px] md:text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                  {pin.region}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      <div 
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm z-50 transition-all duration-500 flex items-center justify-center px-5 ${selectedPin ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSelectedPin(null)}
      >
        <div 
          className={`bg-card border border-border shadow-2xl rounded-3xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row transition-all duration-500 delay-100 ${selectedPin ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedPin && (
            <>
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-muted">
                <Image 
                  src={selectedPin.image} 
                  alt={selectedPin.motifName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-teal uppercase tracking-widest">{selectedPin.region}</span>
                  <button 
                    onClick={() => setSelectedPin(null)}
                    className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="font-serif text-3xl font-bold text-foreground mb-4">
                  {selectedPin.motifName}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {selectedPin.description}
                </p>

                <div className="mt-8">
                  <Link 
                    href="/#riset" 
                    onClick={() => setSelectedPin(null)}
                    className="inline-flex items-center text-sm font-bold text-foreground hover:text-teal transition-colors"
                  >
                    Pelajari lebih lanjut di Riset 
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
