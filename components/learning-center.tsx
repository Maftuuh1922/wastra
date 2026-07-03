'use client'

import { useState } from 'react'
import { BookMarked, GraduationCap, Palette, Sparkles } from 'lucide-react'

type Level = 'sd' | 'smp-sma' | 'umum'

const levels: { id: Level; label: string }[] = [
  { id: 'sd', label: 'SD' },
  { id: 'smp-sma', label: 'SMP – SMA' },
  { id: 'umum', label: 'Umum & Dewasa' },
]

const materials: Record<
  Level,
  { icon: typeof Palette; title: string; description: string }[]
> = {
  sd: [
    {
      icon: Palette,
      title: 'Cerita Bergambar: Si Kawung',
      description:
        'Ikuti petualangan Si Kawung mengenal bentuk lingkaran ajaib di kain batik lewat cerita dan gambar seru.',
    },
    {
      icon: Sparkles,
      title: 'Tebak Motif Yuk!',
      description:
        'Permainan mencocokkan gambar motif dengan namanya — belajar sambil bermain.',
    },
    {
      icon: BookMarked,
      title: 'Mewarnai Motif Nusantara',
      description:
        'Lembar mewarnai motif parang dan mega mendung yang bisa dicetak di rumah atau di kelas.',
    },
  ],
  'smp-sma': [
    {
      icon: BookMarked,
      title: 'Filosofi di Balik Motif',
      description:
        'Kupas makna simbolik kawung, parang, dan truntum serta perannya dalam upacara adat Jawa.',
    },
    {
      icon: GraduationCap,
      title: 'Sejarah Batik Nusantara',
      description:
        'Perjalanan batik dari keraton hingga diakui UNESCO sebagai Warisan Budaya Takbenda pada 2009.',
    },
    {
      icon: Sparkles,
      title: 'Proyek Kelas: Peta Motif Daerah',
      description:
        'Panduan proyek kelompok memetakan motif khas daerah masing-masing beserta ceritanya.',
    },
  ],
  umum: [
    {
      icon: GraduationCap,
      title: 'Kajian: Taksonomi Motif Batik',
      description:
        'Telaah mendalam penggolongan motif geometris dan non-geometris beserta sebaran regionalnya.',
    },
    {
      icon: BookMarked,
      title: 'Batik Tulis, Cap, dan Printing',
      description:
        'Memahami perbedaan teknik produksi, nilai budayanya, dan cara mengenali masing-masing.',
    },
    {
      icon: Sparkles,
      title: 'Etika AI dan Warisan Budaya',
      description:
        'Diskusi tentang peran teknologi generatif dalam pelestarian — peluang sekaligus batasannya.',
    },
  ],
}

export function LearningCenter() {
  const [level, setLevel] = useState<Level>('sd')

  return (
    <section id="belajar" className="bg-contrast py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
            Pusat Pembelajaran
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Belajar Sesuai Jenjangmu
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Materi yang sama pentingnya, disampaikan dengan cara yang berbeda —
            pilih jenjang pendidikanmu.
          </p>
        </div>

        <div
          className="mt-8 flex justify-center"
          role="tablist"
          aria-label="Pilih jenjang pendidikan"
        >
          <div className="flex gap-2 rounded-full border border-border bg-card p-1.5">
            {levels.map((l) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={level === l.id}
                onClick={() => setLevel(l.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  level === l.id
                    ? 'bg-gold text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {materials[level].map((m) => (
            <article
              key={m.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <m.icon className="h-7 w-7 text-teal" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-lg font-bold text-foreground">
                {m.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {m.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
