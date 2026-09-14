import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Flame, X } from 'lucide-react'
import {
  db,
  currentWeekDays, lastNWeeks, lastNMonths,
  todayKey, weekKey, monthKey,
  weekLabel, monthLabel,
  toggleEntry, computeStreak,
  archiveHabit,
  XP_PER_COMPLETION, xpForStreak
} from '../db'
import { HabitIcon } from '../icons'
import ConfirmModal from './ConfirmModal'

// Shorthand day labels for daily view (Mon–Sun, 0=Mon in currentWeekDays)
const DAY_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// Full class strings — needed so Tailwind JIT compiles them
const CARD_GRADIENT = {
  violet: 'habit-violet',
  blue:   'habit-blue',
  moss:   'habit-moss',
  clay:   'habit-clay',
  gold:   'habit-gold',
  pink:   'habit-pink',
  teal:   'habit-teal',
}

const FREQ_LABEL = {
  daily:   'Diario',
  weekly:  'Semanal',
  monthly: 'Mensual',
}

function getPeriodKeys(frequency) {
  if (frequency === 'weekly')  return lastNWeeks(8)
  if (frequency === 'monthly') return lastNMonths(6)
  // Daily: siempre la semana ISO actual → se "reinicia" cada lunes
  return currentWeekDays()
}

function getPeriodLabel(frequency, key, idx) {
  if (frequency === 'weekly')  return weekLabel(key)
  if (frequency === 'monthly') return monthLabel(key)
  return DAY_SHORT[idx]          // L M X J V S D
}

function getCurrentPeriod(frequency) {
  if (frequency === 'weekly')  return weekKey()
  if (frequency === 'monthly') return monthKey()
  return todayKey()
}

export default function HabitCard({ habit, onXP }) {
  const [popping, setPopping] = useState(null)
  const [showArchiveModal, setShowArchiveModal] = useState(false)

  const entries = useLiveQuery(
    () => db.entries.where('habitId').equals(habit.id).toArray(),
    [habit.id],
    []
  )

  const frequency  = habit.frequency  ?? 'daily'
  const color      = habit.color      ?? 'violet'
  const gradClass  = CARD_GRADIENT[color] ?? CARD_GRADIENT.violet
  const periodKeys = getPeriodKeys(frequency)
  const current    = getCurrentPeriod(frequency)
  const entryMap   = Object.fromEntries((entries ?? []).map(e => [e.date, e]))
  const streak     = computeStreak(entries ?? [], frequency)

  const doneCount = periodKeys.filter(k => entryMap[k]?.done).length
  const pct       = Math.round((doneCount / periodKeys.length) * 100)

  async function handleToggle(key) {
    if (key !== current) return
    const wasDone = !!entryMap[key]?.done
    await toggleEntry(habit.id, key)
    if (!wasDone) {
      setPopping(key)
      setTimeout(() => setPopping(null), 350)
      onXP?.(XP_PER_COMPLETION + xpForStreak(streak + 1))
    } else {
      onXP?.(-(XP_PER_COMPLETION + xpForStreak(streak)))
    }
  }

  async function confirmArchive() {
    await archiveHabit(habit.id)
  }

  return (
    <>
      <div className={`group relative rounded-2xl p-4 animate-fade-in overflow-hidden isolate ${gradClass}`}
           style={{ boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>

        {/* Decorative circle (top-right) — same as reference cards */}
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.08] pointer-events-none" />

        {/* ── Top row: icon + name + streak + archive ──────── */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Icon bubble */}
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <HabitIcon iconKey={habit.icon ?? 'check'} size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-[15px] leading-tight">{habit.name}</p>
              <p className="text-white/60 text-[11px] font-medium mt-0.5">{FREQ_LABEL[frequency]}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Streak badge */}
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                <Flame size={11} className="text-white" fill="white" />
                <span className="text-white font-bold text-[11px]">{streak}</span>
              </div>
            )}
            {/* Archive (hover) */}
            <button
              onClick={() => setShowArchiveModal(true)}
              aria-label={`Archivar ${habit.name}`}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg bg-black/20 text-white/70 hover:text-white hover:bg-black/35 transition-all"
            >
              <X size={11} />
            </button>
          </div>
        </div>

        {/* ── Period dots ──────────────────────────────────── */}
        <div className="flex items-end gap-1 mb-3">
          {periodKeys.map((key, idx) => {
            const done      = !!entryMap[key]?.done
            const isCurrent = key === current
            const isPopping = popping === key

            return (
              <div key={key} className="flex flex-col items-center gap-1 flex-1">
                <span className={`text-[9px] font-semibold leading-none ${isCurrent ? 'text-white font-bold' : 'text-white/40'}`}>
                  {getPeriodLabel(frequency, key, idx)}
                </span>
                <button
                  disabled={!isCurrent}
                  onClick={() => handleToggle(key)}
                  aria-pressed={done}
                  aria-label={`${habit.name} ${key}`}
                  title={!isCurrent ? 'Solo se puede marcar el día/periodo actual' : ''}
                  className={[
                    'w-full aspect-square max-w-[30px] rounded-full border-[1.5px] transition-all duration-200',
                    isCurrent
                      ? 'hover:scale-110 active:scale-90 cursor-pointer'
                      : 'cursor-not-allowed opacity-40 hover:scale-100 active:scale-100',
                    done
                      ? `bg-white border-white ${isPopping ? 'animate-pop' : ''}`
                      : 'bg-transparent border-white/40 hover:border-white/70',
                    isCurrent && !done ? 'border-white/90 ring-1 ring-white/30' : ''
                  ].join(' ')}
                >
                  {done && (
                    <svg viewBox="0 0 10 8" className="w-2 h-2 mx-auto" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#5B68F5" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* ── Progress bar (bottom accent — like reference) ── */}
        <div className="h-1 rounded-full bg-black/20 overflow-hidden">
          <div
            className="h-full bg-white/60 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Custom Archive Modal */}
      <ConfirmModal
        open={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={confirmArchive}
        variant="warning"
        title="¿Archivar hábito?"
        description="El hábito se ocultará de tu lista principal, pero se conservará todo el historial de rachas y estadísticas."
        confirmText="Archivar"
        cancelText="Cancelar"
        habit={habit}
      />
    </>
  )
}

