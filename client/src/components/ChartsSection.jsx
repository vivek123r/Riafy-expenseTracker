import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { CATEGORY_COLORS, formatCurrency, getCurrentMonth, navMonth, monthLabel } from '../utils/format'
import { useSummary } from '../hooks/useExpenses'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const RADIAN = Math.PI / 180
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.55
  return (
    <text
      x={cx + r * Math.cos(-midAngle * RADIAN)}
      y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 shadow-xl p-3 text-xs">
      <p className="font-semibold text-slate-800 dark:text-white mb-1">{payload[0].name}</p>
      <p className="text-slate-500 dark:text-slate-400">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function ChartsSection() {
  const [month, setMonth] = useState(getCurrentMonth())
  const { summary, loading } = useSummary(month)
  const isNow = month === getCurrentMonth()

  const pieData = summary?.breakdown.map(b => ({ name: b.category, value: b.amount })) || []
  const barData = summary?.breakdown.map(b => ({
    name: b.category,
    amount: b.amount,
    fill: CATEGORY_COLORS[b.category] || '#94a3b8',
  })) || []

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Spending Breakdown</h2>
        <div className="flex items-center gap-1">
          <button className="btn-ghost h-7 w-7 rounded-lg p-0" onClick={() => setMonth(m => navMonth(m, -1))}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 min-w-[110px] text-center">
            {monthLabel(month)}
          </span>
          <button
            className="btn-ghost h-7 w-7 rounded-lg p-0 disabled:opacity-30"
            onClick={() => setMonth(m => navMonth(m, 1))}
            disabled={isNow}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-52">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && pieData.length === 0 && (
        <div className="flex flex-col items-center justify-center h-52 text-slate-400">
          <p className="text-sm font-medium">No data for {monthLabel(month)}</p>
          <p className="text-xs mt-1">Add expenses to see your breakdown</p>
        </div>
      )}

      {!loading && pieData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Distribution</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90}
                  paddingAngle={3} dataKey="value"
                  labelLine={false} label={<PieLabel />}
                >
                  {pieData.map(e => (
                    <Cell key={e.name} fill={CATEGORY_COLORS[e.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">By Category</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 8 }} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
