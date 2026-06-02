import { Sun, Moon, Wallet, ChevronDown } from 'lucide-react'

export default function Navbar({ dark, toggleDark }) {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/30 dark:border-white/5 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Expense Tracker</p>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleDark}
              className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                V
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">Vivek</span>
              <ChevronDown className="hidden sm:block h-3 w-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
