import { Link } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'

export function EmptyFeed() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-5">
        <UtensilsCrossed size={28} className="text-stone-400" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-semibold text-stone-900 mb-2">No entries yet</h2>
      <p className="text-sm text-stone-500 mb-6 max-w-xs">
        Start building your food journal. Log a meal, a dish you cooked, or a restaurant you loved.
      </p>
      <Link
        to="/entry/new"
        className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-full active:scale-95 transition-transform"
      >
        Log your first entry
      </Link>
    </div>
  )
}
