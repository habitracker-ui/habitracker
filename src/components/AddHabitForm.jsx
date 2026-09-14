import { useState } from 'react'
import { X } from 'lucide-react'
import { createHabit } from '../db'
import { HABIT_ICONS, HabitIcon } from '../icons'

const FREQUENCIES = [
  { key: 'daily',   label: 'Diario'   },
  { key: 'weekly',  label: 'Semanal'  },
  { key: 'monthly', label: 'Mensual'  },
]

// Full class strings for Tailwind JIT
const COLOR_OPTIONS = [
  { key: 'violet', cls: 'habit-violet', label: 'Violeta' },
  { key: 'blue',   cls: 'habit-blue',   label: 'Azul'    },
  { key: 'moss',   cls: 'habit-moss',   label: 'Verde'   },
  { key: 'clay',   cls: 'habit-clay',   label: 'Naranja' },
  { key: 'gold',   cls: 'habit-gold',   label: 'Dorado'  },
  { key: 'pink',   cls: 'habit-pink',   label: 'Rosa'    },
  { key: 'teal',   cls: 'habit-teal',   label: 'Teal'    },
]

export default function AddHabitForm({ open, onClose }) {
  const [name,      setName]      = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [icon,      setIcon]      = useState('check')
  const [color,     setColor]     = useState('violet')

  async function handleSubmit(e) {
    e?.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await createHabit({ name: trimmed, frequency, icon, color })
    setName(''); setFrequency('daily'); setIcon('check'); setColor('violet')
    onClose?.()
  }

  if (!open) return null

  const previewGrad = COLOR_OPTIONS.find(c => c.key === color)?.cls ?? 'habit-violet'

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/30 backdrop-blur-[2px]" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-dark-surface rounded-t-3xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="w-8 h-1 rounded-full bg-app-border dark:bg-dark-border" />
        </div>

        <div className="px-5 pt-4 pb-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-navy dark:text-dark-ink">Nuevo hábito</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-subtle hover:text-navy dark:hover:text-dark-ink hover:bg-surface dark:hover:bg-dark-card transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name input */}
            <div>
              <label className="text-[10px] font-bold text-subtle dark:text-dark-muted uppercase tracking-widest block mb-2">
                Nombre
              </label>
              <input
                id="input-habit-name"
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Leer 20 minutos..."
                className="w-full h-11 px-4 rounded-xl bg-surface dark:bg-dark-card border border-app-border dark:border-dark-border text-navy dark:text-dark-ink placeholder:text-subtle/60 dark:placeholder:text-dark-muted text-sm font-medium outline-none focus:border-primary dark:focus:border-primary transition-colors"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="text-[10px] font-bold text-subtle dark:text-dark-muted uppercase tracking-widest block mb-2">
                Frecuencia
              </label>
              <div className="flex gap-2">
                {FREQUENCIES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFrequency(key)}
                    className={[
                      'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95',
                      frequency === key
                        ? 'bg-primary text-white shadow-primary'
                        : 'bg-surface dark:bg-dark-card text-subtle dark:text-dark-muted border border-app-border dark:border-dark-border hover:border-primary'
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="text-[10px] font-bold text-subtle dark:text-dark-muted uppercase tracking-widest block mb-2">
                Icono
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {HABIT_ICONS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    title={label}
                    className={[
                      'w-full aspect-square rounded-xl flex items-center justify-center transition-all active:scale-90',
                      icon === key
                        ? 'bg-primary text-white shadow-primary scale-110'
                        : 'bg-surface dark:bg-dark-card text-subtle dark:text-dark-muted hover:text-navy dark:hover:text-dark-ink border border-app-border dark:border-dark-border hover:border-primary'
                    ].join(' ')}
                  >
                    <HabitIcon iconKey={key} size={15} />
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="text-[10px] font-bold text-subtle dark:text-dark-muted uppercase tracking-widest block mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map(({ key, cls }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setColor(key)}
                    className={[
                      'flex-1 h-8 rounded-xl transition-all active:scale-90 hover:scale-105',
                      cls,
                      color === key ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-surface ring-primary scale-105 shadow-md' : ''
                    ].join(' ')}
                  />
                ))}
              </div>

              {/* Live preview */}
              <div className={`mt-3 rounded-xl p-3 ${previewGrad} flex items-center gap-2.5`}>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <HabitIcon iconKey={icon} size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm truncate">
                  {name || 'Vista previa...'}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-600 active:scale-98 transition-all shadow-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Crear hábito
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
