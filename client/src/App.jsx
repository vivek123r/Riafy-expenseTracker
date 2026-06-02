import { useState, useCallback } from 'react'
import { PlusCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from './hooks/useTheme'
import { useExpenses, useSummary } from './hooks/useExpenses'
import { getCurrentMonth } from './utils/format'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import SummaryCards from './components/SummaryCards'
import InsightsPanel from './components/InsightsPanel'
import ChartsSection from './components/ChartsSection'
import FiltersBar from './components/FiltersBar'
import ExpenseForm from './components/ExpenseForm'
import ExpenseTimeline from './components/ExpenseTimeline'
import EditModal from './components/EditModal'

const emptyFilters = { title: '', category: '', dateFrom: '', dateTo: '' }

export default function App() {
  const { dark, toggle } = useTheme()
  const [filters, setFilters] = useState(emptyFilters)
  const [editingExpense, setEditingExpense] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [summaryKey, setSummaryKey] = useState(0)

  const safeFilters =
    filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo
      ? { ...filters, dateTo: '' }
      : filters

  const { expenses, loading: expLoading, error: expError, refetch } = useExpenses(safeFilters)
  const { summary, loading: sumLoading } = useSummary(getCurrentMonth(), summaryKey)

  function bump() { setSummaryKey(k => k + 1) }

  const handleSaved = useCallback(() => { refetch(); bump(); setShowForm(false) }, [refetch])
  const handleDeleted = useCallback(() => { refetch(); bump() }, [refetch])
  const handleEditSaved = useCallback(() => { refetch(); bump(); setEditingExpense(null) }, [refetch])
  const handleCloseEdit = useCallback(() => setEditingExpense(null), [])

  return (
    <div className="min-h-screen relative">
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar dark={dark} toggleDark={toggle} />

        <div className="flex flex-1 min-h-0">
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 space-y-5">

            {/* Summary cards */}
            <SummaryCards summary={summary} loading={sumLoading} />

            {/* Charts + Insights row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="xl:col-span-2">
                <ChartsSection key={summaryKey} />
              </div>
              <div>
                <InsightsPanel summary={summary} loading={sumLoading} />
              </div>
            </div>

            {/* Filters */}
            <FiltersBar filters={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />

            {/* Add form toggle */}
            <div className="card overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                onClick={() => setShowForm(v => !v)}
              >
                <span className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <PlusCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                  Add New Expense
                </span>
                {showForm
                  ? <ChevronUp className="h-4 w-4 text-slate-400" />
                  : <ChevronDown className="h-4 w-4 text-slate-400" />
                }
              </button>
              {showForm && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-white/5">
                  <ExpenseForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
                </div>
              )}
            </div>

            {/* Expense list */}
            <div className="card">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
                    {expLoading ? 'Loading...' : `Expenses (${expenses.length})`}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Sorted by most recent</p>
                </div>
              </div>

              {expError ? (
                <div className="p-8 text-center text-sm text-red-500">{expError}</div>
              ) : (
                <ExpenseTimeline
                  expenses={expenses}
                  loading={expLoading}
                  onEdit={setEditingExpense}
                  onDeleted={handleDeleted}
                />
              )}
            </div>

          </main>
        </div>
      </div>

      {editingExpense && (
        <EditModal
          expense={editingExpense}
          onSaved={handleEditSaved}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  )
}
