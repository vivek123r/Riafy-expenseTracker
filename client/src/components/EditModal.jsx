import { useEffect } from 'react'
import ExpenseForm from './ExpenseForm'
import { X } from 'lucide-react'

export default function EditModal({ expense, onSaved, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!expense) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.15s ease' }}
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-lg glass rounded-2xl shadow-2xl"
        style={{ animation: 'modalIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 dark:border-white/5">
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">Edit Expense</h2>
            <p className="text-xs text-slate-400 mt-0.5">Update the expense details below</p>
          </div>
          <button
            className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">
          <ExpenseForm
            initial={expense}
            onSaved={saved => { onSaved(saved); onClose() }}
            onCancel={onClose}
            compact
          />
        </div>
      </div>
    </div>
  )
}
