import { getLevelInfo } from '../db'

const LEVEL_GRADIENTS = [
  'from-slate-400 to-slate-600',
  'from-emerald-400 to-teal-600',
  'from-blue-400 to-indigo-600',
  'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-red-600',
  'from-yellow-300 to-amber-500',
]

export default function StatsHeader({ totalXP = 0, longestStreak = 0 }) {
  const lvl = getLevelInfo(totalXP)
  const gradClass = LEVEL_GRADIENTS[(lvl.level - 1) % LEVEL_GRADIENTS.length]

  return (
    <div className="glass dark:glass-dark rounded-3xl p-4 shadow-sm">
      <div className="flex items-center gap-4">

        {/* Level badge */}
        <div className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br ${gradClass} shadow-lg flex-shrink-0`}>
          <span className="text-white/70 text-[9px] font-bold uppercase tracking-wider">Niv.</span>
          <span className="text-white text-xl font-black leading-none">{lvl.level}</span>
        </div>

        {/* XP + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{lvl.name}</span>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{totalXP} XP</span>
          </div>

          {/* XP bar */}
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${lvl.progress}%` }}
            />
          </div>

          {/* Next level */}
          {lvl.nextXP !== Infinity && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              {lvl.nextXP - totalXP} XP para nivel {lvl.level + 1}
            </p>
          )}
        </div>

        {/* Best streak */}
        <div className="text-center flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/40 flex flex-col items-center justify-center">
            <span className="text-lg leading-none">{longestStreak >= 3 ? '🔥' : '⚡'}</span>
            <span className="text-xs font-black text-slate-700 dark:text-slate-200 leading-none mt-0.5">{longestStreak}</span>
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">racha</p>
        </div>

      </div>
    </div>
  )
}
