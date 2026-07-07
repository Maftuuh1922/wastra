'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { MapPin, X, Map as MapIcon, ChevronRight } from 'lucide-react'
import { mapPinsData, MapPin as MapPinType } from '@/lib/map-pins'

// A rough 100x30 text map of Indonesia to generate particles from
const mapGrid = [
  "                                                                                                    ",
  "                                                                                                    ",
  "   ###                                                                                              ",
  "  #####                                   ##                                                        ",
  "  ######                                 ####                                     #                 ",
  "   ######                              ########                                  ###                ",
  "   #######                            ##########                 ##              ###          ##    ",
  "    #######                           ###########               ####             ###         ####   ",
  "     #######         ##               ###########              ######            ##         ######  ",
  "      ######        ####              ###########              ######                       ####### ",
  "       ######      ######              #########              ########                     ######## ",
  "        ####       ######               #######               #######                      ######## ",
  "                    ####                 #####                 #####                        ######  ",
  "                                                                                             ####   ",
  "                                                                                              ##    ",
  "           ###                 #####                  ###                  ###                      ",
  "          #####              #########               #####                #####                     ",
  "         #######           #############            #######              #######                    ",
  "         #################################         #########            #########                   ",
  "          ###############################           #######              #######                    ",
  "            ###########################              #####                #####                     ",
  "                ###################                   ###                  ###                      ",
  "                                                                                                    ",
  "                                                                                                    "
];

const chars = ['B', 'A', 'T', 'I', 'K', '*', '#', '+', '=', '%', ':', '.']

export function InteractiveBatikMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPin, setSelectedPin] = useState<MapPinType | null>(null)
  
  // ASCII Particle Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.width = canvas.offsetWidth
    let height = canvas.height = canvas.offsetHeight

    // Setup particles
    let particles: any[] = []
    
    const initParticles = () => {
      particles = []
      // We want the map to fit inside the canvas.
      // mapGrid is 100 cols x 24 rows
      const cols = 100
      const rows = 24
      
      // Calculate spacing so the map fits beautifully in the center
      const isMobile = width < 768
      const scaleX = isMobile ? width / cols : (width * 0.8) / cols
      const scaleY = isMobile ? (height * 0.5) / rows : (height * 0.7) / rows
      
      const spacing = Math.min(scaleX, scaleY)
      
      const mapWidth = cols * spacing
      const mapHeight = rows * spacing
      
      const offsetX = (width - mapWidth) / 2
      const offsetY = (height - mapHeight) / 2

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (mapGrid[r][c] !== ' ') {
            // Randomly decide to drop some characters to make it look like a constellation/mesh
            if (Math.random() > 0.8) continue;
            
            const x = offsetX + c * spacing
            const y = offsetY + r * spacing
            
            particles.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              char: chars[Math.floor(Math.random() * chars.length)],
              // Dark teal/greenish colors for the particles
              color: Math.random() > 0.5 ? 'rgba(20, 184, 166, 0.4)' : 'rgba(153, 246, 228, 0.2)',
              size: Math.random() * 6 + 8 // 8px to 14px
            })
          }
        }
      }
    }

    initParticles()

    let mouse = { x: -1000, y: -1000, radius: 100 }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      initParticles()
    })
    
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i]

        // Distance to mouse
        let dx = mouse.x - p.x
        let dy = mouse.y - p.y
        let distance = Math.sqrt(dx * dx + dy * dy)

        // Mouse repel force
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          const force = (mouse.radius - distance) / mouse.radius
          
          const pushX = forceDirectionX * force * 5
          const pushY = forceDirectionY * force * 5
          
          p.vx -= pushX
          p.vy -= pushY
        }

        // Spring back to origin
        p.vx += (p.originX - p.x) * 0.05 // Spring constant
        p.vy += (p.originY - p.y) * 0.05
        
        // Damping (Friction)
        p.vx *= 0.85
        p.vy *= 0.85

        p.x += p.vx
        p.y += p.vy

        // Render particle
        ctx.font = \`\${p.size}px monospace\`
        ctx.fillStyle = p.color
        
        // Highlight particle if it's currently displaced significantly
        const displacement = Math.abs(p.x - p.originX) + Math.abs(p.y - p.originY)
        if (displacement > 5) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.font = \`bold \${p.size + 2}px monospace\`
        }

        ctx.fillText(p.char, p.x, p.y)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section className="relative w-full h-[800px] bg-card overflow-hidden border-y border-border">
      {/* The interactive ASCII background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0 cursor-crosshair"
      />

      {/* Foreground Container for Title and Pins */}
      <div className="absolute inset-0 w-full h-full max-w-7xl mx-auto px-5 md:px-8 pointer-events-none">
        
        <div className="pt-16 pb-8 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal/10 text-teal rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <MapIcon className="w-4 h-4" />
            Eksplorasi Geografis
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
            Peta Wastra Nusantara
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Arahkan kursor Anda ke lautan kode ASCII untuk melihat ombak data, dan klik pin lokasi untuk mempelajari motif wastra dari seluruh penjuru Nusantara.
          </p>
        </div>

        {/* Pins Container - Coordinates map directly to percentage of this container */}
        <div className="relative w-full h-[600px] mt-8 pointer-events-auto">
          {mapPinsData.map((pin) => (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-teal/20 flex items-center justify-center cursor-pointer group hover:bg-teal transition-all duration-300"
              style={{ left: \`\${pin.x}%\`, top: \`\${pin.y}%\` }}
              aria-label={\`Lihat wastra dari \${pin.region}\`}
            >
              <div className="w-3 h-3 bg-teal rounded-full group-hover:bg-card group-hover:scale-150 transition-all shadow-[0_0_15px_rgba(20,184,166,0.8)]" />
              
              {/* Tooltip on hover */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                {pin.region}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal Overlay */}
      <div 
        className={\`absolute inset-0 bg-background/80 backdrop-blur-sm z-50 transition-all duration-500 flex items-center justify-center px-5 \${selectedPin ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}\`}
        onClick={() => setSelectedPin(null)}
      >
        <div 
          className={\`bg-card border border-border shadow-2xl rounded-3xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row transition-all duration-500 delay-100 \${selectedPin ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}\`}
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
