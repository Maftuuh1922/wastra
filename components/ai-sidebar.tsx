'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Clock, LogIn, LogOut, Loader2, Image as ImageIcon, Plus } from 'lucide-react'

type HistoryItem = {
  id: string
  prompt: string
  image_url: string
  created_at: string
}

export function AiSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Login states
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const router = useRouter()

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchHistory(session.user.id)
      } else {
        router.push('/login')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchHistory(session.user.id)
      } else {
        setHistory([])
        router.push('/login')
      }
    })

    // Listen for external history updates
    const handleHistoryUpdate = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        fetchHistory(session.user.id)
      }
    }
    window.addEventListener('history-updated', handleHistoryUpdate)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('history-updated', handleHistoryUpdate)
    }
  }, [router])

  const fetchHistory = async (userId: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (data) setHistory(data)
    setLoading(false)
  }

  const handleAuth = async (type: 'login' | 'register') => {
    setAuthLoading(true)
    setAuthError('')
    
    let result
    if (type === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      result = await supabase.auth.signUp({ email, password })
    }

    if (result.error) {
      setAuthError(result.error.message)
    } else {
      setShowLogin(false)
    }
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed md:relative top-0 left-0 h-full bg-card/95 border-r border-border transition-all duration-300 z-50 flex flex-col py-4 ${
          isOpen ? 'w-72 translate-x-0' : 'w-0 md:w-[68px] -translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header & Toggle */}
        <div className={`flex items-center ${isOpen ? 'px-4 justify-between' : 'justify-center'} mb-6`}>
          {!isOpen ? (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-full hover:bg-secondary transition-colors text-foreground relative w-12 h-12 flex items-center justify-center group flex-shrink-0"
              title="Buka menu"
            >
              <img src="/images/wastra-logo-eye.png" alt="Toggle Menu" className="h-10 w-10 object-contain absolute transition-opacity duration-200 opacity-100 group-hover:opacity-0" />
              <Menu className="h-6 w-6 absolute transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/images/wastra-logo-eye.png" alt="Wastra Logo" className="h-8 w-8 object-contain" />
              <span className="font-serif font-bold text-xl tracking-tight text-foreground/90 mt-0.5">Wastra.ai</span>
            </Link>
          )}
          
          {isOpen && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.dispatchEvent(new Event('new-chat'))}
                className="p-2 rounded-full hover:bg-secondary transition-colors text-foreground flex-shrink-0 bg-secondary/50 border border-border"
                title="Mulai Baru (New Chat)"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground flex-shrink-0"
                title="Tutup menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-300 ${!isOpen && 'md:opacity-100 opacity-0'}`}>
          
          {isOpen && (
            <div className="px-4 mb-3">
              <h2 className="text-xs font-bold tracking-wide flex items-center gap-2 text-muted-foreground uppercase">
                <Clock className="h-3 w-3" />
                Riwayat Kreasi
              </h2>
            </div>
          )}

          {/* History List */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1 px-2">
            {!user ? (
              isOpen ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-4 h-full mt-10">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <LogIn className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Belum Masuk</p>
                    <p className="text-xs text-muted-foreground">Login untuk menyimpan riwayat generasi Wastra Studio kamu.</p>
                  </div>
                </div>
              ) : null
            ) : (
              <>
                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-teal" />
                  </div>
                ) : history.length === 0 ? (
                  isOpen && (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                      <ImageIcon className="h-8 w-8 mb-2" />
                      <p className="text-xs">Belum ada riwayat.</p>
                    </div>
                  )
                ) : (
                  history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => window.dispatchEvent(new CustomEvent('load-history', { detail: item }))}
                      className={`flex items-center gap-3 rounded-full hover:bg-secondary/50 cursor-pointer transition-colors ${isOpen ? 'p-2' : 'p-2 justify-center'}`}
                      title={!isOpen ? item.prompt : undefined}
                    >
                      <img src={item.image_url} alt={item.prompt} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      {isOpen && (
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-sm font-medium text-foreground truncate">{item.prompt}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* User Profile Footer - ALWAYS RENDERED */}
          <div className={`mt-auto pt-4 px-4 flex items-center ${isOpen ? 'justify-between' : 'justify-center'} pb-2`}>
            {user ? (
              <>
                {isOpen ? (
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate text-foreground">{user.email}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {isOpen && (
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-muted-foreground hover:text-terracotta transition-colors rounded-full hover:bg-terracotta/10 flex-shrink-0"
                    title="Keluar"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
              </>
            ) : (
              <button 
                onClick={() => router.push('/login')} 
                className={`flex items-center gap-3 ${isOpen ? 'w-full px-2 py-2 hover:bg-secondary' : 'justify-center'} rounded-full group transition-colors`}
                title="Masuk / Daftar"
              >
                <div className="w-8 h-8 rounded-full bg-secondary group-hover:bg-teal group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                  <LogIn className="h-4 w-4" />
                </div>
                {isOpen && <span className="text-sm font-medium text-foreground group-hover:text-teal transition-colors">Masuk / Daftar</span>}
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
