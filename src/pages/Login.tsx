import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface LoginProps {
  onLogin: () => void
  onDemoLogin: () => void
}

export function Login({ onLogin: _onLogin, onDemoLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-stone-50">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed size={28} className="text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-stone-900">Food Journal</h1>
        <p className="text-sm text-stone-500 mt-1">Your private dining & cooking log</p>
      </div>

      {!sent ? (
        <div className="w-full max-w-sm space-y-4">
          <form onSubmit={handleMagicLink} className="space-y-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/20 placeholder:text-stone-400"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-stone-900 text-white text-sm font-semibold rounded-xl disabled:opacity-50 active:scale-98 transition-transform"
            >
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400">or</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2.5 py-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 bg-white active:bg-stone-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onDemoLogin}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
            >
              Skip — explore with demo data
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="text-4xl">📬</div>
          <h2 className="text-lg font-semibold text-stone-900">Check your inbox</h2>
          <p className="text-sm text-stone-500">
            We sent a magic link to <strong>{email}</strong>. Click it to sign in.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-stone-400 underline underline-offset-2"
          >
            Use a different email
          </button>
        </div>
      )}
    </div>
  )
}
