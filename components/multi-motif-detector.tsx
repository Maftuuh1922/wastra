'use client'

import { useRef, useState } from 'react'
import { Loader2, RotateCcw, Upload } from 'lucide-react'

type DetectState = 'idle' | 'analyzing' | 'done'

// Bounding boxes as % of image dimensions (simulated detections)
const detections = [
  { label: 'Parang', confidence: 94, x: 2, y: 8, w: 23, h: 84 },
  { label: 'Kawung', confidence: 91, x: 27, y: 8, w: 23, h: 84 },
  { label: 'Mega Mendung', confidence: 88, x: 52, y: 8, w: 23, h: 84 },
  { label: 'Truntum', confidence: 83, x: 77, y: 8, w: 21, h: 84 },
]

export function MultiMotifDetector() {
  const [state, setState] = useState<DetectState>('idle')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const startAnalysis = (src: string) => {
    setImageSrc(src)
    setState('analyzing')
    setTimeout(() => setState('done'), 2600)
  }

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => startAnalysis(reader.result as string)
    reader.readAsDataURL(file)
  }

  const reset = () => {
    setState('idle')
    setImageSrc(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="mx-auto max-w-3xl">
      {state === 'idle' && (
        <div className="flex flex-col gap-4">
          <label
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-teal/50 bg-card px-6 py-16 text-center transition-colors hover:border-teal"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFile(e.dataTransfer.files[0])
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal">
              <Upload className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
            </div>
            <p className="font-serif text-lg font-bold text-foreground">
              Unggah foto berisi banyak motif
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Cocok untuk etalase toko, pameran, atau kain tambal
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          <button
            type="button"
            onClick={() => startAnalysis('/images/demo-multi.png')}
            className="mx-auto text-sm font-medium text-teal underline-offset-4 hover:underline"
          >
            Tidak punya foto? Coba dengan contoh etalase toko
          </button>
        </div>
      )}

      {state === 'analyzing' && imageSrc && (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8">
          <img
            src={imageSrc || '/placeholder.svg'}
            alt="Foto yang sedang dianalisis untuk deteksi banyak motif"
            className="max-h-80 rounded-xl object-cover"
          />
          <div className="flex items-center gap-3 text-teal">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <p className="text-sm font-medium">
              Mendeteksi motif-motif dalam foto{'\u2026'}
            </p>
          </div>
        </div>
      )}

      {state === 'done' && imageSrc && (
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-7">
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
              className="w-full object-cover"
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
                <span className="absolute -top-0.5 left-0 -translate-y-full rounded-t-md bg-teal px-2 py-0.5 text-xs font-semibold text-accent-foreground">
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
            Deteksi Foto Lain
          </button>
        </div>
      )}
    </div>
  )
}
