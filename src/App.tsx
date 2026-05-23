import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { setDemoMode } from '@/lib/api'
import { AppLayout } from '@/components/layout/AppLayout'
import { Login } from '@/pages/Login'
import { AuthCallback } from '@/pages/AuthCallback'
import { Feed } from '@/pages/Feed'
import { NewEntry } from '@/pages/NewEntry'
import { EntryDetail } from '@/pages/EntryDetail'
import { EditEntry } from '@/pages/EditEntry'
import { Search } from '@/pages/Search'
import { Profile } from '@/pages/Profile'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  function handleLogin() {
    setIsAuthenticated(true)
  }

  function handleDemoLogin() {
    setDemoMode(true)
    setIsAuthenticated(true)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/feed" replace /> : <Login onLogin={handleLogin} onDemoLogin={handleDemoLogin} />
        } />
        <Route path="/auth/callback" element={<AuthCallback onLogin={handleLogin} />} />

        <Route element={<AppLayout isAuthenticated={isAuthenticated} />}>
          <Route index element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/entry/new" element={<NewEntry />} />
          <Route path="/entry/:id" element={<EntryDetail />} />
          <Route path="/entry/:id/edit" element={<EditEntry />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
        </Route>

        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
