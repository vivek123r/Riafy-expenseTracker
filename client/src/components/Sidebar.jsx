import { LayoutDashboard, CreditCard, TrendingUp, BarChart2, Settings, HelpCircle, Zap, X, Menu } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  {
    group: 'General',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', active: true },
      { icon: CreditCard, label: 'All Expenses' },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { icon: TrendingUp, label: 'Insights' },
      { icon: BarChart2, label: 'Analytics' },
    ],
  },
  {
    group: 'Other',
    items: [
      { icon: Settings, label: 'Settings' },
      { icon: HelpCircle, label: 'Help Center' },
    ],
  },
]

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="flex-1 px-3 space-y-5 overflow-y-auto">
        {NAV.map(group => (
          <div key={group.group}>
            <p className="px-3 mb-1.5 text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <button
                  key={item.label}
                  className={`nav-item w-full ${item.active ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 mt-4">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/15 dark:to-purple-500/15 border border-indigo-100 dark:border-indigo-500/20 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-white">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">AI insights & unlimited history</p>
          <button className="w-full btn-primary text-xs py-2">Upgrade Plan</button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 lg:hidden h-12 w-12 rounded-2xl btn-primary shadow-2xl shadow-indigo-500/40"
        onClick={() => setMobileOpen(v => !v)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-60 glass border-r border-white/20 dark:border-white/5
        transform transition-transform duration-300 ease-in-out lg:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      <aside className="hidden lg:flex lg:flex-col w-56 flex-shrink-0 glass border-r border-white/20 dark:border-white/5 min-h-screen sticky top-0 h-screen">
        <SidebarContent onClose={() => {}} />
      </aside>
    </>
  )
}
