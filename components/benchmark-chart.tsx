import { BarChart, Activity, Zap, Target } from 'lucide-react'

export function BenchmarkChart() {
  const data = [
    { name: 'MobileNetV3 (Scan Cepat)', fps: 92, accuracy: 94.8, color: 'bg-teal' },
    { name: 'YOLOv8 (Multi-Motif)', fps: 45, accuracy: 91.5, color: 'bg-terracotta' },
  ]

  return (
    <div className="mt-4 flex flex-col gap-8 rounded-xl border border-border/50 bg-secondary/30 p-5 md:p-7">
      
      {/* FPS Chart */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-gold" />
          <h4 className="font-semibold text-sm text-foreground">Kecepatan Pemrosesan (FPS)</h4>
        </div>
        
        <div className="relative border-l border-b border-border/60 pb-2 pl-2">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2 pl-2 opacity-10">
             <div className="w-full h-px bg-foreground" />
             <div className="w-full h-px bg-foreground" />
             <div className="w-full h-px bg-foreground" />
             <div className="w-full h-px bg-foreground" />
          </div>

          <div className="relative z-10 flex flex-col gap-4 pt-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground leading-tight">{item.name}</span>
                <div className="relative h-6 w-full rounded-r-md bg-background overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${(item.fps / 100) * 100}%` }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">
                    {item.fps} FPS
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground pl-24">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Accuracy Chart */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-teal" />
          <h4 className="font-semibold text-sm text-foreground">Tingkat Akurasi (%)</h4>
        </div>
        
        <div className="relative border-l border-b border-border/60 pb-2 pl-2">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2 pl-2 opacity-10">
             <div className="w-full h-px bg-foreground" />
             <div className="w-full h-px bg-foreground" />
             <div className="w-full h-px bg-foreground" />
             <div className="w-full h-px bg-foreground" />
          </div>

          <div className="relative z-10 flex flex-col gap-4 pt-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground leading-tight">{item.name}</span>
                <div className="relative h-6 w-full rounded-r-md bg-background overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.accuracy}%` }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">
                    {item.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground pl-24">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-background/50 p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">Catatan Wastra Studio:</strong> Model Stable Diffusion tidak diukur dengan FPS/Akurasi layaknya deteksi, melainkan menggunakan kecepatan latensi iterasi (~4.5 detik per gambar penuh) untuk menghasilkan gambar sintetis resolusi tinggi.
      </div>
    </div>
  )
}
