import { Outlet, Navigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { FloatingActionButton } from './FloatingActionButton'

interface AppLayoutProps {
  isAuthenticated: boolean
}

export function AppLayout({ isAuthenticated }: AppLayoutProps) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <BottomNav />
      <main className="flex-1 pb-20 md:pb-0 md:ml-56">
        <div className="md:max-w-2xl md:mx-auto">
          <Outlet />
        </div>
      </main>
      <FloatingActionButton />
    </div>
  )
}
