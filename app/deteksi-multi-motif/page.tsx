import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { MultiMotifDetector } from '@/components/multi-motif-detector'

export const metadata: Metadata = {
  title: 'Deteksi Multi-Motif — Wastra.ai',
  description:
    'Alat identifikasi lanjutan: kenali banyak motif batik sekaligus dalam satu foto, lengkap dengan penanda posisi tiap motif.',
}

export default function DeteksiMultiMotifPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background pb-24 pt-32 md:pt-36">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">
              Alat Identifikasi — Mode Lanjutan
            </p>
            <h1 className="mt-3 text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
              Deteksi Multi-Motif
            </h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Berbeda dari Scan Cepat — alat ini mengenali banyak motif
              sekaligus dalam satu foto, lengkap dengan penanda posisi dan
              tingkat keyakinan tiap motif.
            </p>
          </div>
          <MultiMotifDetector />
          <p className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-contrast p-4 text-center text-xs leading-relaxed text-muted-foreground">
            Hasil analisis AI bersifat estimasi berdasarkan pola visual, bukan
            sertifikasi resmi keaslian motif. Untuk verifikasi formal,
            disarankan berkonsultasi dengan ahli atau lembaga budaya terkait.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
