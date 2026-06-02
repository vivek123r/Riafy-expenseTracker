import { CreditCard, TrendingUp, Trophy, Calendar } from 'lucide-react'
import { formatCompact } from '../utils/format'
import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    if (!target) { setValue(0); return }
    const start = performance.now()
    function tick(now) {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.floor(target * eased))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => raf.current && cancelAnimationFrame(raf.current)
  }, [target])
  return value
}

function Card({ icon: Icon, iconClass, label, value, sub, delay }) {
  return (
    <div
      className="card-hover p-5 opacity-0"
      style={{ animation: `fadeSlideUp 0.4s ease ${delay}ms forwards` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">{value}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

export default function SummaryCards({ summary, loading }) {
  const total = summary?.total || 0
  const count = summary?.count || 0
  const topCat = summary?.breakdown?.[0]
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const avgDaily = total > 0 ? total / daysInMonth : 0

  const animTotal = useCountUp(Math.round(total))
  const animCount = useCountUp(count)
  const animAvg = useCountUp(Math.round(avgDaily))

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 h-36">
            <div className="shimmer h-10 w-10 rounded-xl mb-4" />
            <div className="shimmer h-3 w-20 rounded mb-2" />
            <div className="shimmer h-7 w-28 rounded" />
          </div>
        ))}
      </div>
    )
  }


  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={CreditCard}
        iconClass="bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
        label="Total Spent"
        value={formatCompact(animTotal)}
        sub="This month"
        delay={0}
      />
      <Card
        icon={TrendingUp}
        iconClass="bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
        label="Transactions"
        value={animCount.toString()}
        sub="This month"
        delay={60}
      />
      <Card
        icon={Trophy}
        iconClass="bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
        label="Largest Category"
        value={topCat?.category || '—'}
        sub={topCat ? `${topCat.percentage}% of total` : 'No data'}
        delay={120}
      />
      <Card
        icon={Calendar}
        iconClass="bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400"
        label="Avg Daily Spend"
        value={formatCompact(animAvg)}
        sub="This month"
        delay={180}
      />
    </div>
  )
}
