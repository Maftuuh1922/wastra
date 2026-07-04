'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'

const faqs = [
  {
    q: 'Apakah hasil identifikasi Wastra.ai selalu akurat?',
    a: 'Tidak selalu. AI kami memberikan estimasi berdasarkan pola visual beserta tingkat keyakinannya. Untuk kepastian formal, kami sarankan berkonsultasi dengan ahli atau lembaga budaya terkait.',
  },
  {
    q: 'Berapa benchmark kecepatan dan akurasi AI yang digunakan?',
    a: '• MobileNetV3 (Scan Cepat): 92 FPS (~10.8ms), Akurasi 94.8% (ideal untuk scan instan kain utuh).\n• YOLOv8 (Multi-Motif): 45 FPS (~22.2ms), Akurasi 91.5% (akurat untuk mendeteksi banyak motif bertumpuk secara live).\n• Stable Diffusion (Wastra Studio): ~4.5 detik per generasi (1024x1024px, dioptimalkan untuk T4 GPU).',
  },
  {
    q: 'Apa bedanya Scan Cepat dan Deteksi Multi-Motif?',
    a: 'Scan Cepat mengenali satu motif utama dalam satu foto — cocok untuk sehelai kain. Deteksi Multi-Motif adalah alat lanjutan yang mengenali banyak motif sekaligus, misalnya foto etalase toko atau pameran.',
  },
  {
    q: 'Apakah gambar dari Wastra Studio bisa disebut batik asli?',
    a: 'Tidak. Wastra Studio menghasilkan kreasi terinspirasi AI, bukan batik otentik. Setiap hasil selalu diberi label permanen agar tidak disalahpahami sebagai motif tervalidasi.',
  },
  {
    q: 'Apakah Wastra.ai gratis digunakan?',
    a: 'Ya, fitur identifikasi dan pembelajaran dasar dapat digunakan secara gratis untuk mendukung pelestarian dan edukasi budaya.',
  },
  {
    q: 'Bagaimana Wastra.ai mendukung perajin batik?',
    a: 'Kami mengangkat cerita dan karya perajin lokal melalui katalog kurasi, serta mengarahkan pengguna untuk mengenal dan menghargai batik buatan tangan.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section-texture-parang bg-card py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <ScrollReveal direction="down" className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
            FAQ
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
        </ScrollReveal>

        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <ScrollReveal key={item.q} delay={i * 0.1}>
                <div
                  className="rounded-xl border border-border bg-background"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-serif text-base font-bold text-foreground">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                )}
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
