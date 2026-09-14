import { todayKey } from '../db'

// Labels cortos: lunes primero
const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

function getCurrentWeekDays() {
  const today  = new Date()
  const dow    = today.getDay()             // 0 = domingo
  const offset = dow === 0 ? -6 : 1 - dow  // lunes = 0
  const monday = new Date(today)
  monday.setDate(today.getDate() + offset)
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { dateKey: d.toISOString().slice(0, 10), label: DAY_LABELS[i], num: d.getDate() }
  })
}

export default function WeekStrip() {
  const today    = todayKey()
  const weekDays = getCurrentWeekDays()

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-app-border dark:border-dark-border p-4">
      {/* Day columns */}
      <div className="flex justify-between">
        {weekDays.map(({ dateKey, label, num }) => {
          const isToday = dateKey === today
          const isPast  = dateKey < today

          return (
            <div key={dateKey} className="flex flex-col items-center gap-2">
              {/* Number with optional filled circle */}
              <div className={[
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                isToday
                  ? 'bg-primary text-white shadow-primary'
                  : isPast
                    ? 'text-subtle/60 dark:text-dark-muted/60'
                    : 'text-navy dark:text-dark-ink'
              ].join(' ')}>
                {num}
              </div>

              {/* Day label below */}
              <span className={[
                'text-[10px] font-semibold uppercase tracking-wider',
                isToday ? 'text-primary' : 'text-subtle dark:text-dark-muted'
              ].join(' ')}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
