import { useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, computeStreak, XP_PER_COMPLETION, xpForStreak } from './db'
import HabitCard from './components/HabitCard'
import AddHabitForm from './components/AddHabitForm'
import FrequencyTabs from './components/FrequencyTabs'
import StatsHeader from './components/StatsHeader'
import WeekStrip from './components/WeekStrip'
import TopNav from './components/TopNav'
import { ThemeProvider } from './ThemeProvider'

function todayLabel() {
  const d = new Date()
  const weekday = d.toLocaleDateString('es-MX', { weekday: 'long' })
  const day     = d.getDate()
  const month   = d.toLocaleDateString('es-MX', { month: 'long' })
  const result  = `${weekday} ${day} de ${month}`
  return result.charAt(0).toUpperCase() + result.slice(1)
}

function AppContent() {
  const [filterFreq, setFilterFreq] = useState('all')
  const [showAdd,    setShowAdd]    = useState(false)
  const [xp,         setXP]        = useState(() => Number(localStorage.getItem('habit-xp') ?? 0))
  const [xpFlash,    setXpFlash]   = useState(null)

  const habits = useLiveQuery(
    () => db.habits.where('archived').equals(0).toArray(),
    [],
    []
  )

  const allEntries = useLiveQuery(
    () => db.entries.toArray(),
    [],
    []
  )

  // Best streak across all active habits
  const longestStreak = (() => {
    if (!habits?.length || !allEntries?.length) return 0
    return Math.max(
      0,
      ...habits.map(h => {
        const e = allEntries.filter(e => e.habitId === h.id)
        return computeStreak(e, h.frequency ?? 'daily')
      })
    )
  })()

  const filtered = (habits ?? []).filter(
    h => filterFreq === 'all' || (h.frequency ?? 'daily') === filterFreq
  )

  const handleXP = useCallback((amount) => {
    setXP(prev => {
      const next = prev + amount
      localStorage.setItem('habit-xp', String(next))
      return next
    })
    setXpFlash(`+${amount} XP`)
    setTimeout(() => setXpFlash(null), 1800)
  }, [])

  const loaded = habits !== undefined

  return (
    <div className={`min-h-screen transition-colors duration-300 app-bg dark:app-bg`}>
      {/* Top navigation */}
      <TopNav onAddHabit={() => setShowAdd(true)} />

      {/* XP flash toast */}
      {xpFlash && (
        <div className="fixed top-20 right-5 z-50 pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-sm font-black shadow-xl shadow-indigo-300/40 animate-xp-flash">
            {xpFlash} 🎉
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-lg mx-auto px-5 pb-12 pt-5 space-y-4">

        {/* Date heading */}
        <div>
          <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">
            {todayLabel()}
          </p>
          <h1 className="font-black text-3xl text-slate-900 dark:text-white leading-tight">
            Buenos días 👋
          </h1>
        </div>

        {/* Week strip */}
        <WeekStrip />

        {/* Gamification card */}
        <StatsHeader totalXP={xp} longestStreak={longestStreak} />

        {/* Frequency tabs */}
        <FrequencyTabs active={filterFreq} onChange={setFilterFreq} />

        {/* Habit list */}
        <main>
          {loaded && filtered.length === 0 && (
            <div className="glass dark:glass-dark rounded-3xl py-16 px-6 text-center shadow-sm">
              <p className="text-5xl mb-4">🌱</p>
              <p className="font-bold text-slate-600 dark:text-slate-300 text-base mb-1">
                {filterFreq === 'all'
                  ? 'Sin hábitos todavía'
                  : `No tienes hábitos ${filterFreq === 'daily' ? 'diarios' : filterFreq === 'weekly' ? 'semanales' : 'mensuales'}`}
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Toca el botón <strong className="text-indigo-500">+</strong> para agregar el primero.
              </p>
            </div>
          )}

          {filtered.map(habit => (
            <HabitCard key={habit.id} habit={habit} onXP={handleXP} />
          ))}
        </main>

        {/* Footer */}
        <footer className="text-center space-y-1 pt-2">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            🔒 Datos guardados solo en este dispositivo
          </p>
        </footer>
      </div>

      {/* Add habit bottom sheet */}
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
