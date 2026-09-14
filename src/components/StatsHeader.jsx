import { getLevelInfo } from '../db'
import { useTheme } from '../ThemeProvider'

const LEVEL_COLORS = [
  'from-gray-400 to-gray-500',
  'from-emerald-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-red-600',
  'from-yellow-300 to-amber-500',
]

export default function StatsHeader({ totalXP = 0, longestStreak = 0 }) {
  const { dark, toggle } = useTheme()
  const lvl = getLevelInfo(totalXP)
  const colorClass = LEVEL_COLORS[(lvl.level - 1) % LEVEL_COLORS.length]

  return (
    <div className="mb-8 space-y-4">
      {/* Level card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-moss/20 to-moss/5 dark:from-moss/30 dark:to-dark-card border border-moss/20 dark:border-moss/30">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-white text-sm font-bold bg-gradient-to-br ${colorClass} shadow-lg`}>
                {lvl.level}
              </span>
              <span className="text-xs font-semibold text-moss dark:text-moss uppercase tracking-wider">
                Nivel {lvl.level} — {lvl.name}
              </span>
            </div>
            <p className="text-2xl font-bold text-ink dark:text-dark-ink">
              {totalXP} <span className="text-sm font-medium text-ink/50 dark:text-dark-muted">XP</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Racha global */}
            <div className="text-right">
              <p className="text-xs text-ink/50 dark:text-dark-muted">Mejor racha</p>
              <p className="text-xl font-bold text-clay dark:text-clay flex items-center gap-1 justify-end">
                {longestStreak > 0 ? '🔥' : '💤'} {longestStreak}
              </p>
            </div>

            {/* Dark mode toggle */}
            <button
              id="toggle-dark-mode"
              onClick={toggle}
              aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/60 dark:bg-dark-border/60 text-ink/60 dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink transition-all hover:scale-110 active:scale-95"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-ink/40 dark:text-dark-muted mb-1.5">
            <span>{lvl.xpMin} XP</span>
            {lvl.nextXP !== Infinity && <span>Siguiente: {lvl.nextXP} XP</span>}
          </div>
          <div className="h-2 rounded-full bg-line dark:bg-dark-border overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700 ease-out`}
              style={{ width: `${lvl.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
