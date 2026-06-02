import { useState, useEffect } from 'react'
import { CATEGORIES, CATEGORY_META, getToday } from '../utils/format'
import { api } from '../services/api'
import { Plus } from 'lucide-react'

const empty = () => ({ title: '', amount: '', category: 'Food', date: getToday(), note: '' })

export default function ExpenseForm({ initial, onSaved, onCancel, compact = false }) {
  const [form, setForm] = useState(initial || empty())
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(initial?.id)

  useEffect(() => { setForm(initial || empty()); setErrors({}) }, [initial])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined, submit: undefined }))
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    const amt = Number(form.amount)
    if (!form.amount || isNaN(amt) || amt <= 0) errs.amount = 'Amount must be greater than 0'
    if (!form.category) errs.category = 'Category is required'
    if (!form.date) errs.date = 'Date is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const payload = { ...form, amount: Number(form.amount), note: form.note?.trim() || null }
      const saved = isEdit
        ? await api.expenses.update(initial.id, payload)
        : await api.expenses.create(payload)
      if (!isEdit) setForm(empty())
      onSaved(saved)
    } catch (err) {
      if (err.errors) {
        const fe = {}; err.errors.forEach(e => { fe[e.path] = e.msg }); setErrors(fe)
      } else setErrors({ submit: err.message })
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={`grid gap-4 ${compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            className={`input ${errors.title ? 'border-red-400 focus:ring-red-400/20' : ''}`}
            type="text" value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Coffee at Starbucks" maxLength={120}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Amount (₹) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">₹</span>
            <input
              className={`input pl-8 ${errors.amount ? 'border-red-400' : ''}`}
              type="number" value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0.00" min="0.01" step="0.01"
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Category <span className="text-red-400">*</span>
          </label>
          <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{CATEGORY_META[c]?.icon} {c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Date <span className="text-red-400">*</span>
          </label>
          <input
            className={`input ${errors.date ? 'border-red-400' : ''}`}
            type="date" value={form.date}
            onChange={e => set('date', e.target.value)}
          />
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Note <span className="text-slate-300 dark:text-slate-600">(optional)</span>
          </label>
          <textarea
            className="input resize-none" rows={2} value={form.note}
            onChange={e => set('note', e.target.value)}
            placeholder="Any additional details..." maxLength={500}
          />
        </div>
      </div>

      {errors.submit && (
        <p className="mt-3 rounded-xl bg-red-50 dark:bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
          {errors.submit}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2.5">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving
            ? <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />{isEdit ? 'Saving...' : 'Adding...'}</span>
            : <><Plus className="h-4 w-4" />{isEdit ? 'Save Changes' : 'Add Expense'}</>
          }
        </button>
        {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
