import { useState } from 'react'
import { createHabit } from '../db'

const FREQUENCIES = [
  { key: 'daily',   label: 'Diario',   icon: '📅' },
  { key: 'weekly',  label: 'Semanal',  icon: '📆' },
  { key: 'monthly', label: 'Mensual',  icon: '🗓️' },
]

const EMOJIS = ['✅', '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '✍️', '🎯', '🎸', '🌿', '🧹', '💊', '🚴', '🧗', '🎨', '🧠', '🛌', '☕']

const COLORS = [
  { key: 'blue',   label: 'Azul',    preview: 'habit-blue'   },
  { key: 'violet', label: 'Violeta', preview: 'habit-violet' },
  { key: 'moss',   label: 'Verde',   preview: 'habit-moss'   },
  { key: 'clay',   label: 'Naranja', preview: 'habit-clay'   },
  { key: 'gold',   label: 'Dorado',  preview: 'habit-gold'   },
  { key: 'pink',   label: 'Rosa',    preview: 'habit-pink'   },
  { key: 'teal',   label: 'Teal',    preview: 'habit-teal'   },
]

export default function AddHabitForm({ open, onClose }) {
  const [name,      setName]      = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [emoji,     setEmoji]     = useState('✅')
  const [color,     setColor]     = useState('blue')
  const [showEmoji, setShowEmoji] = useState(false)

  async function handleSubmit(e) {
    e?.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await createHabit({ name: trimmed, frequency, emoji, color })
    // Reset
    setName('')
    setFrequency('daily')
    setEmoji('✅')
    setColor('blue')
    setShowEmoji(false)
    onClose?.()
  }

  function handleClose() {
    setShowEmoji(false)
    onClose?.()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Bottom sheet */}
      <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-2xl animate-slide-up overflow-hidden">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="px-6 pb-8 pt-4 max-h-[90vh] overflow-y-auto">
          {/* Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nuevo hábito</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name + Emoji picker */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Nombre del hábito
              </label>
              <div className="flex items-center gap-3">
                {/* Emoji toggle */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmoji(v => !v)}
                    className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-2xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
                  >
                    {emoji}
                  </button>

                  {/* Emoji picker */}
                  {showEmoji && (
                    <div className="absolute bottom-14 left-0 z-20 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-2xl border border-slate-100 dark:border-slate-700 grid grid-cols-5 gap-1 w-52">
                      {EMOJIS.map(e => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => { setEmoji(e); setShowEmoji(false) }}
                          className={`text-xl p-1.5 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 ${emoji === e ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  id="input-habit-name"
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Leer 20 minutos..."
                  className="flex-1 h-12 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Frecuencia
              </label>
              <div className="flex gap-2">
                {FREQUENCIES.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFrequency(key)}
                    className={[
                      'flex-1 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 flex flex-col items-center gap-1',
                      frequency === key
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    ].join(' ')}
                  >
                    <span className="text-lg">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Color del card
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(({ key, label, preview }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setColor(key)}
                    aria-label={label}
                    className={[
                      'w-10 h-10 rounded-2xl transition-all active:scale-90 hover:scale-110',
                      preview,
                      color === key ? 'ring-3 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-indigo-500 scale-110 shadow-lg' : ''
                    ].join(' ')}
                  />
                ))}
              </div>

              {/* Color preview mini card */}
              <div className={`mt-3 rounded-2xl p-3 ${COLORS.find(c => c.key === color)?.preview ?? 'habit-blue'} flex items-center gap-2`}>
                <span className="text-xl">{emoji}</span>
                <span className="text-white font-bold text-sm truncate">{name || 'Vista previa...'}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 active:scale-98 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Crear hábito
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
