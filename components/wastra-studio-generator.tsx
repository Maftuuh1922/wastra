'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'

type StudioState = 'idle' | 'generating' | 'done'

const sampleImages = [
  '/images/studio-sample-1.png',
  '/images/studio-sample-2.png',
  '/images/studio-sample-3.png',
]

interface WastraStudioGeneratorProps {
  externalPrompt?: string
  trigger?: number
}

export function WastraStudioGenerator({ externalPrompt, trigger }: WastraStudioGeneratorProps) {
  const [state, setState] = useState<StudioState>('idle')
  const [resultIndex, setResultIndex] = useState(0)
  const [lastPrompt, setLastPrompt] = useState('')

  const generate = (text: string) => {
    const trimmed = text?.trim()
    if (!trimmed || state === 'generating') return
    setLastPrompt(trimmed)
    setState('generating')
    setTimeout(() => {
      setResultIndex((i) => (i + 1) % sampleImages.length)
      setState('done')
    }, 2400)
  }

  // Trigger generation when the external trigger increments
  useEffect(() => {
    if (trigger && trigger > 0 && externalPrompt) {
      generate(externalPrompt)
    }
  }, [trigger])

  return (
    <div className="mx-auto w-full max-w-2xl">
      {state === 'idle' && (
        <div className="flex flex-col items-center justify-center p-10 text-center opacity-70">
          <motion.p 
            className="text-sm font-medium text-muted-foreground"
            variants={{
              hidden: { opacity: 1 },
              visible: { transition: { staggerChildren: 0.03 } }
            }}
            initial="hidden"
            animate="visible"
          >
            {"Ketik deskripsi batik di bawah, lalu tekan Enter untuk mulai berkreasi.".split("").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 2 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </div>
      )}

      {state === 'generating' && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta" aria-hidden="true" />
          <p className="text-sm font-medium text-muted-foreground">
            Meracik pola dan warna dari deskripsimu{'\u2026'}
          </p>
        </div>
      )}

      {state === 'done' && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative">
            <img
              src={sampleImages[resultIndex] || '/placeholder.svg'}
              alt={`Kreasi batik hasil AI terinspirasi dari deskripsi: ${lastPrompt}`}
              className="aspect-square w-full object-cover"
            />
            {/* Permanent disclaimer badge attached to every result */}
            <p className="absolute bottom-3 left-3 right-3 rounded-lg bg-[#3C3836]/90 px-3 py-2 text-center text-xs font-medium leading-relaxed text-[#FBF1C7] backdrop-blur-sm">
              Kreasi terinspirasi AI — bukan identifikasi motif otentik atau
              tervalidasi.
            </p>
          </div>
          <div className="flex flex-col gap-4 p-5 md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-terracotta">
                Kreasi Terinspirasi
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {'\u201C'}
                {lastPrompt}
                {'\u201D'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => generate(lastPrompt)}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-terracotta px-5 py-2.5 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta hover:text-[#FBF1C7]"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Generate Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
