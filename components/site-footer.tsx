import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="relative z-10 pt-12 pb-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div className="max-w-sm">
          <p className="font-serif text-xl font-bold text-foreground">Wastra.ai</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Melestarikan wastra Nusantara dengan teknologi — hangat,
            mengedukasi, dan membanggakan budaya Indonesia.
          </p>
        </div>
        <nav className="flex gap-12" aria-label="Tautan footer">
          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-semibold text-foreground">Alat AI</p>
            <Link href="/scan-cepat" className="text-sm text-muted-foreground hover:text-foreground">
              Scan Cepat
            </Link>
            <Link href="/deteksi-multi-motif" className="text-sm text-muted-foreground hover:text-foreground">
              Deteksi Multi-Motif
            </Link>
            <Link href="/wastra-studio" className="text-sm text-muted-foreground hover:text-foreground">
              Wastra Studio
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-semibold text-foreground">Jelajah</p>
            <Link href="/#katalog" className="text-sm text-muted-foreground hover:text-foreground">
              Katalog
            </Link>
            <Link href="/#belajar" className="text-sm text-muted-foreground hover:text-foreground">
              Belajar
            </Link>
            <Link href="/#faq" className="text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
          </div>
        </nav>
      </div>
      <div>
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground md:px-8">
          {'\u00A9'} 2026 Wastra.ai — Dibuat dengan cinta untuk budaya Nusantara.
        </p>
      </div>
    </footer>
  )
}
