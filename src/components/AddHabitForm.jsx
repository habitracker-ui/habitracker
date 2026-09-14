import { useState } from 'react'
import { createHabit } from '../db'

const FREQUENCIES = [
  { key: 'daily',   label: 'Diario',   icon: '📅' },
  { key: 'weekly',  label: 'Semanal',  icon: '📆' },
  { key: 'monthly', label: 'Mensual',  icon: '🗓️' },
]

const EMOJIS = ['✅', '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️', '🎯', '🎸', '🌿', '🧹', '💊', '🚴']

const COLORS = [
  { key: 'moss',  label: 'Verde',   cls: 'bg-moss'  },
  { key: 'clay',  label: 'Clay',    cls: 'bg-clay'  },
  { key: 'gold',  label: 'Dorado',  cls: 'bg-gold'  },
  { key: 'blue',  label: 'Azul',    cls: 'bg-blue-500' },
  { key: 'violet',label: 'Violeta', cls: 'bg-violet-500' },
]

export default function AddHabitForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [emoji, setEmoji] = useState('✅')
  const [color, setColor] = useState('moss')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await createHabit({ name: trimmed, frequency, emoji, color })
    setName('')
    setFrequency('daily')
    setEmoji('✅')
    setColor('moss')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        id="btn-add-habit"
        onClick={() => setOpen(true)}
        className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-line dark:border-dark-border text-clay dark:text-clay hover:border-moss dark:hover:border-moss hover:text-moss dark:hover:text-moss transition-all duration-200 font-serif text-lg flex items-center justify-center gap-2 group"
      >
        <span className="text-xl group-hover:rotate-90 transition-transform duration-200">+</span>
        Agregar un hábito
      </button>
    )
  }

  return (
    <div className="mt-4 rounded-2xl border border-line dark:border-dark-border bg-white/80 dark:bg-dark-card/80 p-5 animate-fade-in space-y-4">
      <h3 className="font-serif text-lg text-ink dark:text-dark-ink">Nuevo hábito</h3>

      {/* Nombre */}
      <div>
        <label className="text-xs text-ink/50 dark:text-dark-muted font-medium mb-1 block">Nombre</label>
        <div className="flex items-center gap-2">
          {/* Emoji selector */}
          <div className="relative group">
            <button
              type="button"
              className="w-10 h-10 rounded-xl border border-line dark:border-dark-border bg-paper dark:bg-dark-surface text-xl flex items-center justify-center hover:border-moss transition-colors"
            >
              {emoji}
            </button>
            {/* Emoji picker dropdown */}
            <div className="absolute top-12 left-0 z-10 hidden group-focus-within:grid grid-cols-5 gap-1 p-2 bg-white dark:bg-dark-card rounded-xl border border-line dark:border-dark-border shadow-xl">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-xl p-1 rounded-lg hover:bg-line dark:hover:bg-dark-border transition-colors ${emoji === e ? 'bg-line dark:bg-dark-border' : ''}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <input
            id="input-habit-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Leer 20 minutos..."
            className="flex-1 bg-transparent border-b border-ink/20 dark:border-dark-border focus:border-moss dark:focus:border-moss outline-none py-2 font-serif text-lg text-ink dark:text-dark-ink placeholder:text-ink/30 dark:placeholder:text-dark-muted transition-colors"
          />
        </div>
      </div>

      {/* Frecuencia */}
      <div>
        <label className="text-xs text-ink/50 dark:text-dark-muted font-medium mb-2 block">Frecuencia</label>
        <div className="flex gap-2">
          {FREQUENCIES.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFrequency(key)}
              className={[
                'flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5',
                frequency === key
                  ? 'bg-moss text-white border-moss shadow-sm'
                  : 'border-line dark:border-dark-border text-ink/60 dark:text-dark-muted hover:border-moss dark:hover:border-moss'
              ].join(' ')}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-xs text-ink/50 dark:text-dark-muted font-medium mb-2 block">Color</label>
        <div className="flex gap-2">
          {COLORS.map(({ key, label, cls }) => (
            <button
              key={key}
              type="button"
              onClick={() => setColor(key)}
              aria-label={label}
              className={[
                'w-8 h-8 rounded-full transition-all duration-200 hover:scale-110',
                cls,
                color === key ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-card ring-ink/40 scale-110' : ''
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-2.5 gradient-moss text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95"
        >
          Crear hábito
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setName('') }}
          className="px-4 py-2.5 rounded-xl border border-line dark:border-dark-border text-sm text-ink/60 dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
