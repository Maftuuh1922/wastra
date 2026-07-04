'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, Download, Share2, Maximize2, X } from 'lucide-react'

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
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [resultImage, setResultImage] = useState<string | null>(null)

  const generate = async (text: string) => {
    const trimmed = text?.trim()
    if (!trimmed || state === 'generating') return
    setLastPrompt(trimmed)
    setState('generating')
    
    try {
      // PENTING: Karena generate gambar AI (LoRA) membutuhkan waktu ~1-2 menit di CPU gratis, 
      // Vercel Backend (Hobby tier) akan memutus koneksi dalam 10 detik (504 Gateway Timeout).
      // Solusinya: Kita panggil langsung API Hugging Face dari Frontend untuk mem-bypass Vercel!
      const SPACE_URL = 'https://maftuh-main-wastra-lora-api.hf.space/generate'
      
      const response = await fetch(SPACE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: trimmed })
      })

      if (!response.ok) throw new Error('API Error')

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setResultImage(imageUrl)
      setState('done')
    } catch (error) {
      console.error('Failed to generate image:', error)
      // Fallback to demo mode if API fails
      setResultIndex((i) => (i + 1) % sampleImages.length)
      setResultImage(null)
      setState('done')
    }
  }

  // Trigger generation when the external trigger increments
  useEffect(() => {
    if (trigger && trigger > 0 && externalPrompt) {
      generate(externalPrompt)
    }
  }, [trigger])

  return (
    <div className="mx-auto w-full max-w-md">
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
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-teal" aria-hidden="true" />
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground">
              Mewujudkan imajinasi: <span className="italic text-teal">"{lastPrompt}"</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Meracik pola dan warna (bisa memakan waktu 1-2 menit){'\u2026'}
            </p>
          </div>
        </div>
      )}

      {state === 'done' && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative group cursor-pointer overflow-hidden" onClick={() => setIsFullscreen(true)}>
            <img
              src={resultImage || sampleImages[resultIndex] || '/placeholder.svg'}
              alt={`Kreasi batik hasil AI terinspirasi dari deskripsi: ${lastPrompt}`}
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
              <div className="bg-black/50 p-3 rounded-full text-white backdrop-blur-md">
                <Maximize2 className="h-6 w-6" />
              </div>
            </div>
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

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col backdrop-blur-md animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
            <button 
              onClick={() => setIsFullscreen(false)} 
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: 'Kreasi Wastra Studio',
                        text: `Lihat gambar batik kreasiku dari Wastra.ai dengan prompt: "${lastPrompt}"`,
                        url: window.location.href,
                      })
                    } catch (e) {
                      console.log('User cancelled share')
                    }
                  } else {
                    alert('Fitur share tidak didukung di browser ini.')
                  }
                }}
                className="text-white hover:bg-white/10 p-2.5 rounded-full transition-colors flex items-center justify-center"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button 
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = resultImage || sampleImages[resultIndex] || '/placeholder.svg'
                  link.download = `wastra-studio-${Date.now()}.png`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
                className="text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors flex items-center gap-2 px-5 border border-white/10"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm font-semibold hidden md:inline">Simpan</span>
              </button>
            </div>
          </div>
          
          {/* Image Area */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img 
              src={resultImage || sampleImages[resultIndex] || '/placeholder.svg'} 
              alt="Batik Fullscreen" 
              className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain rounded-md shadow-2xl"
            />
          </div>
          
          {/* Bottom Prompt Info */}
          <div className="p-6 md:p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white/50 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">Kreasi Terinspirasi dari</p>
            <p className="text-white text-sm md:text-lg max-w-2xl mx-auto font-serif leading-relaxed">
              "{lastPrompt}"
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
