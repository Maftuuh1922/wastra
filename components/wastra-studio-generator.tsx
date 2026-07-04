'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, RefreshCw, Download, Share2, Maximize2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type FeedItem = {
  id: string
  prompt: string
  image: string | null
  isGenerating: boolean
}

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
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [activePrompt, setActivePrompt] = useState<string>('')
  
  // Ref for auto-scrolling
  const endOfFeedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom whenever feed changes
    if (feed.length > 0) {
      endOfFeedRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [feed])

  // Listen for 'new-chat' and 'load-history' events
  useEffect(() => {
    const handleNewChat = () => setFeed([])
    const handleLoadHistory = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        setFeed([{
          id: customEvent.detail.id,
          prompt: customEvent.detail.prompt,
          image: customEvent.detail.image_url,
          isGenerating: false
        }])
      }
    }

    window.addEventListener('new-chat', handleNewChat)
    window.addEventListener('load-history', handleLoadHistory)
    return () => {
      window.removeEventListener('new-chat', handleNewChat)
      window.removeEventListener('load-history', handleLoadHistory)
    }
  }, [])

  const generate = async (text: string, forceId?: string) => {
    const trimmed = text?.trim()
    if (!trimmed) return
    
    // Check if there's already a generating item
    if (feed.some(item => item.isGenerating)) return

    const newItemId = forceId || Date.now().toString()
    
    setFeed(prev => [...prev, {
      id: newItemId,
      prompt: trimmed,
      image: null,
      isGenerating: true
    }])
    
    try {
      const SPACE_URL = 'https://maftuh-main-wastra-lora-api.hf.space/generate'
      
      const response = await fetch(SPACE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed })
      })

      if (!response.ok) throw new Error('API Error')

      const blob = await response.blob()
      
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = async () => {
        const base64data = reader.result as string
        
        setFeed(prev => prev.map(item => 
          item.id === newItemId 
            ? { ...item, image: base64data, isGenerating: false } 
            : item
        ))

        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase.from('history').insert({
            user_id: session.user.id,
            prompt: trimmed,
            image_url: base64data
          })
          window.dispatchEvent(new Event('history-updated'))
        }
      }
    } catch (error) {
      console.error('Failed to generate image:', error)
      const fallbackUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)]
      
      setFeed(prev => prev.map(item => 
        item.id === newItemId 
          ? { ...item, image: fallbackUrl, isGenerating: false } 
          : item
      ))
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await supabase.from('history').insert({
          user_id: session.user.id,
          prompt: trimmed,
          image_url: fallbackUrl
        })
        window.dispatchEvent(new Event('history-updated'))
      }
    }
  }

  // Trigger generation when the external trigger increments
  useEffect(() => {
    if (trigger && trigger > 0 && externalPrompt) {
      generate(externalPrompt)
    }
  }, [trigger])

  const openLightbox = (image: string, prompt: string) => {
    setActiveImage(image)
    setActivePrompt(prompt)
    setIsFullscreen(true)
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col gap-8 pb-10">
      {feed.length === 0 && (
        <div className="flex flex-col items-center justify-center p-10 text-center opacity-70 mt-10">
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

      <AnimatePresence initial={false}>
        {feed.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 w-full"
          >
            {/* User Prompt Bubble */}
            <div className="flex justify-end w-full pl-12">
              <div className="bg-secondary/60 text-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-sm font-medium shadow-sm border border-border/50">
                {item.prompt}
              </div>
            </div>

            {/* AI Response Area */}
            <div className="flex justify-start w-full pr-12">
              {item.isGenerating ? (
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm w-full md:w-[400px]">
                  <Loader2 className="h-6 w-6 animate-spin text-teal shrink-0" aria-hidden="true" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground">Sedang meracik pola...</p>
                    <p className="text-xs text-muted-foreground">Proses memakan waktu 1-2 menit</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm w-full md:w-[400px]">
                  <div className="relative group cursor-pointer overflow-hidden" onClick={() => openLightbox(item.image!, item.prompt)}>
                    <img
                      src={item.image!}
                      alt={item.prompt}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                      <div className="bg-black/50 p-3 rounded-full text-white backdrop-blur-md">
                        <Maximize2 className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="absolute bottom-3 left-3 right-3 rounded-lg bg-[#3C3836]/90 px-3 py-2 text-center text-xs font-medium leading-relaxed text-[#FBF1C7] backdrop-blur-sm pointer-events-none">
                      Kreasi terinspirasi AI — bukan identifikasi motif otentik.
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openLightbox(item.image!, item.prompt)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-secondary"
                        title="Perbesar Gambar"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => generate(item.prompt, item.id + '-retry')}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Coba Lagi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div ref={endOfFeedRef} className="h-4" />

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && activeImage && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col backdrop-blur-md animate-in fade-in duration-200">
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
                        text: `Lihat gambar batik kreasiku dari Wastra.ai dengan prompt: "${activePrompt}"`,
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
                  link.href = activeImage
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
          
          <div className="flex-1 flex items-center justify-center p-4">
            <img 
              src={activeImage} 
              alt="Batik Fullscreen" 
              className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain rounded-md shadow-2xl"
            />
          </div>
          
          <div className="p-6 md:p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white/50 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">Kreasi Terinspirasi dari</p>
            <p className="text-white text-sm md:text-lg max-w-2xl mx-auto font-serif leading-relaxed">
              "{activePrompt}"
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

