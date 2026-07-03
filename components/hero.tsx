import Link from 'next/link'
import { ScanLine, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-end">
      <img
        src="/images/hero-batik.png"
        alt="Perajin batik sedang membatik dengan canting di atas kain bermotif tradisional"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(60,56,54,0.55), rgba(60,56,54,0.15) 50%, rgba(60,56,54,0.65))',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-40 md:px-8">
        <p className="mb-4 inline-block rounded-full border border-[#FBF1C7]/40 px-4 py-1.5 text-xs font-medium tracking-wide text-[#FBF1C7]">
          Melestarikan Wastra Nusantara dengan AI
        </p>
        <h1 className="max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-[#FBF1C7] md:text-6xl">
          Kenali Motif Batik di Genggaman Anda
        </h1>
        <p className="mt-5 max-w-xl text-pretty leading-relaxed text-[#FBF1C7]/85 md:text-lg">
          Foto sehelai kain, dan Wastra.ai membantu Anda mengenali nama motif,
          asal daerah, serta cerita budaya di baliknya — dalam hitungan detik.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/scan-cepat"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-base font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            <ScanLine className="h-5 w-5" aria-hidden="true" />
            Scan Cepat — Kenali Motif Ini
          </Link>
          <Link
            href="/wastra-studio"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#FBF1C7]/50 px-7 py-3.5 text-base font-semibold text-[#FBF1C7] transition-colors hover:bg-[#FBF1C7]/10"
          >
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            Jelajahi Wastra Studio
          </Link>
        </div>
      </div>
    </section>
  )
}
