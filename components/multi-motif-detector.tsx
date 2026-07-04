'use client'

import { useRef, useState, useEffect } from 'react'
import { Camera, Loader2, RotateCcw, Upload, Scan, Zap, ZapOff, SwitchCamera, Maximize, Minimize } from 'lucide-react'

type DetectState = 'idle' | 'camera_active' | 'analyzing' | 'done' | 'camera_error' | 'done_live'

// Bounding boxes as % of image dimensions (simulated detections)
const detections = [
  { label: 'Parang', confidence: 94, x: 2, y: 8, w: 23, h: 84 },
  { label: 'Kawung', confidence: 91, x: 27, y: 8, w: 23, h: 84 },
  { label: 'Mega Mendung', confidence: 88, x: 52, y: 8, w: 23, h: 84 },
  { label: 'Truntum', confidence: 83, x: 77, y: 8, w: 21, h: 84 },
]

export function MultiMotifDetector({ onFallback }: { onFallback?: () => void }) {
  const [state, setState] = useState<DetectState>('idle')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
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

  const captureAndShowDetails = async () => {
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
      setState('analyzing')
      
      try {
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        
        const formData = new FormData()
        formData.append('image', blob, 'capture.png')
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const res = await fetch(`${API_URL}/api/detect`, {
          method: 'POST',
          body: formData
        })
        
        if (!res.ok) throw new Error('API Error')
        
        const result = await res.json()
        console.log('Detection Result:', result)
        
        setState('done')
      } catch (error) {
        console.error('Failed to detect motifs:', error)
        setState('done') // Fallback to demo mode
      }
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
            {(state === 'camera_active' || state === 'analyzing') && (
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
              <div className="absolute inset-0 pointer-events-none">
                {detections.map((d, i) => (
                  <div
                    key={i}
                    className="absolute border-2 border-teal transition-all duration-300 pointer-events-none"
                    style={{
                      left: `${d.x}%`,
                      top: `${d.y}%`,
                      width: `${d.w}%`,
                      height: `${d.h}%`,
                    }}
                  >
                    <button
                      onClick={captureAndShowDetails}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded-md bg-teal hover:bg-teal/80 px-3 py-1.5 text-sm font-bold text-accent-foreground shadow-lg whitespace-nowrap pointer-events-auto transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      {d.label}
                      <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full">Klik Detail</span>
                    </button>
                  </div>
                ))}
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
            alt="Foto yang sedang dianalisis untuk deteksi banyak motif"
            className="max-h-64 rounded-xl object-cover opacity-50"
          />
          <div className="flex items-center gap-3 text-teal">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <p className="text-sm font-medium">
              YOLO sedang mendeteksi motif-motif dalam foto{'\u2026'}
            </p>
          </div>
        </div>
      )}

      {state === 'done' && imageSrc && (
        <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 md:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">
              Hasil Identifikasi
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              {detections.length} motif terdeteksi
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-xl">
            <img
              src={imageSrc || '/placeholder.svg'}
              alt="Foto dengan kotak penanda motif yang terdeteksi"
              className="w-full object-cover max-h-[60vh]"
            />
            {detections.map((d) => (
              <div
                key={d.label}
                className="absolute rounded-md border-2 border-teal"
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  width: `${d.w}%`,
                  height: `${d.h}%`,
                }}
              >
                <span className="absolute -top-0.5 left-0 -translate-y-full rounded-t-md bg-teal px-2 py-0.5 text-xs font-semibold text-accent-foreground shadow-md whitespace-nowrap">
                  {d.label}
                </span>
              </div>
            ))}
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {detections.map((d) => (
              <li
                key={d.label}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-serif font-bold text-foreground">{d.label}</span>
                  <span className="font-semibold text-teal">{d.confidence}%</span>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-contrast"
                  role="progressbar"
                  aria-valuenow={d.confidence}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Tingkat keyakinan motif ${d.label}`}
                >
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${d.confidence}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={reset}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Deteksi Foto Lain (Buka Kamera)
          </button>
        </div>
      )}
    </div>
  )
}
