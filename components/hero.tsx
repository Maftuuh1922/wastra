import Link from 'next/link'
import Image from 'next/image'
import { ScanLine, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden w-full px-4 pt-16 pb-12 md:px-6 md:pt-20 lg:px-8">

      {/* Massive Rounded Container */}
      <div className="relative z-10 flex min-h-[85vh] w-full flex-col overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-[#3c3836] shadow-2xl">
        
        {/* Background Image */}
        <Image
          src="/images/hero-batik-banana.png"
          alt="Perajin batik sedang membatik dengan canting di atas kain bermotif tradisional"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Gradient Overlay (only for BG image to darken the room) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(60,56,54,0.4) 0%, rgba(60,56,54,0.2) 30%, rgba(60,56,54,0.85) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Huge Background Text - Text Behind Subject Illusion */}
        <div className="absolute top-28 left-0 right-0 z-10 flex justify-center px-4 md:top-8 pointer-events-none">
          <h1 className="elegant-reveal whitespace-nowrap text-[20vw] leading-[0.8] tracking-tight text-[#FBF1C7]/70 font-serif select-none md:text-[13vw] drop-shadow-md">
            WASTRA
          </h1>
        </div>

        {/* Foreground Image (Cutout) */}
        <Image
          src="/images/hero-batik-banana-fg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover z-20 pointer-events-none"
        />

        {/* Main Content Area (Bottom Aligned) */}
        <div className="relative z-20 flex flex-1 flex-col justify-end px-6 pb-12 pt-[30vh] md:px-12 md:pb-16 lg:px-20 lg:pb-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              <p className="mb-5 inline-block rounded-full border border-[#FBF1C7]/40 bg-[#FBF1C7]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FBF1C7] backdrop-blur-sm">
                Melestarikan Wastra Nusantara dengan AI
              </p>
              <h2 className="text-balance font-serif text-3xl font-bold leading-tight text-[#FBF1C7] md:text-5xl lg:text-6xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
                Kenali Motif Batik <br /> di Genggaman Anda
              </h2>
              <p className="mt-5 max-w-xl text-pretty leading-relaxed text-[#FBF1C7]/90 md:text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                Foto sehelai kain, dan Wastra.ai membantu Anda mengenali nama motif,
                asal daerah, serta cerita budaya di baliknya — dalam hitungan detik.
              </p>
              
              <div className="mt-4 flex items-start gap-2 max-w-[280px] sm:max-w-fit rounded-lg bg-[#3c3836]/40 px-3 py-2 text-xs text-[#FBF1C7]/80 backdrop-blur-sm overflow-hidden transform-gpu border border-[#FBF1C7]/10 drop-shadow-md">
                <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#FBF1C7]" />
                <span className="leading-relaxed">Didukung 3 Model AI: <strong>MobileNetV3, YOLOv8, & Stable Diffusion</strong></span>
              </div>
              
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FBF1C7] px-8 py-3.5 text-base font-semibold text-[#3c3836] transition-all hover:bg-[#FBF1C7]/90 hover:scale-[1.02] shadow-lg"
                >
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  Mulai Sekarang
                </Link>
              </div>
            </div>

            {/* Right Mini Card */}
            <div className="hidden shrink-0 overflow-hidden rounded-2xl border border-[#FBF1C7]/20 shadow-2xl lg:block bg-[#3c3836]/60 backdrop-blur-md p-2 w-[280px]">
               <div className="relative h-[150px] w-full rounded-xl overflow-hidden">
                 <Image
                  src="/images/hero-batik-banana.png"
                  alt="Preview Motif"
                  fill
                  sizes="(min-width: 1024px) 280px, 100vw"
                  className="object-cover opacity-90"
                 />
               </div>
               <div className="mt-3 flex items-center justify-between px-2 pb-1">
                 <span className="text-sm font-semibold text-[#FBF1C7]">Yogyakarta</span>
                 <span className="rounded-full border border-[#FBF1C7]/40 bg-[#FBF1C7]/10 px-2 py-0.5 text-xs font-medium text-[#FBF1C7]">Motif Kawung</span>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
