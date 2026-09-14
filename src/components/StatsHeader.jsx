import { getLevelInfo } from '../db'
import { Zap } from 'lucide-react'

const LEVEL_COLORS = [
  '#94A3B8', // 1 slate
  '#34D399', // 2 emerald
  '#60A5FA', // 3 blue
  '#A78BFA', // 4 violet
  '#FBBF24', // 5 amber
  '#F87171', // 6 red
  '#FDE047', // 7 gold
]

export default function StatsHeader({ totalXP = 0, longestStreak = 0 }) {
  const lvl   = getLevelInfo(totalXP)
  const color = LEVEL_COLORS[(lvl.level - 1) % LEVEL_COLORS.length]

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-app-border dark:border-dark-border px-4 py-3.5 flex items-center gap-4">

      {/* Level circle */}
      <div
        className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
        style={{ background: `linear-gradient(135deg, ${color}CC, ${color})` }}
      >
        <span className="text-[9px] font-bold opacity-80 uppercase leading-none">Niv</span>
        <span className="text-lg font-black leading-tight">{lvl.level}</span>
      </div>

      {/* XP bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-subtle dark:text-dark-muted">{lvl.name}</span>
          <span className="text-xs font-bold text-primary">{totalXP} XP</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface dark:bg-dark-card overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 bg-primary"
            style={{ width: `${lvl.progress}%` }}
          />
        </div>
        {lvl.nextXP !== Infinity && (
          <p className="text-[9px] text-subtle dark:text-dark-muted mt-1">
            Faltan {lvl.nextXP - totalXP} XP para nivel {lvl.level + 1}
          </p>
        )}
      </div>

      {/* Streak */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
          <Zap size={16} className="text-orange-400" fill="currentColor" />
        </div>
        <span className="text-xs font-black text-navy dark:text-dark-ink mt-1">{longestStreak}</span>
      </div>

    </div>
  )
}
