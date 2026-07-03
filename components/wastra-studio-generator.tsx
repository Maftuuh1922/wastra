'use client'

import { useState } from 'react'
import { Loader2, Palette, RefreshCw, Sparkles } from 'lucide-react'

type StudioState = 'idle' | 'generating' | 'done'

const sampleImages = [
  '/images/studio-sample-1.png',
  '/images/studio-sample-2.png',
  '/images/studio-sample-3.png',
]

const promptIdeas = [
  'Batik kawung warna coklat gaya Yogyakarta',
  'Mega mendung biru dengan sentuhan modern',
  'Parang emas untuk kain pesta',
]

export function WastraStudioGenerator() {
  const [prompt, setPrompt] = useState('')
  const [state, setState] = useState<StudioState>('idle')
  const [resultIndex, setResultIndex] = useState(0)
  const [lastPrompt, setLastPrompt] = useState('')

  const generate = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || state === 'generating') return
    setLastPrompt(trimmed)
    setState('generating')
    setTimeout(() => {
      setResultIndex((i) => (i + 1) % sampleImages.length)
      setState('done')
    }, 2400)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:p-6"
        onSubmit={(e) => {
          e.preventDefault()
          generate(prompt)
        }}
      >
        <label
          htmlFor="studio-prompt"
          className="flex items-center gap-2 font-serif text-lg font-bold text-foreground"
        >
          <Palette className="h-5 w-5 text-terracotta" aria-hidden="true" />
          Deskripsikan batik impianmu
        </label>
        <textarea
          id="studio-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              generate(prompt)
            }
          }}
          rows={3}
          placeholder="Contoh: batik kawung warna coklat gaya Yogyakarta"
          className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <div className="flex flex-wrap gap-2">
          {promptIdeas.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => setPrompt(idea)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-terracotta hover:text-terracotta"
            >
              {idea}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={!prompt.trim() || state === 'generating'}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Generate Kreasi Batik
        </button>
      </form>

      {state === 'generating' && (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta" aria-hidden="true" />
          <p className="text-sm font-medium text-muted-foreground">
            Meracik pola dan warna dari deskripsimu{'\u2026'}
          </p>
        </div>
      )}

      {state === 'done' && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
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
