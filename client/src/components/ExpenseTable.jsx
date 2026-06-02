import { useState } from 'react'
import { Pencil, Trash2, FileText } from 'lucide-react'
import { formatCurrency, formatDate, CATEGORY_BG } from '../utils/format'
import { api } from '../services/api'

export default function ExpenseTable({ expenses, loading, onEdit, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null)

  async function handleDelete(expense) {
    if (!window.confirm(`Delete "${expense.title}"?`)) return
    setDeletingId(expense.id)
    try {
      await api.expenses.delete(expense.id)
      onDeleted(expense.id)
    } catch (e) {
      alert(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="card p-12 flex flex-col items-center gap-3 text-slate-400">
        <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span className="text-sm">Loading expenses...</span>
      </div>
    )
  }

  if (!expenses.length) {
    return (
      <div className="card p-12 flex flex-col items-center gap-3 text-slate-400">
        <FileText className="h-12 w-12 stroke-1 text-slate-200" />
        <p className="text-sm font-medium">No expenses found</p>
        <p className="text-xs text-slate-400">Try adjusting your filters or add a new expense above.</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Note</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">{formatDate(exp.date)}</td>
                <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate">{exp.title}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${CATEGORY_BG[exp.category] || 'bg-slate-100 text-slate-600'}`}>
                    {exp.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                  {formatCurrency(exp.amount)}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs max-w-[180px] truncate">
                  {exp.note || <span className="text-slate-200">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition"
                      onClick={() => onEdit(exp)}
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                      onClick={() => handleDelete(exp)}
                      disabled={deletingId === exp.id}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-slate-100">
        {expenses.map(exp => (
          <div key={exp.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{exp.title}</p>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <span className={`badge ${CATEGORY_BG[exp.category]}`}>{exp.category}</span>
                  <span className="text-xs text-slate-400">{formatDate(exp.date)}</span>
                </div>
                {exp.note && <p className="mt-1 text-xs text-slate-400 truncate">{exp.note}</p>}
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800 whitespace-nowrap">{formatCurrency(exp.amount)}</p>
                <div className="mt-2 flex gap-1 justify-end">
                  <button
                    className="rounded p-1 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition"
                    onClick={() => onEdit(exp)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                    onClick={() => handleDelete(exp)}
                    disabled={deletingId === exp.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/40">
        <p className="text-xs text-slate-400">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  )
}
