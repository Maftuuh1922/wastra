'use client'

import { useRef, useState, useEffect } from 'react'
import { Camera, Loader2, RotateCcw, Zap, ZapOff, SwitchCamera, Scan, Search, ArrowRight, X } from 'lucide-react'

type DetectState = 'idle' | 'camera_active' | 'analyzing' | 'done_live' | 'camera_error' | 'detail_view'

const BATIK_INFO: Record<string, string> = {
  'batik-aceh': 'Batik Aceh terkenal dengan warna-warna cerah dan motif yang kental dengan nuansa Islami dan alam, seperti pintu Aceh dan tolak angin.',
  'batik-celup': 'Batik celup (tie-dye) dibuat dengan teknik ikat dan celup. Menghasilkan pola tak beraturan yang unik dan warna yang bergradasi.',
  'batik-jawa_barat_megamendung': 'Motif Mega Mendung asal Cirebon melambangkan awan pembawa hujan sebagai lambang kesuburan dan pemberi kehidupan.',
  'batik-gentongan': 'Batik Gentongan asal Madura dibuat dengan merendam kain dalam gentong. Motifnya pesisir dengan warna berani seperti merah dan biru.',
  'batik-garutan': 'Batik Garutan dari Jawa Barat memiliki ciri khas warna cerah dan motif flora fauna yang sederhana namun elegan.',
  'batik-parang': 'Motif Parang adalah salah satu motif tertua di Indonesia, melambangkan ombak lautan yang tak pernah berhenti bergerak, simbol pantang menyerah.',
  'batik-kawung': 'Motif Kawung berbentuk bulat lonjong seperti buah aren, melambangkan kesucian, umur panjang, dan kesempurnaan.',
  'batik-sogan': 'Batik Sogan khas Solo dan Jogja berwarna kecoklatan. Melambangkan kerendahan hati dan nilai-nilai klasik keraton.',
  'batik-lasem': 'Batik Lasem merupakan akulturasi budaya Tionghoa dan Jawa, terkenal dengan warna merah darah ayam yang khas.'
}

export function MultiMotifDetector({ onFallback }: { onFallback?: () => void }) {
  const [state, setState] = useState<DetectState>('idle')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [liveSnapshot, setLiveSnapshot] = useState<string | null>(null)
  const [bestDetection, setBestDetection] = useState<any>(null)
  const [flashOn, setFlashOn] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [mediaSize, setMediaSize] = useState({ w: 0, h: 0 })
  const [focusPoint, setFocusPoint] = useState<{x: number, y: number} | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isScanningRef = useRef<boolean>(false)
  
  // Tracking references for stabilization
  const missCountRef = useRef<number>(0)
  const lastDetectionRef = useRef<any>(null)

  // Start camera on mount
  useEffect(() => {
    startCamera(facingMode)
    return () => {
      stopCamera()
    }
  }, [])

  // Continuously track video/image dimensions for accurate bounding box mapping
  useEffect(() => {
    const updateSize = () => {
      if (state === 'camera_active' && videoRef.current) {
        setMediaSize({ w: videoRef.current.videoWidth, h: videoRef.current.videoHeight })
      } else if (state === 'detail_view' && imgRef.current) {
        setMediaSize({ w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight })
      }
    }
    const interval = setInterval(updateSize, 200) // faster size sync
    return () => clearInterval(interval)
  }, [state])

  const calculateBoxStyle = (box: any) => {
    if (!containerRef.current || mediaSize.w === 0 || mediaSize.h === 0) return { display: 'none' }
    
    const cw = containerRef.current.clientWidth
    const ch = containerRef.current.clientHeight
    const vw = mediaSize.w
    const vh = mediaSize.h
    
    const scale = Math.max(cw / vw, ch / vh)
    const visualWidth = vw * scale
    const visualHeight = vh * scale
    
    const offsetLeft = (cw - visualWidth) / 2
    const offsetTop = (ch - visualHeight) / 2

    let pixelX = (box.x / 100) * visualWidth + offsetLeft
    let pixelY = (box.y / 100) * visualHeight + offsetTop
    let pixelW = (box.w / 100) * visualWidth
    let pixelH = (box.h / 100) * visualHeight

    // Clamp to screen bounds so glowing corners never get hidden outside the phone screen
    const PADDING = 16
    if (pixelX < PADDING) { 
       pixelW -= (PADDING - pixelX)
       pixelX = PADDING 
    }
    if (pixelY < PADDING) { 
       pixelH -= (PADDING - pixelY)
       pixelY = PADDING 
    }
    if (pixelX + pixelW > cw - PADDING) { 
       pixelW = (cw - PADDING) - pixelX 
    }
    if (pixelY + pixelH > ch - PADDING) { 
       pixelH = (ch - PADDING) - pixelY 
    }

    return {
       left: `${pixelX}px`,
       top: `${pixelY}px`,
       width: `${pixelW}px`,
       height: `${pixelH}px`
    }
  }

  const scanLiveObject = async (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    if (!isScanningRef.current) return

    const vw = video.videoWidth
    const vh = video.videoHeight
    if (!vw || !vh) {
       setTimeout(() => scanLiveObject(video, canvas), 200)
       return
    }

    // Shrink size heavily to make upload lighting fast (YOLO uses 416/640 anyway)
    const MAX_SIZE = 416 
    let drawW = vw
    let drawH = vh
    if (drawW > MAX_SIZE || drawH > MAX_SIZE) {
       const ratio = Math.min(MAX_SIZE / drawW, MAX_SIZE / drawH)
       drawW = drawW * ratio
       drawH = drawH * ratio
    }

    canvas.width = drawW
    canvas.height = drawH
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.drawImage(video, 0, 0, drawW, drawH)
    // Extra compression for extreme speed (0.6 is virtually indistinguishable to YOLO)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.6) 
    
    try {
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      const formData = new FormData()
      formData.append('image', blob, 'capture.jpg')
      
      const SPACE_URL = 'https://maftuh-main-wastra-yolo-api.hf.space/predict'
      const res = await fetch(SPACE_URL, {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) throw new Error('API Error')
      
      const apiResponse = await res.json()
      
      if (apiResponse.success && apiResponse.detections && apiResponse.detections.length > 0) {
          // VERY STRICT confidence threshold to prevent FALSE POSITIVES (detecting wrong batiks)
          const validDetections = apiResponse.detections.filter((d: any) => d.confidence >= 70)
          
          if (validDetections.length > 0) {
              const best = validDetections.reduce((prev: any, current: any) => {
                  return (prev.confidence > current.confidence) ? prev : current
              })
              
              // STABILIZATION: Prevent flickering/jumping classes
              if (lastDetectionRef.current && lastDetectionRef.current.label !== best.label) {
                 // If the class changed, only accept it if it's REALLY sure (> 75)
                 if (best.confidence < 75) {
                    throw new Error('Ignore low confidence class switch')
                 }
              }

              const fullCanvas = document.createElement('canvas')
              fullCanvas.width = vw
              fullCanvas.height = vh
              fullCanvas.getContext('2d')?.drawImage(video, 0, 0, vw, vh)
              setLiveSnapshot(fullCanvas.toDataURL('image/jpeg', 0.9))
              
              const rawLabel = best.label.toLowerCase()
              let cleanLabel = best.label.replace('batik-', '').replace(/_/g, ' ')
              cleanLabel = cleanLabel.replace(/\b\w/g, (l: string) => l.toUpperCase())
              const desc = BATIK_INFO[rawLabel] || 'Batik ini memiliki corak unik Nusantara.'

              const newDetection = {
                 ...best,
                 label: cleanLabel,
                 desc: desc
              }

              lastDetectionRef.current = newDetection
              setBestDetection(newDetection)
              missCountRef.current = 0 // Reset miss counter
          } else {
             handleMiss()
          }
      } else {
         handleMiss()
      }
    } catch (error) {
      // Ignore API errors, treat as miss
      handleMiss()
    } finally {
      if (isScanningRef.current) {
        // Almost instant loop! Wait only 50ms before grabbing next frame
        setTimeout(() => {
           if (videoRef.current && canvasRef.current) {
             scanLiveObject(videoRef.current, canvasRef.current)
           }
        }, 50) 
      }
    }
  }

  const handleMiss = () => {
    missCountRef.current += 1
    // Keep bounding box alive for 4 frames (around 1-2 seconds) to prevent flickering!
    if (missCountRef.current > 4) {
       setBestDetection(null)
       lastDetectionRef.current = null
    }
  }

  const startCamera = async (mode = 'environment') => {
    try {
      // Force ideal 1080p to coax the browser into selecting the primary wide lens 
      // (which has better hardware auto-focus than ultra-wide lenses on mobile)
      const baseConstraints = { 
        facingMode: mode,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
      
      let stream;
      try {
        // Attempt to force continuous auto-focus on supported mobile browsers
        stream = await navigator.mediaDevices.getUserMedia({ 
           video: { ...baseConstraints, advanced: [{ focusMode: "continuous" }] } as any
        })
      } catch (e) {
        // Fallback without advanced constraints if device rejects it
        stream = await navigator.mediaDevices.getUserMedia({ video: baseConstraints })
      }

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setState('camera_active')
      isScanningRef.current = true
      
      setTimeout(() => {
        if (streamRef.current && videoRef.current && canvasRef.current) {
          scanLiveObject(videoRef.current, canvasRef.current)
        }
      }, 500)
    } catch (err) {
      console.error('Camera access denied or unavailable', err)
      setState('camera_error')
    }
  }

  const stopCamera = () => {
    isScanningRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const viewDetail = () => {
    stopCamera()
    if (liveSnapshot) {
      setImageSrc(liveSnapshot)
    }
    setState('analyzing')
    
    setTimeout(() => {
      setState('detail_view')
    }, 800)
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
    setLiveSnapshot(null)
    setBestDetection(null)
    lastDetectionRef.current = null
    missCountRef.current = 0
    startCamera()
  }

  // Refocus click handler for iOS/Android
  const handleTapToFocus = async (e: React.MouseEvent) => {
     // visual feedback
     const rect = e.currentTarget.getBoundingClientRect()
     const x = e.clientX - rect.left
     const y = e.clientY - rect.top
     setFocusPoint({x, y})
     setTimeout(() => setFocusPoint(null), 1000)

     if (streamRef.current) {
        const track = streamRef.current.getVideoTracks()[0]
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : {}
        if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
           try {
              await track.applyConstraints({
                 advanced: [{ focusMode: 'continuous' }]
              })
           } catch (err) {}
        }
     }
  }

  return (
    <div className="w-full h-[500px]">
      {(state === 'camera_active' || state === 'analyzing') && !imageSrc && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
          
          {/* Header Bar */}
          <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
             <button onClick={handleFallback} className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg border border-white/10">
                <X className="h-6 w-6" />
             </button>
             <div className="flex gap-3 pointer-events-auto">
                <button onClick={toggleFlash} className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg border border-white/10">
                  {flashOn ? <Zap className="h-5 w-5 fill-yellow-400 text-yellow-400" /> : <ZapOff className="h-5 w-5 text-white" />}
                </button>
                <button onClick={toggleCamera} className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors shadow-lg border border-white/10">
                  <SwitchCamera className="h-5 w-5 text-white" />
                </button>
             </div>
          </div>

          <div 
             ref={containerRef} 
             className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden cursor-crosshair"
             onClick={handleTapToFocus}
          >
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            
            {/* Visual Focus Ring */}
            {focusPoint && (
               <div 
                 className="absolute w-20 h-20 border-2 border-yellow-400 rounded-lg pointer-events-none animate-in zoom-in-150 fade-in duration-300"
                 style={{ left: focusPoint.x - 40, top: focusPoint.y - 40 }}
               />
            )}

            {/* Dimmed Background Overlay */}
            {bestDetection && state === 'camera_active' && (
               <div className="absolute inset-0 bg-black/40 pointer-events-none transition-colors duration-500" />
            )}

            {/* Empty Scanning Animation */}
            {(!bestDetection && state === 'camera_active') && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <Scan className="h-24 w-24 text-teal/40 animate-pulse" />
              </div>
            )}

            {/* YOLO Bounding Box */}
            {(bestDetection && state === 'camera_active') && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  // duration-500 makes the box glide smoothly across the screen like real-time tracking!
                  className="absolute pointer-events-none transition-all duration-500 ease-out flex flex-col items-center justify-center"
                  style={calculateBoxStyle(bestDetection)}
                >
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-[4px] border-l-[4px] border-teal rounded-tl-xl shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-[4px] border-r-[4px] border-teal rounded-tr-xl shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[4px] border-l-[4px] border-teal rounded-bl-xl shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[4px] border-r-[4px] border-teal rounded-br-xl shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
                  
                  <div className="absolute inset-0 bg-teal/10 mix-blend-screen" />

                  <button
                    onClick={viewDetail}
                    className="z-10 rounded-full bg-black/80 backdrop-blur-xl px-6 py-3 text-sm md:text-base font-bold text-white shadow-2xl whitespace-nowrap pointer-events-auto transition-transform active:scale-95 cursor-pointer flex items-center gap-2 border border-teal hover:bg-black"
                  >
                    <Search className="w-5 h-5 text-teal" />
                    <span>{bestDetection.label} ({bestDetection.confidence}%)</span>
                    <ArrowRight className="w-5 h-5 ml-1 opacity-70 text-teal" />
                  </button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          {/* Footer Bar */}
          <div className="w-full bg-black p-6 text-center z-20 pb-safe">
             <p className="text-white/80 text-sm font-medium tracking-wide">
               Ketuk layar untuk fokus • Beri jarak ~15cm dari motif
             </p>
          </div>
        </div>
      )}

      {(state === 'idle' || state === 'camera_error') && (
        <div className="flex flex-col items-center justify-center h-full gap-6 rounded-3xl border border-border bg-card/60 px-6 py-24 text-center transition-all hover:bg-card hover:shadow-md">
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
                  Ganti Mode Scan
                </button>
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Coba kamera lagi
                </button>
              </div>
            )}
        </div>
      )}

      {state === 'analyzing' && imageSrc && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
          <img
            src={imageSrc || '/placeholder.svg'}
            alt="Foto yang sedang dianalisis"
            className="w-48 h-48 md:w-64 md:h-64 rounded-3xl object-cover opacity-60 shadow-2xl mb-8"
          />
          <div className="flex flex-col items-center gap-4 text-teal">
            <Loader2 className="h-10 w-10 animate-spin" aria-hidden="true" />
            <p className="text-lg font-bold tracking-wide">
              Menganalisis Pola Motif{'\u2026'}
            </p>
          </div>
        </div>
      )}

      {state === 'detail_view' && imageSrc && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background animate-in slide-in-from-bottom-12 fade-in duration-500 overflow-hidden">
          
          {/* Header Image Area */}
          <div ref={containerRef} className="relative w-full h-[50vh] md:h-[60vh] shrink-0 bg-black shadow-2xl">
            <img
              ref={imgRef}
              src={imageSrc || '/placeholder.svg'}
              alt={`Foto batik ${bestDetection?.label}`}
              className="w-full h-full object-cover opacity-90"
            />
            
            {/* Close / Back Button */}
            <button onClick={reset} className="absolute top-6 left-6 z-20 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all shadow-lg active:scale-90 border border-white/10">
               <X className="w-6 h-6" />
            </button>

            {/* Overlay bounding box on static image matching object-cover scale */}
            {bestDetection && (
               <div
                 className="absolute border-[3px] border-teal rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.6)] transition-all duration-300 pointer-events-none"
                 style={calculateBoxStyle(bestDetection)}
               >
                  <div className="absolute inset-0 bg-teal/10 mix-blend-screen rounded-xl" />
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-[3px] border-l-[3px] border-white rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-[3px] border-r-[3px] border-white rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-[3px] border-l-[3px] border-white rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-[3px] border-r-[3px] border-white rounded-br-xl" />
               </div>
            )}
            
            {/* Gradient fade transition to content below */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
          </div>

          {/* Content Area */}
          <div className="flex-1 px-6 sm:px-10 pb-12 overflow-y-auto bg-background relative z-10 -mt-10">
            <div className="flex flex-col gap-4 max-w-3xl mx-auto h-full">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-teal/20 flex items-center gap-2">
                  <Scan className="w-3 h-3" />
                  Akurasi {bestDetection?.confidence || 0}%
                </span>
                <span className="bg-blue-500/10 text-blue-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                  YOLOv8 Scan
                </span>
              </div>
              
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mt-2">
                Batik {bestDetection?.label}
              </h2>
              
              <p className="text-muted-foreground leading-relaxed text-lg md:text-xl font-medium mt-2">
                {bestDetection?.desc}
              </p>
              
              <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={reset}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-teal px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-teal/20 transition-all hover:bg-teal/90 active:scale-95"
                >
                  <RotateCcw className="h-6 w-6" aria-hidden="true" />
                  Pindai Motif Lain
                </button>
                
                <button className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-secondary px-8 py-4 text-lg font-semibold text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95">
                  <Search className="h-6 w-6" />
                  Eksplorasi Katalog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
