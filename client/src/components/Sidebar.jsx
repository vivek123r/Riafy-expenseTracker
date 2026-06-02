import { LayoutDashboard, CreditCard, TrendingUp, X, Menu } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',    view: 'dashboard' },
  { icon: CreditCard,      label: 'All Expenses', view: 'expenses'  },
  { icon: TrendingUp,      label: 'Analytics',    view: 'analytics' },
]

function SidebarContent({ activeView, onNav, onClose }) {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
          Menu
        </p>
        {NAV.map(item => (
          <button
            key={item.view}
            className={`nav-item w-full ${activeView === item.view ? 'active' : ''}`}
            onClick={() => { onNav(item.view); onClose() }}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  )
}

export default function Sidebar({ activeView, onNav }) {
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
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-60 glass border-r border-white/20 dark:border-white/5 transform transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent activeView={activeView} onNav={onNav} onClose={() => setMobileOpen(false)} />
      </aside>

      <aside className="hidden lg:flex lg:flex-col w-56 flex-shrink-0 glass border-r border-white/20 dark:border-white/5 min-h-screen sticky top-0 h-screen">
        <SidebarContent activeView={activeView} onNav={onNav} onClose={() => {}} />
      </aside>
    </>
  )
}
