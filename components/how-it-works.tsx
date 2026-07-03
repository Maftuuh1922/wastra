import Link from 'next/link'
import { ScanLine } from 'lucide-react'

const steps = [
  {
    number: '1',
    title: 'Foto atau Unggah',
    description:
      'Ambil foto kain batik dengan kamera ponsel, atau unggah gambar yang sudah ada.',
  },
  {
    number: '2',
    title: 'AI Menganalisis',
    description:
      'Sistem mengenali pola visual dan mencocokkannya dengan katalog motif Nusantara.',
  },
  {
    number: '3',
    title: 'Kenali Ceritanya',
    description:
      'Dapatkan nama motif, asal daerah, tingkat keyakinan, dan filosofi di baliknya.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
            Cara Pakai
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Semudah 1 — 2 — 3
          </h2>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <div key={s.number} className="relative flex flex-col items-center text-center">
              {i < steps.length - 1 && (
                <div
                  className="absolute left-[calc(50%+2.5rem)] top-7 hidden h-px w-[calc(100%-5rem)] bg-border md:block"
                  aria-hidden="true"
                />
              )}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold font-serif text-xl font-bold text-foreground">
                {s.number}
              </div>
              <h3 className="mt-5 font-serif text-lg font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/scan-cepat"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-base font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            <ScanLine className="h-5 w-5" aria-hidden="true" />
            Mulai Scan Sekarang
          </Link>
        </div>
      </div>
    </section>
  )
}
