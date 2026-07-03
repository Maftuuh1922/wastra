import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { ScanCepatUploader } from '@/components/scan-cepat-uploader'

export const metadata: Metadata = {
  title: 'Scan Cepat — Wastra.ai',
  description:
    'Foto sehelai kain batik dan kenali nama motif, asal daerah, serta tingkat keyakinannya dalam hitungan detik.',
}

export default function ScanCepatPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background pb-24 pt-32 md:pt-36">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">
              Alat Identifikasi
            </p>
            <h1 className="mt-3 text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
              Scan Cepat
            </h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Unggah atau foto satu kain batik, dan dapatkan nama motif, asal
              daerah, beserta tingkat keyakinan hasilnya.
            </p>
          </div>
          <ScanCepatUploader />
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
