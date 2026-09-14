import { useState, useRef } from 'react'
import { exportData, importData } from '../db'

export default function ImportExport({ onImported, menuStyle = false }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)  // null | 'ok' | 'error'
  const [msg, setMsg] = useState('')
  const fileRef = useRef()

  async function handleExport() {
    try {
      const json = await exportData()
      const blob = new Blob([json], { type: 'application/json' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      const date = new Date().toISOString().slice(0, 10)
      a.href     = url
      a.download = `habitos-backup-${date}.json`
      a.click()
      URL.revokeObjectURL(url)
      setStatus('ok')
      setMsg('Backup exportado correctamente.')
    } catch {
      setStatus('error')
      setMsg('Error al exportar los datos.')
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      await importData(text)
      setStatus('ok')
      setMsg('Datos importados correctamente.')
      onImported?.()
    } catch (err) {
      setStatus('error')
      setMsg(`Error al importar: ${err.message}`)
    } finally {
      fileRef.current.value = ''
    }
  }

  // ── Inline menu style (inside hamburger drawer) ───────
  if (menuStyle) {
    return (
      <div className="space-y-1">
        <button
          id="btn-export-json-menu"
          onClick={handleExport}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-base">⬇</span>
          Exportar JSON
        </button>

        <label
          htmlFor="file-import-menu"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-base">⬆</span>
          Importar JSON
        </label>
        <input
          id="file-import-menu"
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
          className="sr-only"
        />

        {status && (
          <p className={`text-xs px-3 py-2 rounded-xl ${status === 'ok' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
            {status === 'ok' ? '✅' : '❌'} {msg}
          </p>
        )}

        <p className="text-[10px] text-slate-400 dark:text-slate-500 px-3 pt-1">
          ⚠ Al importar se reemplazarán todos los datos actuales.
        </p>
      </div>
    )
  }

  // ── Modal style (footer trigger) ─────────────────────
  return (
    <>
      <button
        id="btn-import-export"
        onClick={() => setOpen(true)}
        className="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 font-medium"
      >
        ↕ Importar / Exportar
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Importar / Exportar</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
              Respaldo JSON para mover tus datos entre dispositivos.
            </p>

            {status && (
              <div className={`mb-4 p-3 rounded-2xl text-sm font-medium ${status === 'ok' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                {status === 'ok' ? '✅' : '❌'} {msg}
              </div>
            )}

            <div className="space-y-3">
              <button
                id="btn-export-json"
                onClick={handleExport}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 active:scale-98 transition-all shadow-md shadow-indigo-200 dark:shadow-indigo-900/40 flex items-center justify-center gap-2"
              >
                ⬇ Exportar JSON
              </button>

              <label
                htmlFor="file-import-modal"
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                ⬆ Importar JSON
              </label>
              <input
                id="file-import-modal"
                ref={fileRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="sr-only"
              />

              <p className="text-[10px] text-slate-400 text-center">
                ⚠ Al importar se reemplazarán TODOS los datos actuales.
              </p>
            </div>

            <button
              onClick={() => { setOpen(false); setStatus(null) }}
              className="mt-5 w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
