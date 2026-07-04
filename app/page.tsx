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
        <AboutPlatform />
        <WhyChooseUs />
        <MotifCatalog />
        <Faq />
        <BenchmarkChart />
        <CulturalTrends />
        <LearningCenter />
        <HowItWorks />
      </main>
      <SiteFooter />
    </>
  )
}
