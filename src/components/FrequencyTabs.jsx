const TABS = [
  { key: 'all',     label: 'Todos'    },
  { key: 'daily',   label: 'Diarios'  },
  { key: 'weekly',  label: 'Semana'   },
  { key: 'monthly', label: 'Mensual'  },
]

export default function FrequencyTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-surface dark:bg-dark-card rounded-xl border border-app-border dark:border-dark-border">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          id={`tab-${key}`}
          onClick={() => onChange(key)}
          className={[
            'flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95',
            active === key
              ? 'bg-primary text-white shadow-primary'
              : 'text-subtle dark:text-dark-muted hover:text-navy dark:hover:text-dark-ink'
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
