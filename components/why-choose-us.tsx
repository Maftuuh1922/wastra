import { Award, HeartHandshake, ShieldCheck } from 'lucide-react'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Transparan & Bertanggung Jawab',
    description:
      'Kami selalu jujur tentang batas kemampuan AI. Hasil identifikasi disertai tingkat keyakinan, dan kreasi AI selalu diberi label yang jelas.',
  },
  {
    icon: Award,
    title: 'Dikurasi Bersama Ahli Budaya',
    description:
      'Informasi motif di katalog kami disusun bersama pegiat dan peneliti batik agar cerita yang tersampaikan tetap akurat dan bermartabat.',
  },
  {
    icon: HeartHandshake,
    title: 'Berpihak pada Perajin',
    description:
      'Wastra.ai dibangun untuk mengangkat karya perajin lokal — bukan menggantikannya. Teknologi hadir sebagai penghubung, bukan pengganti.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-contrast py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
            Kenapa Memilih Kami
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Teknologi yang Menghormati Budaya
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card">
                <r.icon className="h-7 w-7 text-olive" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-serif text-lg font-bold text-foreground">
                {r.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
