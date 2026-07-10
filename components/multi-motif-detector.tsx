'use client'

import { useRef, useState, useEffect, useCallback, type CSSProperties } from 'react'
import {
  Camera, Loader2, RotateCcw, Zap, ZapOff, SwitchCamera,
  Scan, Search, ArrowRight, X, ChevronLeft, ChevronRight, WifiOff
} from 'lucide-react'
import { getBatikDetail } from '@/lib/batik-info'

type DetectState = 'idle' | 'camera_active' | 'analyzing' | 'camera_error' | 'detail_view'

interface Box {
  x: number // percent, 0-100
  y: number
  w: number
  h: number
}

interface RawDetection extends Box {
  label: string
  confidence: number
}

interface TrackedDetection extends Box {
  id: string
  label: string
  displayLabel: string
  desc: string
  origin: string
  meaning: string
  source: string
  sourceUrl: string
  confidence: number
  color: string
  streak: number
  missStreak: number
}

// --- Tunables ----------------------------------------------------------------
// Centralised here so future tweaks don't require hunting through the code.
const CONFIG = {
  API_URL: 'https://maftuh-main-wastra-yolo-api.hf.space/predict',
  MAX_FRAME_SIZE: 640,          // matches YOLO's input size, keeps upload small/fast
  SCAN_INTERVAL_MS: 800,        // Ditambah jadi 800ms agar tidak spam API (mencegah Rate Limit / Timeout)
  SCAN_INTERVAL_BACKOFF_MS: 2000, // Slower polling while API is failing
  // A single low-confidence frame should never be enough to label something.
  // A detection must survive this many *consecutive* frames before it's shown.
  // Dikembalikan ke nilai yang lebih aman (3) agar hasil deteksi lebih stabil dan mengurangi false positive.
  STABLE_FRAMES_REQUIRED: 4,
  // How many frames a tracked object is allowed to "disappear" for before
  // we drop it (keeps boxes from flickering when a frame is missed/slow).
  MISS_TOLERANCE_FRAMES: 4,
  // Baseline confidence needed to even consider a detection.
  // Dinaikkan ke 75% untuk menekan false positive (mendeteksi objek non-batik).
  CONFIDENCE_THRESHOLD: 75,
  // Label kelas negatif dari model — tidak boleh pernah ditampilkan.
  NEGATIVE_LABEL: 'bukan_batik',
  MAX_SIMULTANEOUS_DETECTIONS: 6,
  MAX_CONSECUTIVE_ERRORS: 6,
} as const

// Distinct colours so multiple simultaneous detections stay visually
// separable. Assigned deterministically per motif (see colorForLabel) so the
// same motif always renders in the same colour across frames.
const DETECTION_COLORS = ['#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6', '#84cc16']

function colorForLabel(label: string): string {
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = (hash * 31 + label.charCodeAt(i)) >>> 0
  return DETECTION_COLORS[hash % DETECTION_COLORS.length]
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function boxIoU(a: Box, b: Box): number {
  const ax2 = a.x + a.w, ay2 = a.y + a.h
  const bx2 = b.x + b.w, by2 = b.y + b.h
  const interW = Math.max(0, Math.min(ax2, bx2) - Math.max(a.x, b.x))
  const interH = Math.max(0, Math.min(ay2, by2) - Math.max(a.y, b.y))
  const interArea = interW * interH
  const unionArea = a.w * a.h + b.w * b.h - interArea
  return unionArea <= 0 ? 0 : interArea / unionArea
}

function makeTrack(raw: RawDetection): TrackedDetection {
  const rawLabel = raw.label.toLowerCase()
  const detail = getBatikDetail(rawLabel)
  
  return {
    id: `${rawLabel}-${Math.random().toString(36).slice(2, 9)}`,
    label: rawLabel,
    displayLabel: detail.name,
    desc: detail.description,
    origin: detail.origin,
    meaning: detail.meaning,
    source: detail.source,
    sourceUrl: detail.sourceUrl,
    confidence: raw.confidence,
    x: raw.x, y: raw.y, w: raw.w, h: raw.h,
    color: colorForLabel(rawLabel),
    streak: 1,
    missStreak: 0,
  }
}

// Matches this frame's raw detections against tracks kept from previous
// frames (same label + overlapping box), so multiple different motifs can
// each accumulate their own stability streak independently. This is what
// lets several batik pieces be recognised at the same time, while still
// filtering out one-off, single-frame false positives.
function updateTracks(prevTracks: TrackedDetection[], raws: RawDetection[]): TrackedDetection[] {
  const matched = new Set<number>()
  const next: TrackedDetection[] = []

  for (const track of prevTracks) {
    let bestIdx = -1
    let bestIoU = 0.25 // minimum overlap to count as "the same object"
    raws.forEach((r, i) => {
      if (matched.has(i)) return
      if (r.label.toLowerCase() !== track.label) return
      const iou = boxIoU(track, r)
      if (iou > bestIoU) { bestIoU = iou; bestIdx = i }
    })

    if (bestIdx >= 0) {
      const r = raws[bestIdx]
      matched.add(bestIdx)
      next.push({
        ...track,
        x: lerp(track.x, r.x, 0.5),
        y: lerp(track.y, r.y, 0.5),
        w: lerp(track.w, r.w, 0.5),
        h: lerp(track.h, r.h, 0.5),
        confidence: r.confidence,
        streak: Math.min(track.streak + 1, 999),
        missStreak: 0,
      })
    } else if (track.missStreak < CONFIG.MISS_TOLERANCE_FRAMES) {
      next.push({ ...track, missStreak: track.missStreak + 1 })
    }
    // else: dropped, too many consecutive misses
  }

  raws.forEach((r, i) => {
    if (!matched.has(i)) next.push(makeTrack(r))
  })

  return next
}

export function MultiMotifDetector({ onFallback }: { onFallback?: () => void }) {
  const [state, setState] = useState<DetectState>('idle')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [tracks, setTracks] = useState<TrackedDetection[]>([])
  const [capturedDetections, setCapturedDetections] = useState<TrackedDetection[]>([])
  const [detailIndex, setDetailIndex] = useState(0)
  const [flashOn, setFlashOn] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [mediaSize, setMediaSize] = useState({ w: 0, h: 0 })
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null)
  const [networkIssue, setNetworkIssue] = useState(false)
  const [isColdStart, setIsColdStart] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isScanningRef = useRef(false)
  const isFetchingRef = useRef(false)
  const isMountedRef = useRef(true)
  const tracksRef = useRef<TrackedDetection[]>([])
  const consecutiveErrorsRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    isMountedRef.current = true
    startCamera(facingMode)
    return () => {
      isMountedRef.current = false
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Keep media (video/image) natural size in sync for accurate box mapping.
  useEffect(() => {
    const updateSize = () => {
      if (state === 'camera_active' && videoRef.current) {
        setMediaSize({ w: videoRef.current.videoWidth, h: videoRef.current.videoHeight })
      } else if (state === 'detail_view' && imgRef.current) {
        setMediaSize({ w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight })
      }
    }
    const interval = setInterval(updateSize, 200)
    return () => clearInterval(interval)
  }, [state])

  const calculateBoxStyle = (box: Box): CSSProperties => {
    if (!containerRef.current || mediaSize.w === 0 || mediaSize.h === 0) return { display: 'none' }

    const cw = containerRef.current.clientWidth
    const ch = containerRef.current.clientHeight
    const scale = Math.max(cw / mediaSize.w, ch / mediaSize.h)
    const visualWidth = mediaSize.w * scale
    const visualHeight = mediaSize.h * scale
    const offsetLeft = (cw - visualWidth) / 2
    const offsetTop = (ch - visualHeight) / 2

    let pixelX = (box.x / 100) * visualWidth + offsetLeft
    let pixelY = (box.y / 100) * visualHeight + offsetTop
    let pixelW = (box.w / 100) * visualWidth
    let pixelH = (box.h / 100) * visualHeight

    const PADDING = 24
    if (pixelX < PADDING) { pixelW -= (PADDING - pixelX); pixelX = PADDING }
    if (pixelY < PADDING) { pixelH -= (PADDING - pixelY); pixelY = PADDING }
    if (pixelX + pixelW > cw - PADDING) pixelW = (cw - PADDING) - pixelX
    if (pixelY + pixelH > ch - PADDING) pixelH = (ch - PADDING) - pixelY
    pixelW = Math.max(0, pixelW)
    pixelH = Math.max(0, pixelH)

    if (facingMode === 'user') {
      pixelX = cw - (pixelX + pixelW)
    }

    // Cosmetic only: a box spanning almost the whole screen looks like a bug
    // rather than a scan reticle, so we shrink it visually toward its center.
    if (pixelW * pixelH > cw * ch * 0.7) {
      const shrink = 0.8
      const newW = pixelW * shrink
      const newH = pixelH * shrink
      pixelX += (pixelW - newW) / 2
      pixelY += (pixelH - newH) / 2
      pixelW = newW
      pixelH = newH
    }

    return { left: `${pixelX}px`, top: `${pixelY}px`, width: `${pixelW}px`, height: `${pixelH}px` }
  }

  const scanLiveObject = useCallback(async () => {
    const next = (delay: number) => {
      if (isScanningRef.current) window.setTimeout(scanLiveObject, delay)
    }

    if (!isScanningRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || isFetchingRef.current) return next(CONFIG.SCAN_INTERVAL_MS)

    const vw = video.videoWidth
    const vh = video.videoHeight
    if (!vw || !vh) return next(200)

    let drawW = vw, drawH = vh
    if (drawW > CONFIG.MAX_FRAME_SIZE || drawH > CONFIG.MAX_FRAME_SIZE) {
      const ratio = Math.min(CONFIG.MAX_FRAME_SIZE / drawW, CONFIG.MAX_FRAME_SIZE / drawH)
      drawW *= ratio
      drawH *= ratio
    }
    canvas.width = drawW
    canvas.height = drawH
    const ctx = canvas.getContext('2d')
    if (!ctx) return next(CONFIG.SCAN_INTERVAL_MS)
    ctx.drawImage(video, 0, 0, drawW, drawH)

    isFetchingRef.current = true
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.8)
      })

      const formData = new FormData()
      formData.append('image', blob, 'frame.jpg')

      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const apiResponse = await response.json()
      console.log("Raw API Response:", apiResponse)
      
      if (!isMountedRef.current) return

      consecutiveErrorsRef.current = 0
      setNetworkIssue(false)
      setIsColdStart(false)

      const rawDetections: RawDetection[] = Array.isArray(apiResponse?.detections) ? apiResponse.detections : []
      const candidates = rawDetections.filter(
        (d) => d.label !== CONFIG.NEGATIVE_LABEL && d.confidence >= CONFIG.CONFIDENCE_THRESHOLD,
      )

      tracksRef.current = updateTracks(tracksRef.current, candidates)
      setTracks(tracksRef.current)
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error("YOLO Detection Error:", err)
      }
      if (err?.name !== 'AbortError' && isMountedRef.current) {
        consecutiveErrorsRef.current += 1
        setNetworkIssue(consecutiveErrorsRef.current >= CONFIG.MAX_CONSECUTIVE_ERRORS)
        tracksRef.current = updateTracks(tracksRef.current, [])
        setTracks(tracksRef.current)
      }
    } finally {
      isFetchingRef.current = false
      const delay = consecutiveErrorsRef.current >= CONFIG.MAX_CONSECUTIVE_ERRORS
        ? CONFIG.SCAN_INTERVAL_BACKOFF_MS
        : CONFIG.SCAN_INTERVAL_MS
      next(delay)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startCamera = async (mode: 'environment' | 'user' = 'environment') => {
    try {
      const baseConstraints = { facingMode: mode, width: { ideal: 1920 }, height: { ideal: 1080 } }
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { ...baseConstraints, advanced: [{ focusMode: 'continuous' }] } as any,
        })
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: baseConstraints })
      }

      if (!isMountedRef.current) {
        stream.getTracks().forEach((t) => t.stop())
        return
      }

      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream

      tracksRef.current = []
      setTracks([])
      consecutiveErrorsRef.current = 0
      setNetworkIssue(false)
      setState('camera_active')
      isScanningRef.current = true

      window.setTimeout(() => scanLiveObject(), 500)
    } catch (err) {
      console.error('Camera access denied or unavailable', err)
      if (isMountedRef.current) setState('camera_error')
    }
  }

  const stopCamera = () => {
    isScanningRef.current = false
    abortControllerRef.current?.abort()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const rawStable = tracks
    .filter((t) => t.streak >= CONFIG.STABLE_FRAMES_REQUIRED)
    .sort((a, b) => b.confidence - a.confidence)

  // Frontend Agnostic NMS: Hapus box yang menumpuk (IoU > 0.4) agar
  // 1 titik motif hanya menampilkan 1 label dengan confidence tertinggi.
  const nmsStable: TrackedDetection[] = []
  for (const t of rawStable) {
    let overlap = false
    for (const kept of nmsStable) {
      if (boxIoU(t, kept) > 0.4) {
        overlap = true
        break
      }
    }
    if (!overlap) nmsStable.push(t)
  }

  const stableDetections = nmsStable.slice(0, CONFIG.MAX_SIMULTANEOUS_DETECTIONS)

  const viewDetail = (index: number) => {
    const video = videoRef.current
    if (!video || stableDetections.length === 0) return

    const vw = video.videoWidth
    const vh = video.videoHeight
    const snapCanvas = document.createElement('canvas')
    snapCanvas.width = vw
    snapCanvas.height = vh
    snapCanvas.getContext('2d')?.drawImage(video, 0, 0, vw, vh)
    const snapshot = snapCanvas.toDataURL('image/jpeg', 0.9)

    setCapturedDetections(stableDetections)
    setDetailIndex(clamp(index, 0, stableDetections.length - 1))
    setImageSrc(snapshot)
    stopCamera()
    setState('analyzing')
    window.setTimeout(() => { if (isMountedRef.current) setState('detail_view') }, 150)
  }

  const toggleCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(newMode)
    stopCamera()
    window.setTimeout(() => startCamera(newMode), 300)
  }

  const toggleFlash = async () => {
    const track = streamRef.current?.getVideoTracks()[0]
    const capabilities: any = track?.getCapabilities ? track.getCapabilities() : {}
    if (track && capabilities.torch) {
      try {
        await track.applyConstraints({ advanced: [{ torch: !flashOn }] } as any)
        setFlashOn((prev) => !prev)
      } catch (err) {
        console.error('Torch not supported on this device', err)
      }
    } else {
      // No hardware torch access (common on iOS Safari) — nothing to toggle.
      console.warn('Flash/torch control is not available on this browser/device.')
    }
  }

  const handleFallback = () => {
    stopCamera()
    onFallback?.()
  }

  const reset = () => {
    setImageSrc(null)
    setCapturedDetections([])
    setDetailIndex(0)
    tracksRef.current = []
    setTracks([])
    startCamera(facingMode)
  }

  const handleTapToFocus = async (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setFocusPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    window.setTimeout(() => setFocusPoint(null), 1000)

    const track = streamRef.current?.getVideoTracks()[0]
    const capabilities: any = track?.getCapabilities ? track.getCapabilities() : {}
    if (track && capabilities.focusMode?.includes('continuous')) {
      try {
        await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] } as any)
      } catch { /* ignore unsupported constraint */ }
    }
  }

  const bestDetection = capturedDetections[detailIndex] ?? null

  return (
    <div className="w-full h-[500px]">
      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100%); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(2500%); opacity: 0; } }
        .scan-line-anim { animation: scanline 2.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .scan-line-anim { animation: none; display: none; }
        }
      `}</style>

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

          {/* Multi-detection summary pill */}
          {stableDetections.length > 0 && state === 'camera_active' && (
            <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none" aria-live="polite">
              <div className="flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white border border-white/10 shadow-lg">
                <Scan className="w-3.5 h-3.5 text-teal" />
                {stableDetections.length} motif terdeteksi
              </div>
            </div>
          )}

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

            {focusPoint && (
              <div
                className="absolute w-20 h-20 border-2 border-yellow-400 rounded-lg pointer-events-none animate-in zoom-in-150 fade-in duration-300"
                style={{ left: focusPoint.x - 40, top: focusPoint.y - 40 }}
              />
            )}

            {stableDetections.length > 0 && state === 'camera_active' && (
              <div className="absolute inset-0 bg-black/40 pointer-events-none transition-colors duration-500" />
            )}

            {stableDetections.length === 0 && state === 'camera_active' && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <Scan className="h-24 w-24 text-teal/40 animate-pulse" />
                {!reducedMotion && (
                  <div className="scan-line-anim absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-transparent via-teal/25 to-transparent" />
                )}
              </div>
            )}

            {/* Bounding boxes — one per stable, simultaneously tracked motif */}
            {state === 'camera_active' && stableDetections.map((detection, idx) => (
              <div key={detection.id} className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="absolute pointer-events-none transition-all duration-500 ease-out flex flex-col items-center justify-center"
                  style={calculateBoxStyle(detection)}
                >
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-[4px] border-l-[4px] rounded-tl-xl" style={{ borderColor: detection.color, filter: `drop-shadow(0 0 6px ${detection.color}99)` }} />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-[4px] border-r-[4px] rounded-tr-xl" style={{ borderColor: detection.color, filter: `drop-shadow(0 0 6px ${detection.color}99)` }} />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[4px] border-l-[4px] rounded-bl-xl" style={{ borderColor: detection.color, filter: `drop-shadow(0 0 6px ${detection.color}99)` }} />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[4px] border-r-[4px] rounded-br-xl" style={{ borderColor: detection.color, filter: `drop-shadow(0 0 6px ${detection.color}99)` }} />
                  <div className="absolute inset-0 mix-blend-screen" style={{ backgroundColor: `${detection.color}22` }} />

                  <button
                    onClick={() => viewDetail(idx)}
                    className="z-10 rounded-full bg-black/80 backdrop-blur-xl px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-2xl whitespace-nowrap pointer-events-auto transition-transform active:scale-95 cursor-pointer flex items-center gap-2 border"
                    style={{ borderColor: detection.color }}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: detection.color }} />
                    <Search className="w-4 h-4" style={{ color: detection.color }} />
                    <span>{detection.displayLabel} ({Math.round(detection.confidence)}%)</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-70" style={{ color: detection.color }} />
                  </button>
                </div>
              </div>
            ))}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Footer Bar */}
          <div className="w-full bg-black p-6 text-center z-20 pb-safe space-y-2">
            {isColdStart && (
              <p className="flex items-center justify-center gap-2 text-blue-400 text-xs font-medium animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Server AI sedang startup… mohon tunggu 30–60 detik
              </p>
            )}
            {networkIssue && !isColdStart && (
              <p className="flex items-center justify-center gap-2 text-amber-400 text-xs font-medium">
                <WifiOff className="w-3.5 h-3.5" />
                Koneksi ke server tidak stabil, mencoba lagi…
              </p>
            )}
            <p className="text-white/80 text-sm font-medium tracking-wide">
              {stableDetections.length > 0
                ? `${stableDetections.length} motif ditemukan — ketuk salah satu untuk lihat detail`
                : isColdStart
                ? 'Menghubungkan ke server AI (ZeroGPU)…'
                : 'Ketuk layar untuk fokus • Beri jarak ~15cm dari motif'}
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
            <p className="text-lg font-bold tracking-wide">Menganalisis Pola Motif…</p>
          </div>
        </div>
      )}

      {state === 'detail_view' && imageSrc && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background animate-in slide-in-from-bottom-12 fade-in duration-500 overflow-hidden">

          <div ref={containerRef} className="relative w-full h-[50vh] md:h-[60vh] shrink-0 bg-black shadow-2xl">
            <img
              ref={imgRef}
              src={imageSrc || '/placeholder.svg'}
              alt={bestDetection ? `Foto batik ${bestDetection.displayLabel}` : 'Foto batik'}
              className="w-full h-full object-cover opacity-90"
            />

            <button onClick={reset} className="absolute top-6 left-6 z-20 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all shadow-lg active:scale-90 border border-white/10">
              <X className="w-6 h-6" />
            </button>

            {/* All captured motifs shown at once; tap any box to switch focus */}
            {capturedDetections.map((det, idx) => (
              <button
                key={det.id}
                onClick={() => setDetailIndex(idx)}
                className="absolute rounded-xl transition-all duration-300"
                style={{
                  ...calculateBoxStyle(det),
                  border: `3px solid ${det.color}`,
                  opacity: idx === detailIndex ? 1 : 0.45,
                  boxShadow: idx === detailIndex ? `0 0 20px ${det.color}99` : 'none',
                }}
              >
                <div className="absolute inset-0 mix-blend-screen rounded-xl" style={{ backgroundColor: idx === detailIndex ? `${det.color}22` : 'transparent' }} />
              </button>
            ))}

            {capturedDetections.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-2 border border-white/10">
                <button onClick={() => setDetailIndex((i) => (i - 1 + capturedDetections.length) % capturedDetections.length)} className="p-1.5 rounded-full hover:bg-white/10 text-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-white text-xs font-semibold tabular-nums">{detailIndex + 1} / {capturedDetections.length}</span>
                <button onClick={() => setDetailIndex((i) => (i + 1) % capturedDetections.length)} className="p-1.5 rounded-full hover:bg-white/10 text-white">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
          </div>

          <div className="flex-1 px-6 sm:px-10 pb-12 overflow-y-auto bg-background relative z-10 -mt-10">
            <div className="flex flex-col gap-4 max-w-3xl mx-auto h-full">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-teal/20 flex items-center gap-2">
                  <Scan className="w-3 h-3" />
                  Akurasi {bestDetection ? Math.round(bestDetection.confidence) : 0}%
                </span>
                <span className="bg-blue-500/10 text-blue-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                  YOLOv8 Scan
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mt-2">
                Batik {bestDetection?.displayLabel ?? '—'}
              </h2>

              <p className="text-muted-foreground leading-relaxed text-lg md:text-xl font-medium mt-2">
                {bestDetection?.desc ?? 'Tidak ada detail untuk motif ini.'}
              </p>

              {bestDetection && (
                <div className="mt-6 flex flex-col gap-4 text-sm text-foreground/80 bg-secondary/20 p-6 rounded-2xl border border-border">
                  <p><strong className="text-foreground">Asal Daerah:</strong> {bestDetection.origin}</p>
                  <p><strong className="text-foreground">Makna Filosofis:</strong> {bestDetection.meaning}</p>
                  <p>
                    <strong className="text-foreground">Sumber Literatur:</strong>{' '}
                    <a href={bestDetection.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline italic">
                      {bestDetection.source}
                    </a>
                  </p>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={reset}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-teal px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-teal/20 transition-all hover:bg-teal/90 active:scale-95"
                >
                  <RotateCcw className="h-6 w-6" aria-hidden="true" />
                  Pindai Motif Lain
                </button>

                <button
                  type="button"
                  onClick={() => onFallback?.()}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-secondary px-8 py-4 text-lg font-semibold text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"
                >
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