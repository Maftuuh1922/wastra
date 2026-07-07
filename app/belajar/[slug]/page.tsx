import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookMarked, GraduationCap, Palette, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { learningDataset } from '@/lib/learning-dataset'

export async function generateStaticParams() {
  return learningDataset.map((material) => ({
    slug: material.slug,
  }))
}

function parseContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl md:text-3xl font-serif font-bold mt-8 mb-4 text-foreground">{line.replace('## ', '')}</h2>
    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-foreground">{line.replace('### ', '')}</h3>
    
    if (line.startsWith('- ') || /^\d+\.\s/.test(line)) {
      const isNumbered = /^\d+\.\s/.test(line);
      let text = line.replace(/^(- |\d+\.\s)/, '')
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*')) return <em key={j}>{part.slice(1, -1)}</em>
        return part
      })
      return <li key={i} className="ml-6 mb-2 list-item" style={{ listStyleType: isNumbered ? 'decimal' : 'disc' }}>{parts}</li>
    }
    
    if (line.trim() === '') return <div key={i} className="h-2"></div>

    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>
      if (part.startsWith('*') && part.endsWith('*')) return <em key={j}>{part.slice(1, -1)}</em>
      return part
    })
    
    return <p key={i} className="mb-4 leading-relaxed text-muted-foreground text-lg">{parts}</p>
  })
}

export default async function LearningMaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const material = learningDataset.find((m) => m.slug === resolvedParams.slug)

  if (!material) {
    notFound()
  }

  const iconMap = {
    Palette,
    Sparkles,
    BookMarked,
    GraduationCap,
  }

  const Icon = iconMap[material.iconName]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Link
            href="/#belajar"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Pusat Pembelajaran
          </Link>

          <article className="max-w-none">
            <div className="flex items-center gap-4 mb-8">
              <div className="rounded-2xl bg-teal/10 p-4">
                <Icon className="h-8 w-8 text-teal" />
              </div>
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-teal">
                  Jenjang: {material.level.toUpperCase()}
                </span>
                <h1 className="mt-1 font-serif text-3xl md:text-5xl font-bold text-foreground mb-0">
                  {material.title}
                </h1>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
              {parseContent(material.content)}
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
