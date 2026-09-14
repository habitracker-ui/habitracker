import { useState } from 'react'
import { Menu, Moon, Sun, Plus } from 'lucide-react'
import { useTheme } from '../ThemeProvider'
import ImportExport from './ImportExport'

export default function TopNav({ onAddHabit }) {
  const { dark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-app-border dark:border-dark-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-3.5">

          {/* Hamburger */}
          <button
            id="btn-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-subtle dark:text-dark-muted hover:text-navy dark:hover:text-dark-ink hover:bg-surface dark:hover:bg-dark-surface transition-colors"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>

          {/* App name (center) */}
          <span className="text-[15px] font-bold text-navy dark:text-dark-ink tracking-tight">
            Mis Hábitos
          </span>

          {/* Right: dark mode + add */}
          <div className="flex items-center gap-2">
            <button
              id="toggle-dark-mode"
              onClick={toggle}
              aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-subtle dark:text-dark-muted hover:text-navy dark:hover:text-dark-ink hover:bg-surface dark:hover:bg-dark-surface transition-colors"
            >
              {dark
                ? <Sun size={18} strokeWidth={1.75} />
                : <Moon size={18} strokeWidth={1.75} />
              }
            </button>

            <button
              id="btn-add-habit"
              onClick={onAddHabit}
              aria-label="Agregar hábito"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-600 active:scale-95 transition-all shadow-primary"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Drawer lateral ───────────────────────────────────── */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-navy/20 dark:bg-black/50 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-dark-surface shadow-2xl animate-slide-in flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-app-border dark:border-dark-border">
              <div>
                <p className="text-xs font-semibold text-subtle dark:text-dark-muted uppercase tracking-widest">Hábitos App</p>
                <h2 className="text-lg font-bold text-navy dark:text-dark-ink mt-0.5">Menú</h2>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-subtle hover:text-navy dark:hover:text-dark-ink hover:bg-surface dark:hover:bg-dark-card transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-4 py-5 overflow-y-auto">
              <p className="text-[10px] font-bold text-subtle dark:text-dark-muted uppercase tracking-widest px-2 mb-2">
                Datos
              </p>
              <div onClick={() => setMenuOpen(false)}>
                <ImportExport onImported={() => window.location.reload()} menuStyle />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-app-border dark:border-dark-border">
              <p className="text-xs text-subtle dark:text-dark-muted text-center">
                🔒 Datos guardados solo en este dispositivo
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
