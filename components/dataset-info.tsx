'use client'

import { motion } from 'framer-motion'
import { Database, Image as ImageIcon, Layers, Cpu, CheckCircle2 } from 'lucide-react'
import { BATIK_INFO } from '@/lib/batik-info'
import { ScrollReveal } from '@/components/scroll-reveal'

export function DatasetInfo() {
  // Excluding the generic fallback/unknown class from the visual count
  const validBatiks = Object.entries(BATIK_INFO).filter(([key]) => key !== 'batik-lainnya')

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
      <ScrollReveal>
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/50 rounded-2xl mb-6 border border-border">
            <Database className="w-6 h-6 text-teal" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Infrastruktur Dataset Kami
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Sistem pengenalan Wastra didukung oleh puluhan ribu data latih dan metodologi kecerdasan buatan mutakhir untuk memastikan akurasi pelestarian budaya.
          </p>
        </div>
      </ScrollReveal>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {[
          {
            icon: <ImageIcon className="w-5 h-5" />,
            label: 'Total Gambar Pelatihan',
            value: '2.600+',
            desc: 'Termasuk oversampling & augmentasi'
          },
          {
            icon: <Layers className="w-5 h-5" />,
            label: 'Kelas Motif Terdaftar',
            value: validBatiks.length.toString(),
            desc: 'Dari seluruh penjuru nusantara'
          },
          {
            icon: <Cpu className="w-5 h-5" />,
            label: 'Arsitektur AI',
            value: 'YOLOv8',
            desc: 'Finetuned @ 768px resolution'
          },
          {
            icon: <CheckCircle2 className="w-5 h-5" />,
            label: 'Metodologi',
            value: 'Mosaic & Scaling',
            desc: 'Fokus pada lokalisasi in-the-wild'
          }
        ].map((stat, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="bg-secondary/20 border border-border rounded-3xl p-6 h-full flex flex-col items-start hover:bg-secondary/40 transition-colors">
              <div className="p-3 bg-background rounded-xl border border-border mb-4 text-foreground">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="font-medium text-foreground mb-1">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Batik List */}
      <ScrollReveal>
        <div className="bg-secondary/10 border border-border rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold mb-8 text-center">Katalog Motif Terlatih</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
            {validBatiks.map(([key, detail]) => (
              <div key={key} className="flex items-center gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-teal/50 group-hover:bg-teal transition-colors" />
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors cursor-default">
                  {detail.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
