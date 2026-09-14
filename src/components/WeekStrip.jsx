import { todayKey } from '../db'

// Labels cortos para los días — empezando por lunes
const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

/** Retorna los 7 días de la semana actual (Lun–Dom) */
function getCurrentWeekDays() {
  const today = new Date()
  const dow   = today.getDay()                      // 0 = domingo
  // offset para que el lunes sea el primer día
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateKey = d.toISOString().slice(0, 10)
    const label   = DAY_LABELS[i]
    return { dateKey, label, num: d.getDate() }
  })
}

export default function WeekStrip() {
  const today   = todayKey()
  const weekDays = getCurrentWeekDays()

  const monthLabel = new Intl.DateTimeFormat('es-MX', {
    month: 'long',
    year:  'numeric'
  }).format(new Date())
  const formattedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  return (
    <div className="glass dark:glass-dark rounded-3xl p-4 shadow-sm">
      {/* Month label */}
      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">
        {formattedMonth}
      </p>

      {/* Day circles */}
      <div className="flex justify-between items-center">
        {weekDays.map(({ dateKey, label, num }) => {
          const isToday  = dateKey === today
          const isPast   = dateKey < today
          const isFuture = dateKey > today

          return (
            <div key={dateKey} className="flex flex-col items-center gap-1.5">
              <span className={[
                'text-[10px] font-bold uppercase tracking-wider',
                isToday
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 dark:text-slate-500'
              ].join(' ')}>
                {label}
              </span>

              <div className={[
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                isToday
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/50 dark:shadow-indigo-900/60'
                  : isPast
                    ? 'text-slate-400 dark:text-slate-600'
                    : 'text-slate-600 dark:text-slate-300'
              ].join(' ')}>
                {num}
              </div>

              {/* Dot indicator: today has a filled dot */}
              <div className={[
                'w-1.5 h-1.5 rounded-full transition-all',
                isToday ? 'bg-indigo-500' : 'bg-transparent'
              ].join(' ')} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
