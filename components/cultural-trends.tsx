import Image from "next/image"

const fallbackTrends = [
  {
    tag: 'Fashion Urban',
    title: 'Parang di Panggung Streetwear',
    description:
      'Motif klasik keraton kini hadir di blazer dan outerwear anak muda kota — bukti batik terus beradaptasi tanpa kehilangan makna.',
    image: '/images/trend-fashion.png',
    alt: 'Model muda mengenakan blazer batik motif parang di latar perkotaan',
    link: 'https://www.google.com/search?q=batik+fashion+streetwear',
  },
  {
    tag: 'Runway',
    title: 'Mega Mendung Menembus Panggung Dunia',
    description:
      'Desainer Indonesia membawa awan Cirebon ke pekan mode internasional, membuktikan wastra Nusantara berkelas global.',
    image: '/images/trend-runway.png',
    alt: 'Model berjalan di runway mengenakan gaun batik mega mendung',
    link: 'https://www.google.com/search?q=batik+mega+mendung+fashion+week',
  },
  {
    tag: 'Regenerasi',
    title: 'Generasi Muda Kembali Membatik',
    description:
      'Sanggar dan sekolah menghidupkan kembali tradisi canting — kini dibantu teknologi untuk mengenal ribuan motif warisan.',
    image: '/images/trend-craft.png',
    alt: 'Pelajar Indonesia belajar membatik di sanggar dengan kain batik warna-warni',
    link: 'https://www.google.com/search?q=generasi+muda+belajar+membatik',
  },
]

async function getBatikNews() {
  const endpoints = [
    // Original APIs
    'https://api-berita-indonesia.vercel.app/antara/terbaru/',
    'https://api-berita-indonesia.vercel.app/cnn/terbaru/',
    'https://api-berita-indonesia.vercel.app/cnbc/terbaru/',
    // Alternative APIs in case original hits 402 Limit
    'https://berita-indo-api.vercel.app/v1/cnn-news',
    'https://berita-indo-api.vercel.app/v1/cnbc-news',
    'https://berita-indo-api.vercel.app/v1/kumparan-news',
  ]

  let allPosts: any[] = []

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) continue
      const json = await res.json()
      
      let posts = []
      if (json.data && Array.isArray(json.data.posts)) {
        // api-berita-indonesia format
        posts = json.data.posts.map((p: any) => ({
          title: p.title,
          link: p.link,
          description: p.description,
          pubDate: p.pubDate,
          thumbnail: p.thumbnail
        }))
      } else if (json.data && Array.isArray(json.data)) {
        // berita-indo-api format
        posts = json.data.map((p: any) => ({
          title: p.title,
          link: p.link,
          description: p.contentSnippet || p.description || '',
          pubDate: p.isoDate || p.pubDate,
          thumbnail: p.image?.large || p.image?.small || p.image || p.thumbnail
        }))
      }
      
      allPosts = allPosts.concat(posts)
    } catch (e) {
      console.error(`Failed to fetch from ${url}`, e)
    }
  }

  // filter
  const batikNews = allPosts.filter(post => {
    const titleMatch = post.title && post.title.toLowerCase().includes('batik')
    const descMatch = post.description && post.description.toLowerCase().includes('batik')
    return titleMatch || descMatch
  })

  // sort by pubDate (newest first)
  batikNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  // map to our format
  const mapped = batikNews.slice(0, 3).map(post => ({
    tag: 'Berita Terbaru',
    title: post.title,
    description: post.description,
    image: post.thumbnail,
    alt: post.title,
    link: post.link,
  }))

  return mapped
}

export async function CulturalTrends() {
  const news = await getBatikNews()
  
  // Use fallback if no news about batik is found right now
  const trendsToDisplay = news.length > 0 ? news : fallbackTrends

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
            Tren Budaya & Fashion
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Batik yang Terus Bergerak
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {trendsToDisplay.map((t, idx) => (
            <article
              key={idx}
              className="group overflow-hidden rounded-2xl border border-border bg-card flex flex-col"
            >
              <a href={`/baca?url=${encodeURIComponent(t.link)}`} className="flex-1 flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image || '/placeholder.svg'}
                    alt={t.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div>
                    <span className="inline-block rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-[#FBF1C7]">
                      {t.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-bold text-foreground line-clamp-2">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {t.description}
                  </p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
