'use client'

import { useState } from 'react'
import { Database, FileText, FlaskConical, Network, Microscope, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { researchDataset, Category } from '@/lib/research-data'

const categories: { id: Category; label: string }[] = [
  { id: 'ai-model', label: 'Riset AI & Model' },
  { id: 'sejarah', label: 'Kajian Sejarah' },
  { id: 'geometri', label: 'Geometri & Pola' },
  { id: 'teknologi', label: 'Teknologi Alam' },
]

const iconMap: Record<string, LucideIcon> = {
  Database,
  FileText,
  FlaskConical,
  Network,
  Microscope
}

export function ResearchHub() {
  const [activeCategory, setActiveCategory] = useState<Category>('ai-model')

  const displayMaterials = researchDataset.filter(m => m.category === activeCategory)

  return (
    <section id="riset" className="py-20 md:py-28 relative">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 bg-background pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none"
           style={{
             backgroundImage: "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.05) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(225, 82, 61, 0.05) 0%, transparent 40%)"
           }}
      />

      <div className="mx-auto max-w-6xl px-5 md:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Pusat Riset & Data Wastra
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-5xl">
            Repositori Kajian Nusantara
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground text-lg">
            Akses data teknis, kajian akademis, dan dokumentasi arsitektur AI kami untuk memperdalam wawasan Anda di bidang teknologi dan warisan budaya.
          </p>
        </div>

        <div
          className="mt-12 flex justify-center flex-wrap gap-2"
          role="tablist"
          aria-label="Pilih kategori riset"
        >
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 border ${
                activeCategory === c.id
                  ? 'bg-foreground text-background border-foreground shadow-lg scale-105'
                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayMaterials.map((m) => {
            const Icon = iconMap[m.iconName] || FileText
            return (
              <Link
                key={m.slug}
                href={`/riset/${m.slug}`}
                className="group flex flex-col rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-8 transition-all duration-500 hover:border-foreground hover:shadow-2xl hover:shadow-foreground/5 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Decorative background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="rounded-2xl bg-foreground/5 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-foreground/10 transition-colors">
                    <Icon className="h-8 w-8 text-foreground transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground leading-tight">
                    {m.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground flex-1">
                    {m.description}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-border/50 flex items-center text-sm font-bold text-foreground relative z-10">
                  Baca Dokumen 
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                </div>
              </Link>
            )
          })}
          
          {displayMaterials.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-border rounded-3xl">
              <p className="text-muted-foreground">Dokumen riset untuk kategori ini sedang disusun.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
