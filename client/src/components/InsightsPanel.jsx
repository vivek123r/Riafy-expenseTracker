import { Sparkles, AlertCircle } from 'lucide-react'
import { formatCurrency, CATEGORY_BG } from '../utils/format'

export default function InsightsPanel({ summary, loading }) {
  const { total = 0, count = 0, breakdown = [] } = summary || {}
  const avgPerTx = count > 0 ? total / count : 0

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Spending Insights</h2>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer h-10 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && !summary && (
        <div className="flex flex-col items-center py-8 text-slate-400">
          <AlertCircle className="h-7 w-7 stroke-1 mb-2" />
          <p className="text-sm">Add expenses to see insights.</p>
        </div>
      )}

      {!loading && summary && (
        <div className="space-y-1">
          {/* Avg per transaction */}
          <Row label="Avg per transaction" value={formatCurrency(Math.round(avgPerTx))} />

          {/* Top categories */}
          {breakdown.slice(0, 4).map((b, i) => (
            <div
              key={b.category}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-white/5 last:border-0 opacity-0"
              style={{ animation: `fadeSlideUp 0.3s ease ${i * 60}ms forwards` }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ background: `var(--cat-${b.category.toLowerCase()}, #94a3b8)` }} />
                <span className={`badge ${CATEGORY_BG[b.category]}`}>{b.category}</span>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</p>
                <p className="text-xs text-slate-400">{b.percentage}%</p>
              </div>
            </div>
          ))}

          {breakdown.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No data this month</p>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-white/5">
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 dark:text-white">{value}</span>
    </div>
  )
}
