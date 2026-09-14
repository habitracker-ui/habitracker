import { AlertTriangle, Trash2, Archive, X } from 'lucide-react'
import { HabitIcon } from '../icons'

const CARD_GRADIENT = {
  violet: 'habit-violet',
  blue:   'habit-blue',
  moss:   'habit-moss',
  clay:   'habit-clay',
  gold:   'habit-gold',
  pink:   'habit-pink',
  teal:   'habit-teal',
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger', // 'danger' | 'warning'
  habit = null
}) {
  if (!open) return null

  const gradClass = habit?.color ? CARD_GRADIENT[habit.color] ?? 'habit-violet' : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="relative w-full max-w-sm bg-white dark:bg-dark-surface rounded-3xl border border-app-border dark:border-dark-border shadow-2xl overflow-hidden animate-slide-up z-10 p-6">
        
        {/* Close X button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl text-subtle hover:text-navy dark:hover:text-dark-ink hover:bg-surface dark:hover:bg-dark-card transition-colors"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        {/* Icon / Header Badge */}
        <div className="flex flex-col items-center text-center">
          {habit ? (
            <div className={`w-14 h-14 rounded-2xl ${gradClass} flex items-center justify-center shadow-lg mb-4 ring-4 ring-surface dark:ring-dark-card`}>
              <HabitIcon iconKey={habit.icon ?? 'check'} size={26} className="text-white" />
            </div>
          ) : (
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-4 ${
              variant === 'danger'
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
            }`}>
              {variant === 'danger' ? <Trash2 size={26} /> : <Archive size={26} />}
            </div>
          )}

          <h3 className="text-xl font-bold text-navy dark:text-dark-ink mb-1">
            {title}
          </h3>

          {habit && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-surface dark:bg-dark-card text-subtle dark:text-dark-muted mb-2">
              {habit.name}
            </span>
          )}

          <p className="text-xs text-subtle dark:text-dark-muted max-w-[260px] leading-relaxed mb-6">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-surface dark:bg-dark-card text-subtle dark:text-dark-muted hover:text-navy dark:hover:text-dark-ink border border-app-border dark:border-dark-border active:scale-95 transition-all"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={() => {
              onConfirm?.()
              onClose?.()
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 transition-all ${
              variant === 'danger'
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
            }`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  )
}
