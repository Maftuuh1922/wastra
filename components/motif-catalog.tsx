import Link from 'next/link'
import { Info, ScanSearch } from 'lucide-react'

const motifs = [
  {
    name: 'Kawung',
    region: 'Yogyakarta',
    image: '/images/motif-kawung.png',
    description: 'Lingkaran bertumpuk yang melambangkan kesucian dan pengendalian diri.',
  },
  {
    name: 'Parang',
    region: 'Solo & Yogyakarta',
    image: '/images/motif-parang.png',
    description: 'Garis diagonal berkesinambungan, simbol semangat yang tak pernah padam.',
  },
  {
    name: 'Mega Mendung',
    region: 'Cirebon',
    image: '/images/motif-mega-mendung.png',
    description: 'Awan berlapis dengan gradasi biru, simbol kesabaran dan keteduhan.',
  },
  {
    name: 'Truntum',
    region: 'Solo',
    image: '/images/motif-truntum.png',
    description: 'Bunga-bunga kecil bertabur, lambang cinta yang tumbuh kembali.',
  },
  {
    name: 'Sekar Jagad',
    region: 'Solo & Yogyakarta',
    image: '/images/motif-sekar-jagad.png',
    description: 'Peta keindahan dunia — keragaman motif dalam satu helai kain.',
  },
  {
    name: 'Sidomukti',
    region: 'Solo',
    image: '/images/motif-sidomukti.png',
    description: 'Doa kemakmuran dan kebahagiaan, kerap hadir dalam upacara pernikahan.',
  },
]

export function MotifCatalog() {
  return (
    <section id="katalog" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
              Katalog Kurasi Motif
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
              Jelajahi Motif-Motif Nusantara
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Setiap motif punya cerita. Kenali filosofi dan asal daerahnya,
              atau uji foto kain Anda dengan fitur Cek Keaslian Motif.
            </p>
          </div>
          <Link
            href="/ai"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            <ScanSearch className="h-4 w-4" aria-hidden="true" />
            Cek Keaslian Motif
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {motifs.map((m) => (
            <article
              key={m.name}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={m.image || '/placeholder.svg'}
                  alt={`Kain batik motif ${m.name}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {m.name}
                  </h3>
                  <span className="text-xs font-medium text-olive">{m.region}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-contrast p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Hasil analisis AI bersifat estimasi berdasarkan pola visual, bukan
            sertifikasi resmi keaslian motif. Untuk verifikasi formal,
            disarankan berkonsultasi dengan ahli atau lembaga budaya terkait.
          </p>
        </div>
      </div>
    </section>
  )
}
