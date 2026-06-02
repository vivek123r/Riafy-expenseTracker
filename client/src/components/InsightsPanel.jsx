import { Sparkles, AlertCircle } from 'lucide-react'
import { formatCurrency } from '../utils/format'

function buildInsights(summary) {
  if (!summary || !summary.breakdown?.length) return []
  const { total, count, breakdown } = summary
  const insights = []
  const top = breakdown[0]

  if (top) insights.push({
    icon: '🏆', type: top.percentage > 50 ? 'warning' : 'info',
    text: `You spent ${top.percentage}% on ${top.category} this month (${formatCurrency(top.amount)}).`,
  })
  if (count > 0) insights.push({
    icon: '💳', type: 'info',
    text: `Average spend per transaction: ${formatCurrency(Math.round(total / count))}.`,
  })
  if (breakdown.length >= 2) insights.push({
    icon: '📊', type: 'info',
    text: `${breakdown[1].category} is your 2nd largest expense at ${formatCurrency(breakdown[1].amount)}.`,
  })
  if (top?.percentage > 60) {
    insights.push({ icon: '⚠️', type: 'warning', text: `${top.category} takes up over 60% of your budget. Consider redistributing.` })
  } else {
    insights.push({ icon: '✅', type: 'success', text: `Spending spread across ${breakdown.length} categories — well balanced!` })
  }
  return insights
}

const TYPE = {
  info:    'border-l-indigo-400 bg-indigo-50/60 dark:bg-indigo-500/10',
  warning: 'border-l-amber-400 bg-amber-50/60 dark:bg-amber-500/10',
  success: 'border-l-emerald-400 bg-emerald-50/60 dark:bg-emerald-500/10',
}

export default function InsightsPanel({ summary, loading }) {
  const insights = buildInsights(summary)

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Spending Insights</h2>
          <p className="text-xs text-slate-400">Smart analysis</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-12 rounded-xl" />)}
        </div>
      )}

      {!loading && insights.length === 0 && (
        <div className="flex flex-col items-center py-6 text-slate-400">
          <AlertCircle className="h-8 w-8 stroke-1 mb-2" />
          <p className="text-sm">Add expenses to see insights.</p>
        </div>
      )}

      {!loading && insights.map((ins, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 rounded-xl border-l-2 px-3 py-2.5 mb-2 opacity-0 ${TYPE[ins.type]}`}
          style={{ animation: `fadeSlideUp 0.3s ease ${i * 80}ms forwards` }}
        >
          <span className="text-base mt-0.5 flex-shrink-0">{ins.icon}</span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{ins.text}</p>
        </div>
      ))}
    </div>
  )
}
