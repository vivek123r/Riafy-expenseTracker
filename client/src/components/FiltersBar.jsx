import { Search, X, SlidersHorizontal } from 'lucide-react'
import { CATEGORIES } from '../utils/format'

export default function FiltersBar({ filters, onChange, onClear }) {
  function set(field, value) { onChange({ ...filters, [field]: value }) }
  const hasFilters = Object.values(filters).some(Boolean)
  const activeCount = Object.values(filters).filter(Boolean).length
  const invalidRange = filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Filters</span>
          {hasFilters && (
            <span className="h-4 w-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {hasFilters && (
          <button
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            onClick={onClear}
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            className="input pl-9"
            placeholder="Search expenses..."
            value={filters.title}
            onChange={e => set('title', e.target.value)}
          />
        </div>
        <select className="input" value={filters.category} onChange={e => set('category', e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input className="input" type="date" value={filters.dateFrom} onChange={e => set('dateFrom', e.target.value)} />
        <input className="input" type="date" value={filters.dateTo} onChange={e => set('dateTo', e.target.value)} />
      </div>

      {/* Active chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 pt-1">
          {filters.title && <Chip label={`"${filters.title}"`} onRemove={() => set('title', '')} />}
          {filters.category && (
            <Chip label={filters.category} onRemove={() => set('category', '')} />
          )}
          {filters.dateFrom && <Chip label={`From: ${filters.dateFrom}`} onRemove={() => set('dateFrom', '')} />}
          {filters.dateTo && <Chip label={`To: ${filters.dateTo}`} onRemove={() => set('dateTo', '')} />}
        </div>
      )}

      {invalidRange && (
        <p className="text-xs text-red-500">⚠️ "From" date cannot be after "To" date</p>
      )}
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 px-2.5 py-1 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
