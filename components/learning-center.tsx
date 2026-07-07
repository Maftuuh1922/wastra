'use client'

import { useState, useEffect, useMemo } from 'react'
import { BookMarked, GraduationCap, Palette, Sparkles, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { learningDataset, Level } from '@/lib/learning-dataset'

const levels: { id: Level; label: string }[] = [
  { id: 'sd', label: 'SD' },
  { id: 'smp-sma', label: 'SMP – SMA' },
  { id: 'umum', label: 'Umum & Dewasa' },
]

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Sparkles,
  BookMarked,
  GraduationCap
}

export function LearningCenter() {
  const [level, setLevel] = useState<Level>('sd')
  const [seed, setSeed] = useState(0)

  useEffect(() => {
    // Generate a daily seed on the client to avoid hydration mismatch
    setSeed(Math.floor(Date.now() / 86400000))
  }, [])

  // Get 3 items per level based on the daily seed
  const displayMaterials = useMemo(() => {
    const allForLevel = learningDataset.filter(m => m.level === level)
    
    if (seed === 0) {
      // Default before hydration (server-side render)
      return allForLevel.slice(0, 3)
    }

    // A simple deterministic shuffle based on the daily seed
    const shuffled = [...allForLevel].sort((a, b) => {
      const hashA = (a.slug.length * seed) % 100
      const hashB = (b.slug.length * seed) % 100
      return hashA - hashB
    })

    return shuffled.slice(0, 3)
  }, [level, seed])

  return (
    <section id="belajar" className="py-20 md:py-28">
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
            pilih jenjang pendidikanmu. Berubah setiap harinya!
          </p>
        </div>

        <div
          className="mt-8 flex justify-center"
          role="tablist"
          aria-label="Pilih jenjang pendidikan"
        >
          <div className="flex gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm">
            {levels.map((l) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={level === l.id}
                onClick={() => setLevel(l.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  level === l.id
                    ? 'bg-primary text-secondary shadow-md scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {displayMaterials.map((m) => {
            const Icon = iconMap[m.iconName] || BookMarked
            return (
              <Link
                key={m.slug}
                href={`/belajar/${m.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-teal hover:shadow-lg hover:-translate-y-1"
              >
                <div className="rounded-full bg-teal/10 w-14 h-14 flex items-center justify-center mb-2 group-hover:bg-teal/20 transition-colors">
                  <Icon className="h-7 w-7 text-teal transition-transform group-hover:scale-110" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-foreground group-hover:text-teal transition-colors">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground flex-1">
                  {m.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-bold text-teal">
                  Mulai Belajar 
                  <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
