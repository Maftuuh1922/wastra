import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Database, FileText, FlaskConical, Network, Microscope } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { researchDataset } from '@/lib/research-data'

export async function generateStaticParams() {
  return researchDataset.map((material) => ({
    slug: material.slug,
  }))
}

function parseContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl md:text-3xl font-serif font-bold mt-10 mb-5 text-foreground">{line.replace('## ', '')}</h2>
    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-8 mb-4 text-foreground">{line.replace('### ', '')}</h3>
    
    if (line.startsWith('- ') || /^\d+\.\s/.test(line)) {
      const isNumbered = /^\d+\.\s/.test(line);
      let text = line.replace(/^(- |\d+\.\s)/, '')
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*')) return <em key={j}>{part.slice(1, -1)}</em>
        return part
      })
      return <li key={i} className="ml-6 mb-3 list-item" style={{ listStyleType: isNumbered ? 'decimal' : 'disc' }}>{parts}</li>
    }
    
    if (line.trim() === '') return <div key={i} className="h-4"></div>

    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>
      if (part.startsWith('*') && part.endsWith('*')) return <em key={j}>{part.slice(1, -1)}</em>
      return part
    })
    
    return <p key={i} className="mb-5 leading-relaxed text-muted-foreground text-lg">{parts}</p>
  })
}

export default async function ResearchMaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const material = researchDataset.find((m) => m.slug === resolvedParams.slug)

  if (!material) {
    notFound()
  }

  const iconMap = {
    Database,
    FileText,
    FlaskConical,
    Network,
    Microscope,
  }

  const Icon = iconMap[material.iconName]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Link
            href="/#riset"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Repositori Riset
          </Link>

          <article className="max-w-none">
            <div className="flex items-start gap-6 mb-12 border-b border-border/50 pb-10">
              <div className="rounded-3xl bg-foreground/5 p-6 shadow-sm hidden md:block">
                <Icon className="h-10 w-10 text-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-teal/10 text-teal rounded-full text-xs font-bold uppercase tracking-widest">
                    Kategori: {material.category.replace('-', ' ')}
                  </span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {material.title}
                </h1>
                <p className="mt-4 text-xl text-muted-foreground leading-relaxed">
                  {material.description}
                </p>
              </div>
            </div>

            <div className="bg-card/30 rounded-3xl p-6 md:p-0">
              {parseContent(material.content)}
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
