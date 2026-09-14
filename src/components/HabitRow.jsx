import { useLiveQuery } from 'dexie-react-hooks'
import { db, lastNDays, todayKey, toggleEntry, computeStreak, deleteHabit } from '../db'

const DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

export default function HabitRow({ habit }) {
  const entries = useLiveQuery(
    () => db.entries.where('habitId').equals(habit.id).toArray(),
    [habit.id],
    []
  )

  const days = lastNDays(7)
  const today = todayKey()
  const entryByDate = Object.fromEntries((entries ?? []).map((e) => [e.date, e]))
  const streak = computeStreak(entries ?? [])

  async function handleDelete() {
    if (confirm(`¿Eliminar "${habit.name}" y todo su historial?`)) {
      await deleteHabit(habit.id)
    }
  }

  return (
    <div className="group py-5 border-b border-line flex items-center gap-6">
      <div className="flex-1 min-w-0">
        <p className="font-serif text-lg text-ink truncate">{habit.name}</p>
        <p className="text-xs text-ink/50 mt-0.5">
          {streak > 0 ? `Racha de ${streak} día${streak === 1 ? '' : 's'}` : 'Sin racha activa'}
        </p>
      </div>

      <div className="flex items-end gap-2 shrink-0">
        {days.map((dateKey) => {
          const done = entryByDate[dateKey]?.done
          const isToday = dateKey === today
          const dayIndex = new Date(dateKey + 'T00:00:00').getDay()
          return (
            <div key={dateKey} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-ink/40">{DAY_LABELS[dayIndex]}</span>
              <button
                onClick={() => toggleEntry(habit.id, dateKey)}
                aria-label={`${habit.name} — ${dateKey}${done ? ', completado' : ''}`}
                aria-pressed={!!done}
                className={[
                  'w-7 h-7 rounded-full border transition-colors',
                  done
                    ? 'bg-moss border-moss'
                    : 'bg-transparent border-ink/25 hover:border-moss',
                  isToday && !done ? 'ring-1 ring-offset-2 ring-offset-paper ring-clay/60' : ''
                ].join(' ')}
              />
            </div>
          )
        })}
      </div>

      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-ink/30 hover:text-clay text-sm shrink-0"
        aria-label={`Eliminar ${habit.name}`}
      >
        ✕
      </button>
    </div>
  )
}
