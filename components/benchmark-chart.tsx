import Link from 'next/link'
import { ScrollReveal } from '@/components/scroll-reveal'

export function BenchmarkChart() {
  const data = [
    { name: 'MobileNetV3', role: 'Scan Cepat', fps: 92, accuracy: 94.8 },
    { name: 'YOLOv8', role: 'Multi-Motif', fps: 45, accuracy: 91.5 },
  ]

  // Using 40 blocks total for the progress bar (2.5% per block)
  const totalBlocks = 40

  return (
    <section className="bg-background py-10 pb-20 md:pb-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <ScrollReveal direction="up">
          <div className="flex flex-col gap-8 rounded-3xl bg-[#111111] p-8 md:p-12 text-[#e0e0e0] shadow-2xl font-mono border border-white/5">
            
            <h2 className="text-3xl md:text-4xl tracking-[0.2em] font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
              BENCHMARKS
            </h2>

            {/* FPS SECTION */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white/40 tracking-[0.15em] uppercase">Processing Speed (FPS)</h3>
              
              {data.map((item) => {
                const filled = Math.round((item.fps / 100) * totalBlocks);
                return (
                  <div key={`fps-${item.name}`} className="space-y-3">
                    <div className="flex justify-between text-xs md:text-sm tracking-wider">
                      <span>{item.name.toUpperCase()}: {item.fps}</span>
                      <span>LIMIT: 100</span>
                    </div>
                    <div className="flex gap-[2px] md:gap-1">
                      {Array.from({ length: totalBlocks }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-4 md:h-5 w-full rounded-sm ${i < filled ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-[#222]'}`} 
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="w-full h-px bg-[#222] my-4" />

            {/* ACCURACY SECTION */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white/40 tracking-[0.15em] uppercase">Accuracy Rate (%)</h3>
              
              {data.map((item) => {
                const filled = Math.round((item.accuracy / 100) * totalBlocks);
                return (
                  <div key={`acc-${item.name}`} className="space-y-3">
                    <div className="flex justify-between text-xs md:text-sm tracking-wider">
                      <span>{item.name.toUpperCase()}: {item.accuracy}%</span>
                      <span>LIMIT: 100%</span>
                    </div>
                    <div className="flex gap-[2px] md:gap-1">
                      {Array.from({ length: totalBlocks }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-4 md:h-5 w-full rounded-sm ${i < filled ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-[#222]'}`} 
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-4">
              <p className="text-xs leading-relaxed text-white/50 max-w-sm tracking-widest uppercase">
                OPTIMIZED FOR EDGE COMPUTING AND REAL-TIME INFERENCE. STABLE DIFFUSION TAKES ~4.5S PER GENERATION.
              </p>
              <Link 
                href="/ai"
                className="flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold tracking-widest text-black transition-all hover:bg-white/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] whitespace-nowrap"
              >
                DETAILS
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
