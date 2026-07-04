import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { AboutPlatform } from '@/components/about-platform'
import { WhyChooseUs } from '@/components/why-choose-us'
import { MotifCatalog } from '@/components/motif-catalog'
import { Faq } from '@/components/faq'
import { BenchmarkChart } from '@/components/benchmark-chart'
import { CulturalTrends } from '@/components/cultural-trends'
import { LearningCenter } from '@/components/learning-center'
import { HowItWorks } from '@/components/how-it-works'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        
        {/* Spot 2 - Middle Section */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply" 
            style={{ backgroundImage: "url('/images/image_secondary.webp')", backgroundSize: "350px", backgroundRepeat: "repeat", opacity: 0.08 }} 
          />
          <div className="relative z-10">
            <AboutPlatform />
            <WhyChooseUs />
            <MotifCatalog />
          </div>
        </div>

        {/* Spot 3 - Bottom Section */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply" 
            style={{ backgroundImage: "url('/images/image_primary.webp')", backgroundSize: "400px", backgroundRepeat: "repeat", opacity: 0.05 }} 
          />
          <div className="relative z-10">
            <Faq />
            <BenchmarkChart />
            <CulturalTrends />
            <LearningCenter />
            <HowItWorks />
            <SiteFooter />
          </div>
        </div>
      </main>
    </>
  )
}
