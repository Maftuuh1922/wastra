'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Image as ImageIcon, Layers, Cpu, CheckCircle2 } from 'lucide-react'
import { BATIK_INFO } from '@/lib/batik-info'
import { ScrollReveal } from '@/components/scroll-reveal'

export function DatasetInfo() {
  const [modelType, setModelType] = useState<'mobilenet' | 'yolo'>('mobilenet')
  
  // Excluding the generic fallback/unknown class from the visual count
  let validBatiks = Object.entries(BATIK_INFO).filter(([key]) => key !== 'batik-lainnya')
  
  if (modelType === 'yolo') {
    // YOLO only has 35 classes (excluding the 2 new ones)
    validBatiks = validBatiks.filter(([key]) => !['batik-ikat_celup', 'batik-madura_mataketeran'].includes(key))
  }

  const stats = modelType === 'mobilenet' 
    ? [
        { icon: <ImageIcon className="w-5 h-5" />, label: 'Total Gambar Pelatihan', value: '5.985', desc: 'Rata-rata 157 gambar per kelas' },
        { icon: <Layers className="w-5 h-5" />, label: 'Kelas Motif Terdaftar', value: validBatiks.length.toString(), desc: 'Dari seluruh penjuru nusantara' },
        { icon: <Cpu className="w-5 h-5" />, label: 'Arsitektur AI', value: 'MobileNetV3', desc: 'V2 + V3 Ensemble Architecture' },
        { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Metodologi', value: 'Ensemble (No TTA)', desc: 'Optimasi performa & akurasi tinggi' }
      ]
    : [
        { icon: <ImageIcon className="w-5 h-5" />, label: 'Total Gambar Pelatihan', value: '2.600+', desc: 'Termasuk oversampling & augmentasi' },
        { icon: <Layers className="w-5 h-5" />, label: 'Kelas Motif Terdaftar', value: validBatiks.length.toString(), desc: 'Dari seluruh penjuru nusantara' },
        { icon: <Cpu className="w-5 h-5" />, label: 'Arsitektur AI', value: 'YOLOv8', desc: 'Finetuned @ 768px resolution' },
        { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Metodologi', value: 'Mosaic & Scaling', desc: 'Fokus pada lokalisasi in-the-wild' }
      ]

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
      <ScrollReveal>
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/50 rounded-2xl mb-6 border border-border">
            <Database className="w-6 h-6 text-teal" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Infrastruktur Dataset Kami
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Sistem pengenalan Wastra didukung oleh puluhan ribu data latih dan metodologi kecerdasan buatan mutakhir untuk memastikan akurasi pelestarian budaya.
          </p>
          
          <div className="mt-8 bg-secondary/20 p-1.5 rounded-full inline-flex items-center border border-border">
            <button
              onClick={() => setModelType('mobilenet')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${modelType === 'mobilenet' ? 'bg-teal text-white shadow-md' : 'text-foreground/70 hover:text-foreground'}`}
            >
              MobileNetV3 (Classifier)
            </button>
            <button
              onClick={() => setModelType('yolo')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${modelType === 'yolo' ? 'bg-teal text-white shadow-md' : 'text-foreground/70 hover:text-foreground'}`}
            >
              YOLOv8 (Detector)
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, i) => (
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
