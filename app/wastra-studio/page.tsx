import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { WastraStudioGenerator } from '@/components/wastra-studio-generator'

export const metadata: Metadata = {
  title: 'Wastra Studio — Wastra.ai',
  description:
    'Tuliskan deskripsi batik impianmu dan biarkan AI meracik kreasi visual terinspirasi motif Nusantara. Alat kreasi, bukan validasi keaslian.',
}

export default function WastraStudioPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background pb-24 pt-32 md:pt-36">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
              Alat Kreasi
            </p>
            <h1 className="mt-3 text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
              Wastra Studio
            </h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Ketik deskripsi batik yang kamu bayangkan — misalnya motif, warna,
              dan gaya daerah — lalu biarkan AI meracik kreasi visual baru yang
              terinspirasi kekayaan wastra Nusantara.
            </p>
          </div>
          <WastraStudioGenerator />
          <p className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-contrast p-4 text-center text-xs leading-relaxed text-muted-foreground">
            Wastra Studio adalah alat eksplorasi kreatif. Gambar yang dihasilkan
            merupakan kreasi terinspirasi AI, bukan identifikasi maupun
            sertifikasi keaslian motif tradisional. Untuk identifikasi motif,
            gunakan Scan Cepat atau Deteksi Multi-Motif.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
