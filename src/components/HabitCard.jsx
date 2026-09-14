import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  db,
  lastNDays, lastNWeeks, lastNMonths,
  todayKey, weekKey, monthKey,
  weekLabel, monthLabel,
  toggleEntry, computeStreak,
  archiveHabit,
  XP_PER_COMPLETION, xpForStreak
} from '../db'

const DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

const COLOR_MAP = {
  moss:   { done: 'bg-moss border-moss', ring: 'ring-moss/50', text: 'text-moss' },
  clay:   { done: 'bg-clay border-clay', ring: 'ring-clay/50', text: 'text-clay' },
  gold:   { done: 'bg-gold border-gold', ring: 'ring-gold/50', text: 'text-gold' },
  blue:   { done: 'bg-blue-500 border-blue-500', ring: 'ring-blue-500/50', text: 'text-blue-500' },
  violet: { done: 'bg-violet-500 border-violet-500', ring: 'ring-violet-500/50', text: 'text-violet-500' },
}

function getPeriodKeys(frequency) {
  if (frequency === 'weekly')  return lastNWeeks(8)
  if (frequency === 'monthly') return lastNMonths(6)
  return lastNDays(7)
}

function getPeriodLabel(frequency, key) {
  if (frequency === 'weekly')  return weekLabel(key)
  if (frequency === 'monthly') return monthLabel(key)
  const dayIdx = new Date(key + 'T00:00:00').getDay()
  return DAY_LABELS[dayIdx]
}

function getCurrentPeriod(frequency) {
  if (frequency === 'weekly')  return weekKey()
  if (frequency === 'monthly') return monthKey()
  return todayKey()
}

function frequencyBadge(frequency) {
  if (frequency === 'weekly')  return { label: 'Semanal',  cls: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' }
  if (frequency === 'monthly') return { label: 'Mensual',  cls: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' }
  return { label: 'Diario', cls: 'bg-moss/10 text-moss dark:bg-moss/20' }
}

export default function HabitCard({ habit, onXP }) {
  const [justDone, setJustDone] = useState(null)

  const entries = useLiveQuery(
    () => db.entries.where('habitId').equals(habit.id).toArray(),
    [habit.id],
    []
  )

  const frequency  = habit.frequency ?? 'daily'
  const color      = habit.color ?? 'moss'
  const colors     = COLOR_MAP[color] ?? COLOR_MAP.moss
  const periodKeys = getPeriodKeys(frequency)
  const current    = getCurrentPeriod(frequency)
  const entryMap   = Object.fromEntries((entries ?? []).map(e => [e.date, e]))
  const streak     = computeStreak(entries ?? [], frequency)
  const badge      = frequencyBadge(frequency)

  // Completion % of visible periods
  const doneCount  = periodKeys.filter(k => entryMap[k]?.done).length
  const pct        = Math.round((doneCount / periodKeys.length) * 100)

  async function handleToggle(periodKey) {
    const wasDone = !!entryMap[periodKey]?.done
    await toggleEntry(habit.id, periodKey)

    if (!wasDone && periodKey === current) {
      setJustDone(periodKey)
      setTimeout(() => setJustDone(null), 600)
      const newStreak = streak + 1
      const xpGained = XP_PER_COMPLETION + xpForStreak(newStreak)
      onXP?.(xpGained)
    }
  }

  async function handleArchive() {
    if (confirm(`¿Archivar "${habit.name}"? El historial se conservará.`)) {
      await archiveHabit(habit.id)
    }
  }

  return (
    <div className="group animate-fade-in rounded-2xl border border-line dark:border-dark-border bg-white/70 dark:bg-dark-card/80 backdrop-blur-sm p-4 mb-3 hover:shadow-md dark:hover:shadow-dark-border/20 hover:border-line dark:hover:border-dark-border transition-all duration-200">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{habit.emoji ?? '✅'}</span>
          <div>
            <p className="font-serif text-base text-ink dark:text-dark-ink leading-tight">{habit.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.cls}`}>
                {badge.label}
              </span>
              {streak > 0 && (
                <span className={`text-[10px] font-medium ${colors.text} flex items-center gap-0.5`}>
                  {streak >= 3 ? '🔥' : '⚡'} {streak} {frequency === 'daily' ? 'd' : frequency === 'weekly' ? 'sem' : 'mes'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Archive button (visible on hover) */}
        <button
          onClick={handleArchive}
          aria-label={`Archivar ${habit.name}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-ink/25 dark:text-dark-muted hover:text-clay dark:hover:text-clay text-xs px-2 py-1 rounded-lg hover:bg-clay/10"
        >
          Archivar
        </button>
      </div>

      {/* Period circles */}
      <div className="flex items-end gap-1.5 justify-between">
        {periodKeys.map((key) => {
          const done    = !!entryMap[key]?.done
          const isCurrent = key === current
          const isPopping = justDone === key

          return (
            <div key={key} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[9px] text-ink/35 dark:text-dark-muted font-medium">
                {getPeriodLabel(frequency, key)}
              </span>
              <button
                onClick={() => handleToggle(key)}
                aria-label={`${habit.name} — ${key}${done ? ', completado' : ''}`}
                aria-pressed={done}
                className={[
                  'w-full aspect-square max-w-[32px] rounded-full border-2 transition-all duration-200',
                  'hover:scale-110 active:scale-90',
                  done
                    ? `${colors.done} shadow-sm ${isPopping ? 'animate-pop' : ''}`
                    : `bg-transparent border-line dark:border-dark-border hover:border-current ${colors.text}`,
                  isCurrent && !done
                    ? `ring-2 ring-offset-1 ring-offset-white dark:ring-offset-dark-card ${colors.ring}`
                    : ''
                ].join(' ')}
              />
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 rounded-full bg-line dark:bg-dark-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            color === 'moss'   ? 'bg-moss'   :
            color === 'clay'   ? 'bg-clay'   :
            color === 'gold'   ? 'bg-gold'   :
            color === 'blue'   ? 'bg-blue-500' :
            'bg-violet-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-ink/35 dark:text-dark-muted text-right">
        {doneCount}/{periodKeys.length} completados
      </p>
    </div>
  )
}
