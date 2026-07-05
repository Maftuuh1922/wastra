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
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isScanningRef = useRef<boolean>(false)

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
    const interval = setInterval(updateSize, 500)
    return () => clearInterval(interval)
  }, [state])

  const calculateBoxStyle = (box: any) => {
    if (!containerRef.current || mediaSize.w === 0 || mediaSize.h === 0) return { display: 'none' }
    
    const cw = containerRef.current.clientWidth
    const ch = containerRef.current.clientHeight
    const vw = mediaSize.w
    const vh = mediaSize.h
    
    // Calculate how object-cover scaled the media
    const scale = Math.max(cw / vw, ch / vh)
    const visualWidth = vw * scale
    const visualHeight = vh * scale
    
    const offsetLeft = (cw - visualWidth) / 2
    const offsetTop = (ch - visualHeight) / 2

    // box.x, y, w, h are in percentage of intrinsic media size
    const pixelX = (box.x / 100) * visualWidth + offsetLeft
    const pixelY = (box.y / 100) * visualHeight + offsetTop
    const pixelW = (box.w / 100) * visualWidth
    const pixelH = (box.h / 100) * visualHeight

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
       setTimeout(() => scanLiveObject(video, canvas), 500)
       return
    }

    // Scale down to 640px max to prevent UI freezing (canvas sync operations)
    // and speed up network upload.
    const MAX_SIZE = 640
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
    // Use JPEG format for massive speedup over PNG, prevents UI freeze
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8) 
    
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
          // Filter low confidence to avoid detecting random non-batik objects
          const validDetections = apiResponse.detections.filter((d: any) => d.confidence >= 50)
          
          if (validDetections.length > 0) {
              const best = validDetections.reduce((prev: any, current: any) => {
                  return (prev.confidence > current.confidence) ? prev : current
              })
              
              // Full-res snapshot for detail view
              const fullCanvas = document.createElement('canvas')
              fullCanvas.width = vw
              fullCanvas.height = vh
              fullCanvas.getContext('2d')?.drawImage(video, 0, 0, vw, vh)
              setLiveSnapshot(fullCanvas.toDataURL('image/jpeg', 0.9))
              
              const rawLabel = best.label.toLowerCase()
              let cleanLabel = best.label.replace('batik-', '').replace(/_/g, ' ')
              cleanLabel = cleanLabel.replace(/\b\w/g, (l: string) => l.toUpperCase())
              const desc = BATIK_INFO[rawLabel] || 'Batik ini memiliki corak khas yang kaya akan nilai budaya warisan Nusantara.'

              setBestDetection({
                 ...best,
                 label: cleanLabel,
                 desc: desc
              })
          } else {
             setBestDetection(null)
          }
      } else {
         setBestDetection(null)
      }
    } catch (error) {
      console.error('Failed to detect motifs:', error)
    } finally {
      // Loop the scan for real-time tracking! Fast 500ms interval since we optimized payload
      if (isScanningRef.current) {
        setTimeout(() => {
           if (videoRef.current && canvasRef.current) {
             scanLiveObject(videoRef.current, canvasRef.current)
           }
        }, 500) 
      }
    }
  }

  const startCamera = async (mode = 'environment') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setState('camera_active')
      isScanningRef.current = true
      
      // Auto-Detect loop starts shortly after camera
      setTimeout(() => {
        if (streamRef.current && videoRef.current && canvasRef.current) {
          scanLiveObject(videoRef.current, canvasRef.current)
        }
      }, 1000)
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
    startCamera()
  }

  return (
    <div className="mx-auto w-full h-full">
      {(state === 'camera_active' || state === 'analyzing') && !imageSrc && (
        <div className="relative w-full h-full">
          <div ref={containerRef} className="relative w-full h-full bg-black flex items-center justify-center group overflow-hidden">
            
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
            
            {/* Dark overlay specifically outside detection */}
            {bestDetection && state === 'camera_active' && (
               <div className="absolute inset-0 bg-black/30 pointer-events-none transition-all duration-500" />
            )}

            {/* Scanning overlay animation (only when no detection yet) */}
            {(!bestDetection && state === 'camera_active') && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <Scan className="h-24 w-24 text-teal/40 animate-pulse" />
              </div>
            )}

            {/* Live Bounding Boxes (Auto Detect) */}
            {(bestDetection && state === 'camera_active') && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="absolute pointer-events-none transition-all duration-300 ease-out flex flex-col items-center justify-center"
                  style={calculateBoxStyle(bestDetection)}
                >
                  {/* High-tech Scanner Corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal rounded-tl-lg shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal rounded-tr-lg shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal rounded-bl-lg shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal rounded-br-lg shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                  
                  {/* Internal scanner highlight */}
                  <div className="absolute inset-0 bg-teal/10 mix-blend-screen" />

                  {/* Label Button Centered Inside Box */}
                  <button
                    onClick={viewDetail}
                    className="z-10 rounded-full bg-black/70 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-white shadow-2xl whitespace-nowrap pointer-events-auto transition-transform active:scale-95 cursor-pointer flex items-center gap-2 border border-teal/50 hover:bg-black/90 animate-in fade-in zoom-in"
                  >
                    <Search className="w-4 h-4 text-teal" />
                    <span>{bestDetection.label} ({bestDetection.confidence}%)</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-70 text-teal" />
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

          <div ref={containerRef} className="relative w-full h-64 md:h-80 bg-black overflow-hidden">
            <img
              ref={imgRef}
              src={imageSrc || '/placeholder.svg'}
              alt={`Foto batik ${bestDetection?.label}`}
              className="w-full h-full object-cover opacity-90"
            />
            {/* Overlay bounding box on static image matching object-cover scale */}
            {bestDetection && (
               <div
                 className="absolute border-2 border-gold rounded-lg shadow-[0_0_0_4000px_rgba(0,0,0,0.5)] transition-all duration-300"
                 style={calculateBoxStyle(bestDetection)}
               />
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-teal/10 text-teal px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Tingkat Kecocokan {bestDetection?.confidence || 0}%</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Batik {bestDetection?.label}
            </h2>
            
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              {bestDetection?.desc}
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
