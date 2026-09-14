import { useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, computeStreak } from './db'
import HabitCard    from './components/HabitCard'
import AddHabitForm from './components/AddHabitForm'
import FrequencyTabs from './components/FrequencyTabs'
import StatsHeader  from './components/StatsHeader'
import WeekStrip    from './components/WeekStrip'
import TopNav       from './components/TopNav'
import { ThemeProvider } from './ThemeProvider'

function todayHeading() {
  const d   = new Date()
  const day = d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
  return day.charAt(0).toUpperCase() + day.slice(1)
}

function AppContent() {
  const [filterFreq, setFilterFreq] = useState('all')
  const [showAdd,    setShowAdd]    = useState(false)
  const [xp,         setXP]        = useState(() => Number(localStorage.getItem('habit-xp') ?? 0))
  const [xpFlash,    setXpFlash]   = useState(null)

  const habits = useLiveQuery(
    () => db.habits.where('archived').equals(0).toArray(),
    [], []
  )

  const allEntries = useLiveQuery(
    () => db.entries.toArray(),
    [], []
  )

  const longestStreak = (() => {
    if (!habits?.length || !allEntries?.length) return 0
    return Math.max(0, ...habits.map(h => {
      const e = allEntries.filter(e => e.habitId === h.id)
      return computeStreak(e, h.frequency ?? 'daily')
    }))
  })()

  const filtered = (habits ?? []).filter(
    h => filterFreq === 'all' || (h.frequency ?? 'daily') === filterFreq
  )

  const handleXP = useCallback((amount) => {
    setXP(prev => {
      const next = Math.max(0, prev + amount)
      localStorage.setItem('habit-xp', String(next))
      return next
    })
    setXpFlash(amount > 0 ? `+${amount} XP` : `${amount} XP`)
    setTimeout(() => setXpFlash(null), 1800)
  }, [])

  const loaded = habits !== undefined

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg transition-colors duration-300">

      <TopNav onAddHabit={() => setShowAdd(true)} />

      {/* XP toast */}
      {xpFlash && (
        <div className="fixed top-16 right-4 z-50 pointer-events-none">
          <div className={`px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg animate-xp-rise ${
            xpFlash.startsWith('+') ? 'bg-primary shadow-primary' : 'bg-slate-600'
          }`}>
            {xpFlash} {xpFlash.startsWith('+') ? '🎉' : '↩'}
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-5 py-5 pb-14 space-y-3">

        {/* Page heading */}
        <div className="pt-1 pb-1">
          <p className="text-[11px] font-semibold text-subtle dark:text-dark-muted uppercase tracking-widest mb-1">
            {todayHeading()}
          </p>
          <h1 className="text-[28px] font-black text-navy dark:text-dark-ink leading-tight tracking-tight">
            Mis Hábitos
          </h1>
        </div>

        {/* Week strip */}
        <WeekStrip />

        {/* XP/Level */}
        <StatsHeader totalXP={xp} longestStreak={longestStreak} />

        {/* Tabs */}
        <FrequencyTabs active={filterFreq} onChange={setFilterFreq} />

        {/* List */}
        <main className="flex flex-col gap-3.5 pt-1">
          {loaded && filtered.length === 0 && (
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-app-border dark:border-dark-border py-16 text-center">
              <p className="text-3xl mb-3">🌱</p>
              <p className="font-bold text-navy dark:text-dark-ink text-sm mb-1">
                {filterFreq === 'all'
                  ? 'Sin hábitos todavía'
                  : `Sin hábitos ${filterFreq === 'daily' ? 'diarios' : filterFreq === 'weekly' ? 'semanales' : 'mensuales'}`}
              </p>
              <p className="text-xs text-subtle dark:text-dark-muted">
                Toca el <strong className="text-primary">+</strong> para agregar el primero.
              </p>
            </div>
          )}

          {filtered.map(habit => (
            <HabitCard key={habit.id} habit={habit} onXP={handleXP} />
          ))}
        </main>

      </div>

      <AddHabitForm open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
