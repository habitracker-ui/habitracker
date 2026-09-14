const FREQUENCIES = [
  { key: 'all',     label: 'Todos'    },
  { key: 'daily',   label: 'Diarios'  },
  { key: 'weekly',  label: 'Semana'   },
  { key: 'monthly', label: 'Mensual'  },
]

export default function FrequencyTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm">
      {FREQUENCIES.map(({ key, label }) => (
        <button
          key={key}
          id={`tab-${key}`}
          onClick={() => onChange(key)}
          className={[
            'flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95',
            active === key
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300/40 dark:shadow-indigo-900/50'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
