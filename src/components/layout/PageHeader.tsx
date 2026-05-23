import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  showBack?: boolean
  right?: React.ReactNode
  className?: string
}

export function PageHeader({ title, showBack = false, right, className }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className={cn('sticky top-0 z-40 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200', className)}>
      <div className="flex items-center h-14 px-4 gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center -ml-2 w-10 h-10 rounded-full text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <h1 className={cn('flex-1 text-lg font-semibold text-stone-900 truncate', showBack && 'text-base')}>
          {title}
        </h1>
        {right && <div className="flex items-center">{right}</div>}
      </div>
    </header>
  )
}
