import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

interface AuthCallbackProps {
  onLogin: () => void
}

export function AuthCallback({ onLogin }: AuthCallbackProps) {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) onLogin()
      navigate('/feed', { replace: true })
    })
  }, [navigate, onLogin])

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-stone-500">Signing you in…</p>
      </div>
    </div>
  )
}
