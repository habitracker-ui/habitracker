const FREQUENCIES = [
  { key: 'all',     label: 'Todos'     },
  { key: 'daily',   label: 'Diarios'   },
  { key: 'weekly',  label: 'Semanales' },
  { key: 'monthly', label: 'Mensuales' },
]

export default function FrequencyTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-line/50 dark:bg-dark-border/50 rounded-xl">
      {FREQUENCIES.map(({ key, label }) => (
        <button
          key={key}
          id={`tab-${key}`}
          onClick={() => onChange(key)}
          className={[
            'flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200',
            active === key
              ? 'bg-white dark:bg-dark-card text-ink dark:text-dark-ink shadow-sm'
              : 'text-ink/50 dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink'
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
