export const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other']

export const CATEGORY_META = {
  Food:          { icon: '🍔', color: '#f97316', light: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',     hex: '#f97316' },
  Transport:     { icon: '🚕', color: '#3b82f6', light: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',             hex: '#3b82f6' },
  Shopping:      { icon: '🛒', color: '#ec4899', light: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400',             hex: '#ec4899' },
  Bills:         { icon: '📄', color: '#8b5cf6', light: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',     hex: '#8b5cf6' },
  Entertainment: { icon: '🎮', color: '#10b981', light: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400', hex: '#10b981' },
  Other:         { icon: '📦', color: '#94a3b8', light: 'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400',         hex: '#94a3b8' },
}

export const CATEGORY_COLORS = Object.fromEntries(
  Object.entries(CATEGORY_META).map(([k, v]) => [k, v.hex])
)
export const CATEGORY_BG = Object.fromEntries(
  Object.entries(CATEGORY_META).map(([k, v]) => [k, v.light])
)

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR',
    minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(amount || 0)
}

export function formatCompact(amount) {
  if (!amount) return '₹0'
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return formatCurrency(amount)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const m = parseInt(parts[1], 10)
  if (m < 1 || m > 12) return dateStr
  return `${parts[2]} ${months[m - 1]} ${parts[0]}`
}

export function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export function getCurrentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}

export function monthLabel(month) {
  if (!month) return ''
  const [y, m] = month.split('-')
  return new Date(Number(y), Number(m)-1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export function navMonth(month, delta) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}
