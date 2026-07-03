'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, ScanLine, Sparkles, X } from 'lucide-react'

const SCROLL_THRESHOLD = 90

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // On inner pages the navbar is always in "scrolled" (solid) style
  const solid = scrolled || !isHome

  return (
    <header
      className={`fixed z-50 transition-all duration-300 ease-in-out ${
        solid
          ? 'top-4 left-1/2 w-[min(92%,1100px)] -translate-x-1/2 rounded-full border border-border bg-card/85 px-5 py-2.5 shadow-lg shadow-foreground/10 backdrop-blur-md md:px-7'
          : 'top-0 left-0 right-0 w-full bg-transparent px-5 py-5 md:px-10'
      }`}
    >
      <nav
        className="flex items-center justify-between gap-4"
        aria-label="Navigasi utama"
      >
        <Link
          href="/"
          className={`font-serif text-xl font-bold tracking-tight ${
            solid ? 'text-foreground' : 'text-[#FBF1C7]'
          }`}
        >
          Wastra.ai
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/#katalog"
            className={`text-sm font-medium transition-colors hover:opacity-70 ${
              solid ? 'text-foreground' : 'text-[#FBF1C7]'
            }`}
          >
            Katalog
          </Link>
          <Link
            href="/#belajar"
            className={`text-sm font-medium transition-colors hover:opacity-70 ${
              solid ? 'text-foreground' : 'text-[#FBF1C7]'
            }`}
          >
            Belajar
          </Link>
          <Link
            href="/#faq"
            className={`text-sm font-medium transition-colors hover:opacity-70 ${
              solid ? 'text-foreground' : 'text-[#FBF1C7]'
            }`}
          >
            FAQ
          </Link>

          {/* Alat dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              type="button"
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              onClick={() => setToolsOpen((o) => !o)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70 ${
                solid ? 'text-foreground' : 'text-[#FBF1C7]'
              }`}
            >
              Alat
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
            {toolsOpen && (
              <div className="absolute right-0 top-full w-64 pt-2">
                <div className="rounded-xl border border-border bg-card p-2 shadow-lg shadow-foreground/10">
                  <Link
                    href="/deteksi-multi-motif"
                    className="block rounded-lg px-3 py-2.5 hover:bg-secondary"
                    onClick={() => setToolsOpen(false)}
                  >
                    <span className="block text-sm font-semibold text-foreground">
                      Deteksi Multi-Motif
                    </span>
                    <span className="block text-xs leading-relaxed text-muted-foreground">
                      Kenali banyak motif sekaligus dalam satu foto
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/wastra-studio"
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80 ${
              solid ? 'text-terracotta' : 'text-gold'
            }`}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Wastra Studio
          </Link>

          <Link
            href="/scan-cepat"
            className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            <ScanLine className="h-4 w-4" aria-hidden="true" />
            Scan Cepat
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={`md:hidden ${solid ? 'text-foreground' : 'text-[#FBF1C7]'}`}
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={`mt-3 flex flex-col gap-1 border-t border-border pt-3 md:hidden ${
            solid ? '' : 'rounded-2xl bg-card p-4'
          }`}
        >
          {[
            { href: '/scan-cepat', label: 'Scan Cepat' },
            { href: '/deteksi-multi-motif', label: 'Deteksi Multi-Motif' },
            { href: '/wastra-studio', label: 'Wastra Studio' },
            { href: '/#katalog', label: 'Katalog' },
            { href: '/#belajar', label: 'Belajar' },
            { href: '/#faq', label: 'FAQ' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
