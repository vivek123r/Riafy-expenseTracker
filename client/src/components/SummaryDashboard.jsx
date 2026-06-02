import { useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, ShoppingBag, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSummary } from '../hooks/useExpenses'
import { formatCurrency, CATEGORY_COLORS, CATEGORY_BG, getCurrentMonth } from '../utils/format'

function navMonth(month, delta) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(month) {
  const [y, m] = month.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

const RADIAN = Math.PI / 180
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function SummaryDashboard({ refreshKey }) {
  const [month, setMonth] = useState(getCurrentMonth)
  const { summary, loading, error } = useSummary(month)
  const isCurrentMonth = month === getCurrentMonth()

  const chartData = summary?.breakdown.map(b => ({
    name: b.category,
    value: b.amount,
  })) || []

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-500" />
          <h2 className="font-semibold text-slate-800">Monthly Summary</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
            onClick={() => setMonth(m => navMonth(m, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-slate-700 min-w-[130px] text-center">
            {monthLabel(month)}
          </span>
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition disabled:opacity-30"
            onClick={() => setMonth(m => navMonth(m, 1))}
            disabled={isCurrentMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <svg className="h-6 w-6 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {!loading && summary && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 p-4 text-white">
              <p className="text-xs font-medium text-primary-100 mb-1">Total Spent</p>
              <p className="text-xl font-bold truncate">{formatCurrency(summary.total)}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 p-4 text-white">
              <p className="text-xs font-medium text-slate-300 mb-1">Transactions</p>
              <p className="text-xl font-bold">{summary.count}</p>
            </div>
          </div>

          {summary.breakdown.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-slate-400">
              <Calendar className="h-10 w-10 stroke-1 text-slate-200 mb-2" />
              <p className="text-sm">No expenses this month</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Pie chart */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">Breakdown</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      labelLine={false}
                      label={<CustomLabel />}
                    >
                      {chartData.map(entry => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Amount']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category list */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">By Category</p>
                <div className="space-y-2.5">
                  {summary.breakdown.map(b => (
                    <div key={b.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`badge ${CATEGORY_BG[b.category]}`}>{b.category}</span>
                        <span className="text-sm font-semibold text-slate-700">{formatCurrency(b.amount)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${b.percentage}%`,
                            backgroundColor: CATEGORY_COLORS[b.category] || '#94a3b8',
                          }}
                        />
                      </div>
                      <p className="text-right text-xs text-slate-400 mt-0.5">{b.percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
