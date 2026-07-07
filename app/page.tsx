import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { AboutPlatform } from '@/components/about-platform'
import { WhyChooseUs } from '@/components/why-choose-us'
import { MotifCatalog } from '@/components/motif-catalog'
import { Faq } from '@/components/faq'
import { BenchmarkChart } from '@/components/benchmark-chart'
import { CulturalTrends } from '@/components/cultural-trends'
import { ResearchHub } from '@/components/research-hub'
import { HowItWorks } from '@/components/how-it-works'
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

        {/* Pattern Block Why Choose Us */}
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
                maskImage: 'radial-gradient(circle at 85% 80%, black 0%, transparent 65%)',
                WebkitMaskImage: 'radial-gradient(circle at 85% 80%, black 0%, transparent 65%)',
              }}
            />
          </div>
          <div className="relative z-10">
            <WhyChooseUs />
          </div>
        </div>

        {/* Plain Block 1 */}
        <div className="relative z-10 bg-background">
          <MotifCatalog />
        </div>

        {/* Pattern Block FAQ */}
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
                backgroundImage: "url('/images/image_secondary.webp')", 
                backgroundSize: "400px", 
                backgroundPosition: "center",
                backgroundRepeat: "repeat", 
                opacity: 0.3,
                maskImage: 'radial-gradient(circle at 50% 0%, black 0%, transparent 60%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 0%, black 0%, transparent 60%)',
              }}
            />
          </div>
          <div className="relative z-10">
            <Faq />
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

        {/* Plain Block 2 */}
        <div className="relative z-10 bg-background">
          <CulturalTrends />
        </div>

        {/* Pattern Block 2 */}
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
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)',
              }}
            />
          </div>

          <div className="relative z-10">
            <ResearchHub />
            <HowItWorks />
          </div>
        </div>

        {/* Plain Block 2 (Footer) */}
        <div className="relative z-10 bg-background">
          <SiteFooter />
        </div>
      </main>
    </>
  )
}
