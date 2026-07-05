'use client'

import { useRef, useState, useEffect } from 'react'
import { Camera, Loader2, RotateCcw, Zap, ZapOff, SwitchCamera, Scan, Search, ArrowRight, X } from 'lucide-react'

type DetectState = 'idle' | 'camera_active' | 'analyzing' | 'done_live' | 'camera_error' | 'detail_view'

// Bounding boxes as % of image dimensions (simulated detections)
const detections = [
  { label: 'Parang', confidence: 94, x: 25, y: 15, w: 50, h: 70, desc: 'Motif parang memiliki makna petuah untuk tidak pernah menyerah, ibarat ombak laut yang tak pernah berhenti bergerak. Cocok dipakai untuk acara formal dan keseharian.' },
  { label: 'Kawung', confidence: 91, x: 27, y: 8, w: 23, h: 84, desc: 'Motif kawung bermakna kesempurnaan, kemurnian, dan kesucian.' },
]

export function MultiMotifDetector({ onFallback }: { onFallback?: () => void }) {
  const [state, setState] = useState<DetectState>('idle')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [bestDetection, setBestDetection] = useState(detections[0])
  const [flashOn, setFlashOn] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Start camera on mount
  useEffect(() => {
    startCamera(facingMode)
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async (mode = 'environment') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode } // Prefer rear camera if available
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setState('camera_active')
      
      // Simulate Auto-Detect after 2.5 seconds
      setTimeout(() => {
        if (streamRef.current) {
          setState('analyzing')
          setTimeout(() => {
             setState('done_live')
          }, 1500)
        }
      }, 2500)
    } catch (err) {
      console.error('Camera access denied or unavailable', err)
      setState('camera_error')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const viewDetail = async (det: typeof detections[0]) => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    
    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/png')
      stopCamera()
      setImageSrc(dataUrl)
      setBestDetection(det)
      setState('analyzing')
      
      // Simulate API analysis delay before showing detail
      setTimeout(() => {
        setState('detail_view')
      }, 1200)
    }
  }

  const toggleCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(newMode)
    stopCamera()
    setTimeout(() => startCamera(newMode), 300)
  }

  const toggleFlash = () => {
    setFlashOn(prev => !prev)
  }

  const handleFallback = () => {
    stopCamera()
    if (onFallback) onFallback()
  }

  const reset = () => {
    setImageSrc(null)
    startCamera() // Restart camera
  }

  return (
    <div className="mx-auto w-full h-full">
      {(state === 'camera_active' || state === 'analyzing' || state === 'done_live') && !imageSrc && (
        <div className="relative w-full h-full">
          <div className="relative w-full h-full bg-black flex items-center justify-center group overflow-hidden">
            
            {/* Camera Controls */}
            {(state === 'camera_active' || state === 'analyzing' || state === 'done_live') && (
              <div className="absolute top-24 right-4 md:right-8 z-20 flex flex-col gap-3">
                <button onClick={toggleFlash} className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg">
                  {flashOn ? <Zap className="h-5 w-5 fill-yellow-400 text-yellow-400" /> : <ZapOff className="h-5 w-5 text-white" />}
                </button>
                <button onClick={toggleCamera} className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg">
                  <SwitchCamera className="h-5 w-5 text-white" />
                </button>
              </div>
            )}

            {/* Live Video Feed */}
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            
            {/* Scanning overlay animation */}
            {(state === 'camera_active' || state === 'analyzing') && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal/0 via-teal/20 to-teal/0 animate-[scan_3s_ease-in-out_infinite]" />
                <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-teal/50 animate-pulse" />
              </div>
            )}

            {/* Live Bounding Boxes (Auto Detect) */}
            {state === 'done_live' && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Single central bounding box */}
                <div
                  className="absolute border-2 border-teal transition-all duration-300 pointer-events-none rounded-xl"
                  style={{
                    left: `${detections[0].x}%`,
                    top: `${detections[0].y}%`,
                    width: `${detections[0].w}%`,
                    height: `${detections[0].h}%`,
                    boxShadow: '0 0 0 4000px rgba(0,0,0,0.5)', // Darken outside the box to highlight
                  }}
                >
                  <button
                    onClick={() => viewDetail(detections[0])}
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-white/95 backdrop-blur-sm px-5 py-3 text-sm font-bold text-teal-950 shadow-[0_8px_30px_rgb(0,0,0,0.12)] whitespace-nowrap pointer-events-auto transition-all active:scale-95 cursor-pointer flex items-center gap-3 border border-teal/20 hover:bg-white"
                  >
                    <Search className="w-5 h-5 text-teal" />
                    <div className="flex flex-col items-start text-left">
                      <span className="text-xs font-semibold text-muted-foreground leading-none mb-1">Terdeteksi:</span>
                      <span className="text-base leading-none">{detections[0].label} <span className="opacity-60 font-normal">({detections[0].confidence}%)</span></span>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-50" />
                  </button>
                </div>
              </div>
            )}

            {/* Hidden canvas for capturing frame */}
            <canvas ref={canvasRef} className="hidden" />

          </div>
        </div>
      )}

      {(state === 'idle' || state === 'camera_error') && (
        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-border bg-card/60 px-6 py-24 text-center transition-all hover:bg-card hover:shadow-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal/10">
              <Camera className="h-10 w-10 text-teal" aria-hidden="true" />
            </div>
            <p className="font-serif text-xl font-medium text-foreground">
              {state === 'camera_error' ? 'Kamera ditolak atau tidak tersedia.' : 'Memulai kamera...'}
            </p>
            {state === 'camera_error' && (
              <div className="flex flex-col gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleFallback}
                  className="rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white hover:bg-teal/90"
                >
                  Gunakan Fitur Scan Cepat
                </button>
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Coba aktifkan kamera lagi
                </button>
              </div>
            )}
        </div>
      )}

      {state === 'analyzing' && imageSrc && (
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-card p-8 aspect-video w-full justify-center">
          <img
            src={imageSrc || '/placeholder.svg'}
            alt="Foto yang sedang dianalisis"
            className="max-h-64 rounded-xl object-cover opacity-50"
          />
          <div className="flex items-center gap-3 text-teal">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <p className="text-sm font-medium">
              Memproses dan mengenali detail batik{'\u2026'}
            </p>
          </div>
        </div>
      )}

      {state === 'detail_view' && imageSrc && (
        <div className="flex flex-col gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-lg animate-in zoom-in-95 duration-300 relative">
          
          <button onClick={reset} className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors shadow-lg">
             <X className="w-5 h-5" />
          </button>

          <div className="relative w-full h-64 md:h-80 bg-black">
            <img
              src={imageSrc || '/placeholder.svg'}
              alt={`Foto batik ${bestDetection.label}`}
              className="w-full h-full object-cover opacity-90"
            />
            {/* Overlay bounding box on static image */}
            <div
              className="absolute border-2 border-gold rounded-lg shadow-[0_0_0_4000px_rgba(0,0,0,0.5)]"
              style={{
                left: `${bestDetection.x}%`,
                top: `${bestDetection.y}%`,
                width: `${bestDetection.w}%`,
                height: `${bestDetection.h}%`,
              }}
            />
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-teal/10 text-teal px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Tingkat Kecocokan {bestDetection.confidence}%</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Batik {bestDetection.label}
            </h2>
            
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              {bestDetection.desc}
            </p>
            
            <div className="mt-4 pt-6 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Pindai Ulang
              </button>
              
              <button className="text-sm font-semibold text-teal hover:text-teal/80">
                Lihat Katalog Lengkap &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

