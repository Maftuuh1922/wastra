import Link from 'next/link'
import { Camera, ImageUp, ScanLine, Search } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'

const steps = [
  {
    number: '1',
    title: 'Foto atau Unggah',
    description:
      'Ambil foto kain batik dengan kamera ponsel, atau unggah gambar yang sudah ada.',
    icon: Camera,
  },
  {
    number: '2',
    title: 'AI Menganalisis',
    description:
      'Sistem mengenali pola visual dan mencocokkannya dengan katalog motif Nusantara.',
    icon: Search,
  },
  {
    number: '3',
    title: 'Kenali Ceritanya',
    description:
      'Dapatkan nama motif, asal daerah, tingkat keyakinan, dan filosofi di baliknya.',
    icon: ImageUp,
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <ScrollReveal direction="down" className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
            Cara Kerja
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Tiga Langkah Mudah
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <ScrollReveal key={s.title} delay={0.2 + i * 0.15}>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm border border-border transition-transform hover:scale-110 duration-300">
                  <s.icon className="h-8 w-8 text-gold" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.6} direction="up" className="mt-14 flex justify-center">
          <Link
            href="/ai"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-secondary transition-opacity hover:opacity-90 shadow-lg"
          >
            <ScanLine className="h-5 w-5" aria-hidden="true" />
            Get Started
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
