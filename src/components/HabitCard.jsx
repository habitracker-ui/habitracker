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

// Full class strings so Tailwind JIT picks them up
const GRADIENT_MAP = {
  moss:   'habit-moss',
  clay:   'habit-clay',
  gold:   'habit-gold',
  blue:   'habit-blue',
  violet: 'habit-violet',
  pink:   'habit-pink',
  teal:   'habit-teal',
}

const FREQ_BADGE = {
  daily:   '📅 Diario',
  weekly:  '📆 Semanal',
  monthly: '🗓️ Mensual',
}

function getPeriodKeys(frequency) {
  if (frequency === 'weekly')  return lastNWeeks(8)
  if (frequency === 'monthly') return lastNMonths(6)
  return lastNDays(7)
}

function getPeriodLabel(frequency, key) {
  if (frequency === 'weekly')  return weekLabel(key)
  if (frequency === 'monthly') return monthLabel(key)
  return DAY_LABELS[new Date(key + 'T00:00:00').getDay()]
}

function getCurrentPeriod(frequency) {
  if (frequency === 'weekly')  return weekKey()
  if (frequency === 'monthly') return monthKey()
  return todayKey()
}

export default function HabitCard({ habit, onXP }) {
  const [popping, setPopping] = useState(null)

  const entries = useLiveQuery(
    () => db.entries.where('habitId').equals(habit.id).toArray(),
    [habit.id],
    []
  )

  const frequency  = habit.frequency  ?? 'daily'
  const color      = habit.color      ?? 'moss'
  const gradClass  = GRADIENT_MAP[color] ?? GRADIENT_MAP.moss
  const periodKeys = getPeriodKeys(frequency)
  const current    = getCurrentPeriod(frequency)
  const entryMap   = Object.fromEntries((entries ?? []).map(e => [e.date, e]))
  const streak     = computeStreak(entries ?? [], frequency)

  // Completion count for visible periods
  const doneCount = periodKeys.filter(k => entryMap[k]?.done).length
  const pct       = Math.round((doneCount / periodKeys.length) * 100)

  async function handleToggle(key) {
    const wasDone = !!entryMap[key]?.done
    await toggleEntry(habit.id, key)
    if (!wasDone) {
      setPopping(key)
      setTimeout(() => setPopping(null), 400)
      if (key === current) {
        onXP?.(XP_PER_COMPLETION + xpForStreak(streak + 1))
      }
    }
  }

  async function handleArchive() {
    if (confirm(`¿Archivar "${habit.name}"?\nEl historial se conservará.`)) {
      await archiveHabit(habit.id)
    }
  }

  return (
    <div className={`group relative rounded-3xl p-5 mb-3 animate-fade-in shadow-lg overflow-hidden ${gradClass}`}>

      {/* ── Decorative blobs for depth ──────────────────── */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-black/10 pointer-events-none" />

      {/* ── Header ──────────────────────────────────────── */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Emoji bubble */}
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
            {habit.emoji ?? '✅'}
          </div>
          <div>
            <h3 className="text-white font-bold text-base leading-tight">
              {habit.name}
            </h3>
            <span className="text-white/70 text-[10px] font-semibold">
              {FREQ_BADGE[frequency] ?? FREQ_BADGE.daily}
            </span>
          </div>
        </div>

        {/* Streak badge + archive */}
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
              <span className="text-sm">{streak >= 3 ? '🔥' : '⚡'}</span>
              <span className="text-white font-black text-xs">{streak}</span>
            </div>
          )}
          <button
            onClick={handleArchive}
            aria-label={`Archivar ${habit.name}`}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-xl bg-black/20 text-white/70 hover:text-white hover:bg-black/30 transition-all text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Period circles ───────────────────────────────── */}
      <div className="relative flex items-end justify-between gap-1 mb-4">
        {periodKeys.map((key) => {
          const done      = !!entryMap[key]?.done
          const isCurrent = key === current
          const isPopping = popping === key

          return (
            <div key={key} className="flex flex-col items-center gap-1.5 flex-1">
              <span className="text-[9px] text-white/60 font-semibold">
                {getPeriodLabel(frequency, key)}
              </span>
              <button
                onClick={() => handleToggle(key)}
                aria-label={`${habit.name} — ${key}`}
                aria-pressed={done}
                className={[
                  'w-full aspect-square max-w-[34px] rounded-full transition-all duration-200',
                  'hover:scale-110 active:scale-90',
                  done
                    ? `bg-white shadow-md ${isPopping ? 'animate-pop' : ''}`
                    : 'bg-white/25 hover:bg-white/40',
                  isCurrent && !done ? 'ring-2 ring-white/60 ring-offset-1 ring-offset-transparent' : ''
                ].join(' ')}
              >
                {done && (
                  <svg className="w-3 h-3 mx-auto" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* ── Progress bar ─────────────────────────────────── */}
      <div className="relative">
        <div className="h-1.5 rounded-full bg-black/15 overflow-hidden">
          <div
            className="h-full bg-white/70 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-white/60 text-[10px] font-semibold mt-1.5 text-right">
          {doneCount}/{periodKeys.length} · {pct}%
        </p>
      </div>
    </div>
  )
}
