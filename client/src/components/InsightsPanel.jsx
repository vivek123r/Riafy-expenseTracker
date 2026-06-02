import { formatCurrency, CATEGORY_BG, CATEGORY_COLORS } from '../utils/format'

export default function InsightsPanel({ summary, loading }) {
  const { total = 0, count = 0, breakdown = [] } = summary || {}
  const avgPerTx = count > 0 ? Math.round(total / count) : 0
  const topCat = breakdown[0]

  return (
    <div className="card p-5 h-full flex flex-col">
      <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Category Breakdown</h2>

      {loading && (
        <div className="space-y-3 flex-1">
          {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-9 rounded-lg" />)}
        </div>
      )}

      {!loading && breakdown.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-400">No expenses this month</p>
        </div>
      )}

      {!loading && breakdown.length > 0 && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Category rows */}
          <div className="space-y-1">
            {breakdown.map((b, i) => (
              <div
                key={b.category}
                className="opacity-0"
                style={{ animation: `fadeSlideUp 0.3s ease ${i * 50}ms forwards` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`badge ${CATEGORY_BG[b.category]}`}>{b.category}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</span>
                    <span className="text-xs text-slate-400 ml-2">{b.percentage}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${b.percentage}%`, background: CATEGORY_COLORS[b.category] || '#94a3b8' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-3">
              <p className="text-xs text-slate-400 mb-0.5">Avg / transaction</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(avgPerTx)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-3">
              <p className="text-xs text-slate-400 mb-0.5">Top category</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{topCat?.category || '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
