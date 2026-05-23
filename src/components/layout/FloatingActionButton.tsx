import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export function FloatingActionButton() {
  return (
    <Link
      to="/entry/new"
      className="fixed right-5 bottom-24 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-stone-900 text-white shadow-lg active:scale-95 transition-transform md:hidden"
      aria-label="New entry"
    >
      <Plus size={26} strokeWidth={2} />
    </Link>
  )
}
