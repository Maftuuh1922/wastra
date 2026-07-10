import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { AboutPlatform } from '@/components/about-platform'
import { MotifCatalog } from '@/components/motif-catalog'
import { BenchmarkChart } from '@/components/benchmark-chart'
import { CulturalTrends } from '@/components/cultural-trends'
import { DatasetInfo } from '@/components/dataset-info'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        
        {/* Pattern Block 1 */}
        <div className="relative w-full">
          {/* Edge fading masks */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent, black 100px, black calc(100% - 100px), transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 100px, black calc(100% - 100px), transparent)',
            }} 
          >
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/images/image_primary.webp')", 
                backgroundSize: "500px", 
                backgroundPosition: "center",
                backgroundRepeat: "repeat", 
                opacity: 0.25,
                maskImage: 'radial-gradient(circle at 15% 20%, black 0%, transparent 65%)',
                WebkitMaskImage: 'radial-gradient(circle at 15% 20%, black 0%, transparent 65%)',
              }}
            />
          </div>

          <div className="relative z-10">
            <AboutPlatform />
          </div>
        </div>

        {/* Pattern Block Benchmark */}
        <div className="relative w-full">
          <div 
            className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent, black 100px, black calc(100% - 100px), transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 100px, black calc(100% - 100px), transparent)',
            }} 
          >
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/images/image_primary.webp')", 
                backgroundSize: "500px", 
                backgroundPosition: "center",
                backgroundRepeat: "repeat", 
                opacity: 0.5,
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)',
              }}
            />
          </div>
          <div className="relative z-10">
            <BenchmarkChart />
          </div>
        </div>

        {/* Plain Block DatasetInfo */}
        <div className="relative z-10 bg-background">
          <DatasetInfo />
        </div>

        {/* Plain Block Motif Catalog */}
        <div className="relative z-10 bg-background">
          <MotifCatalog />
        </div>

        {/* Plain Block Trends */}
        <div className="relative z-10 bg-background">
          <CulturalTrends />
        </div>

        {/* Plain Block Footer */}
        <div className="relative z-10 bg-background">
          <SiteFooter />
        </div>
      </main>
    </>
  )
}

