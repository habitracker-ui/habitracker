import { useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, computeStreak, XP_PER_COMPLETION, xpForStreak } from './db'
import HabitCard from './components/HabitCard'
import AddHabitForm from './components/AddHabitForm'
import FrequencyTabs from './components/FrequencyTabs'
import StatsHeader from './components/StatsHeader'
import ImportExport from './components/ImportExport'
import { ThemeProvider } from './ThemeProvider'

function todayLabel() {
  const formatted = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date())
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function AppContent() {
  const [filterFreq, setFilterFreq] = useState('all')
  const [xp, setXP] = useState(() => Number(localStorage.getItem('habit-xp') ?? 0))
  const [xpFlash, setXpFlash] = useState(null)

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

  // Calculate best streak across all habits
  const longestStreak = (() => {
    if (!habits?.length || !allEntries?.length) return 0
    return Math.max(...habits.map(h => {
      const e = allEntries.filter(e => e.habitId === h.id)
      return computeStreak(e, h.frequency ?? 'daily')
    }), 0)
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
    setTimeout(() => setXpFlash(null), 1500)
  }, [])

  const loaded = habits !== undefined

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-lg mx-auto px-5 py-8 pb-16">

        {/* Header */}
        <header className="mb-6">
          <p className="text-xs text-clay dark:text-clay font-semibold uppercase tracking-widest mb-1">
            {todayLabel()}
          </p>
          <h1 className="font-serif text-4xl text-ink dark:text-dark-ink mb-6">Hábitos</h1>

          {/* XP flash notification */}
          {xpFlash && (
            <div className="fixed top-5 right-5 z-50 px-4 py-2 rounded-xl gradient-moss text-white text-sm font-bold shadow-lg animate-fade-in pointer-events-none">
              {xpFlash} 🎉
            </div>
          )}

          <StatsHeader totalXP={xp} longestStreak={longestStreak} />
        </header>

        {/* Tabs */}
        <div className="mb-4">
          <FrequencyTabs active={filterFreq} onChange={setFilterFreq} />
        </div>

        {/* Habit list */}
        <main>
          {loaded && filtered.length === 0 && (
            <div className="text-center py-14">
              <p className="text-4xl mb-3">🌱</p>
              <p className="text-ink/40 dark:text-dark-muted text-sm">
                {filterFreq === 'all'
                  ? 'Todavía no tienes hábitos. Agrega el primero abajo.'
                  : `No tienes hábitos ${filterFreq === 'daily' ? 'diarios' : filterFreq === 'weekly' ? 'semanales' : 'mensuales'} aún.`
                }
              </p>
            </div>
          )}

          {filtered.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onXP={handleXP} />
          ))}

          <AddHabitForm />
        </main>

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-between text-xs text-ink/35 dark:text-dark-muted">
          <span>Datos solo en este dispositivo 🔒</span>
          <ImportExport onImported={() => window.location.reload()} />
        </footer>
      </div>
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
