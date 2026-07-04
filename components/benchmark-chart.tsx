'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/scroll-reveal'

export function BenchmarkChart() {
  const data = [
    { name: 'MobileNetV3', role: 'Scan Cepat', fps: 92, accuracy: 94.8 },
    { name: 'YOLOv8', role: 'Multi-Motif', fps: 45, accuracy: 91.5 },
  ]

  // Using 80 blocks total for the progress bar (1.25% per block) on desktop
  const totalBlocks = 80

  const renderBlocks = (value: number, blockCount: number, isAccuracy: boolean = false) => {
    const filled = Math.round((value / 100) * blockCount);
    return (
      <div className="flex flex-col gap-[2px]">
        {[0, 1, 2].map((row) => (
          <motion.div 
            key={row} 
            className="flex gap-[2px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              visible: { transition: { staggerChildren: 0.015, delayChildren: row * 0.1 } }
            }}
          >
            {Array.from({ length: blockCount }).map((_, i) => {
              const colors = ['bg-foreground', 'bg-foreground', 'bg-foreground', 'bg-background', 'bg-white'];
              const offset = isAccuracy ? 10 : 0;
              const hash = Math.floor(Math.abs(Math.sin(i * 12.9898 + row * 78.233 + offset) * 43758.5453));
              const blockColor = colors[hash % colors.length];
              return (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, scale: 0.2 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  className={`w-full aspect-square rounded-[1px] ${i < filled ? blockColor : 'bg-foreground/15'}`} 
                />
              )
            })}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <section className="bg-transparent py-10 pb-20 md:pb-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <ScrollReveal direction="up">
          <div className="relative rounded-3xl bg-[#c29623]/25 border border-[#c29623]/30 shadow-sm overflow-hidden">
            {/* Gradient Blur Layer */}
            <div 
              className="absolute inset-0 z-0 backdrop-blur-xl"
              style={{
                maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
              }}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col gap-8 p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                  Benchmarks AI
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-3xl">
                  Wastra.ai ditenagai oleh arsitektur kecerdasan buatan yang secara spesifik dilatih untuk membaca keunikan pola batik Nusantara. 
                  <strong className="text-foreground"> MobileNetV3</strong> digunakan untuk pemindaian tunggal yang sangat ringan dan instan, cocok untuk ponsel. Sedangkan <strong className="text-foreground">YOLOv8</strong> bertugas sebagai pendeteksi tangguh yang mampu memetakan banyak motif sekaligus di dalam satu foto kompleks (seperti kain pameran atau etalase).
                  Grafik kontribusi di bawah menunjukkan performa nyata dari model kami.
                </p>
              </div>
              
              {/* FPS SECTION */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Kecepatan Pemrosesan (FPS)</h3>
                
                {data.map((item) => {
                  return (
                    <div key={`fps-${item.name}`} className="space-y-3">
                      <div className="flex justify-between text-xs md:text-sm font-medium text-foreground">
                        <span>{item.name}: {item.fps}</span>
                        <span className="text-muted-foreground">MAX: 100</span>
                      </div>
                      <div className="block md:hidden">
                        {renderBlocks(item.fps, 40, false)}
                      </div>
                      <div className="hidden md:block">
                        {renderBlocks(item.fps, 80, false)}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="w-full h-px bg-border my-4" />

              {/* ACCURACY SECTION */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Tingkat Akurasi (%)</h3>
                
                {data.map((item) => {
                  return (
                    <div key={`acc-${item.name}`} className="space-y-3">
                      <div className="flex justify-between text-xs md:text-sm font-medium text-foreground">
                        <span>{item.name}: {item.accuracy}%</span>
                        <span className="text-muted-foreground">MAX: 100%</span>
                      </div>
                      <div className="block md:hidden">
                        {renderBlocks(item.accuracy, 40, true)}
                      </div>
                      <div className="hidden md:block">
                        {renderBlocks(item.accuracy, 80, true)}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4">
                <p className="text-xs leading-relaxed text-muted-foreground max-w-sm">
                  Dioptimalkan untuk komputasi Edge dan inferensi waktu nyata. Wastra Studio (Stable Diffusion) memakan waktu ~4.5 detik per gambar.
                </p>
                <Link 
                  href="/ai"
                  className="flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-secondary transition-all hover:bg-primary/90 hover:scale-105 shadow-md whitespace-nowrap"
                >
                  Coba Model AI
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
