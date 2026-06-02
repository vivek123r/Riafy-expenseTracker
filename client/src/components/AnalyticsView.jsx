import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useSummary } from '../hooks/useExpenses'
import { CATEGORY_COLORS, CATEGORY_BG, formatCurrency, getCurrentMonth, navMonth, monthLabel } from '../utils/format'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const RADIAN = Math.PI / 180
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.55
  return (
    <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-xl p-3 text-xs">
      <p className="font-semibold text-slate-800 dark:text-white mb-1">{payload[0].name || payload[0].dataKey}</p>
      <p className="text-slate-500 dark:text-slate-400">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function AnalyticsView() {
  const [month, setMonth] = useState(getCurrentMonth())
  const { summary, loading } = useSummary(month)
  const isNow = month === getCurrentMonth()

  const breakdown = summary?.breakdown || []
  const pieData = breakdown.map(b => ({ name: b.category, value: b.amount }))
  const barData = breakdown.map(b => ({ name: b.category, amount: b.amount }))

  return (
    <div className="space-y-5">
      {/* Month nav */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">Analytics</h1>
        <div className="flex items-center gap-1 card px-3 py-2">
          <button className="btn-ghost h-7 w-7 rounded-lg p-0" onClick={() => setMonth(m => navMonth(m, -1))}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 min-w-[110px] text-center">
            {monthLabel(month)}
          </span>
          <button className="btn-ghost h-7 w-7 rounded-lg p-0 disabled:opacity-30"
            onClick={() => setMonth(m => navMonth(m, 1))} disabled={isNow}>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5 h-80 shimmer" />
          <div className="card p-5 h-80 shimmer" />
        </div>
      )}

      {!loading && breakdown.length === 0 && (
        <div className="card p-16 text-center text-slate-400">
          <p className="text-sm font-medium">No data for {monthLabel(month)}</p>
          <p className="text-xs mt-1">Add expenses to see analytics</p>
        </div>
      )}

      {!loading && breakdown.length > 0 && (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Spent', value: formatCurrency(summary.total) },
              { label: 'Transactions', value: summary.count },
              { label: 'Avg per tx', value: formatCurrency(Math.round(summary.total / summary.count)) },
              { label: 'Categories', value: breakdown.length },
            ].map((s, i) => (
              <div key={i} className="card p-4 opacity-0" style={{ animation: `fadeSlideUp 0.3s ease ${i * 50}ms forwards` }}>
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Donut */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Spending Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                    paddingAngle={3} dataKey="value" labelLine={false} label={<PieLabel />}>
                    {pieData.map(e => <Cell key={e.name} fill={CATEGORY_COLORS[e.name] || '#94a3b8'} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Amount by Category</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barSize={28} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                    angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} width={36} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 8 }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {barData.map((e, i) => <Cell key={i} fill={CATEGORY_COLORS[e.name] || '#94a3b8'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category breakdown table */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Category Detail</h3>
            <div className="space-y-3">
              {breakdown.map((b, i) => (
                <div key={b.category} className="opacity-0" style={{ animation: `fadeSlideUp 0.3s ease ${i * 50}ms forwards` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`badge ${CATEGORY_BG[b.category]}`}>{b.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{b.percentage}%</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(b.amount)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${b.percentage}%`, background: CATEGORY_COLORS[b.category] || '#94a3b8' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
