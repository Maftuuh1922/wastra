'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ScrollReveal } from '@/components/scroll-reveal'

export function BenchmarkChart() {
  const data = [
    { name: 'MobileNetV3', role: 'Scan Cepat', fps: 92, accuracy: 94.8 },
    { name: 'YOLOv8', role: 'Multi-Motif', fps: 45, accuracy: 91.5 },
  ]

  // Using 80 blocks total for the progress bar (1.25% per block)
  const totalBlocks = 80

  return (
    <section className="bg-card py-10 pb-20 md:pb-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <ScrollReveal direction="up">
          <div className="flex flex-col gap-8 rounded-3xl bg-[#c29623]/25 p-8 md:p-12 border border-[#c29623]/30 shadow-sm backdrop-blur-sm">
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
                const filled = Math.round((item.fps / 100) * totalBlocks);
                return (
                  <div key={`fps-${item.name}`} className="space-y-3">
                    <div className="flex justify-between text-xs md:text-sm font-medium text-foreground">
                      <span>{item.name}: {item.fps}</span>
                      <span className="text-muted-foreground">MAX: 100</span>
                    </div>
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
                          {Array.from({ length: totalBlocks }).map((_, i) => {
                            const colors = ['bg-foreground', 'bg-foreground', 'bg-foreground', 'bg-background', 'bg-white'];
                            const hash = Math.floor(Math.abs(Math.sin(i * 12.9898 + row * 78.233) * 43758.5453));
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
                  </div>
                )
              })}
            </div>

            <div className="w-full h-px bg-border my-4" />

            {/* ACCURACY SECTION */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Tingkat Akurasi (%)</h3>
              
              {data.map((item) => {
                const filled = Math.round((item.accuracy / 100) * totalBlocks);
                return (
                  <div key={`acc-${item.name}`} className="space-y-3">
                    <div className="flex justify-between text-xs md:text-sm font-medium text-foreground">
                      <span>{item.name}: {item.accuracy}%</span>
                      <span className="text-muted-foreground">MAX: 100%</span>
                    </div>
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
                          {Array.from({ length: totalBlocks }).map((_, i) => {
                            const colors = ['bg-foreground', 'bg-foreground', 'bg-foreground', 'bg-background', 'bg-white'];
                            const hash = Math.floor(Math.abs(Math.sin(i * 12.9898 + row * 78.233 + 10) * 43758.5453));
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
        </ScrollReveal>
      </div>
    </section>
  )
}
