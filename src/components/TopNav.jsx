import { useState } from 'react'
import { useTheme } from '../ThemeProvider'
import ImportExport from './ImportExport'

export default function TopNav({ onAddHabit }) {
  const { dark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-5 py-3 glass dark:glass-dark shadow-sm shadow-slate-200/50 dark:shadow-slate-900/50">
        {/* Hamburger */}
        <button
          id="btn-menu"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <rect width="18" height="2.5" rx="1.25" fill="currentColor"/>
            <rect y="5.75" width="12" height="2.5" rx="1.25" fill="currentColor"/>
            <rect y="11.5" width="18" height="2.5" rx="1.25" fill="currentColor"/>
          </svg>
        </button>

        {/* App name */}
        <p className="text-base font-bold tracking-tight text-slate-800 dark:text-white select-none">
          Hábitos
        </p>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-dark-mode"
            onClick={toggle}
            aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-base"
          >
            {dark ? '☀️' : '🌙'}
          </button>

          <button
            id="btn-add-habit"
            onClick={onAddHabit}
            aria-label="Agregar hábito"
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-300/40 dark:shadow-indigo-900/40 text-2xl font-light leading-none"
          >
            +
          </button>
        </div>
      </div>

      {/* ── Side Drawer ─────────────────────────────────── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl animate-slide-right flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Menú</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Hábitos tracker</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Menu items */}
            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-3">
                Datos
              </p>
              <div onClick={() => setMenuOpen(false)}>
                <ImportExport
                  onImported={() => window.location.reload()}
                  menuStyle
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                🔒 Datos guardados solo en este dispositivo
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
