'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2, Scissors } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/ai')
      }
    })
  }, [router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    let result
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      result = await supabase.auth.signUp({ email, password })
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      router.push('/ai')
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero-batik-banana.png" 
          alt="Background" 
          fill 
          className="object-cover"
        />
        {/* Just a slight dark overlay to make the container pop, no heavy blur */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Container - Reduced max-w and min-h */}
      <div className="relative z-10 w-full max-w-[850px] max-h-[95vh] overflow-y-auto no-scrollbar bg-[#fdfdfb] rounded-[2rem] shadow-2xl flex flex-col md:flex-row border border-border/50">
        
        {/* Top/Left Side: Image */}
        <div className="w-full md:w-1/2 relative p-2 md:p-3">
          <div className="relative w-full h-[140px] md:h-full rounded-[1.5rem] overflow-hidden md:min-h-[350px]">
            <Image 
              src="/images/hero-batik-banana.png" 
              alt="Batik Art" 
              fill 
              className="object-cover object-top md:object-center"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="mb-10 flex flex-col items-start">
            <div className="flex items-center gap-1 md:gap-1.5 mb-2">
              <span className="font-serif font-bold text-3xl md:text-4xl leading-none tracking-tight">Wastra.ai</span>
              <img src="/images/wastra-logo-eye.png" alt="Wastra Logo" className="h-10 w-10 md:h-14 md:w-14 object-contain scale-125 drop-shadow-sm mt-1 md:mt-2" />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-semibold ml-1">AI untuk Budaya Bangsa</span>
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
            {error && (
              <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
                className="w-full bg-secondary/30 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 transition-shadow placeholder:text-muted-foreground/70"
              />
            </div>
            
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-secondary/30 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 transition-shadow placeholder:text-muted-foreground/70"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="hidden" // We'll trigger via Enter key or we can add a subtle button
            />

            <div className="flex flex-col gap-4 pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-colors flex items-center justify-center disabled:opacity-70 shadow-lg text-sm"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? 'Login' : 'Daftar Akun')}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#fdfdfb] px-2 text-muted-foreground font-semibold">Atau</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={async () => {
                  setLoading(true)
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo: `${window.location.origin}/ai` }
                  })
                  if (error) { setError(error.message); setLoading(false); }
                }}
                disabled={loading}
                className="w-full py-3 bg-white border border-border text-foreground font-semibold rounded-xl hover:bg-secondary/50 transition-colors flex items-center justify-center gap-3 shadow-sm text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Lanjutkan dengan Google
              </button>

              <div className="flex items-center justify-center gap-2 text-xs mt-2">
                <span className="text-muted-foreground">
                  {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
                </span>
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-teal hover:underline"
                >
                  {isLogin ? 'Daftar sekarang' : 'Masuk'}
                </button>
              </div>
            </div>
          </form>



        </div>
      </div>
    </div>
  )
}
