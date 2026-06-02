import { useState } from 'react'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency, formatDate, CATEGORY_META, CATEGORY_BG } from '../utils/format'
import { api } from '../services/api'

function ExpenseCard({ exp, onEdit, onDeleted, index }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const meta = CATEGORY_META[exp.category] || CATEGORY_META.Other

  async function handleDelete() {
    if (!window.confirm(`Delete "${exp.title}"?`)) return
    setDeleting(true)
    try {
      await api.expenses.delete(exp.id)
      onDeleted(exp.id)
    } catch (e) {
      alert(e.message)
      setDeleting(false)
    }
  }

  return (
    <div
      className="group mb-2 opacity-0"
      style={{ animation: `fadeSlideUp 0.35s ease ${index * 40}ms forwards` }}
    >
      <div className="rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => exp.note && setExpanded(v => !v)}
        >
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-slate-800 dark:text-white text-sm">{exp.title}</p>
              <span className={`badge ${CATEGORY_BG[exp.category] || 'bg-slate-100 text-slate-600'} flex-shrink-0`}>
                {exp.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{formatDate(exp.date)}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">
              {formatCurrency(exp.amount)}
            </p>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                onClick={e => { e.stopPropagation(); onEdit(exp) }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/15 hover:text-red-500 transition-all disabled:opacity-40"
                onClick={e => { e.stopPropagation(); handleDelete() }}
                disabled={deleting}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {exp.note && (
              <span className="text-slate-300 dark:text-slate-600">
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </span>
            )}
          </div>
        </div>

        {expanded && exp.note && (
          <div className="px-4 pb-4 border-t border-slate-50 dark:border-white/5">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-3">{exp.note}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ExpenseTimeline({ expenses, loading, onEdit, onDeleted }) {
  if (loading) {
    return (
      <div className="space-y-3 p-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="shimmer h-9 w-9 rounded-xl flex-shrink-0 mt-1" />
            <div className="flex-1 shimmer h-16 rounded-2xl" />
          </div>
        ))}
      </div>
    )
  }

  if (!expenses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">No expenses found</p>
        <p className="text-sm text-slate-400">Try adjusting filters or add a new expense</p>
      </div>
    )
  }

  return (
    <div className="pt-2 px-1">
      {expenses.map((exp, i) => (
        <ExpenseCard key={exp.id} exp={exp} onEdit={onEdit} onDeleted={onDeleted} index={i} />
      ))}
      <p className="text-xs text-slate-400 dark:text-slate-600 text-center pb-2 mt-1">
        {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
