const trends = [
  {
    tag: 'Fashion Urban',
    title: 'Parang di Panggung Streetwear',
    description:
      'Motif klasik keraton kini hadir di blazer dan outerwear anak muda kota — bukti batik terus beradaptasi tanpa kehilangan makna.',
    image: '/images/trend-fashion.png',
    alt: 'Model muda mengenakan blazer batik motif parang di latar perkotaan',
  },
  {
    tag: 'Runway',
    title: 'Mega Mendung Menembus Panggung Dunia',
    description:
      'Desainer Indonesia membawa awan Cirebon ke pekan mode internasional, membuktikan wastra Nusantara berkelas global.',
    image: '/images/trend-runway.png',
    alt: 'Model berjalan di runway mengenakan gaun batik mega mendung',
  },
  {
    tag: 'Regenerasi',
    title: 'Generasi Muda Kembali Membatik',
    description:
      'Sanggar dan sekolah menghidupkan kembali tradisi canting — kini dibantu teknologi untuk mengenal ribuan motif warisan.',
    image: '/images/trend-craft.png',
    alt: 'Pelajar Indonesia belajar membatik di sanggar dengan kain batik warna-warni',
  },
]

export function CulturalTrends() {
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
          {trends.map((t) => (
            <article
              key={t.title}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={t.image || '/placeholder.svg'}
                  alt={t.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="inline-block rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-[#FBF1C7]">
                  {t.tag}
                </span>
                <h3 className="mt-3 font-serif text-lg font-bold text-foreground">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
