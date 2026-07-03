'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2, MapPin, RotateCcw, Upload } from 'lucide-react'

type ScanState = 'idle' | 'analyzing' | 'done'

const demoResult = {
  motif: 'Kawung',
  region: 'Yogyakarta',
  confidence: 92,
  philosophy:
    'Motif Kawung tersusun dari lingkaran-lingkaran yang saling bertumpuk, terinspirasi buah aren. Motif ini melambangkan kesucian hati, pengendalian diri, dan harapan agar pemakainya menjadi manusia yang berguna bagi sesama.',
}

export function ScanCepatUploader() {
  const [state, setState] = useState<ScanState>('idle')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const startAnalysis = (src: string) => {
    setImageSrc(src)
    setState('analyzing')
    setTimeout(() => setState('done'), 2200)
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
    <div className="mx-auto max-w-2xl">
      {state === 'idle' && (
        <div className="flex flex-col gap-4">
          <label
            className="group relative flex cursor-pointer flex-col items-center justify-center gap-5 rounded-[2.5rem] border-2 border-dashed border-teal/40 bg-gradient-to-b from-card/80 to-card/30 px-6 py-20 text-center transition-all duration-300 hover:border-teal hover:bg-teal/5 hover:shadow-[0_8px_40px_rgba(69,133,136,0.12)] overflow-hidden"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFile(e.dataTransfer.files[0])
            }}
          >
            {/* Glowing background effect on hover */}
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-teal/0 blur-2xl transition-all duration-500 group-hover:bg-teal/10" />
            
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-sm ring-1 ring-border transition-all duration-500 group-hover:scale-110 group-hover:shadow-md group-hover:ring-teal/60">
              <Upload className="h-10 w-10 text-teal transition-transform duration-500 group-hover:-translate-y-1.5" aria-hidden="true" />
              {/* Subtle ping animation on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-teal opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-30" style={{ animationDuration: '2s' }} />
            </div>
            
            <div className="space-y-2">
              <p className="font-serif text-2xl md:text-3xl font-bold text-foreground transition-colors duration-300 group-hover:text-teal">
                Unggah Foto Kain
              </p>
              <p className="text-sm md:text-base text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Tarik & lepas file foto batik Anda di sini, atau <span className="font-semibold text-teal underline underline-offset-4">telusuri perangkat</span>
              </p>
            </div>
            
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
            onClick={() => startAnalysis('/images/demo-scan.png')}
            className="mx-auto text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Atau coba dengan kain kawung contoh
          </button>
        </div>
      )}

      {state === 'analyzing' && imageSrc && (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8">
          <img
            src={imageSrc || '/placeholder.svg'}
            alt="Foto kain batik yang sedang dianalisis"
            className="max-h-72 rounded-xl object-cover"
          />
          <div className="flex items-center gap-3 text-teal">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <p className="text-sm font-medium">Menganalisis pola visual{'\u2026'}</p>
          </div>
        </div>
      )}

      {state === 'done' && imageSrc && (
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:p-8">
            <img
              src={imageSrc || '/placeholder.svg'}
              alt="Foto kain batik yang dianalisis"
              className="h-full max-h-80 w-full rounded-xl object-cover"
            />
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-teal">
                  Hasil Identifikasi
                </p>
                <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">
                  Motif {demoResult.motif}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-olive" aria-hidden="true" />
                  Asal daerah: {demoResult.region}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Tingkat Keyakinan</span>
                  <span className="font-semibold text-teal">
                    {demoResult.confidence}%
                  </span>
                </div>
                <div
                  className="mt-2 h-2.5 overflow-hidden rounded-full bg-contrast"
                  role="progressbar"
                  aria-valuenow={demoResult.confidence}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Tingkat keyakinan identifikasi"
                >
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${demoResult.confidence}%` }}
                  />
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {demoResult.philosophy}
              </p>

              <button
                type="button"
                onClick={reset}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Scan Foto Lain
              </button>
            </div>
          </div>

          <Link
            href="/ai?tab=multi-motif"
            className="group flex items-center justify-between rounded-xl border border-teal/40 bg-card px-5 py-4 transition-colors hover:border-teal"
          >
            <span className="text-sm text-foreground">
              Foto ini berisi lebih dari satu motif?{' '}
              <span className="font-semibold text-teal">Coba Deteksi Multi-Motif</span>
            </span>
            <ArrowRight
              className="h-4 w-4 text-teal transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      )}
    </div>
  )
}
