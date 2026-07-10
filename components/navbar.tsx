'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, ScanLine, ScanSearch, Sparkles, X } from 'lucide-react'

const SCROLL_THRESHOLD = 90

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
      className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-out ${
        solid
          ? `top-4 w-[min(92%,1100px)] border border-border bg-card/70 px-5 py-2.5 shadow-lg shadow-foreground/10 backdrop-blur-xl md:px-7 ${
              mobileOpen ? 'rounded-3xl' : 'rounded-full'
            }`
          : `top-0 w-full border border-transparent px-5 py-5 md:px-10 ${
              mobileOpen ? 'rounded-b-3xl bg-card/70 backdrop-blur-xl shadow-lg' : 'rounded-none bg-transparent'
            }`
      }`}
    >
      <nav
        className="flex items-center justify-between gap-4"
        aria-label="Navigasi utama"
      >
        <Link
          href="/"
          onClick={() => {
            if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' })
            setMobileOpen(false)
          }}
          aria-label="Wastra.ai — kembali ke beranda"
          className="flex items-center gap-1"
        >
          <img src="/images/wastra-logo-eye.png" alt="Wastra Logo" className="h-12 w-12 object-contain scale-125" />
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            Wastra.ai
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/#katalog"
            className={`text-sm font-medium transition-colors hover:opacity-70 text-foreground`}
          >
            Katalog
          </Link>
          <Link
            href="/ai"
            className="flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal/90 shadow-md hover:scale-105"
          >
            <ScanSearch className="h-4 w-4" aria-hidden="true" />
            Coba Wastra AI
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={`md:hidden text-foreground`}
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden flex flex-col gap-1 overflow-hidden transition-all duration-500 ease-out ${
          mobileOpen
            ? 'max-h-80 mt-3 border-t border-border/50 pt-3 pb-2 opacity-100'
            : 'max-h-0 border-t-0 border-transparent opacity-0'
        }`}
      >
        {[
          { href: '/ai', label: 'Coba Wastra AI' },
          { href: '/#katalog', label: 'Katalog' },
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
    </header>
  )
}
