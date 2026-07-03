import { BookOpen, Leaf, ScanSearch, Users } from 'lucide-react'

const features = [
  {
    icon: ScanSearch,
    accent: 'text-teal',
    title: 'Identifikasi Berbasis AI',
    description:
      'Teknologi pengenalan visual membantu mengenali nama motif dan asal daerahnya dari sebuah foto — tanpa perlu keahlian khusus.',
  },
  {
    icon: Leaf,
    accent: 'text-olive',
    title: 'Pelestarian Budaya',
    description:
      'Setiap motif dilengkapi cerita, filosofi, dan konteks budayanya agar pengetahuan wastra Nusantara tetap hidup lintas generasi.',
  },
  {
    icon: Users,
    accent: 'text-terracotta',
    title: 'Komunitas & Kolaborasi',
    description:
      'Terhubung dengan perajin, pelajar, dan pecinta batik di seluruh Indonesia untuk saling berbagi temuan dan cerita.',
  },
  {
    icon: BookOpen,
    accent: 'text-gold',
    title: 'Pusat Pembelajaran Adaptif',
    description:
      'Materi belajar yang menyesuaikan jenjang pendidikan — dari cerita bergambar untuk SD hingga kajian mendalam untuk umum.',
  },
]

export function AboutPlatform() {
  return (
    <section className="section-texture-kawung bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
            Tentang Platform
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Jembatan antara Warisan Budaya dan Teknologi
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Wastra.ai lahir dari keinginan sederhana: agar setiap orang bisa
            mengenal dan membanggakan kekayaan motif batik Nusantara, di mana
            pun dan kapan pun.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <f.icon className={`h-8 w-8 ${f.accent}`} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-lg font-bold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
