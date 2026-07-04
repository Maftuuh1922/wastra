'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Palette,
  ScanLine,
  ScanSearch,
  ArrowLeft,
  Plus,
  Mic,
  Image as ImageIcon,
  HelpCircle,
  X,
  Info,
  Sparkles,
  ArrowUp
} from 'lucide-react'
import { ScanCepatUploader } from './scan-cepat-uploader'
import { MultiMotifDetector } from './multi-motif-detector'
import { WastraStudioGenerator } from './wastra-studio-generator'

type TabId = 'scan-cepat' | 'multi-motif' | 'wastra-studio'

interface UnifiedAiWorkspaceProps {
  initialTab?: string
}

const models = [
  {
    id: 'wastra-studio',
    label: 'Wastra Studio',
    desc: 'SD + LoRA (Kreasi teks ke gambar)',
    icon: Palette,
  },
  {
    id: 'scan-cepat',
    label: 'Scan Cepat',
    desc: 'MobileNetV3 (Klasifikasi instan)',
    icon: ScanLine,
  },
  {
    id: 'multi-motif',
    label: 'Multi-Motif',
    desc: 'YOLOv8 (Deteksi banyak motif)',
    icon: ScanSearch,
  },
] as const

export function UnifiedAiWorkspace({
  initialTab = 'wastra-studio',
}: UnifiedAiWorkspaceProps) {
  const defaultTab: TabId = (['scan-cepat', 'multi-motif', 'wastra-studio'].includes(
    initialTab
  )
    ? initialTab
    : 'wastra-studio') as TabId

  const [activeModel, setActiveModel] = useState<TabId>(defaultTab)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Wastra Studio specific state hosted here to connect the unified input bar
  const [prompt, setPrompt] = useState('')
  const [studioTrigger, setStudioTrigger] = useState(0)

  // UI states for info and popups
  const [showPopup, setShowPopup] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  // Click outside to close dropdown
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedModelDef = models.find((m) => m.id === activeModel)!

  return (
    <div className="relative flex h-full w-full flex-col items-center pt-24 pb-12">
      {/* Floating Popup (Toast) */}
      {showPopup && (
        <div className="fixed top-auto bottom-36 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setShowPopup(false)}
            className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 text-gold shrink-0" />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-foreground">Sekilas Tentang Model AI Wastra</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                • <strong>MobileNetV3:</strong> Klasifikasi 1 motif super cepat.<br />
                • <strong>YOLOv8:</strong> Deteksi banyak motif sekaligus.<br />
                • <strong>SD+LoRA:</strong> Kreasi gambar dari teks deskripsi.
              </p>
            </div>
          </div>
        </div>
      )}



      {/* Main Content Area */}
      <div className={`flex w-full flex-1 flex-col items-center justify-start no-scrollbar ${
        activeModel === 'multi-motif' 
          ? 'max-w-none p-0 relative overflow-hidden' 
          : 'max-w-4xl overflow-y-auto px-5 pb-6 pt-10'
      }`}>
        {/* Central Greeting (Visible mostly when idle or generating) */}
        <h1 className={`relative z-40 text-center font-serif text-2xl md:text-3xl font-bold lg:text-5xl pointer-events-none transition-all duration-500 ${
          activeModel === 'multi-motif' 
            ? 'hidden' 
            : 'mb-4 md:mb-10 text-foreground'
        }`}>
          {activeModel === 'wastra-studio'
            ? 'Ada ide motif batik baru untuk dieksplorasi?'
            : activeModel === 'multi-motif'
            ? 'Deteksi banyak motif sekaligus (YOLO)'
            : 'Pindai dan kenali motif batik Anda'}
        </h1>

        {activeModel !== 'multi-motif' && (
          <p className="text-center text-sm md:text-base text-muted-foreground max-w-xl mx-auto -mt-1 mb-6 md:mb-10 animate-in fade-in slide-in-from-bottom-2">
            {activeModel === 'wastra-studio' 
              ? 'Model cerdas (SD + LoRA) ini memungkinkan Anda mengkreasi pola dan gambar batik baru yang unik berdasarkan imajinasi teks Anda.'
              : 'Model ringan (MobileNetV3) ini dapat mengenali 38 jenis motif batik dominan dari foto kain Anda hanya dalam hitungan detik.'}
          </p>
        )}

        {/* Dynamic Model View */}
        <div className={`w-full animate-in fade-in zoom-in-95 duration-300 ${
          activeModel === 'multi-motif' ? 'absolute inset-0' : ''
        }`}>
          {activeModel === 'scan-cepat' && <ScanCepatUploader />}
          {activeModel === 'multi-motif' && <MultiMotifDetector onFallback={() => setActiveModel('scan-cepat')} />}
          {activeModel === 'wastra-studio' && (
            <WastraStudioGenerator
              externalPrompt={prompt}
              trigger={studioTrigger}
            />
          )}
        </div>
      </div>

      {/* Gemini-Style Unified Input/Action Bar */}
      <div className={`w-full max-w-3xl px-5 mx-auto flex flex-col items-center justify-center transition-all duration-500 ${
        activeModel === 'multi-motif' ? 'absolute bottom-24 z-40' : 'mt-auto'
      }`}>
        <div className={`relative flex items-center rounded-full border border-border p-1.5 md:p-2 shadow-sm focus-within:ring-2 focus-within:ring-gold transition-all duration-500 ease-out ${
          activeModel === 'wastra-studio' ? 'w-full bg-card' : 'w-fit shadow-md bg-card/90 backdrop-blur-md'
        }`}>
          
          {activeModel === 'wastra-studio' && (
            <button className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground">
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}

          {activeModel === 'wastra-studio' ? (
            <>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && prompt.trim()) {
                    setStudioTrigger((prev) => prev + 1)
                    setPrompt('') // Clear prompt after send
                  }
                }}
                placeholder="Ketik imajinasi batik Anda di sini..."
                className="mx-2 md:mx-3 flex-1 min-w-0 bg-transparent py-2 md:py-3 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              
              {/* Send Button (Muncul jika ada teks) */}
              {prompt.trim().length > 0 && (
                <button 
                  onClick={() => {
                    setStudioTrigger((prev) => prev + 1)
                    setPrompt('') // Clear prompt after send
                  }}
                  className="mr-1 md:mr-2 flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-teal text-white hover:bg-teal/90 transition-all shadow-md animate-in zoom-in-90"
                >
                  <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              )}
            </>
          ) : null}

          {/* Model Switcher Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center rounded-full bg-background font-semibold text-foreground hover:bg-secondary transition-all ${
                activeModel === 'wastra-studio' 
                  ? 'gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm' 
                  : 'gap-2.5 px-5 py-2 text-sm md:text-base'
              }`}
            >
              <selectedModelDef.icon className="h-4 w-4 text-gold shrink-0" />
              
              {/* Desktop always shows full label */}
              <span className="hidden sm:inline whitespace-nowrap">{selectedModelDef.label}</span>
              
              {/* Mobile shows "Model" if in studio mode (to save space), else shows full label */}
              <span className="inline sm:hidden whitespace-nowrap">
                {activeModel === 'wastra-studio' ? 'Model' : selectedModelDef.label}
              </span>

              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-full right-0 mb-3 w-64 overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-lg shadow-foreground/10 animate-in fade-in slide-in-from-bottom-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setActiveModel(model.id as TabId)
                      setDropdownOpen(false)
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-secondary ${
                      activeModel === model.id ? 'bg-secondary/50' : ''
                    }`}
                  >
                    <model.icon
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        activeModel === model.id
                          ? 'text-gold'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {model.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {model.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeModel === 'wastra-studio' && (
            <button className="ml-1 md:ml-2 flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground">
              <Mic className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}
        </div>
        
        {/* Gemini AI Disclaimer Text and Info Modal */}
        <div className={`relative flex flex-col items-center justify-center gap-2 text-center z-[100] transition-all duration-500 ${
          activeModel === 'multi-motif' ? 'absolute bottom-6 w-full px-5' : 'mt-4'
        }`}>
          <p className={`text-[11px] ${activeModel === 'multi-motif' ? 'text-white/70 mix-blend-difference' : 'text-muted-foreground'}`}>
            Wastra.ai dapat membuat kesalahan dalam mengenali motif. Harap periksa kembali informasinya.
          </p>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`relative font-bold text-xs group transition-colors ${
              activeModel === 'multi-motif' ? 'text-white hover:text-teal-300 drop-shadow-md' : 'text-foreground hover:text-teal'
            }`}
            aria-label="Info Detail Model AI"
          >
            Detail & Akurasi Model AI
            <span className={`absolute -bottom-1 left-0 h-1 w-full rounded-full transition-colors ${
              activeModel === 'multi-motif' ? 'bg-teal-400/40 group-hover:bg-teal-300' : 'bg-teal/40 group-hover:bg-teal'
            }`} />
          </button>
          
          {/* Animated Pop-out Modal */}
          <div 
            className={`absolute bottom-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-sm md:max-w-none md:w-[550px] lg:w-[650px] rounded-3xl border border-border bg-card p-5 md:p-7 shadow-2xl transition-all duration-300 ease-out origin-bottom text-left z-50 ${
              showInfo ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-50 translate-y-6 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                Spesifikasi Model AI
              </h4>
              <button onClick={() => setShowInfo(false)} className="rounded-full p-1 hover:bg-secondary text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-col gap-5 text-xs text-muted-foreground leading-relaxed max-h-[50vh] md:max-h-[65vh] overflow-y-auto pr-3 no-scrollbar">
              <div className="rounded-xl bg-secondary/30 p-5 border border-border/50 shadow-sm">
                <strong className="text-foreground text-base block mb-2">1. Scan Cepat (MobileNetV3)</strong>
                <p className="mb-5 text-justify">
                  MobileNetV3 dirancang khusus untuk pemrosesan citra instan. Model klasifikasi ini bekerja dengan mengidentifikasi satu pola motif paling dominan dalam sebuah gambar. Sangat ideal digunakan untuk memindai satu lembar kain batik utuh secara cepat, memberikan hasil (nama motif dan asal) nyaris tanpa waktu tunggu (<em>real-time</em>) dengan tingkat akurasi yang sangat tinggi.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      <span>Kecepatan Pemrosesan</span>
                      <span className="text-foreground">92 FPS (~10.8 ms)</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-teal w-[92%] rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      <span>Tingkat Kepastian (Confidence)</span>
                      <span className="text-foreground">94.8%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gold w-[95%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-secondary/30 p-5 border border-border/50 shadow-sm">
                <strong className="text-foreground text-base block mb-2">2. Multi-Motif (YOLOv8)</strong>
                <p className="mb-5 text-justify">
                  YOLO (<em>You Only Look Once</em>) versi 8 adalah model deteksi objek mutakhir yang memindai gambar layaknya radar. AI ini tidak sekadar menebak gambar, melainkan melacak lokasi spasial untuk mengotak-ngotakkan (<em>bounding box</em>) puluhan motif berbeda secara bersamaan dalam satu lensa. Sangat cocok mendeteksi orang-orang yang sedang memakai baju batik berbeda di tengah keramaian.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      <span>Kecepatan Deteksi Kamera</span>
                      <span className="text-foreground">90.8 FPS (~11 ms)</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-teal w-[91%] rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      <span>Rata-Rata Kepastian Multi-Objek</span>
                      <span className="text-foreground">51.8%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-orange-400 w-[52%] rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      <span>Rasio Kesuksesan Pelacakan</span>
                      <span className="text-foreground">79.3%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gold w-[79%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-secondary/30 p-5 border border-border/50 shadow-sm">
                <strong className="text-foreground text-base block mb-2">3. Wastra Studio (SD + LoRA)</strong>
                <p className="mb-5 text-justify">
                  Wastra Studio adalah model kecerdasan buatan generatif berbasis <em>Stable Diffusion</em> yang tidak mendeteksi, melainkan <strong>menciptakan</strong>. Model ini telah melalui proses penyempurnaan mendalam (<em>fine-tuning</em>) menggunakan teknik <em>Low-Rank Adaptation</em> (LoRA) dengan dataset khusus berisi puluhan motif regional dari Sabang sampai Merauke. Hasilnya, AI mampu menerjemahkan imajinasi teks Anda menjadi mahakarya visual batik yang memiliki filosofi dan kedalaman warna ultra-realistis.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      <span>Kualitas & Kerapian Visual (FID)</span>
                      <span className="text-foreground">Sangat Tinggi (95%)</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gold w-[95%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
