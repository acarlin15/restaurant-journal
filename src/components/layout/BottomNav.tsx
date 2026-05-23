import { NavLink, Link } from 'react-router-dom'
import { BookOpen, Search, User, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/feed', icon: BookOpen, label: 'Journal' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 pb-safe',
      'md:top-0 md:right-auto md:w-56 md:h-screen md:border-t-0 md:border-r md:border-stone-200 md:pb-0 md:flex md:flex-col md:justify-start md:pt-6'
    )}>
      <div className="hidden md:flex md:flex-col md:px-4 md:pb-6 md:mb-2 md:border-b md:border-stone-100">
        <span className="text-base font-bold text-stone-900 tracking-tight">Restaurant Journal</span>
      </div>

      <div className="flex md:flex-col md:w-full md:px-2 md:mt-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                'md:flex-row md:flex-none md:w-full md:gap-3 md:px-3 md:py-2.5 md:text-sm md:rounded-lg',
                isActive
                  ? 'text-stone-900 md:bg-stone-100'
                  : 'text-stone-400 md:text-stone-500 md:hover:bg-stone-50 md:hover:text-stone-900'
              )
            }
          >
            <Icon size={22} strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="hidden md:block md:px-4 md:mt-4">
        <Link
          to="/entry/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors"
        >
          <Plus size={16} strokeWidth={2} />
          New Entry
        </Link>
      </div>
    </nav>
  )
}
