import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import { scrapeArticle } from '@/lib/scraper'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Wastra Reader',
  description: 'Membaca berita seputar kebudayaan tanpa gangguan.',
}

export default async function ReaderPage({
  searchParams,
}: {
  searchParams: { url?: string }
}) {
  const url = searchParams.url

  if (!url) {
    redirect('/')
  }

  // Scrap the article
  const article = await scrapeArticle(url)

  if (!article || !article.content) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Gagal Memuat Berita</h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Maaf, kami tidak dapat mengekstrak teks berita dari URL tersebut karena struktur website aslinya tidak didukung atau dilindungi.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/"
              className="px-6 py-2.5 bg-secondary/30 text-foreground font-semibold rounded-full hover:bg-secondary/50 transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-teal text-white font-semibold rounded-full hover:bg-teal/90 transition-colors flex items-center gap-2"
            >
              Buka Web Asli <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-teal/20">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link 
          href="/#berita" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-teal transition-colors mb-10 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>
        
        <article className="prose prose-lg prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-teal max-w-none">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground border-y border-border py-4">
              {article.siteName && (
                <span className="flex items-center gap-2">
                  <span className="uppercase tracking-wider font-bold text-teal">{article.siteName}</span>
                </span>
              )}
              {article.byline && (
                <span>Oleh {article.byline}</span>
              )}
              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors flex items-center gap-1 ml-auto">
                Sumber Asli <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </header>

          {/* Render the sanitized HTML content from Readability */}
          <div 
            className="article-content font-serif text-lg md:text-xl leading-relaxed tracking-wide"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>

      {/* Internal CSS for the article content injected by readability */}
      <style dangerouslySetInnerHTML={{__html: `
        .article-content img {
          width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .article-content a {
          color: #0d9488;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .article-content h2, .article-content h3 {
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }
        .article-content p {
          margin-bottom: 1.5rem;
        }
        .article-content blockquote {
          border-left: 4px solid #0d9488;
          padding-left: 1.5rem;
          font-style: italic;
          margin: 2rem 0;
          color: #4b5563;
        }
      `}} />

      <SiteFooter />
    </div>
  )
}
